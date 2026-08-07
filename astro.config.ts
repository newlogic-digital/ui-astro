import { defineConfig, fontProviders } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import heroicons from '@newlogic-digital/vite-plugin-heroicons'

export default defineConfig({
  integrations: [heroicons(
    {
      iconSets: {
        'simpleicons-solid': ['src/icons/simpleicons'],
        'icons-solid': ['src/icons/solid'],
        'icons-outline': 'src/icons/outline',
      },
    },
  )],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      subsets: ['latin', 'latin-ext'],
    },
  ],
  vite: {
    plugins: [tailwindcss(), {
      name: '@newlogic-digital/preload-remover',
      configResolved(config) {
        if (config.command !== 'build') return

        const pI = config.plugins.findIndex(
          p => p.name === 'native:import-analysis-build',
        )

        const plugins = config.plugins

        if (pI !== -1) plugins.splice(pI, 1)
      },
    }],
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
    },
  },
})
