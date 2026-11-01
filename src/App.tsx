import { NavBar } from 'antd-mobile'
import { useState } from 'react'
import { budgetForDate, setBudget, type DailyBudget } from './domain/budget'
import { createFood, type Food } from './domain/food'
import { createLogEntry, dailyTotal, todayIso, type LogEntry } from './domain/log'
import { loadBudgets, saveBudgets } from './storage/budgetRepository'
import { loadFoods, saveFoods } from './storage/foodRepository'
import { loadEntries, saveEntries } from './storage/logRepository'
import BudgetSection from './ui/BudgetSection'
import BudgetSummary from './ui/BudgetSummary'
import DailyLogSection from './ui/DailyLogSection'
import FoodSection from './ui/FoodSection'
import Tabs, { type TabKey } from './ui/Tabs'

export default function App() {
  const [tab, setTab] = useState<TabKey>('log')
  const [foods, setFoods] = useState<Food[]>(loadFoods)
  const [entries, setEntries] = useState<LogEntry[]>(loadEntries)
  const [budgets, setBudgets] = useState<DailyBudget[]>(loadBudgets)
  const [date, setDate] = useState(() => todayIso())
  const [selectedFoodId, setSelectedFoodId] = useState('')

  function updateBudget(calories: number) {
    const next = setBudget(budgets, date, calories)
    setBudgets(next)
    saveBudgets(next)
  }

  function addFood(name: string, calories: number) {
    const next = [...foods, createFood(name, calories)]
    setFoods(next)
    saveFoods(next)
  }

  function updateEntries(next: LogEntry[]) {
    setEntries(next)
    saveEntries(next)
  }

  return (
    <main>
      <NavBar back={null}>
        <h1 className="page-title">Calorie Tracker</h1>
      </NavBar>
      {tab === 'log' && (
        <>
          <BudgetSummary consumed={dailyTotal(entries, foods, date)} budget={budgetForDate(budgets, date)} />
          <DailyLogSection
            foods={foods}
            entries={entries}
            date={date}
            selectedFoodId={selectedFoodId}
            onDateChange={setDate}
            onSelectFood={setSelectedFoodId}
            onLog={(foodId) => updateEntries([...entries, createLogEntry(foodId, date)])}
            onRemove={(entryId) => updateEntries(entries.filter((e) => e.id !== entryId))}
          />
        </>
      )}
      {tab === 'food' && <FoodSection foods={foods} onAdd={addFood} />}
      {tab === 'me' && <BudgetSection onSetBudget={updateBudget} />}
      <Tabs active={tab} onChange={setTab} />
    </main>
  )
}

