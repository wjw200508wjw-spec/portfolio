"use client";

import { motion } from "framer-motion";
import { Skill } from "@/lib/types";

export default function TechCard({ skill }: { skill: Skill }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -8,
        scale: 1.03,
        backgroundColor: "var(--bg-elevated)",
        borderColor: "var(--text-muted)",
        transition: { duration: 0.12 },
      }}
      className="bg-bg-surface border border-bg-elevated rounded-xl p-5"
      style={{ willChange: "transform" }}
    >
      <h4 className="text-text-primary font-semibold text-sm mb-3">{skill.name}</h4>
      <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="h-full bg-text-muted rounded-full"
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-text-secondary uppercase tracking-wider">
          {skill.category}
        </span>
        <span className="text-[10px] text-text-secondary">{skill.level}%</span>
      </div>
    </motion.div>
  );
}
