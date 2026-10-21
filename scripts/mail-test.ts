import { MAIL_FROM, sendMail } from "../lib/mailer"

const to = process.argv[2]
if (!to) {
  console.error("Usage: pnpm mail:test <recipient@example.com>")
  process.exit(1)
}

sendMail({
  to: [to],
  subject: "Five Nines mail test",
  html: `<p>This is a test from the Five Nines website mailer, sent as <strong>${MAIL_FROM}</strong>.</p>`,
})
  .then((id) => console.log(`Sent. Gmail message id: ${id}`))
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  })
