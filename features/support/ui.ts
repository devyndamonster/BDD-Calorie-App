import { expect, type Locator, type Page } from '@playwright/test'

export const foodItems = (page: Page) => page.getByTestId('food-item')
export const logItems = (page: Page) => page.getByTestId('log-item')
export const logSummary = (page: Page) => page.getByTestId('log-summary')
export const foodListEmpty = (page: Page) => page.getByTestId('food-list-empty')

export const tabBar = (page: Page) => page.getByTestId('tab-bar')

export async function openTab(page: Page, name: string) {
  await tabBar(page).getByText(name, { exact: true }).click()
}

// Clip to a rounded size so sub-pixel layout shifts don't change the image dimensions.
export async function expectSnapshot(page: Page, locator: Locator) {
  await locator.scrollIntoViewIfNeeded()
  const box = await locator.boundingBox()
  if (!box) throw new Error('Cannot snapshot an element that is not visible')
  const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }))
  const x = Math.round(box.x + scroll.x)
  const y = Math.round(box.y + scroll.y)
  const clip = {
    x,
    y,
    width: Math.round(box.width),
    height: Math.round(box.height),
  }
  await expect(page).toHaveScreenshot({ clip, fullPage: true })
}


