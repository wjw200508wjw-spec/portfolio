"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BLOG_POSTS } from "@/lib/constants";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("全部");

  const categories = useMemo(
    () => ["全部", ...new Set(BLOG_POSTS.map((p) => p.category))],
    []
  );

  const filtered = useMemo(
    () =>
      activeCategory === "全部"
        ? BLOG_POSTS
        : BLOG_POSTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="blog" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">博客</h2>
        <p className="section-subtitle">
          数据工程、AI Agent 与技术思考
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              activeCategory === cat
                ? "bg-text-primary text-bg-deepest font-medium"
                : "bg-bg-surface text-text-muted hover:text-text-primary border border-bg-elevated"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((post, i) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -6, scale: 1.01, borderColor: "var(--text-muted)", transition: { duration: 0.12 } }}
              className="bg-bg-surface border border-bg-elevated rounded-xl p-7 group"
              style={{ willChange: "transform" }}
            >
              <span className="text-xs text-text-secondary uppercase tracking-wider">
                {post.category}
              </span>
              <h3 className="text-lg font-semibold text-text-primary mt-2 group-hover:text-text-bright transition-colors">
                {post.title}
              </h3>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                {post.summary}
              </p>
              <time className="text-xs text-text-secondary mt-4 block">
                {post.date}
              </time>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
