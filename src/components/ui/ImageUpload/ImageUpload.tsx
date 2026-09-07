import { useId, useRef, useState } from "react";
import type { DragEvent } from "react";
import { useTranslation } from "react-i18next";

import type { ImageUploadProps } from "./ImageUpload.types";

/**
 * Per-`File` object URL cache, scoped to a single component instance.
 *
 * File previews are only revoked when a file is actually removed (or the
 * whole field is cleared) -- never on unmount. Revoking on unmount races
 * against the `<img>` still trying to load that blob URL, which is exactly
 * what breaks previews after navigating a multi-step form away and back
 * (React 18 StrictMode's mount/unmount/remount cycle in dev makes this race
 * near-guaranteed, but it's a real bug in production too).
 */
function useFileUrlCache() {
  const cacheRef = useRef(new Map<File, string>());

  function getUrl(file: File): string {
    let url = cacheRef.current.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      cacheRef.current.set(file, url);
    }
    return url;
  }

  function release(file: File) {
    const url = cacheRef.current.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      cacheRef.current.delete(file);
    }
  }

  return { getUrl, release };
}

function ImageUpload({
  label,
  multiple = false,
  value,
  onChange,
  maxFiles,
  accept = "image/*",
  error,
  helperText,
  variant = "dropzone",
  size = 96,
  existingImageUrl,
  compact = false,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { getUrl, release } = useFileUrlCache();

  const previews = value.map((file) => getUrl(file));

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    if (!multiple) {
      value.forEach(release);
      onChange(incoming.slice(0, 1));
      return;
    }

    const combined = [...value, ...incoming];
    onChange(maxFiles ? combined.slice(0, maxFiles) : combined);
  }

  function removeFile(index: number) {
    const file = value[index];
    release(file);
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
  }

  const inputElement = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={accept}
      multiple={multiple}
      className="d-none"
      onChange={(event) => {
        if (event.target.files?.length) addFiles(event.target.files);
        event.target.value = "";
      }}
    />
  );

  if (variant === "avatar") {
    const displaySrc = previews[0] ?? existingImageUrl ?? undefined;

    return (
      <div className="mb-3">
        {label && (
          <label className="form-label d-block" htmlFor={inputId}>
            {label}
          </label>
        )}

        <div
          className={[
            "dropzone dz-clickable rounded-circle p-0 d-flex flex-column align-items-center justify-content-center",
            isDragging && "border-primary",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ width: size, height: size, minHeight: size }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(false);
            if (event.dataTransfer.files.length)
              addFiles(event.dataTransfer.files);
          }}
        >
          {displaySrc ? (
            <img
              src={displaySrc}
              alt=""
              className="w-100 h-100 rounded-circle"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <>
              <i
                className="ri-camera-line fs-20 text-muted"
                aria-hidden="true"
              />
              <span className="fs-11 text-muted text-center px-1 mt-1 lh-sm">
                {t("common.imageUpload.uploadImage")}
              </span>
            </>
          )}

          {inputElement}
        </div>

        {previews[0] && (
          <button
            type="button"
            className="btn btn-link btn-sm p-0 mt-1 text-danger"
            onClick={(event) => {
              event.stopPropagation();
              removeFile(0);
            }}
          >
            {t("common.imageUpload.removeImage")}
          </button>
        )}

        {error && <div className="text-danger fs-13 mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div className="mb-1">
      {label && (
        <label className="form-label d-block" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={["dropzone dz-clickable", isDragging && "border-primary"]
          .filter(Boolean)
          .join(" ")}
        style={compact ? { minHeight: "auto", padding: "0.75rem" } : undefined}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(false);
          if (event.dataTransfer.files.length)
            addFiles(event.dataTransfer.files);
        }}
      >
        {compact ? (
          <div className="dz-message needsclick text-center d-flex align-items-center justify-content-center gap-2">
            <i
              className="ri-upload-cloud-2-fill text-muted fs-20"
              aria-hidden="true"
            />
            <span className="fs-13">
              {t("common.imageUpload.dropInstructions")}
            </span>
          </div>
        ) : (
          <div className="dz-message needsclick text-center">
            <div className="mb-3">
              <i
                className="display-4 text-muted ri-upload-cloud-2-fill"
                aria-hidden="true"
              />
            </div>
            <h5 className="fs-14">
              {t("common.imageUpload.dropInstructions")}
            </h5>
          </div>
        )}

        {inputElement}
      </div>

      {previews.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-3">
          {previews.map((src, index) => (
            <div key={src} className="position-relative">
              <img
                src={src}
                alt=""
                className="rounded border"
                style={{
                  width: compact ? 56 : 80,
                  height: compact ? 56 : 80,
                  objectFit: "cover",
                }}
              />
              <button
                type="button"
                className="btn btn-danger rounded-circle position-absolute top-0 start-100 translate-middle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 20, height: 20, fontSize: 12, lineHeight: 1 }}
                aria-label={t("common.imageUpload.removeImage")}
                onClick={(event) => {
                  event.stopPropagation();
                  removeFile(index);
                }}
              >
                <i className="ri-close-line" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-danger fs-13 mt-1">{error}</div>}
      {helperText && !error && <div className="form-text">{helperText}</div>}
    </div>
  );
}

export default ImageUpload;
