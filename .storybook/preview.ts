import type { Preview } from "@storybook/react";
import type { Decorator } from "@storybook/react";
import React from "react";
import "../src/styles/global.css";

const withTheme: Decorator = (Story, context) => {
  const theme = String(context.globals.theme);
  return React.createElement(
    "div",
    {
      className:
        theme === "dark"
          ? "dark bg-gray-900 text-white p-4"
          : "bg-white text-black p-4",
    },
    React.createElement(Story, context.args)
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  decorators: [withTheme],
};

export default preview;