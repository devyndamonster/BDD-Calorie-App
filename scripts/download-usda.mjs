import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const BASE = 'https://fdc.nal.usda.gov/fdc-datasets'
const FILES = [
  'FoodData_Central_foundation_food_json_2026-04-30.zip',
  'FoodData_Central_sr_legacy_food_json_2018-04.zip',
]
const DEST = 'data/usda'

mkdirSync(DEST, { recursive: true })

for (const file of FILES) {
  const target = `${DEST}/${file}`
  if (existsSync(target)) {
    console.log(`skip ${file} (already downloaded)`)
    continue
  }
  console.log(`downloading ${file}`)
  const response = await fetch(`${BASE}/${file}`)
  if (!response.ok || !response.body) throw new Error(`${file}: HTTP ${response.status}`)
  await pipeline(Readable.fromWeb(response.body), createWriteStream(target))
}
console.log(`done -> ${DEST}`)
