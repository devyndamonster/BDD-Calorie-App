import { useState, type FormEvent } from 'react'
import { validateFood, type Food } from '../domain/food'

type Props = {
  foods: Food[]
  onAdd: (name: string, calories: number) => void
}

export default function FoodSection({ foods, onAdd }: Props) {
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
    onAdd(name, amount)
    setName('')
    setCalories('')
    setError(null)
  }

  return (
    <section>
      <h2>Foods</h2>
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
    </section>
  )
}
