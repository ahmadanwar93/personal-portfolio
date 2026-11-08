import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // `site` = the origin; `base` = the subfolder GitHub Pages serves a project repo from.
  site: 'https://ahmadanwar93.github.io',
  base: '/personal-portfolio',
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: 'min-light', wrap: false },
  },
});
