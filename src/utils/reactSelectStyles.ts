import type { StylesConfig } from "react-select";

export type ReactSelectSize = "sm" | "md" | "lg";

/**
 * Builds a `react-select` `styles` config that makes it pixel-identical to a Bootstrap
 * `.form-control`/`.form-select` of the same size, referencing the same `--vz-*` CSS custom
 * properties those use (see `bootstrap/_variables.scss`) so it re-themes automatically when
 * `[data-bs-theme=dark]` flips them, instead of staying stuck on react-select's white default.
 *
 * Shared by every `react-select`-based field (`Select`, `MultiSelect`, `TimePicker`) so they all
 * look and behave the same way instead of drifting apart.
 */
export function createReactSelectStyles<
  Option,
  IsMulti extends boolean = false,
>(size: ReactSelectSize, error: string | undefined): StylesConfig<Option, IsMulti> {
  // Matches Bootstrap's own $input-height formula exactly (line-height * font-size +
  // padding-y * 2 + border * 2 = 1.55 * 15px + padding-y * 2 + 2px) so react-select's control
  // is pixel-identical to a native `.form-control`/`.form-select` of the same size.
  const controlMinHeight = size === "sm" ? 33.25 : size === "lg" ? 47.65 : 41.25;

  // Matches Bootstrap's $input-padding-x so the selected value/placeholder lines up with a
  // sibling `.form-control`'s text instead of react-select's tighter default inset.
  const controlPaddingX = size === "sm" ? 8 : size === "lg" ? 19.2 : 14.4;

  // Same `--vz-border-radius{-sm,-lg}` custom property `.form-control`/`.form-select` use, so
  // corners match a sibling field exactly at every size.
  const controlBorderRadius =
    size === "sm"
      ? "var(--vz-border-radius-sm)"
      : size === "lg"
        ? "var(--vz-border-radius-lg)"
        : "var(--vz-border-radius)";

  return {
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
    multiValue: (base) => ({
      ...base,
      backgroundColor: "var(--vz-tertiary-bg)",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "var(--vz-body-color)",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "var(--vz-secondary-color)",
      "&:hover": {
        backgroundColor: "var(--vz-danger)",
        color: "var(--vz-white, #fff)",
      },
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
  };
}
