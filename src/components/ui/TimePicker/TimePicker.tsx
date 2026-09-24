import { useId, useMemo } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import ReactSelect from "react-select";

import { createReactSelectStyles } from "@/utils/reactSelectStyles";

import type { TimePickerProps } from "./TimePicker.types";

interface TimeOption {
  value: string;
  label: string;
}

const MINUTES_PER_DAY = 24 * 60;

/** Builds every `HH:mm` time-of-day option, `stepMinutes` apart, for the dropdown's option list. */
function buildTimeOptions(stepMinutes: number): TimeOption[] {
  const options: TimeOption[] = [];
  for (let minutes = 0; minutes < MINUTES_PER_DAY; minutes += stepMinutes) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    const value = `${hours}:${mins}`;
    options.push({ value, label: value });
  }
  return options;
}

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

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
  stepMinutes = 30,
  placeholder,
  disabled,
  onChange,
  onBlur,
}: TimePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const options = useMemo(() => buildTimeOptions(stepMinutes), [stepMinutes]);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  // Re-themes automatically when `[data-bs-theme=dark]` flips the underlying `--vz-*` custom
  // properties -- see `reactSelectStyles.ts` for the full rationale.
  const styles = useMemo(
    () => createReactSelectStyles<TimeOption, false>(size, error),
    [size, error],
  );

  return (
    <div className={containerClassName ?? "mb-3"}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}

      <ReactSelect<TimeOption, false>
        inputId={inputId}
        name={name}
        className={joinClassNames("react-select-container", className)}
        classNamePrefix="react-select"
        styles={styles}
        options={options}
        value={selectedOption}
        placeholder={placeholder}
        isDisabled={disabled}
        onChange={(option) => {
          onChange?.({
            target: { name: name ?? "", value: option ? option.value : "" },
          } as unknown as ChangeEvent<HTMLInputElement>);
        }}
        onBlur={() => {
          onBlur?.({ target: { name: name ?? "" } } as unknown as FocusEvent<HTMLInputElement>);
        }}
      />

      {error && <div className="d-block invalid-feedback">{error}</div>}
      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
}

export default TimePicker;
