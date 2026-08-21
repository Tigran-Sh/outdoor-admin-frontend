import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import Pagination from "./Pagination";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    page: 1,
    pageSize: 20,
    totalCount: 97,
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    function PaginationDemo() {
      const [page, setPage] = useState(args.page);
      return <Pagination {...args} page={page} onPageChange={setPage} />;
    }
    return <PaginationDemo />;
  },
};

export const SinglePage: Story = {
  args: {
    totalCount: 10,
  },
};
