import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PortalModal({
  children,
  onClose,
  maxWidth = "max-w-sm",
}: {
  children: ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-base-900/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        className={`glass relative w-full ${maxWidth} rounded-xl p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body
  );
}
