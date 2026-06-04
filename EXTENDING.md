# Extending This Site

All content is data-driven. You only need to edit `lib/constants.ts` for most changes.

## Quick Reference

| Want to... | Edit this file | What to do |
|------------|---------------|------------|
| Add a project | `lib/constants.ts` | Push to `PROJECTS` array |
| Add a blog post | `lib/constants.ts` | Push to `BLOG_POSTS` array |
| Add a skill | `lib/constants.ts` | Push to `SKILLS` array |
| Add an AI tool | `lib/constants.ts` | Push to `AGENT_TOOLS` array |
| Add a nav item | `lib/constants.ts` | Push to `NAV_ITEMS` array |
| Change personal info | `lib/constants.ts` | Edit `SITE` object |
| Add a new section | Multiple files | See below |

## Adding a New Section (4 Steps)

### 1. Register the section ID

In `lib/constants.ts`, add to `SECTION_IDS`:
```ts
export const SECTION_IDS = [
  "hero",
  "about",
  // ...existing...
  "my-new-section",  // ADD HERE
  "contact",
];
```

### 2. Create the component

Create `app/components/MyNewSection.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";

export default function MyNewSection() {
  return (
    <section id="my-new-section" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">My New Section</h2>
        <p className="section-subtitle">Section description</p>
      </motion.div>
      {/* Your content here */}
    </section>
  );
}
```

### 3. Add to page.tsx

In `app/page.tsx`, import and place inside `<main>`:
```tsx
import MyNewSection from "./components/MyNewSection";
// ...
<Contact />
<MyNewSection />  {/* ADD HERE */}
```

### 4. Add navigation link (optional)

In `lib/constants.ts`, add to `NAV_ITEMS`:
```ts
{ label: "New", href: "#my-new-section" }
```

## Design Patterns

- **Section wrapper**: Every section must have `id="..."` and `className="section-container"`
- **Scroll animation**: Wrap in `<motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>`
- **Hover cards**: Use `whileHover={{ y: -4 }}` on interactive elements
- **Grid layouts**: `grid md:grid-cols-3 gap-6` for 3-column card grids
- **Colors**: Use Tailwind classes `text-text-primary`, `text-text-muted`, `bg-bg-surface`, `border-bg-elevated`

## No Build Step Required

Just edit, save, and refresh. Next.js HMR handles the rest.

## Updating Resume

Replace `public/resume.pdf` with your latest resume. The "Download Resume" button in the Hero section links there.
