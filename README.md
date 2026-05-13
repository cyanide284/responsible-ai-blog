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
  styles/global.css
  assets/          # images, fonts
```

New posts go in `src/content/blog/` as `.md` files. Frontmatter schema lives in `src/content.config.ts`.

## Author

Abhinav Mohanty — GenAI researcher and red teamer. [Google Scholar](https://scholar.google.com/citations?user=XbLh3_YAAAAJ).

## License

Code is open. Post content is © Abhinav Mohanty — please don't republish without permission.
