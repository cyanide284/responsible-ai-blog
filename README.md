# responsible-ai.blog

Source for [responsible-ai.blog](https://responsible-ai.blog) — a blog on responsible AI evaluation, agentic systems, and the methods we use to measure them.

Built with [Astro](https://astro.build/), deployed on Cloudflare Pages.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build → ./dist
npm run preview  # serve the production build
```

## Project layout

```
src/
  content/blog/    # blog posts (Markdown + frontmatter)
  pages/           # routes (index, blog/, about)
  layouts/         # BlogPost layout
  components/      # Header, Footer, Subscribe, etc.
  styles/global.css  # design tokens, then base styles
  assets/          # images, fonts
```

New posts go in `src/content/blog/` as `.md` files. Frontmatter schema lives in `src/content.config.ts`. Guest authors set `author` and optionally `authorUrl`: a LinkedIn URL renders the LinkedIn mark beside the byline, anything else links the name itself.

### Colours

The `:root` block in `src/styles/global.css` is the single source of truth. Dark values are declared twice — once under `prefers-color-scheme`, once under `[data-theme]` — so the header toggle can override the system preference in either direction.

Use the tokens rather than literal colours, or a component will look correct in one theme and wrong in the other. `--accent` inverts between themes, so text sitting on an accent background needs `--on-accent` rather than `white`, and raised controls such as inputs need `--surface`. A background that is deliberately fixed across themes should pin its own foreground too, rather than inheriting one that moves.

## Author

Abhinav Mohanty — GenAI researcher and red teamer. [Google Scholar](https://scholar.google.com/citations?user=XbLh3_YAAAAJ).

## License

Code is open. Post content is © Abhinav Mohanty — please don't republish without permission.
