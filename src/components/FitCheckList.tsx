"use client";

import { useMemo, useState } from "react";

type Question = { question: string; recommendedIfYes?: boolean };

export default function FitCheckList({ items }: { items: Question[] }) {
  const [answers, setAnswers] = useState(() => items.map(() => false));
  const score = useMemo(() => {
    return items.reduce((acc, item, index) => {
      if (!item.recommendedIfYes) return acc;
      return answers[index] ? acc + 1 : acc;
    }, 0);
  }, [answers, items]);
  const verdict = score >= Math.ceil(items.length / 2) ? "Good fit" : "Might not fit";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fit check</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{verdict}</span>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <label key={item.question} className="flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              checked={answers[index]}
              onChange={(event) => {
                const next = [...answers];
                next[index] = event.target.checked;
                setAnswers(next);
              }}
            />
            <span>{item.question}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
