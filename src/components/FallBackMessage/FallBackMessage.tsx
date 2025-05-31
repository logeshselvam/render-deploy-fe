import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

function FallbackMessage({
  title = "Oops!",
  message = "Something went wrong."
}: { title?: string; message?: string }) {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center text-muted-foreground overflow-hidden">
      {/* Animated background shape */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full -z-10 blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      <motion.div
        className="p-10 bg-background border border-muted rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AlertTriangle className="w-14 h-14 text-destructive mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold mb-3 text-foreground">{title}</h2>
        <p className="max-w-md mx-auto mb-6 text-muted-foreground text-base">{message}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReload}
            className="px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} /> Reload Page
          </button>
          <button
            onClick={handleGoHome}
            className="px-5 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-primary/80 transition inline-flex items-center gap-2 cursor-pointer"
          >
            <Home size={16} /> Go to Homepage
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default FallbackMessage;