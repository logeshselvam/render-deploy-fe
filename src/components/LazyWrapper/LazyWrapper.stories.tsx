import type { Meta, StoryObj } from "@storybook/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { LazyWrapper } from "./LazyWrapper";

const meta: Meta<typeof LazyWrapper> = {
  component: LazyWrapper,
  tags: ["autodocs", "chromatic"],
  parameters: {
    layout: "centered",
    chromatic: { disableSnapshot: false },
  },
};

export default meta;

const router = createMemoryRouter([
  {
    path: "/",
    element: <LazyWrapper />, // The suspense fallback will show while Outlet resolves
    children: [{ index: true, element: <div>Hello World (Lazy loaded)</div> }],
  },
]);

export const Default: StoryObj = {
  render: () => <RouterProvider router={router} />,
};