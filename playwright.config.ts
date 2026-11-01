import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'features/steps/**/*.ts',
})

export default defineConfig({
  testDir,
  reporter: 'html',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.1, threshold: 0.3 } },
  snapshotPathTemplate: 'features/__screenshots__/{testFileName}/{arg}-{projectName}-{platform}{ext}',
  use: { baseURL: 'http://localhost:5173' },
  projects: [{ name: 'iphone-webkit', use: { ...devices['iPhone 15'] } }],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})

