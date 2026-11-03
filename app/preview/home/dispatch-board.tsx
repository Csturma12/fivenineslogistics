"use client";

import { useEffect, useState } from "react";

type Status = "Quoted" | "Covered" | "In transit" | "On site";

const STATUS_ORDER: Status[] = ["Quoted", "Covered", "In transit", "On site"];

const moves: { lane: string; freight: string; equipment: string; start: number }[] = [
  { lane: "Houston, TX → Abilene, TX", freight: "Switchgear, 38k lb", equipment: "RGN", start: 2 },
  { lane: "Baton Rouge, LA → Beaumont, TX", freight: "Line-down pump", equipment: "Hotshot", start: 3 },
  { lane: "La Porte, TX → Odessa, TX", freight: "Valves + spools", equipment: "Flatbed", start: 1 },
  { lane: "Port of Houston → Dallas, TX", freight: "OOG crate, blind BOL", equipment: "Step deck", start: 0 },
  { lane: "Hueytown, AL → Kirbyville, TX", freight: "Refractory brick", equipment: "Conestoga", start: 2 },
];

function centralTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function DispatchBoard() {
  const [steps, setSteps] = useState(() => moves.map((move) => move.start));
  const [changedRow, setChangedRow] = useState<number | null>(null);
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    setClock(centralTime(new Date()));
    const clockTimer = setInterval(() => setClock(centralTime(new Date())), 1000);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick = 0;
    const statusTimer = reduceMotion
      ? undefined
      : setInterval(() => {
          const row = tick % moves.length;
          tick += 1;
          setSteps((prev) => prev.map((value, index) => (index === row ? value + 1 : value)));
          setChangedRow(row);
        }, 3200);
    return () => {
      clearInterval(clockTimer);
      if (statusTimer) clearInterval(statusTimer);
    };
  }, []);

  return (
    <div className="pv-board" aria-label="Example dispatch board">
      <div className="pv-board__head">
        <span className="pv-board__live">Sample board</span>
        <span className="pv-board__clock" suppressHydrationWarning>
          {clock ?? "--:--:--"} CT
        </span>
      </div>
      <ul className="pv-board__rows">
        {moves.map((move, index) => {
          const status = STATUS_ORDER[steps[index] % STATUS_ORDER.length];
          return (
            <li
              key={index === changedRow ? `${move.lane}-${steps[index]}` : move.lane}
              className="pv-board__row"
              data-flash={index === changedRow ? "true" : undefined}
            >
              <div className="pv-board__lane">
                <strong>{move.lane}</strong>
                <span>
                  {move.freight} · {move.equipment}
                </span>
              </div>
              <span className="pv-board__status" data-status={status}>
                {status}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="pv-board__foot">Example lanes for illustration · not live loads</p>
    </div>
  );
}
