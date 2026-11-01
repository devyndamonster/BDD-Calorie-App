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
  const suggestion = page.getByTestId('suggestion').filter({ hasText: name })
  await expect(suggestion).toBeVisible()
  await expect(suggestion).toHaveScreenshot()
})

Then('I see no suggestions', async ({ page }) => {
  await expect(page.getByTestId('suggestion')).toHaveCount(0)
  await expect(page.getByLabel('Food name')).toHaveScreenshot()
})

Then('the food name is {string}', async ({ page }, name: string) => {
  const input = page.getByLabel('Food name')
  await expect(input).toHaveValue(name)
  await expect(input).toHaveScreenshot()
})

Then('the calories are {int}', async ({ page }, calories: number) => {
  const input = page.getByLabel('Calories')
  await expect(input).toHaveValue(String(calories))
  await expect(input).toHaveScreenshot()
})

