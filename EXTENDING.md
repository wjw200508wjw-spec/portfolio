# Extending the portfolio

## Content

Edit `lib/constants.ts`:

| Content | Export |
| --- | --- |
| Personal details, resume URL, education | `SITE` |
| Work history | `EXPERIENCES` |
| Project cases and illustrative workflows | `PROJECTS` |
| Skills grouped by practical use | `SKILL_GROUPS` |
| Expandable practice notes | `PRACTICE_NOTES` |
| Navigation | `NAV_ITEMS` |

Interfaces are defined in `lib/types.ts`. Keep project IDs stable because the work wall links to them. Adding a project automatically adds it to the gallery and category filters. Update the heading count and about facts if the total changes. Do not invent work results, technology choices or metrics.

`ProjectPreview.tsx` provides project-specific schematic graphics. New projects use the generic pipeline preview unless another view is added. These illustrations must remain labelled as schematics.

## Resume

Replace `public/resume.pdf`, update the version query in `SITE.resume`, and verify the served file against the original bytes. All resume download links use `SITE.resume`.

## Page modules

`app/page.tsx` defines the order. Content modules are server components; client components handle the navigation, project filters, statistics and motion settings. Add an `id` to new sections and register their navigation link.

## Motion

The shared easing tokens in `globals.css` follow Emil Kowalski's design engineering guidance. Use transform and opacity, 100–160ms press feedback and 200ms UI changes. Scroll reveals run once. Gate hover styles by `(hover: hover) and (pointer: fine)`. Keep decorative animations pausable and support reduced motion. Add `data-ambient` to repeating animation containers so offscreen decoration pauses. Add `data-reveal` to an element to opt into the one-time scroll reveal.

Test phone-specific touch feel and safe areas on physical hardware; emulated viewport checks alone do not validate those behaviors.
