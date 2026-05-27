import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'forks',
    forks: {
      execArgv: ['--experimental-sqlite'],
    },
  },
  optimizeDeps: {
    exclude: ['node:sqlite'],
  },
})
