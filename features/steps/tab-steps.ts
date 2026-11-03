import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { openTab, tabBar, expectSnapshot, tabContent } from '../support/ui'

const { When, Then } = createBdd()

When('I open the {string} tab', async ({ page }, name: string) => {
  await openTab(page, name)
})

Then('I see the {string} tab selected', async ({ page }, name: string) => {
  const active = tabBar(page).locator('.adm-tab-bar-item-active')
  await expect(active).toHaveText(name)
  await expectSnapshot(page, tabContent(page))
})

Then('I see the daily log section', async ({ page }) => {
  await expect(page.getByLabel('Food to log')).toBeVisible()
    await expectSnapshot(page, tabContent(page))
  })

Then('I see the food form', async ({ page }) => {
  await expect(page.getByLabel('Food name')).toBeVisible()
    await expectSnapshot(page, tabContent(page))
  })

Then('I see the budget form', async ({ page }) => {
  const form = page.getByTestId('budget-form')
  await expect(form).toBeVisible()
  await expectSnapshot(page, tabContent(page))
})

Then('I do not see the daily log section', async ({ page }) => {
  await expect(page.getByLabel('Food to log')).toHaveCount(0)
    await expectSnapshot(page, tabContent(page))
  })

Then('I do not see the budget form', async ({ page }) => {
  await expect(page.getByTestId('budget-form')).toHaveCount(0)
    await expectSnapshot(page, tabContent(page))
  })

Then('the date is {string}', async ({ page }, date: string) => {
  const input = page.getByRole('textbox', { name: 'Date' })
  await expect(input).toHaveValue(date)
  await expectSnapshot(page, tabContent(page))
})




