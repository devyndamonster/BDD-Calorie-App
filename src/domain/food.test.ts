import { describe, expect, it } from 'vitest'
import { createFood, describeCalories, validateFood } from './food'

describe('validateFood', () => {
  it('accepts a named food with zero or more calories', () => {
    expect(validateFood('Apple', 95)).toBeNull()
    expect(validateFood('Water', 0)).toBeNull()
  })

  it('rejects a blank name', () => {
    expect(validateFood('   ', 95)).toBe('Name is required')
  })

  it('rejects negative or non-numeric calories', () => {
    expect(validateFood('Apple', -1)).toBe('Calories must be zero or more')
    expect(validateFood('Apple', NaN)).toBe('Calories must be zero or more')
  })
})

describe('createFood', () => {
  it('trims the name and assigns an id', () => {
    const food = createFood('  Apple ', 95)
    expect(food).toMatchObject({ name: 'Apple', calories: 95 })
    expect(food.id).toBeTruthy()
  })

  it('throws on invalid input', () => {
    expect(() => createFood('', 10)).toThrow('Name is required')
  })

  it('keeps a trimmed serving and omits a blank one', () => {
    expect(createFood('Apple', 95, ' 1 medium ').serving).toBe('1 medium')
    expect(createFood('Apple', 95, '  ')).not.toHaveProperty('serving')
  })
})

describe('describeCalories', () => {
  it('shows calories per serving when a serving is set', () => {
    expect(describeCalories({ id: '1', name: 'Apple', calories: 95, serving: '1 medium' })).toBe('95 kcal / 1 medium')
  })

  it('shows only calories without a serving', () => {
    expect(describeCalories({ id: '1', name: 'Apple', calories: 95 })).toBe('95 kcal')
  })
})
