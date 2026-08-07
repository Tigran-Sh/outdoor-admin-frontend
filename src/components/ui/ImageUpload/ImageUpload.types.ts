import type { ReactNode } from "react";

export interface ImageUploadProps {
  /** Label rendered above the dropzone. */
  label?: ReactNode;
  /** Allows selecting/dropping more than one file. Defaults to `false`. */
  multiple?: boolean;
  /** Currently selected files. */
  value: File[];
  onChange: (files: File[]) => void;
  /** Caps the number of files kept when `multiple` is true. */
  maxFiles?: number;
  /** Forwarded to the underlying `<input type="file">`. Defaults to `"image/*"`. */
  accept?: string;
  error?: string;
  helperText?: ReactNode;
}
