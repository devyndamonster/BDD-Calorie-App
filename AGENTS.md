# BDD Calorie App

A mobile-first calorie tracking app built with React 19, TypeScript, Vite and Ant Design Mobile, developed with BDD. Deployed to GitHub Pages.

## Layout

- `src/domain` – pure business logic (food, daily log, budget) with colocated Vitest tests
- `src/storage` – repositories that persist data in the browser
- `src/ui` – React components (food, daily log, budget, tabs)
- `src/data` – USDA food-name suggestions (`foods.json`, search and cleaning)
- `features` – Playwright-BDD `.feature` files, step definitions in `features/steps`, helpers in `features/support`, visual baselines in `features/__screenshots__`

## Commands

Node is managed by mise (`mise install`, then `npm install`).

- `npm run dev` – dev server
- `npm run lint` – oxlint
- `npm run build` – type-check and build
- `npm test` – Vitest unit tests
- `npm run test:bdd` – BDD scenarios (iPhone WebKit)
- `npm run test:bdd:update` – accept intentional visual changes

## Conventions

- Write or update a `.feature` scenario first for any user-visible behavior; put business rules in `src/domain` with unit tests.
- Only update screenshot baselines for real visual changes. Screenshots under 100px tall fail lint; capture a larger parent component instead.
- Before finishing, lint, build, unit tests and BDD tests must all pass locally (there is no CI at the moment).
