import type { Meta, StoryObj } from "@storybook/react-vite";

import LocationMapPreview from "./LocationMapPreview";

const meta = {
  title: "UI/LocationMapPreview",
  component: LocationMapPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Read-only Google Map with a single pin, used to display a saved meeting point. Requires `VITE_GOOGLE_MAPS_API_KEY` to be set -- without it, renders nothing.",
      },
    },
  },
  args: {
    lat: 40.177501,
    lng: 44.512329,
  },
} satisfies Meta<typeof LocationMapPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CustomHeight: Story = {
  args: {
    height: 320,
  },
};
