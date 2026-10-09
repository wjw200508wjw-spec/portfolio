# Wang Jiawei · Data & AI Portfolio

Personal portfolio: https://www.vpymhk.cn

An animated, responsive portfolio covering data engineering, data governance, multimodal document workflows and business automation. Content follows the October 2026 resume; the Hermes-Agent entry is retained as a personal exploration from the previous site.

## Run locally

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run lint
npm run build
npm run start
```

Next.js 16.4, React 19, TypeScript and Tailwind 4. The hero uses React Three Fiber and a procedural Three.js environment; no external textures or fonts are required. Most content is rendered on the server.

## Editing content

See `EXTENDING.md`. Personal information, experience, projects, skill groups and practice notes live in `lib/constants.ts`. Replace `public/resume.pdf` and update the resume version in `SITE.resume` when uploading a new resume.

## Motion and accessibility

The navigation includes an animation pause button. The site respects `prefers-reduced-motion`, provides keyboard focus states and a skip link, and uses native details elements for expandable content. The hero renderer pauses offscreen and when the browser tab is hidden. Desktop project cards stack on scroll; mobile and reduced-motion layouts use normal document flow.

## GitHub statistics

`/api/github-stats` reads public repositories and their default-branch commit counts, with one-hour caching, pagination, timeouts and an explicit unavailable state. An optional server-only `GITHUB_TOKEN` can increase the API quota. Never put it in a `NEXT_PUBLIC_` environment variable or commit it.

## Visual assets

The 3D-style avatar was generated from the supplied resume portrait with the built-in image generation tool. Project preview graphics are illustrative diagrams, not screenshots of internal business systems. UI and motion were informed by `emilkowalski/skills` (`emil-design-eng`, `animate`, `mobile-native`) and the user's video reference.

## Deployment

The existing Vercel integration builds the `master` branch. Publish only after lint, a production build, responsive interaction checks and resume verification pass. Verify Vercel status and the custom domain after publication.
