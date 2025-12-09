import React from "react";
import { motion } from "framer-motion";

interface HotelsErrorProps {
  error: string;
  onRetry: () => void;
}

const HotelsError: React.FC<HotelsErrorProps> = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-700 text-center shadow-md"
  >
    <p className="text-lg font-medium">{error}</p>
    <button
      onClick={onRetry}
      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Try Again
    </button>
  </motion.div>
);

export default HotelsError;
