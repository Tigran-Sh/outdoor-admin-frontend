import type { ReactNode } from "react";

export type ImageUploadVariant = "dropzone" | "avatar";

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
  /**
   * `"dropzone"` (default) is the full-width drag-and-drop panel.
   * `"avatar"` is a small square swatch, meant to sit beside other fields
   * (e.g. a profile photo next to a name input); implies `multiple={false}`.
   */
  variant?: ImageUploadVariant;
  /** Side length in px for the `"avatar"` variant. Defaults to `96`. */
  size?: number;
  /**
   * A previously uploaded file's URL, shown (for `"avatar"`) until the user
   * picks a replacement. Lets edit forms preview an existing photo without
   * needing a `File` object for it.
   */
  existingImageUrl?: string | null;
  /** Shrinks the `"dropzone"` variant's panel (smaller icon, one-line text). */
  compact?: boolean;
}
