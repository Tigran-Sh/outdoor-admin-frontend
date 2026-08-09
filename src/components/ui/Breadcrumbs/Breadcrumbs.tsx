import { Link } from "react-router-dom";

import type { BreadcrumbsProps } from "./Breadcrumbs.types";

function Breadcrumbs({ title, items = [] }: BreadcrumbsProps) {
  return (
    <div className="row">
      <div className="col-12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <ol className="breadcrumb m-0">
            {items.map((item) =>
              item.to ? (
                <li key={item.label} className="breadcrumb-item">
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ) : (
                <li key={item.label} className="breadcrumb-item">
                  {item.label}
                </li>
              ),
            )}
            <li className="breadcrumb-item active">{title}</li>
          </ol>

          <h4 className="mb-sm-0">{title}</h4>
        </div>
      </div>
    </div>
  );
}

export default Breadcrumbs;
