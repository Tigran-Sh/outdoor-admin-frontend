import type { ReactNode } from "react";

export interface LocationPickerProps {
  /** Label for the address/description search field. */
  addressLabel?: ReactNode;
  addressName?: string;
  addressPlaceholder?: string;
  addressValue: string;
  addressError?: string;
  onAddressChange: (value: string) => void;
  onAddressBlur?: () => void;

  /** Label for the `"lat, lng"` coordinates field. */
  coordinatesLabel?: ReactNode;
  coordinatesName?: string;
  coordinatesPlaceholder?: string;
  coordinatesHelperText?: ReactNode;
  coordinatesValue: string;
  coordinatesError?: string;
  onCoordinatesChange: (value: string) => void;
  onCoordinatesBlur?: () => void;
}
