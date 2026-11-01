import { readFileSync, writeFileSync } from 'node:fs'
import { buildSuggestions, type RawFood } from '../src/data/cleanFood.ts'

const SOURCE = 'data/usda/FoodData_Central_sr_legacy_food_json_2018-04/FoodData_Central_sr_legacy_food_json_2018-04.json'
const OUTPUT = 'src/data/foods.json'

const { SRLegacyFoods } = JSON.parse(readFileSync(SOURCE, 'utf8')) as { SRLegacyFoods: RawFood[] }
const suggestions = buildSuggestions(SRLegacyFoods)

writeFileSync(OUTPUT, JSON.stringify(suggestions))
console.log(`${SRLegacyFoods.length} raw foods -> ${suggestions.length} suggestions -> ${OUTPUT}`)
