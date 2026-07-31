import type { ReactNode } from "react";

export interface AuthCardProps {
  /** Content rendered inside `.card-body.p-4` (title, form, alerts, etc.). */
  children: ReactNode;
  /** Optional content rendered below the card (e.g. a "back to login" link). */
  afterCard?: ReactNode;
}
