import { motion } from "framer-motion";
import logo from "@/assets/kraftzen-logo.webp";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <motion.img
        src={logo}
        alt="Loading Kraftzen"
        className="w-20 h-20 mb-6"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "50%" }}
        />
      </div>
    </div>
  );
}
