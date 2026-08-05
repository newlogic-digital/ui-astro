// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // css: {
    //   transformer: 'lightningcss',
    //   lightningcss: {
    //     targets: browserslistToTargets(browserslist()),
    //     include: 0,
    //     drafts: {
    //       customMedia: true,
    //     },
    //   }
    // },
    build: {
      target: browserslistToEsbuild(),
    }
  },
});