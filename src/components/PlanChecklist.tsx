"use client";

import { useState } from "react";

type Item = { label: string; fixSlug?: string };

export default function PlanChecklist({ items }: { items: Item[] }) {
  const [checked, setChecked] = useState(() => items.map(() => false));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <label key={`${item.label}-${index}`} className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={checked[index]}
            onChange={(event) => {
              const next = [...checked];
              next[index] = event.target.checked;
              setChecked(next);
            }}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
}
