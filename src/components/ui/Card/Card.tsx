import type { CardBodyProps, CardFooterProps, CardHeaderProps, CardProps } from "./Card.types";

function joinClassNames(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function CardHeader({ title, actions, className, children, ...rest }: CardHeaderProps) {
  return (
    <div className={joinClassNames("card-header", className)} {...rest}>
      {title || actions ? (
        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
          {title && <h4 className="card-title mb-0">{title}</h4>}
          {actions && (
            <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">{actions}</div>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: CardBodyProps) {
  return (
    <div className={joinClassNames("card-body", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: CardFooterProps) {
  return (
    <div className={joinClassNames("card-footer", className)} {...rest}>
      {children}
    </div>
  );
}

function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={joinClassNames("card", className)} {...rest}>
      {children}
    </div>
  );
}

export default Card;
