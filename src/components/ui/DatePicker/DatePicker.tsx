import { useCallback, useId, useMemo } from "react";
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

const FLATPICKR_MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Matches this component's `dateFormat: "d M, Y"` option token-for-token. Used as the initial,
 * *uncontrolled* `defaultValue` of the hand-rendered `<input>` below (see the `render` prop), so
 * the very first paint already shows the right text instead of an empty field for a split second
 * before flatpickr's own effect fills it in.
 */
function formatFlatpickrDisplay(date: Date): string {
  return `${date.getDate()} ${FLATPICKR_MONTH_ABBREVIATIONS[date.getMonth()]}, ${date.getFullYear()}`;
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
  const displayValue = useMemo(
    () => (selectedDate ? formatFlatpickrDisplay(selectedDate) : undefined),
    [selectedDate],
  );

  const options = useMemo<Options>(
    () => ({
      dateFormat: "d M, Y",
      minDate: parseIsoDateLocal(min),
      maxDate: parseIsoDateLocal(max),
      disableMobile: true,
    }),
    [min, max],
  );

  // Memoized so `<Flatpickr>`'s props object stays referentially stable across unrelated
  // re-renders of the surrounding form (react-flatpickr otherwise tears down and reinitializes
  // its flatpickr instance on every render where these are freshly created inline).
  const handleChange = useCallback(
    (selectedDates: Date[]) => {
      const [date] = selectedDates;
      onChange?.({
        target: { name: name ?? "", value: date ? formatIsoDateLocal(date) : "" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    },
    [name, onChange],
  );

  const handleClose = useCallback(() => {
    onBlur?.({ target: { name: name ?? "" } } as unknown as FocusEvent<HTMLInputElement>);
  }, [name, onBlur]);

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
          onChange={handleChange}
          onClose={handleClose}
          // `react-flatpickr`'s default rendering sets the underlying native `<input>`'s
          // (React-controlled) `value` to `value?.toString()` -- so with a `Date` object it
          // flashes the `Date`'s default `toString()`, e.g. "Thu Sep 24 2026 00:00:00 GMT+0400
          // (Armenia Standard Time)", instead of "24 Sep, 2026". Rendering the `<input>` ourselves
          // with an *uncontrolled* `defaultValue` sidesteps that entirely: flatpickr owns this
          // node's displayed text directly (imperatively) once mounted, the same way it does for a
          // plain, non-React `<input>`, so React never gets a chance to overwrite it with that.
          render={(_renderProps, ref) => (
            <input
              ref={ref}
              id={inputId}
              name={name}
              className={controlClassName}
              placeholder={placeholder}
              disabled={disabled}
              defaultValue={displayValue}
            />
          )}
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
