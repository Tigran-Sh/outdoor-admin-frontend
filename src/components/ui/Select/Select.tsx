import { Children, forwardRef, isValidElement, useId, useMemo } from "react";
import type { ChangeEvent, FocusEvent, ReactElement, ReactNode } from "react";
import ReactSelect from "react-select";
import type { SelectInstance } from "react-select";

import { createReactSelectStyles } from "@/utils/reactSelectStyles";

import type { SelectOptionShape, SelectProps } from "./Select.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Flattens `<option>` (and grouped arrays of them, e.g. from `.map()`) children into the plain
 * `{ value, label }` shape react-select expects, so call sites can keep authoring options the
 * same way they did with a native `<select>`.
 */
function extractOptions(children: ReactNode): SelectOptionShape[] {
  const options: SelectOptionShape[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== "option") return;

    const optionElement = child as ReactElement<{
      value?: string;
      children?: ReactNode;
      disabled?: boolean;
    }>;

    options.push({
      value: optionElement.props.value ?? "",
      label: optionElement.props.children,
      isDisabled: optionElement.props.disabled,
    });
  });

  return options;
}

const Select = forwardRef<SelectInstance<SelectOptionShape, false>, SelectProps>(
  function Select(
    {
      id,
      label,
      error,
      helperText,
      size = "md",
      className,
      containerClassName,
      children,
      name,
      value,
      onChange,
      onBlur,
      disabled,
      style,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    const options = useMemo(() => extractOptions(children), [children]);
    const selectedOption = useMemo(
      () => options.find((option) => option.value === value) ?? null,
      [options, value],
    );

    // Re-themes automatically when `[data-bs-theme=dark]` flips the underlying `--vz-*` custom
    // properties, instead of staying stuck on react-select's white default -- see
    // `reactSelectStyles.ts` for the full rationale.
    const styles = useMemo(
      () => createReactSelectStyles<SelectOptionShape, false>(size, error),
      [size, error],
    );

    return (
      <div className={containerClassName ?? "mb-3"} style={style}>
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}

        <ReactSelect<SelectOptionShape, false>
          ref={ref}
          inputId={selectId}
          name={name}
          className={joinClassNames("react-select-container", className)}
          classNamePrefix="react-select"
          styles={styles}
          options={options}
          value={selectedOption}
          isDisabled={disabled}
          aria-label={ariaLabel}
          onChange={(option) => {
            onChange?.({
              target: { name: name ?? "", value: option ? option.value : "" },
            } as unknown as ChangeEvent<HTMLSelectElement>);
          }}
          onBlur={() => {
            onBlur?.({ target: { name: name ?? "" } } as unknown as FocusEvent<HTMLSelectElement>);
          }}
        />

        {error && <div className="d-block invalid-feedback">{error}</div>}
        {helperText && !error && <div className="form-text">{helperText}</div>}
      </div>
    );
  },
);

export default Select;
