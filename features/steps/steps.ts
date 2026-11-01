import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

const foodList = (page: Page) => page.getByRole('list', { name: 'Foods' })
const dailyLog = (page: Page) => page.getByRole('list', { name: 'Daily log' })

Given('I open the app', async ({ page }) => {
  await page.goto('/')
})

When('I reload the app', async ({ page }) => {
  await page.reload()
})

Then('I see the heading {string}', async ({ page }, name: string) => {
  await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible()
})

When('I add a food {string} with {int} calories', async ({ page }, name: string, calories: number) => {
  await page.getByLabel('Food name').fill(name)
  await page.getByLabel('Calories').fill(String(calories))
  await page.getByRole('button', { name: 'Add food' }).click()
})

Then(
  'I see the food {string} with {int} calories in the food list',
  async ({ page }, name: string, calories: number) => {
    const item = foodList(page).getByRole('listitem').filter({ hasText: name })
    await expect(item).toContainText(`${calories} kcal`)
  },
)

Then('I see the error {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('alert')).toHaveText(message)
})

Then('the food list is empty', async ({ page }) => {
  await expect(foodList(page).getByRole('listitem')).toHaveCount(0)
})

When('I view the date {string}', async ({ page }, date: string) => {
  await page.getByLabel('Date').fill(date)
})

When('I log the food {string}', async ({ page }, name: string) => {
  await page.getByLabel('Food to log').selectOption({ label: name })
  await page.getByRole('button', { name: 'Log food' }).click()
})

When('I remove {string} from the daily log', async ({ page }, name: string) => {
  await dailyLog(page)
    .getByRole('listitem')
    .filter({ hasText: name })
    .first()
    .getByRole('button', { name: 'Remove' })
    .click()
})

Then('I see {string} in the daily log', async ({ page }, name: string) => {
  await expect(dailyLog(page).getByRole('listitem').filter({ hasText: name })).toHaveCount(1)
})

Then('the daily log is empty', async ({ page }) => {
  await expect(dailyLog(page).getByRole('listitem')).toHaveCount(0)
})

Then('the daily total is {int} calories', async ({ page }, total: number) => {
  await expect(page.getByText(`Total: ${total} kcal`)).toBeVisible()
})
