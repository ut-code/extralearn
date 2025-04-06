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
          label: "中心概念",
          autogenerate: { directory: "core" },
        },
        {
          label: "JS/TS の追加学習",
          autogenerate: { directory: "js-ts" },
        },
        {
          label: "周辺ツール",
          autogenerate: { directory: "toolchain" },
        },
        {
          label: "コーディングスタイル",
          autogenerate: { directory: "coding-style" },
        },     
        {
          label: "UI",
          autogenerate: { directory: "ui" },
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
