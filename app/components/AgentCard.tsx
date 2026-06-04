"use client";

import { motion } from "framer-motion";
import { AgentTool } from "@/lib/types";

export default function AgentCard({ agent, index }: { agent: AgentTool; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6, borderColor: "var(--text-muted)" }}
      className="bg-bg-surface border border-bg-elevated rounded-2xl p-8 transition-colors group"
    >
      <div className="text-4xl mb-4">{agent.icon}</div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{agent.name}</h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        {agent.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {agent.capabilities.map((cap) => (
          <span
            key={cap}
            className="px-3 py-1 text-xs rounded-full bg-bg-elevated text-text-muted group-hover:bg-bg-elevated/80 transition-colors"
          >
            {cap}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
