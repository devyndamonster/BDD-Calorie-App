import type { LogEntry } from '../domain/log'

const KEY = 'log-entries'

export function loadEntries(): LogEntry[] {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as LogEntry[]) : []
}

export function saveEntries(entries: LogEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries))
}
