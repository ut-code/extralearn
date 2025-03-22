import starlight from "@astrojs/starlight";
// @ts-check
import { defineConfig } from "astro/config";
import starlightThemeRapidePlugin from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      plugins: [starlightThemeRapidePlugin()],
      social: {
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
        {
          label: "最重要",
          autogenerate: { directory: "tier-1" },
        },
      ],
    }),
  ],
  experimental: {
    contentIntellisense: true,
  },
});
