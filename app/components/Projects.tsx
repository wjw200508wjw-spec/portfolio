"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/constants";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">项目</h2>
        <p className="section-subtitle">
          数据工程 &amp; AI Agent 开发核心项目
        </p>
      </motion.div>

      <div className="space-y-6">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
