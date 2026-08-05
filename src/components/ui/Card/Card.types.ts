import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Title rendered as the card's heading (`.card-title`). */
  title?: ReactNode;
  /** Content rendered on the trailing edge of the header, e.g. action buttons. */
  actions?: ReactNode;
  children?: ReactNode;
}

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;
