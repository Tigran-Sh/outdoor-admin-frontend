export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  title: string;
  items?: BreadcrumbItem[];
}
