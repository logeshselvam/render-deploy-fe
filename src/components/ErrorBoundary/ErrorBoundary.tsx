import { ReactNode, useEffect, useState } from "react";
import FallbackMessage from "../FallBackMessage/FallBackMessage";

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault();
      setHasError(true);
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return <FallbackMessage title="Oops!" message="Something went wrong." />;
  }

  return <>{children}</>;
}


// Fix for the story error: export a real component that throws an error
export function ErrorThrowingComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Simulated error for testing ErrorBoundary");
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Trigger Error
    </button>
  );
}