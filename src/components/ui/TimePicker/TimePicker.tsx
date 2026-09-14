import { useId, useMemo } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import Flatpickr from "react-flatpickr";
import type { Options } from "flatpickr/dist/types/options";

import type { TimePickerProps } from "./TimePicker.types";

function parseHmLocal(hm: string | undefined): Date | undefined {
  if (!hm) return undefined;
  const [hours, minutes] = hm.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return undefined;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatHmLocal(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

const TIME_PICKER_OPTIONS: Options = {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true,
  disableMobile: true,
};

function TimePicker({
  id,
  label,
  error,
  helperText,
  size = "md",
  className,
  containerClassName,
  name,
  value,
  placeholder,
  disabled,
  onChange,
  onBlur,
}: TimePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const selectedTime = useMemo(() => parseHmLocal(value), [value]);

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
          options={TIME_PICKER_OPTIONS}
          value={selectedTime}
          onChange={(selectedDates) => {
            const [date] = selectedDates;
            onChange?.({
              target: { name: name ?? "", value: date ? formatHmLocal(date) : "" },
            } as unknown as ChangeEvent<HTMLInputElement>);
          }}
          onClose={() => {
            onBlur?.({ target: { name: name ?? "" } } as unknown as FocusEvent<HTMLInputElement>);
          }}
        />
        <span className="input-group-text">
          <i className="ri-time-line" aria-hidden="true" />
        </span>
      </div>

      {error && <div className="d-block invalid-feedback">{error}</div>}
      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
}

export default TimePicker;
