"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

export default function Select<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  triggerClassName,
  renderTrigger,
}: {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  triggerClassName: string;
  renderTrigger: (selected: SelectOption<T>) => ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={triggerClassName}
      >
        {renderTrigger(selected)}
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-lg border border-border bg-surface py-1 text-sm shadow-md"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-4 whitespace-nowrap px-3 py-1.5 text-left transition-colors hover:bg-accent/10 ${
                  option.value === value
                    ? "font-medium text-accent"
                    : "text-foreground"
                }`}
              >
                {option.label}
                {option.value === value && <span aria-hidden>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
