# BDD-Calorie-App

A calorie tracking app built with React, TypeScript and Ant Design Mobile, developed with BDD.

**Live app:** https://devyndamonster.github.io/BDD-Calorie-App/

## Development

Node is managed with [mise](https://mise.jdx.dev/).

```
mise install
npm install
npm run dev        # start the dev server
npm test           # Vitest unit tests
npm run test:bdd   # Playwright-BDD scenarios (iPhone WebKit)
npm run test:bdd:update  # accept intentional visual changes (screenshots in features/__screenshots__)
# Screenshots tolerate minor pixel noise (see playwright.config.ts); only update baselines for real visual changes
# npm run lint fails if any screenshot in features/__screenshots__ is under 100px tall (see lint/bdd-screenshots-plugin.js); capture a larger parent component instead
```

## Food data

Food-name suggestions come from USDA FoodData Central (SR Legacy, CC0). The cleaned list is committed in `src/data/foods.json`; to regenerate it:

```
npm run data:download   # download raw USDA data into data/usda (gitignored)
npm run data:build      # clean it into src/data/foods.json
```


