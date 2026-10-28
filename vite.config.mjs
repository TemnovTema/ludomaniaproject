import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  // Vercel serves the project at the domain root, GitHub Pages under the
  // repository name. The Pages workflow uses the `github-pages` mode below.
  base: mode === 'github-pages' ? '/ludomaniaproject/' : '/',
}))
