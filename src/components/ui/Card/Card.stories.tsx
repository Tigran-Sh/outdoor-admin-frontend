import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "@/components/ui/Button/Button";

import Card, { CardBody, CardFooter, CardHeader } from "./Card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Card>
      <CardBody>Card content.</CardBody>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card>
      <CardHeader title="Card title" />
      <CardBody>Card content.</CardBody>
      <CardFooter>Card footer.</CardFooter>
    </Card>
  ),
};

export const WithHeaderActions: Story = {
  render: () => (
    <Card>
      <CardHeader
        title="Events"
        actions={
          <Button variant="primary" leftIcon={<i className="ri-add-line align-bottom" />}>
            Create Event
          </Button>
        }
      />
      <CardBody>Card content.</CardBody>
    </Card>
  ),
};
