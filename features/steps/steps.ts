import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { foodItems, foodListEmpty, logItems, logSummary, openTab, expectSnapshot } from '../support/ui'

const { Given, When, Then } = createBdd()

Given('I open the app', async ({ page }) => {
  await page.goto('/')
})

When('I reload the app', async ({ page }) => {
  await page.reload()
})

Then('I see the heading {string}', async ({ page }, name: string) => {
  const heading = page.getByRole('heading', { name, level: 1 })
  await expect(heading).toBeVisible()
  await expectSnapshot(page, heading)
})

When('I add a food {string} with {int} calories', async ({ page }, name: string, calories: number) => {
  await openTab(page, 'Food')
  await page.getByLabel('Food name').fill(name)
  await page.getByLabel('Calories').fill(String(calories))
  await page.getByRole('button', { name: 'Add food' }).click()
})

Then(
  'I see the food {string} with {int} calories in the food list',
  async ({ page }, name: string, calories: number) => {
    await openTab(page, 'Food')
    const item = foodItems(page).filter({ hasText: name })
    await expect(item).toContainText(`${calories} kcal`)
    await expectSnapshot(page, item)
  },
)

Then('I see the error {string}', async ({ page }, message: string) => {
  const error = page.getByText(message)
  await expect(error).toBeVisible()
  await expectSnapshot(page, error)
})

Then('the food list is empty', async ({ page }) => {
  await openTab(page, 'Food')
  await expect(foodItems(page)).toHaveCount(0)
  await expectSnapshot(page, foodListEmpty(page))
})

When('I view the date {string}', async ({ page }, date: string) => {
  await openTab(page, 'Log')
  await page.getByRole('textbox', { name: 'Date' }).fill(date)
})

When('I log the food {string}', async ({ page }, name: string) => {
  await openTab(page, 'Log')
  await page.getByLabel('Food to log').getByText(name, { exact: true }).click()
  await page.getByRole('button', { name: 'Log food' }).click()
})

When('I remove {string} from the daily log', async ({ page }, name: string) => {
  await openTab(page, 'Log')
  await logItems(page).filter({ hasText: name }).first().getByRole('button', { name: 'Remove' }).click()
})

Then('I see {string} in the daily log', async ({ page }, name: string) => {
  await openTab(page, 'Log')
  const item = logItems(page).filter({ hasText: name })
  await expect(item).toHaveCount(1)
  await expectSnapshot(page, item)
})

Then('the daily log is empty', async ({ page }) => {
  await openTab(page, 'Log')
  await expect(logItems(page)).toHaveCount(0)
  await expectSnapshot(page, logSummary(page))
})

Then('the daily total is {int} calories', async ({ page }, total: number) => {
  await openTab(page, 'Log')
  const totalText = page.getByText(`Total: ${total} kcal`)
  await expect(totalText).toBeVisible()
  await expectSnapshot(page, totalText)
})



