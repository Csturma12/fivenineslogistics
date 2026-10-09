"use client";
import { useEffect, useId, useState } from "react";
import useSWR from "swr";
import { input } from "./workspace-ui";

type Place = { label: string; city: string; state: string; zip: string };

const fetchPlaces = (url: string) =>
  fetch(url).then((r) => r.json() as Promise<{ places: Place[] }>);

function useDebounced(value: string, ms = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

/** "City, ST" input with city and ZIP autocomplete. */
export function CityField({
  label,
  name,
  value = "",
  required = false,
  placeholder = "City or ZIP",
}: {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const query = useDebounced(text.trim());
  const { data } = useSWR(
    open && query.length >= 2 ? `/api/places?q=${encodeURIComponent(query)}` : null,
    fetchPlaces,
    { keepPreviousData: true, revalidateOnFocus: false },
  );
  const places = open ? (data?.places ?? []) : [];
  const expanded = places.length > 0;

  const choose = (place: Place) => {
    setText(`${place.city}, ${place.state}`);
    setOpen(false);
    setActive(-1);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`${input} text-base`}
        name={name}
        value={text}
        required={required}
        maxLength={120}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (!expanded) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => (i + 1) % places.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => (i <= 0 ? places.length - 1 : i - 1));
          } else if (e.key === "Enter" && active >= 0) {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            e.preventDefault();
            choose(places[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {expanded ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {places.map((place, i) => (
            <li
              key={`${place.label}-${place.zip}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 text-base ${
                i === active ? "bg-slate-100" : ""
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(place)}
            >
              <span className="text-slate-900">{`${place.city}, ${place.state}`}</span>
              <span className="text-xs text-slate-500">{place.zip}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
