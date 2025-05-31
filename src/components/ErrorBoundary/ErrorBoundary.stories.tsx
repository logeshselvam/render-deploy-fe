import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary, ErrorThrowingComponent } from "./ErrorBoundary";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof ErrorBoundary> = {
  tags: ["autodocs", "chromatic"],
  component: ErrorBoundary,
  parameters: {
    layout: "centered",
    chromatic: { disableSnapshot: false },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  render: () => (
    <MemoryRouter>
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    </MemoryRouter>
  ),
};
