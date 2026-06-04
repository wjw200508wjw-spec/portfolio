"use client";

import { motion } from "framer-motion";
import { SKILLS, SITE } from "@/lib/constants";
import TechCard from "./TechCard";

const categoryLabels: Record<string, string> = {
  language: "Languages",
  database: "Databases",
  bigdata: "Big Data",
  sync: "Data Sync",
  platform: "Platforms",
  ai: "AI & Agents",
  backend: "Backend",
};

export default function About() {
  const categories = [...new Set(SKILLS.map((s) => s.category))];

  return (
    <section id="about" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">Data Engineer &amp; AI Agent Developer</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
        {/* Left: Bio */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-text-muted leading-relaxed mb-6"
          >
            {SITE.aboutIntro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider">
                Education
              </span>
              <p className="text-text-muted text-sm mt-1">
                {SITE.education.school} &middot; {SITE.education.major} &middot;{" "}
                {SITE.education.period}
              </p>
            </div>
            <div>
              <span className="text-xs text-text-secondary uppercase tracking-wider">
                Experience
              </span>
              <p className="text-text-muted text-sm mt-1">
                {SITE.workExperience.company} &middot; {SITE.workExperience.role} &middot;{" "}
                {SITE.workExperience.period}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right: Skills */}
        <div>
          {categories.map((cat, catIdx) => {
            const catSkills = SKILLS.filter((s) => s.category === cat);
            return (
              <div key={cat} className="mb-8">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: catIdx * 0.05 }}
                  className="text-xs text-text-secondary uppercase tracking-widest mb-3"
                >
                  {categoryLabels[cat] || cat}
                </motion.h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {catSkills.map((skill) => (
                    <TechCard key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
