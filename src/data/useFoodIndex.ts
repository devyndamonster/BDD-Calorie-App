import { useEffect, useState } from 'react'
import type { FoodSuggestion } from './cleanFood'

export function useFoodIndex(): FoodSuggestion[] {
  const [foods, setFoods] = useState<FoodSuggestion[]>([])

  useEffect(() => {
    let cancelled = false
    import('./foods.json').then((module) => {
      if (!cancelled) setFoods(module.default as unknown as FoodSuggestion[])
    })
    return () => {
      cancelled = true
    }
  }, [])

  return foods
}
