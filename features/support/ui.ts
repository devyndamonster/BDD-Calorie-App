import type { Page } from '@playwright/test'

export const foodItems = (page: Page) => page.getByTestId('food-item')
export const logItems = (page: Page) => page.getByTestId('log-item')
export const logSummary = (page: Page) => page.getByTestId('log-summary')
export const foodListEmpty = (page: Page) => page.getByTestId('food-list-empty')
