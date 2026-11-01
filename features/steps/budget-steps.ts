import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { openTab } from '../support/ui'

const { When, Then } = createBdd()

When('I set the budget to {int} calories', async ({ page }, calories: number) => {
  await openTab(page, 'Me')
  await page.getByLabel('Daily budget').fill(String(calories))
  await page.getByRole('button', { name: 'Set budget' }).click()
})

Then('I see the budget summary {string}', async ({ page }, summary: string) => {
  await openTab(page, 'Log')
  const budget = page.getByTestId('budget-summary')
  await expect(budget).toHaveText(summary)
  await expect(budget).toHaveScreenshot()
})

