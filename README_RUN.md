
# How to Run (Vite + React + TS)

## Prereqs
- Node.js 18+ (recommended 20+)
- npm 9+

## Install
```bash
npm install
```

## Development
```bash
npm run dev
```
By default Vite serves on http://localhost:5173

## Type-Check (optional, if you have `tsc`)
```bash
npx tsc -b
```

## Production Build
```bash
npm run build
npm run preview
```
`npm run preview` will serve the production build on http://localhost:4173 by default.

## Common Pitfalls
- **Syntax like `...` left from drafts** breaks TypeScript parsing. Make sure no file contains unfinished code.
- If you get `does not provide an export named 'Pack'`, ensure `src/types/index.ts` exports `Pack` and your imports point to `"../types"` correctly.
- If `ESLint` errors block build, you can run `npm run lint` to see details or temporarily adjust rules.

