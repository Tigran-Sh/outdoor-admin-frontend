import type { ReactElement } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Badge from "@/components/ui/Badge/Badge";
import Card, { CardBody } from "@/components/ui/Card/Card";

import Table from "./Table";
import type { TableColumn, TableProps } from "./Table.types";

interface SampleEvent {
  id: string;
  name: string;
  location: string;
  date: string;
  guide: string;
  category: "hiking" | "cycling" | "water";
}

const events: SampleEvent[] = [
  {
    id: "1",
    name: "Sunrise Ridge Hike",
    location: "Dilijan National Park",
    date: "Aug 12, 2026",
    guide: "Ani Grigoryan",
    category: "hiking",
  },
  {
    id: "2",
    name: "Lake Sevan Cycling Tour",
    location: "Lake Sevan",
    date: "Aug 20, 2026",
    guide: "David Sargsyan",
    category: "cycling",
  },
  {
    id: "3",
    name: "Debed Canyon Rafting",
    location: "Debed River",
    date: "Sep 2, 2026",
    guide: "Mari Petrosyan",
    category: "water",
  },
  {
    id: "4",
    name: "Tatev Ropeway Hike",
    location: "Tatev",
    date: "Sep 14, 2026",
    guide: "Ani Grigoryan",
    category: "hiking",
  },
  {
    id: "5",
    name: "Yerevan Loop Ride",
    location: "Yerevan",
    date: "Sep 21, 2026",
    guide: "David Sargsyan",
    category: "cycling",
  },
  {
    id: "6",
    name: "Aragats Base Trek",
    location: "Mount Aragats",
    date: "Oct 3, 2026",
    guide: "Mari Petrosyan",
    category: "hiking",
  },
  {
    id: "7",
    name: "Dzoraget Kayaking",
    location: "Dzoraget River",
    date: "Oct 10, 2026",
    guide: "Mari Petrosyan",
    category: "water",
  },
];

const categoryVariant: Record<SampleEvent["category"], "success" | "info" | "primary"> = {
  hiking: "success",
  cycling: "info",
  water: "primary",
};

const columns: TableColumn<SampleEvent>[] = [
  { key: "name", header: "Event Name", sortable: true },
  { key: "location", header: "Location", sortable: true },
  { key: "date", header: "Date", sortable: true },
  { key: "guide", header: "Assigned Guide", sortable: true },
  {
    key: "category",
    header: "Category",
    render: (row) => (
      <Badge variant={categoryVariant[row.category]} appearance="subtle">
        {row.category}
      </Badge>
    ),
  },
];

const TableComponent = Table as (props: TableProps<SampleEvent>) => ReactElement;

const meta = {
  title: "UI/Table",
  component: TableComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    columns,
    data: events,
    getRowKey: (row: SampleEvent) => row.id,
  },
} satisfies Meta<typeof TableComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Searchable: Story = {
  args: {
    searchable: true,
    searchPlaceholder: "Search events...",
  },
};

export const Paginated: Story = {
  args: {
    pageSize: 3,
  },
};

export const SearchSortAndPaginate: Story = {
  args: {
    searchable: true,
    pageSize: 3,
  },
};

export const InsideCard: Story = {
  render: (args) => (
    <Card>
      <CardBody>
        <TableComponent {...args} card />
      </CardBody>
    </Card>
  ),
};

export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: "No events yet.",
  },
};
