"use client";

import { useState } from "react";
import { Calendar, Plus, Trash2 } from "lucide-react";
import type { UserAnnotation } from "@/types/crux";
import { ANNOTATION_MAX_LABEL_LENGTH } from "@/lib/constants";
import { formatFullDate } from "@/lib/format";

interface EventAnnotationProps {
  annotations: UserAnnotation[];
  onAdd: (date: string, label: string) => void;
  onRemove: (id: string) => void;
}

export default function EventAnnotation({
  annotations,
  onAdd,
  onRemove,
}: EventAnnotationProps) {
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");

  const canAdd =
    date.trim().length > 0 &&
    label.trim().length > 0 &&
    label.trim().length <= ANNOTATION_MAX_LABEL_LENGTH;

  function handleAdd() {
    if (!canAdd) return;
    onAdd(date, label.trim());
    setDate("");
    setLabel("");
  }

  return (
    <section aria-label="Timeline annotations" className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
        <Calendar size={13} aria-hidden="true" />
        Add Event Annotation
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Annotation date"
          className="w-full sm:w-auto px-3 py-2 rounded-xl text-sm bg-bg-surface border border-border text-text-primary focus:border-accent transition-colors duration-150 font-mono"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="e.g. Deployed v2.0"
          maxLength={ANNOTATION_MAX_LABEL_LENGTH}
          aria-label="Annotation label"
          className="flex-1 px-3 py-2 rounded-xl text-sm bg-bg-surface border border-border text-text-primary placeholder:text-text-subtle focus:border-accent transition-colors duration-150"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          aria-label="Add annotation"
          className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-accent-muted border border-border text-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer shrink-0"
        >
          <Plus size={14} aria-hidden="true" />
          Add
        </button>
      </div>

      {annotations.length > 0 && (
        <ul
          className="flex flex-col gap-1.5"
          aria-label={`${annotations.length} annotation${annotations.length === 1 ? "" : "s"}`}
        >
          {annotations.map((ann) => (
            <li
              key={ann.id}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
            >
              <span className="text-accent font-mono text-xs shrink-0">
                {formatFullDate(ann.date)}
              </span>
              <span className="text-text-muted truncate">{ann.label}</span>
              <button
                type="button"
                onClick={() => onRemove(ann.id)}
                aria-label={`Remove annotation: ${ann.label}`}
                className="shrink-0 text-text-subtle hover:text-band-poor transition-colors duration-150 cursor-pointer"
              >
                <Trash2 size={13} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
