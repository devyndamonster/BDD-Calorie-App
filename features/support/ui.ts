import { expect, type Locator, type Page } from '@playwright/test'

export const foodItems = (page: Page) => page.getByTestId('food-item')
export const logItems = (page: Page) => page.getByTestId('log-item')

export const tabBar = (page: Page) => page.getByTestId('tab-bar')

export async function openTab(page: Page, name: string) {
  await tabBar(page).getByText(name, { exact: true }).click()
}

// Clip to a rounded size so sub-pixel layout shifts don't change the image dimensions.
export async function expectSnapshot(page: Page, locator: Locator, options: { withHeader?: boolean } = {}) {
  if (options.withHeader) return expectSnapshotWithHeader(page, locator)
  await locator.scrollIntoViewIfNeeded()
  const box = await locator.boundingBox()
  if (!box) throw new Error('Cannot snapshot an element that is not visible')
  await expectClip(page, box)
}

// Snapshots the sticky header together with the content below it.
async function expectSnapshotWithHeader(page: Page, locator: Locator) {
  await page.evaluate(() => window.scrollTo(0, 0))
  const header = await page.getByTestId('app-header').boundingBox()
  const box = await locator.boundingBox()
  if (!header || !box) throw new Error('Cannot snapshot an element that is not visible')
  const x = Math.min(header.x, box.x)
  const y = Math.min(header.y, box.y)
  await expectClip(page, {
    x,
    y,
    width: Math.max(header.x + header.width, box.x + box.width) - x,
    height: Math.max(header.y + header.height, box.y + box.height) - y,
  })
}

async function expectClip(page: Page, box: { x: number; y: number; width: number; height: number }) {
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



export const tabContent = (page: Page) => page.getByTestId('tab-content')

export async function dragLogItem(page: Page, name: string, direction: 'left' | 'right') {
  await dragItem(logItems(page).filter({ hasText: name }).first(), direction)
}

export async function dragFoodItem(page: Page, name: string, direction: 'left' | 'right') {
  await dragItem(foodItems(page).filter({ hasText: name }).first(), direction)
}

export const editAction = (page: Page, name: string) =>
  foodItems(page)
    .filter({ hasText: name })
    .first()
    .locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," adm-swipe-action ")][1]')
    .getByText('Edit', { exact: true })

async function dragItem(item: Locator, direction: 'left' | 'right') {
  const box = await item.boundingBox()
  if (!box) throw new Error('Item is not visible')
  const y = box.y + box.height / 2
  const from = box.x + box.width * (direction === 'left' ? 0.8 : 0.2)
  const to = box.x + box.width * (direction === 'left' ? 0.2 : 0.8)
  await item.evaluate(
    async (el, { from, to, y }) => {
      const fire = (type: string, x: number) => {
        const touch = { identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y }
        const event = new Event(type, { bubbles: true, cancelable: true })
        Object.defineProperties(event, {
          touches: { value: type === 'touchend' ? [] : [touch] },
          targetTouches: { value: type === 'touchend' ? [] : [touch] },
          changedTouches: { value: [touch] },
        })
        el.dispatchEvent(event)
      }
      fire('touchstart', from)
      for (let i = 1; i <= 10; i++) {
        fire('touchmove', from + ((to - from) * i) / 10)
        await new Promise((resolve) => setTimeout(resolve, 16))
      }
      fire('touchend', to)
    },
    { from, to, y },
  )
}

const swipeRow = (page: Page, name: string) =>
  logItems(page)
    .filter({ hasText: name })
    .first()
    .locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," adm-swipe-action ")][1]')

export const removeAction = (page: Page, name: string) => swipeRow(page, name).getByText('Remove', { exact: true })

// The action sits clipped beside the item until it is slid into view.
export async function isRemoveRevealed(page: Page, name: string) {
  const row = swipeRow(page, name)
  const button = removeAction(page, name)
  const rowBox = await row.boundingBox()
  const buttonBox = await button.boundingBox()
  if (!rowBox || !buttonBox) return false
  return buttonBox.x + buttonBox.width <= rowBox.x + rowBox.width + 1
}