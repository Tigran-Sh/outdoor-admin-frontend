import { useState } from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import LocationPicker from "./LocationPicker";

const meta = {
  title: "UI/LocationPicker",
  component: LocationPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Combines a Google Places-powered address search with a `\"lat, lng\"` coordinates field and a draggable map pin. Requires `VITE_GOOGLE_MAPS_API_KEY` to be set -- without it, it falls back to two plain inputs.",
      },
    },
  },
  args: {
    addressLabel: "Meeting Point",
    addressPlaceholder: "Search for a place, or enter it manually",
    addressValue: "",
    onAddressChange: () => {},
    coordinatesLabel: "Meeting Point Coordinates",
    coordinatesPlaceholder: "e.g. 40.7397, 44.8639",
    coordinatesHelperText: "Filled in automatically when you search above or drag the map pin.",
    coordinatesValue: "",
    onCoordinatesChange: () => {},
  },
} satisfies Meta<typeof LocationPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveLocationPicker(args: ComponentProps<typeof LocationPicker>) {
  const [address, setAddress] = useState(args.addressValue);
  const [coordinates, setCoordinates] = useState(args.coordinatesValue);

  return (
    <LocationPicker
      {...args}
      addressValue={address}
      onAddressChange={setAddress}
      coordinatesValue={coordinates}
      onCoordinatesChange={setCoordinates}
    />
  );
}

export const Playground: Story = {
  render: (args) => <InteractiveLocationPicker {...args} />,
};

export const Prefilled: Story = {
  args: {
    addressValue: "Republic Square, Yerevan, Armenia",
    coordinatesValue: "40.177501, 44.512329",
  },
  render: (args) => <InteractiveLocationPicker {...args} />,
};

export const WithErrors: Story = {
  args: {
    addressError: "Please describe the meeting point",
    coordinatesError: "Please enter the meeting point coordinates",
  },
  render: (args) => <InteractiveLocationPicker {...args} />,
};
