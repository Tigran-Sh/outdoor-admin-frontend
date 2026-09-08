export interface LocationMapPreviewProps {
  lat: number;
  lng: number;
  /** @default 15 */
  zoom?: number;
  /** Map container height in pixels. @default 220 */
  height?: number;
  className?: string;
}
