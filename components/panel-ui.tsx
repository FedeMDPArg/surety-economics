"use client";

import { motion } from "framer-motion";

export function MetricCard({
  label,
  value,
  accent,
  sublabel,
}: {
  label: string;
  value: string;
  accent?: "emerald" | "sky" | "amber" | "rose";
  sublabel?: string;
}) {
  const accentClass = {
    emerald: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-600/30",
    sky: "bg-sky-50 dark:bg-sky-950/30 border-sky-600/30",
    amber: "bg-amber-50 dark:bg-amber-950/30 border-amber-600/30",
    rose: "bg-rose-50 dark:bg-rose-950/30 border-rose-600/30",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-lg border p-4 ${accent ? accentClass[accent] : ""}`}
    >
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="text-2xl font-bold mt-1"
      >
        {value}
      </motion.p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
      )}
    </motion.div>
  );
}

export function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Sources footer — collapsible, links to /assumptions page.
 * Include at the bottom of every panel for credibility.
 */
export function SourcesFooter({ panelSources }: { panelSources: string[] }) {
  return (
    <details className="rounded-lg border bg-card/40 p-4 text-xs">
      <summary className="cursor-pointer font-medium text-muted-foreground">
        📊 Data sources & assumptions for this panel
      </summary>
      <ul className="mt-2 space-y-1 text-muted-foreground list-disc pl-5">
        {panelSources.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
        <li>
          <Link
            href="/assumptions"
            className="text-amber-400 hover:underline font-medium"
          >
            View all assumptions, disclaimers & comparable valuations →
          </Link>
        </li>
      </ul>
    </details>
  );
}

/**
 * Combined slider + number input. Both stay in sync.
 * Text input allows free typing (no aggressive clamping while typing).
 * Clamping only happens on blur or when committing via Enter.
 */
export function NumberSliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
  sublabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
  sublabel?: string;
}) {
  const [text, setText] = useState<string>(String(value));

  // Keep local text in sync when parent value changes externally (e.g. via slider)
  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    if (text === "" || text === "-") {
      setText(String(value));
      return;
    }
    const n = Number(text);
    if (isNaN(n)) {
      setText(String(value));
      return;
    }
    const clamped = Math.max(min, Math.min(max, n));
    onChange(clamped);
    setText(String(clamped));
  };

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-sm font-medium">{label}</label>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <div className="flex items-center gap-1">
          <input
            type="text"
            inputMode="decimal"
            value={text}
            onChange={(e) => {
              const raw = e.target.value;
              setText(raw);
              // Commit to parent on-the-fly if it's a valid number (no clamping yet)
              if (raw !== "" && raw !== "-" && !isNaN(Number(raw))) {
                onChange(Number(raw));
              }
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="w-24 rounded-md border px-2 py-1 text-sm bg-background text-right"
          />
          {suffix && (
            <span className="text-xs text-muted-foreground">{suffix}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight numeric input for table cells — same free-typing behavior
 * but no slider, no label. Just a text input that clamps on blur.
 */
export function TableNumberInput({
  value,
  min,
  max,
  step,
  onChange,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const [text, setText] = useState<string>(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    if (text === "" || text === "-") {
      setText(String(value));
      return;
    }
    const n = Number(text);
    if (isNaN(n)) {
      setText(String(value));
      return;
    }
    let clamped = n;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    onChange(clamped);
    setText(String(clamped));
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        if (raw !== "" && raw !== "-" && !isNaN(Number(raw))) {
          onChange(Number(raw));
        }
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      step={step}
      className={
        className ??
        "w-24 rounded-md border px-2 py-1 bg-background text-sm text-right"
      }
    />
  );
}
