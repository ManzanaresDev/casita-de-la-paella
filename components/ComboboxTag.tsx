// components/ComboboxTag.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface Props {
  label: string;
  values: string[];
  suggestions: string[];
  onChange: (values: string[]) => void;
  tagClassName?: string;
  accentColor?: "amber" | "red";
}

export default function ComboboxTag({
  label,
  values,
  suggestions,
  onChange,
  accentColor = "amber",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()) && !values.includes(s),
  );

  const add = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setQuery("");
    setOpen(false);
  };

  const remove = (index: number) =>
    onChange(values.filter((_, i) => i !== index));

  const focusBorder =
    accentColor === "amber" ? "focus:border-amber-600" : "focus:border-red-600";
  const addBtnColor =
    accentColor === "amber"
      ? "text-amber-500 hover:border-amber-600"
      : "text-red-500 hover:border-red-600";
  const tagStyle =
    accentColor === "amber"
      ? "bg-stone-800 border-stone-700 text-stone-300"
      : "bg-red-950 border-red-900 text-red-300";
  const createColor =
    accentColor === "amber" ? "text-amber-500" : "text-red-400";

  return (
    <div>
      <label className="block text-xs text-stone-400 mb-2">{label}</label>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v, i) => (
          <span
            key={i}
            className={`flex items-center gap-1 border text-xs px-2 py-1 rounded-full ${tagStyle}`}
          >
            {v}
            <button
              type="button"
              onClick={() => remove(i)}
              className="opacity-60 hover:opacity-100 transition"
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>

      {/* Input + dropdown */}
      <div ref={containerRef} className="relative flex gap-2">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // Priorité : premier résultat existant, sinon création libre
              filtered.length > 0
                ? add(filtered[0])
                : query.trim() && add(query);
            }
          }}
          placeholder="Rechercher ou créer..."
          className={`flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-stone-500 focus:outline-none ${focusBorder}`}
        />
        <button
          type="button"
          onClick={() => (filtered.length > 0 ? add(filtered[0]) : add(query))}
          className={`p-2 bg-stone-800 border border-stone-700 rounded-lg transition ${addBtnColor}`}
        >
          <Plus size={16} />
        </button>

        {/* Dropdown */}
        {open && (query || filtered.length > 0) && (
          <div className="absolute top-full left-0 right-10 mt-1 z-50 bg-stone-900 border border-stone-700 rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto">
            {filtered.length > 0 && (
              <>
                <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-stone-500">
                  Existants
                </p>
                {filtered.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()} // évite blur avant click
                    onClick={() => add(s)}
                    className="w-full text-left px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 transition"
                  >
                    {s}
                  </button>
                ))}
              </>
            )}

            {/* Créer si la saisie ne correspond à rien d'existant */}
            {query.trim() &&
              !values.includes(query.trim()) &&
              !filtered.includes(query.trim()) && (
                <>
                  {filtered.length > 0 && (
                    <hr className="border-stone-800 my-1" />
                  )}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(query)}
                    className={`w-full text-left px-3 py-2 text-sm transition hover:bg-stone-800 ${createColor}`}
                  >
                    + Créer &laquo;&nbsp;{query.trim()}&nbsp;&raquo;
                  </button>
                </>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
