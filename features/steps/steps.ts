import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

Given('I open the app', async ({ page }) => {
  await page.goto('/')
})

When('I reload the app', async ({ page }) => {
  await page.reload()
})

Then('I see the heading {string}', async ({ page }, name: string) => {
  await expect(page.getByRole('heading', { name })).toBeVisible()
})

When('I add a food {string} with {int} calories', async ({ page }, name: string, calories: number) => {
  await page.getByLabel('Food name').fill(name)
  await page.getByLabel('Calories').fill(String(calories))
  await page.getByRole('button', { name: 'Add food' }).click()
})

Then(
  'I see the food {string} with {int} calories in the food list',
  async ({ page }, name: string, calories: number) => {
    const item = page.getByRole('list', { name: 'Foods' }).getByRole('listitem').filter({ hasText: name })
    await expect(item).toContainText(`${calories} kcal`)
  },
)

Then('I see the error {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('alert')).toHaveText(message)
})

Then('the food list is empty', async ({ page }) => {
  await expect(page.getByRole('list', { name: 'Foods' }).getByRole('listitem')).toHaveCount(0)
})
