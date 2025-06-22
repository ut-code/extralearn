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
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/ut-code/extralearn",
        },
      ],
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
          label: "Web API",
          autogenerate: { directory: "web-api" },
        },
        {
          label: "コーディングスタイル",
          autogenerate: { directory: "coding-style" },
        },
        {
          label: "マネジメント",
          autogenerate: { directory: "management" },
        },
        {
          label: "周辺ツール",
          autogenerate: { directory: "toolchain" },
        },
        {
          label: "フレームワークに触れる",
          autogenerate: { directory: "frameworks" },
        },
        {
          label: "その他 / 趣味置き場",
          autogenerate: { directory: "utilities" },
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
