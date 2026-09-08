import { useEffect, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

/**
 * Module-scoped so the Maps JS API is only configured/loaded once, no matter
 * how many `LocationPicker` instances mount (e.g. across form steps/pages).
 */
let librariesPromise: Promise<void> | null = null;

function loadGoogleMapsLibraries(apiKey: string): Promise<void> {
  if (!librariesPromise) {
    setOptions({ key: apiKey, v: "weekly" });
    librariesPromise = Promise.all([
      importLibrary("places"),
      importLibrary("maps"),
      importLibrary("marker"),
      importLibrary("geocoding"),
    ]).then(() => undefined);
  }
  return librariesPromise;
}

interface UseGoogleMapsLoaderResult {
  /** Whether the `places`/`maps`/`marker`/`geocoding` libraries have finished loading. */
  isLoaded: boolean;
  /** Set if the API key is missing, or the script failed to load. */
  loadError: Error | null;
  /** Whether `VITE_GOOGLE_MAPS_API_KEY` is configured at all. */
  hasApiKey: boolean;
}

/** Loads the Google Maps JavaScript API (Places + Maps + Marker + Geocoding). */
export function useGoogleMapsLoader(): UseGoogleMapsLoaderResult {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) return;

    let cancelled = false;
    loadGoogleMapsLibraries(apiKey)
      .then(() => {
        if (!cancelled) setIsLoaded(true);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error : new Error(String(error)));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  return { isLoaded, loadError, hasApiKey: Boolean(apiKey) };
}
