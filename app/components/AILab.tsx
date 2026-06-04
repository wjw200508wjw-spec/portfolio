"use client";

import { motion } from "framer-motion";
import { AGENT_TOOLS } from "@/lib/constants";
import AgentCard from "./AgentCard";

export default function AILab() {
  return (
    <section id="ai-lab" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">AI Lab</h2>
        <p className="section-subtitle">Interactive AI tools &amp; agents</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {AGENT_TOOLS.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </section>
  );
}
