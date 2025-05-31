import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const LazyWrapper = () => (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <Outlet />
    </Suspense>
);