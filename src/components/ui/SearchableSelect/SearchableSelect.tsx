import { useId, useMemo } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import ReactSelect from "react-select";

import { createReactSelectStyles } from "@/utils/reactSelectStyles";

import type { SearchableSelectOption, SearchableSelectProps } from "./SearchableSelect.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * A searchable single-select combobox (the "select2" pattern) built on `react-select`, styled to
 * match `Select`/`Input` exactly. Prefer this over the native `Select` whenever the option list is
 * long enough that type-to-filter search meaningfully helps (e.g. picking one person out of a
 * team roster) -- see `MultiSelect` for the multi-value equivalent.
 */
function SearchableSelect({
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
  isClearable = true,
  containerClassName,
  className,
  name,
}: SearchableSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  // Re-themes automatically when `[data-bs-theme=dark]` flips the underlying `--vz-*` custom
  // properties -- see `reactSelectStyles.ts` for the full rationale.
  const styles = useMemo(
    () => createReactSelectStyles<SearchableSelectOption, false>(size, error),
    [size, error],
  );

  return (
    <div className={containerClassName ?? "mb-3"}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}

      <ReactSelect<SearchableSelectOption, false>
        inputId={selectId}
        name={name}
        className={joinClassNames("react-select-container", className)}
        classNamePrefix="react-select"
        styles={styles}
        options={options}
        value={selectedOption}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={isClearable}
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

export default SearchableSelect;
