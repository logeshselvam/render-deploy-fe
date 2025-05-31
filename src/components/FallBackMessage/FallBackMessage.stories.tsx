import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import FallbackMessage from "./FallBackMessage";

const meta: Meta<typeof FallbackMessage> = {
  component: FallbackMessage,
  tags: ["autodocs", "chromatic"],
  parameters: {
    layout: "centered",
    chromatic: { disableSnapshot: false },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <FallbackMessage
      title="Something Broke"
      message="We’re working on it. Try refreshing or come back later."
    />
  ),
};