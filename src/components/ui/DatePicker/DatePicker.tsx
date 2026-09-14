import { useId, useMemo } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import Flatpickr from "react-flatpickr";
import type { Options } from "flatpickr/dist/types/options";

import type { DatePickerProps } from "./DatePicker.types";

function parseIsoDateLocal(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatIsoDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function DatePicker({
  id,
  label,
  error,
  helperText,
  size = "md",
  className,
  containerClassName,
  name,
  value,
  min,
  max,
  placeholder,
  disabled,
  onChange,
  onBlur,
}: DatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const selectedDate = useMemo(() => parseIsoDateLocal(value), [value]);

  const options = useMemo<Options>(
    () => ({
      dateFormat: "d M, Y",
      minDate: parseIsoDateLocal(min),
      maxDate: parseIsoDateLocal(max),
      disableMobile: true,
    }),
    [min, max],
  );

  const controlClassName = joinClassNames(
    "form-control",
    size === "sm" ? "form-control-sm" : undefined,
    size === "lg" ? "form-control-lg" : undefined,
    error ? "is-invalid" : undefined,
    className,
  );

  return (
    <div className={containerClassName ?? "mb-3"}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}

      <div className="input-group">
        <Flatpickr
          id={inputId}
          name={name}
          className={controlClassName}
          placeholder={placeholder}
          disabled={disabled}
          options={options}
          value={selectedDate}
          onChange={(selectedDates) => {
            const [date] = selectedDates;
            onChange?.({
              target: { name: name ?? "", value: date ? formatIsoDateLocal(date) : "" },
            } as unknown as ChangeEvent<HTMLInputElement>);
          }}
          onClose={() => {
            onBlur?.({ target: { name: name ?? "" } } as unknown as FocusEvent<HTMLInputElement>);
          }}
        />
        <span className="input-group-text">
          <i className="ri-calendar-2-line" aria-hidden="true" />
        </span>
      </div>

      {error && <div className="d-block invalid-feedback">{error}</div>}
      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
}

export default DatePicker;
