import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";

import type { LocationMapPreviewProps } from "./LocationMapPreview.types";

/** Read-only map with a single, non-draggable pin -- used to display a saved location. */
function LocationMapPreview({ lat, lng, zoom = 15, height = 220, className }: LocationMapPreviewProps) {
  const { t } = useTranslation();
  const { isLoaded, loadError, hasApiKey } = useGoogleMapsLoader();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    const position = { lat, lng };

    if (!mapRef.current) {
      const map = new google.maps.Map(containerRef.current, {
        center: position,
        zoom,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
      });
      mapRef.current = map;
      markerRef.current = new google.maps.Marker({ map, position });
    } else {
      mapRef.current.panTo(position);
      markerRef.current?.setPosition(position);
    }
  }, [isLoaded, lat, lng, zoom]);

  if (!hasApiKey || loadError) return null;

  return (
    <div className={className}>
      <div ref={containerRef} className="rounded border" style={{ height }} />
      {!isLoaded && (
        <p className="text-muted fs-13 mt-1 mb-0">
          {t("events.form.fields.meetingPointMap.loading")}
        </p>
      )}
    </div>
  );
}

export default LocationMapPreview;
