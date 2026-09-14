import { Children, forwardRef, isValidElement, useId, useMemo } from "react";
import type { ChangeEvent, FocusEvent, ReactElement, ReactNode } from "react";
import ReactSelect from "react-select";
import type { SelectInstance, StylesConfig } from "react-select";

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

    // Matches Bootstrap's own $input-height formula exactly (line-height * font-size +
    // padding-y * 2 + border * 2 = 1.55 * 15px + padding-y * 2 + 2px) so react-select's control
    // is pixel-identical to a native `.form-control`/`.form-select` of the same size.
    const controlMinHeight = size === "sm" ? 33.25 : size === "lg" ? 47.65 : 41.25;

    // Matches Bootstrap's $input-padding-x so the selected value/placeholder lines up with a
    // sibling `.form-control`'s text instead of react-select's tighter default inset.
    const controlPaddingX = size === "sm" ? 8 : size === "lg" ? 19.2 : 14.4;

    // Same `--vz-border-radius{-sm,-lg}` custom property `.form-control`/`.form-select` use, so
    // corners match a sibling Input/DatePicker/TimePicker exactly at every size.
    const controlBorderRadius =
      size === "sm"
        ? "var(--vz-border-radius-sm)"
        : size === "lg"
          ? "var(--vz-border-radius-lg)"
          : "var(--vz-border-radius)";

    // All colors below are the same CSS custom properties `.form-control` resolves to (see
    // Input.tsx / bootstrap/_variables.scss's $input-bg/$input-border-color), referenced by
    // `var()` rather than a static value so this component (react-select renders its own inline
    // styles, not a `.form-control`) re-themes itself automatically when `[data-bs-theme=dark]`
    // flips those custom properties, instead of staying stuck on react-select's white default.
    const styles = useMemo<StylesConfig<SelectOptionShape, false>>(
      () => ({
        control: (base, state) => ({
          ...base,
          minHeight: controlMinHeight,
          backgroundColor: "var(--vz-input-bg-custom)",
          borderRadius: controlBorderRadius,
          borderColor: error
            ? "var(--vz-danger)"
            : state.isFocused
              ? "var(--vz-primary)"
              : "var(--vz-input-border-custom)",
          boxShadow: "none",
          "&:hover": {
            borderColor: error ? "var(--vz-danger)" : "var(--vz-input-border-custom)",
          },
        }),
        valueContainer: (base) => ({
          ...base,
          paddingLeft: controlPaddingX,
        }),
        indicatorsContainer: (base) => ({
          ...base,
          paddingRight: controlPaddingX - 8,
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: "var(--vz-border-color)",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "var(--vz-secondary-color)",
        }),
        clearIndicator: (base) => ({
          ...base,
          color: "var(--vz-secondary-color)",
        }),
        singleValue: (base) => ({
          ...base,
          color: "var(--vz-body-color)",
        }),
        input: (base) => ({
          ...base,
          color: "var(--vz-body-color)",
        }),
        placeholder: (base) => ({
          ...base,
          color: "var(--vz-secondary-color)",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "var(--vz-input-bg-custom)",
          border: "1px solid var(--vz-border-color)",
          borderRadius: "var(--vz-border-radius)",
          boxShadow: "var(--vz-box-shadow)",
          zIndex: 5,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "var(--vz-primary)"
            : state.isFocused
              ? "var(--vz-tertiary-bg)"
              : "transparent",
          color: state.isSelected ? "var(--vz-white, #fff)" : "var(--vz-body-color)",
        }),
      }),
      [controlBorderRadius, controlMinHeight, controlPaddingX, error],
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
