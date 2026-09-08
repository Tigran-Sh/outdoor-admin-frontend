import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "@/components/ui/Input/Input";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";

import type { LocationPickerProps } from "./LocationPicker.types";

/** Yerevan, Armenia -- used as the map's default center until a place is picked. */
const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 40.1792, lng: 44.4991 };

function parseCoordinates(value: string): google.maps.LatLngLiteral | null {
  const parts = value.split(",").map((part) => Number(part.trim()));
  if (parts.length !== 2 || parts.some((part) => Number.isNaN(part))) return null;

  const [lat, lng] = parts;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

function formatCoordinates(position: google.maps.LatLngLiteral): string {
  return `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
}

function LocationPicker({
  addressLabel,
  addressName = "address",
  addressPlaceholder,
  addressValue,
  addressError,
  onAddressChange,
  onAddressBlur,
  coordinatesLabel,
  coordinatesName = "coordinates",
  coordinatesPlaceholder,
  coordinatesHelperText,
  coordinatesValue,
  coordinatesError,
  onCoordinatesChange,
  onCoordinatesBlur,
}: LocationPickerProps) {
  const { t } = useTranslation();
  const { isLoaded, loadError, hasApiKey } = useGoogleMapsLoader();

  const addressInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const onAddressChangeRef = useRef(onAddressChange);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  const coordinatesValueRef = useRef(coordinatesValue);

  useEffect(() => {
    onAddressChangeRef.current = onAddressChange;
    onCoordinatesChangeRef.current = onCoordinatesChange;
    coordinatesValueRef.current = coordinatesValue;
  });

  const [isMapReady, setIsMapReady] = useState(false);

  function reverseGeocode(position: google.maps.LatLngLiteral) {
    geocoderRef.current ??= new google.maps.Geocoder();
    void geocoderRef.current.geocode({ location: position }).then(({ results }) => {
      if (results[0]) onAddressChangeRef.current(results[0].formatted_address);
    });
  }

  // Attach Places Autocomplete to the address input once the API is loaded.
  useEffect(() => {
    if (!isLoaded || !addressInputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
      fields: ["formatted_address", "name", "geometry"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;
      const nextAddress = place.formatted_address ?? place.name ?? "";
      if (nextAddress) onAddressChangeRef.current(nextAddress);

      if (location) {
        const position = { lat: location.lat(), lng: location.lng() };
        onCoordinatesChangeRef.current(formatCoordinates(position));
        markerRef.current?.setPosition(position);
        mapRef.current?.panTo(position);
        mapRef.current?.setZoom(15);
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [isLoaded]);

  // Create the map + draggable marker once the API is loaded.
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;

    const initialPosition = parseCoordinates(coordinatesValueRef.current);

    const map = new google.maps.Map(mapContainerRef.current, {
      center: initialPosition ?? DEFAULT_CENTER,
      zoom: initialPosition ? 15 : 6,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
    });
    mapRef.current = map;

    const marker = new google.maps.Marker({
      map,
      position: initialPosition ?? DEFAULT_CENTER,
      draggable: true,
    });
    markerRef.current = marker;

    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (!position) return;
      const literal = { lat: position.lat(), lng: position.lng() };
      onCoordinatesChangeRef.current(formatCoordinates(literal));
      reverseGeocode(literal);
    });

    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      const literal = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      marker.setPosition(literal);
      onCoordinatesChangeRef.current(formatCoordinates(literal));
      reverseGeocode(literal);
    });

    setIsMapReady(true);
  }, [isLoaded]);

  // Keep the marker/map in sync when coordinates are typed in manually.
  useEffect(() => {
    if (!isMapReady || !markerRef.current || !mapRef.current) return;
    const position = parseCoordinates(coordinatesValue);
    if (!position) return;
    markerRef.current.setPosition(position);
    mapRef.current.panTo(position);
  }, [coordinatesValue, isMapReady]);

  return (
    <div className="row">
      <div className="col-sm-6">
        <Input
          ref={addressInputRef}
          label={addressLabel}
          name={addressName}
          placeholder={addressPlaceholder}
          autoComplete="off"
          onChange={(event) => onAddressChange(event.target.value)}
          onBlur={onAddressBlur}
          value={addressValue}
          error={addressError}
        />
      </div>

      <div className="col-sm-6">
        <Input
          label={coordinatesLabel}
          name={coordinatesName}
          placeholder={coordinatesPlaceholder}
          helperText={coordinatesHelperText}
          onChange={(event) => onCoordinatesChange(event.target.value)}
          onBlur={onCoordinatesBlur}
          value={coordinatesValue}
          error={coordinatesError}
          containerClassName={hasApiKey && !loadError ? "mb-3" : "mb-0"}
        />
      </div>

      {hasApiKey && !loadError && (
        <div className="col-12 mb-3">
          <div ref={mapContainerRef} className="rounded border" style={{ height: 220 }} />
          {!isLoaded && (
            <p className="text-muted fs-13 mt-1 mb-0">
              {t("events.form.fields.meetingPointMap.loading")}
            </p>
          )}
        </div>
      )}

      {loadError && (
        <div className="col-12 mb-3">
          <p className="text-muted fs-13 mb-0">{t("events.form.fields.meetingPointMap.error")}</p>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
