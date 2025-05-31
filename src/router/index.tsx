import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../layout/MainLayout";
import { LazyWrapper } from "../components/LazyWrapper/LazyWrapper";
import FallbackMessage from "../components/FallBackMessage/FallBackMessage";

// Lazy load the HomePage component
const MenuPage = lazy(() => import("../pages/Menu"));
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <FallbackMessage />,
    children: [
      {
        element: <LazyWrapper />,
        errorElement: <FallbackMessage />,
        children: [
          { index: true, element: <MenuPage /> },
        ],
      },
    ],
  },
]);
