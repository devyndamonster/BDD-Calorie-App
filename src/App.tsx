import { useState, type FormEvent } from 'react'
import { createFood, validateFood, type Food } from './domain/food'
import { loadFoods, saveFoods } from './storage/foodRepository'

export default function App() {
  const [foods, setFoods] = useState<Food[]>(loadFoods)
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const amount = calories.trim() === '' ? NaN : Number(calories)
    const validationError = validateFood(name, amount)
    if (validationError) {
      setError(validationError)
      return
    }
    const next = [...foods, createFood(name, amount)]
    setFoods(next)
    saveFoods(next)
    setName('')
    setCalories('')
    setError(null)
  }

  return (
    <main>
      <h1>Calorie Tracker</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Food name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Calories
          <input
            type="number"
            inputMode="numeric"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </label>
        <button type="submit">Add food</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <ul aria-label="Foods">
        {foods.map((food) => (
          <li key={food.id}>
            {food.name} — {food.calories} kcal
          </li>
        ))}
      </ul>
    </main>
  )
}
