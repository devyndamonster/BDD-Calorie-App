import type { LogEntry, Meal } from '../domain/log'

const KEY = 'log-entries'

export function loadEntries(): LogEntry[] {
  const raw = localStorage.getItem(KEY)
  const entries = raw ? (JSON.parse(raw) as (Omit<LogEntry, 'meal'> & { meal?: Meal })[]) : []
  return entries.map((entry) => ({ ...entry, meal: entry.meal ?? 'Snack' }))
}

export function saveEntries(entries: LogEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

