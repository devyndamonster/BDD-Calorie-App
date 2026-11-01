import type { Food } from '../domain/food'

const KEY = 'foods'

export function loadFoods(): Food[] {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as Food[]) : []
}

export function saveFoods(foods: Food[]): void {
  localStorage.setItem(KEY, JSON.stringify(foods))
}
