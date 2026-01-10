"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import { buildAddToCartUrl, buildAmazonProductUrl } from "@/lib/amazon";

type ParsedItem = {
  asin: string;
  quantity: number;
};

function parseLines(value: string): { items: ParsedItem[]; invalidLines: string[] } {
  const items: ParsedItem[] = [];
  const invalidLines: string[] = [];

  value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .forEach((line) => {
      const match = line.match(/^([A-Z0-9]{10})(?:\s*[,x]\s*(\d+))?$/i);
      if (!match) {
        invalidLines.push(line);
        return;
      }
      const asin = match[1].toUpperCase();
      const quantity = match[2] ? Number(match[2]) : 1;
      if (!Number.isFinite(quantity) || quantity <= 0) {
        invalidLines.push(line);
        return;
      }
      items.push({ asin, quantity });
    });

  return { items, invalidLines };
}

export default function KitBuilderForm({ tag, placeholder }: { tag: string; placeholder: string }) {
  const [input, setInput] = useState(placeholder);
  const { items, invalidLines } = parseLines(input);
  const cartUrl = items.length ? buildAddToCartUrl(items, tag) : "";

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <label className="block text-sm font-semibold text-slate-700">
        ASINs + quantities
        <textarea
          className="mt-2 h-40 w-full rounded-xl border border-slate-200 p-3 text-sm"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </label>
      {invalidLines.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <p className="font-semibold">These lines could not be parsed:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {invalidLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-700">Add-to-cart URL</p>
          <p className="mt-2 break-all text-xs text-slate-600">{cartUrl || "Enter at least one ASIN."}</p>
          {cartUrl && (
            <div className="mt-2">
              <CopyButton text={cartUrl} />
            </div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-700">Product URLs</p>
          <div className="mt-2 space-y-2">
            {items.length ? (
              items.map((item) => {
                const url = buildAmazonProductUrl(item.asin, tag);
                return (
                  <div key={item.asin} className="rounded-lg border border-slate-100 bg-white p-2">
                    <p className="text-xs text-slate-600 break-all">{url}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <span>Qty {item.quantity}</span>
                      <CopyButton text={url} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">Paste ASINs to generate product links.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
