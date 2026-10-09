"use client";
import { useState } from "react";
import { TAI_EQUIPMENT_GROUPS, isTaiTrailerType } from "@/lib/tai-equipment";
import { input } from "./workspace-ui";

function Options({ legacy }: { legacy?: string }) {
  return (
    <>
      {legacy ? <option value={legacy}>{`${legacy} (update to a TAI type)`}</option> : null}
      {TAI_EQUIPMENT_GROUPS.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );
}

/** Single TAI trailer type, submitted as the exact TAI string. */
export function EquipmentSelect({
  label,
  name,
  value = "",
  required = false,
}: {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
}) {
  const legacy = value && !isTaiTrailerType(value) ? value : undefined;
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select className={`${input} text-base`} name={name} defaultValue={value} required={required}>
        <option value="" disabled>
          Select TAI equipment
        </option>
        <Options legacy={legacy} />
      </select>
    </label>
  );
}

/** Several TAI trailer types, stored comma-separated in one field. */
export function EquipmentMultiSelect({
  label,
  name,
  value = "",
  required = false,
}: {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
}) {
  const [selected, setSelected] = useState(() =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  return (
    <div className="text-sm font-medium text-slate-700 sm:col-span-2">
      <label className="block">
        {label}
        <select
          className={`${input} text-base`}
          value=""
          required={required && !selected.length}
          onChange={(e) => {
            const type = e.target.value;
            if (type && !selected.includes(type)) setSelected([...selected, type]);
          }}
        >
          <option value="" disabled>
            {selected.length ? "Add another trailer type" : "Select TAI equipment"}
          </option>
          <Options />
        </select>
      </label>
      <input type="hidden" name={name} value={selected.join(", ")} />
      {selected.length ? (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected equipment">
          {selected.map((type) => (
            <li
              key={type}
              className={`flex items-center gap-1 rounded-full border py-1 pl-3 pr-1 text-sm ${
                isTaiTrailerType(type)
                  ? "border-slate-300 bg-slate-50 text-slate-800"
                  : "border-amber-300 bg-amber-50 text-amber-900"
              }`}
            >
              {type}
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200"
                aria-label={`Remove ${type}`}
                onClick={() => setSelected(selected.filter((t) => t !== type))}
              >
                <span aria-hidden="true">{"\u00d7"}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {selected.some((t) => !isTaiTrailerType(t)) ? (
        <p className="mt-2 text-xs font-normal leading-5 text-amber-800">
          Highlighted entries are not TAI trailer types. Remove them and pick the matching type above.
        </p>
      ) : null}
    </div>
  );
}
