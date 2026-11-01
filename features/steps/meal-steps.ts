import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { expectSnapshot, openTab, tabContent } from '../support/ui'

const { Then } = createBdd()

Then('I see {string} under {string}', async ({ page }, name: string, meal: string) => {
  await openTab(page, 'Log')
  const item = page.getByTestId(`meal-${meal}`).getByTestId('log-item').filter({ hasText: name })
  await expect(item).toHaveCount(1)
  await expectSnapshot(page, tabContent(page))
})

Then('I do not see the meal {string}', async ({ page }, meal: string) => {
  await openTab(page, 'Log')
  await expect(page.getByTestId(`meal-${meal}`)).toHaveCount(0)
})
