"use client";

import { motion } from "framer-motion";
import { FlowStep } from "@/lib/types";

const typeStyles: Record<string, string> = {
  source: "border-text-secondary",
  transform: "border-accent",
  queue: "border-orange-400/50",
  storage: "border-blue-400/50",
  output: "border-green-400/50",
};

export default function ArchitectureDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-4 justify-center">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="flex items-center gap-2"
        >
          <div
            className={`px-4 py-2 rounded-lg border text-sm font-medium bg-bg-elevated text-text-muted ${typeStyles[step.type]}`}
          >
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 + 0.15 }}
              className="block border-t border-bg-elevated"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
