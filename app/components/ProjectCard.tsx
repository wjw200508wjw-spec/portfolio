"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/types";
import ArchitectureDiagram from "./ArchitectureDiagram";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -6, borderColor: "var(--text-muted)", boxShadow: "0 6px 30px rgba(0,0,0,0.25)" }}
      className="bg-bg-surface border border-bg-elevated rounded-2xl overflow-hidden transition-all duration-300"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wider">
              项目 {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-bold text-text-primary mt-2">
              {project.title}
            </h3>
            <p className="text-text-secondary text-sm mt-1">{project.subtitle}</p>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 45 : 0 }}
            className="text-text-secondary text-2xl mt-1 shrink-0"
          >
            +
          </motion.span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1 text-xs rounded-full bg-bg-elevated text-text-muted"
            >
              {tool}
            </span>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 border-t border-bg-elevated pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  概述
                </h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  架构
                </h4>
                <ArchitectureDiagram steps={project.flowSteps} />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  数据库
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.databases.map((db) => (
                    <span
                      key={db}
                      className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      {db}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  成果
                </h4>
                <ul className="space-y-2">
                  {project.outcomes.map((o, i) => (
                    <li
                      key={i}
                      className="text-text-muted text-sm flex items-start gap-2"
                    >
                      <span className="text-accent mt-1">&bull;</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
