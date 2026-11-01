import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('I type {string} in the food name', async ({ page }, text: string) => {
  await page.getByLabel('Food name').fill(text)
})

When('I choose the suggestion {string}', async ({ page }, name: string) => {
  await page.getByTestId('suggestion').filter({ hasText: name }).click()
})

When('I add the food', async ({ page }) => {
  await page.getByRole('button', { name: 'Add food' }).click()
})

Then('I see the suggestion {string}', async ({ page }, name: string) => {
  await expect(page.getByTestId('suggestion').filter({ hasText: name })).toBeVisible()
})

Then('I see no suggestions', async ({ page }) => {
  await expect(page.getByTestId('suggestion')).toHaveCount(0)
})

Then('the food name is {string}', async ({ page }, name: string) => {
  await expect(page.getByLabel('Food name')).toHaveValue(name)
})

Then('the calories are {int}', async ({ page }, calories: number) => {
  await expect(page.getByLabel('Calories')).toHaveValue(String(calories))
})

