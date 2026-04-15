"use client";

import { Globe } from "lucide-react";
import type { FormEvent } from "react";

interface URLInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  /** When true, renders without its own <form> wrapper (used inside a parent form) */
  standalone?: boolean;
}

const INPUT_CLASSES = [
  "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-mono",
  "bg-bg-surface border transition-colors duration-150",
  "text-text-primary placeholder:text-text-subtle",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: Omit<URLInputProps, "onSubmit" | "standalone">) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-muted">
        {label}
      </label>
      <div className="relative flex items-center">
        <Globe
          size={16}
          className="absolute left-3 text-text-subtle pointer-events-none"
          aria-hidden="true"
        />
        <input
          id={id}
          type="url"
          inputMode="url"
          autoComplete="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://example.com"}
          disabled={disabled}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={[
            INPUT_CLASSES,
            error
              ? "border-band-poor focus:border-band-poor"
              : "border-border focus:border-accent",
          ].join(" ")}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-band-poor mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

export default function URLInput({
  id,
  label,
  value,
  onChange,
  onSubmit,
  placeholder = "https://example.com/",
  error,
  disabled,
  standalone = false,
}: URLInputProps) {
  const errorId = `${id}-error`;

  if (standalone) {
    return (
      <InputField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1.5" noValidate>
      <label htmlFor={id} className="text-sm font-medium text-text-muted">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex items-center flex-1 min-w-0">
          <Globe
            size={16}
            className="absolute left-3 text-text-subtle pointer-events-none"
            aria-hidden="true"
          />
          <input
            id={id}
            type="url"
            inputMode="url"
            autoComplete="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            className={[
              INPUT_CLASSES,
              error
                ? "border-band-poor focus:border-band-poor"
                : "border-border focus:border-accent",
            ].join(" ")}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="sm:shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent text-bg-base hover:bg-accent-dim disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
        >
          Analyze
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-band-poor">
          {error}
        </p>
      )}
    </form>
  );
}
