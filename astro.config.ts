import starlight from "@astrojs/starlight";
// @ts-check
import { defineConfig } from "astro/config";
import starlightThemeRapidePlugin from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
  site: "https://extra.utcode.net",
  integrations: [
    starlight({
      title: "Extra Learn",
      plugins: [starlightThemeRapidePlugin()],
      social: {
        github: "https://github.com/ut-code/extralearn",
      },
      sidebar: [
        {
          label: "最重要",
          autogenerate: { directory: "tier-1" },
        },
      ],
    }),
  ],
  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },
  experimental: {
    contentIntellisense: true,
    clientPrerender: true,
  },
});
