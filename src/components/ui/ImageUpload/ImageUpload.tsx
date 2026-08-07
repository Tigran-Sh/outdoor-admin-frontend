import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { useTranslation } from "react-i18next";

import type { ImageUploadProps } from "./ImageUpload.types";

function ImageUpload({
  label,
  multiple = false,
  value,
  onChange,
  maxFiles,
  accept = "image/*",
  error,
  helperText,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previews = useMemo(() => value.map((file) => URL.createObjectURL(file)), [value]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    if (!multiple) {
      onChange(incoming.slice(0, 1));
      return;
    }

    const combined = [...value, ...incoming];
    onChange(maxFiles ? combined.slice(0, maxFiles) : combined);
  }

  function removeFile(index: number) {
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label d-block" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={["dropzone dz-clickable", isDragging && "border-primary"]
          .filter(Boolean)
          .join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setIsDragging(false);
          if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
        }}
      >
        <div className="dz-message needsclick text-center">
          <div className="mb-3">
            <i className="display-4 text-muted ri-upload-cloud-2-fill" aria-hidden="true" />
          </div>
          <h5 className="fs-14">{t("common.imageUpload.dropInstructions")}</h5>
        </div>

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
      </div>

      {previews.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-3">
          {previews.map((src, index) => (
            <div key={src} className="position-relative">
              <img
                src={src}
                alt=""
                className="rounded border"
                style={{ width: 80, height: 80, objectFit: "cover" }}
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
