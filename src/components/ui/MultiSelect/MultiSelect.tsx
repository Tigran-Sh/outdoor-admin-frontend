import { forwardRef, useId, useMemo } from "react";
import ReactSelect from "react-select";
import type { SelectInstance } from "react-select";

import { createReactSelectStyles } from "@/utils/reactSelectStyles";

import type { MultiSelectOption, MultiSelectProps } from "./MultiSelect.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * A searchable multi-select combobox (the "select2" pattern) built on `react-select`, styled to
 * match `Select`/`Input` exactly. Prefer this over `MultiSelectDropdown` (a plain Bootstrap
 * checkbox dropdown) whenever the option list benefits from type-to-filter search or chip-style
 * selected values -- e.g. language pickers.
 */
const MultiSelect = forwardRef<SelectInstance<MultiSelectOption, true>, MultiSelectProps>(
  function MultiSelect(
    {
      id,
      label,
      options,
      value,
      onChange,
      onBlur,
      placeholder,
      error,
      helperText,
      size = "md",
      disabled,
      containerClassName,
      className,
      name,
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    const selectedOptions = useMemo(
      () => options.filter((option) => value.includes(option.value)),
      [options, value],
    );

    // Re-themes automatically when `[data-bs-theme=dark]` flips the underlying `--vz-*` custom
    // properties -- see `reactSelectStyles.ts` for the full rationale.
    const styles = useMemo(
      () => createReactSelectStyles<MultiSelectOption, true>(size, error),
      [size, error],
    );

    return (
      <div className={containerClassName ?? "mb-3"}>
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}

        <ReactSelect<MultiSelectOption, true>
          ref={ref}
          inputId={selectId}
          name={name}
          isMulti
          className={joinClassNames("react-select-container", className)}
          classNamePrefix="react-select"
          styles={styles}
          options={options}
          value={selectedOptions}
          placeholder={placeholder}
          isDisabled={disabled}
          onChange={(selected) => onChange(selected.map((option) => option.value))}
          onBlur={onBlur}
        />

        {error && <div className="d-block invalid-feedback">{error}</div>}
        {helperText && !error && <div className="form-text">{helperText}</div>}
      </div>
    );
  },
);

export default MultiSelect;
