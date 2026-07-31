import type { Meta, StoryObj } from "@storybook/react-vite";

import Input from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
  },
  args: {
    label: "Email",
    placeholder: "Enter email",
    type: "email",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: {
    error: "Please enter your email",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "We'll never share your email.",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
};

export const PasswordWithError: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    error: "Please enter your password",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="d-flex flex-column gap-3">
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "disabled@outdoor.com",
  },
};
