"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";

const contacts = [
  { label: "邮箱", value: SITE.email, href: `mailto:${SITE.email}` },
  { label: "电话", value: SITE.phone, href: `tel:${SITE.phone}` },
  { label: "GitHub", value: "github.com", href: SITE.github },
  { label: "LinkedIn", value: "linkedin.com", href: SITE.linkedin },
];

export default function Contact() {
  return (
    <section id="contact" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">联系方式</h2>
        <p className="section-subtitle">期待与您交流</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contacts.map((contact, i) => (
          <motion.a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            whileHover={{ y: -4, borderColor: "var(--text-muted)" }}
            className="bg-bg-surface border border-bg-elevated rounded-xl p-6 text-center transition-colors"
          >
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
              {contact.label}
            </div>
            <div className="text-text-muted text-sm font-medium">
              {contact.value}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
