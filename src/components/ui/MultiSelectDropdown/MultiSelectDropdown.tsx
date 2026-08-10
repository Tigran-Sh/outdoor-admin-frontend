import { useEffect, useId, useRef, useState } from "react";

import Checkbox from "@/components/ui/Checkbox/Checkbox";

import type { MultiSelectDropdownProps } from "./MultiSelectDropdown.types";

function MultiSelectDropdown({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled,
  containerClassName,
  toggleClassName,
}: MultiSelectDropdownProps) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;
  const labelId = `${toggleId}-label`;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleValue(optionValue: string) {
    const next = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];
    onChange(next);
  }

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  const toggleClassNames = ["form-select", "text-start", error ? "is-invalid" : "", toggleClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName ?? "mb-3"}>
      {label && (
        <span className="form-label d-block" id={labelId}>
          {label}
        </span>
      )}

      <div ref={containerRef} className="dropdown">
        <button
          type="button"
          id={toggleId}
          className={toggleClassNames}
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={disabled}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-labelledby={label ? labelId : undefined}
        >
          <span className={selectedLabels.length === 0 ? "text-muted" : undefined}>
            {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
          </span>
        </button>

        <div
          className={["dropdown-menu", "w-100", isOpen ? "show" : ""].filter(Boolean).join(" ")}
          style={{ maxHeight: 260, overflowY: "auto" }}
        >
          {options.map((option) => (
            <div key={option.value} className="dropdown-item">
              <Checkbox
                id={`${toggleId}-${option.value}`}
                label={option.label}
                checked={value.includes(option.value)}
                onChange={() => toggleValue(option.value)}
                containerClassName="form-check mb-0"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <div className="invalid-feedback d-block">{error}</div>}
      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
}

export default MultiSelectDropdown;
