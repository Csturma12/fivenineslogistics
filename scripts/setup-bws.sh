#!/usr/bin/env bash
# Cloud-environment setup script: installs the Bitwarden Secrets Manager CLI
# (bws) and writes the secrets the machine account can read to an env file.
#
# Environment settings it relies on:
#   BWS_ACCESS_TOKEN  machine-account access token (environment variable)
#   BWS_PROJECT_ID    optional: only load secrets from this project
#   BWS_VERSION       optional: bws release to install (default below)
#   Allowed domains:  api.bitwarden.com, identity.bitwarden.com,
#                     github.com, release-assets.githubusercontent.com
#
# Variables set here do not reach Claude's shell, so the secrets are written to
# $BWS_ENV_FILE (default /root/.bws/secrets.env, mode 600) as
# `export NAME='value'` lines. Load them with `. /root/.bws/secrets.env`, or set
# BASH_ENV=/root/.bws/secrets.env in the environment variables so every shell
# loads them.
#
# It never fails the session: problems are logged and the script exits 0.

set -uo pipefail
umask 077

BWS_VERSION="${BWS_VERSION:-2.1.0}"
BWS_FALLBACK_VERSION=1.0.0
BWS_ENV_FILE="${BWS_ENV_FILE:-/root/.bws/secrets.env}"

# bws talks through the cloud egress proxy, which re-signs TLS with its own CA.
if [ -r /root/.ccr/ca-bundle.crt ] && [ -z "${SSL_CERT_FILE:-}" ]; then
  export SSL_CERT_FILE=/root/.ccr/ca-bundle.crt
fi

log() { echo "setup-bws: $*" >&2; }

download_bws() {
  local version=$1 arch=$2 tmp=$3
  local base="https://github.com/bitwarden/sdk-sm/releases/download/bws-v${version}"
  local zip="bws-${arch}-unknown-linux-gnu-${version}.zip"
  local sums="bws-sha256-checksums-${version}.txt"

  curl -fsSL --retry 3 -o "$tmp/$zip" "$base/$zip" || { log "could not download $base/$zip"; return 1; }
  curl -fsSL --retry 3 -o "$tmp/$sums" "$base/$sums" || { log "could not download $base/$sums"; return 1; }
  (cd "$tmp" && grep -E "[ *]${zip}\$" "$sums" | sed 's/\*/ /' | sha256sum -c --status) \
    || { log "checksum missing or wrong for $zip"; return 1; }

  if command -v unzip >/dev/null 2>&1; then
    unzip -oq "$tmp/$zip" -d "$tmp/out"
  else
    python3 -m zipfile -e "$tmp/$zip" "$tmp/out"
  fi
}

install_bws() {
  if command -v bws >/dev/null 2>&1; then
    return 0
  fi

  local arch
  case "$(uname -m)" in
    x86_64 | amd64) arch=x86_64 ;;
    aarch64 | arm64) arch=aarch64 ;;
    *) log "unsupported architecture $(uname -m)"; return 1 ;;
  esac

  local tmp version
  tmp=$(mktemp -d)
  for version in "$BWS_VERSION" "$BWS_FALLBACK_VERSION"; do
    rm -rf "${tmp:?}"/*
    if download_bws "$version" "$arch" "$tmp" && install -m 755 "$tmp/out/bws" /usr/local/bin/bws; then
      rm -rf "$tmp"
      log "installed bws $version"
      return 0
    fi
    [ "$version" = "$BWS_FALLBACK_VERSION" ] && break
    log "falling back to bws $BWS_FALLBACK_VERSION"
  done
  rm -rf "$tmp"
  return 1
}

load_secrets() {
  if [ -z "${BWS_ACCESS_TOKEN:-}" ]; then
    log "BWS_ACCESS_TOKEN is not set; add it to the environment variables"
    return 1
  fi

  local json
  json=$(bws secret list ${BWS_PROJECT_ID:+"$BWS_PROJECT_ID"} --output json) \
    || { log "bws secret list failed (check the token and the allowed domains)"; return 1; }

  local name_re='^[A-Za-z_][A-Za-z0-9_]*$' tmp
  tmp=$(mktemp "$BWS_ENV_FILE.XXXXXX")
  jq -r --arg re "$name_re" \
    '.[] | select(.key | test($re)) | "export \(.key)=\(.value | @sh)"' <<<"$json" >"$tmp" \
    || { rm -f "$tmp"; log "could not parse bws output"; return 1; }
  mv "$tmp" "$BWS_ENV_FILE"

  local count skipped
  count=$(jq --arg re "$name_re" '[.[].key | select(test($re))] | length' <<<"$json")
  skipped=$(jq -r --arg re "$name_re" '[.[].key | select(test($re) | not)] | join(", ")' <<<"$json")
  log "wrote $count secrets to $BWS_ENV_FILE"
  [ -z "$skipped" ] || log "skipped keys that are not valid variable names: $skipped"
}

mkdir -p "$(dirname "$BWS_ENV_FILE")"
[ -f "$BWS_ENV_FILE" ] || : >"$BWS_ENV_FILE"

install_bws && load_secrets
exit 0
