import { useEffect, useMemo } from "react";

export function useObjectUrl(file: File | undefined): string | undefined {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
}
