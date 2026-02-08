# random-commander

A small Next.js app to explore and generate random Magic: The Gathering Commander (EDH) suggestions and summaries.

## Goals
- Provide quick, shareable Commander ideas.
- Surface EDH-related metadata (mana, deck summaries) and links to deeper resources.

## Quick Start

Prerequisites:
- Node.js 18+ (recommended)
- npm

Development:

```bash
npm install
npm run dev
```

Production build and start:

```bash
npm run build
npm run start
```

If `npm run start` fails locally, try `npm run dev` to run the Next.js server in development mode.

## Project Structure

- `src/app/` — Next.js app routes and global layout
- `src/components/` — React UI components (e.g., `CommanderCard`, `Controls`, `EdhrecSummary`)
- `src/lib/api.ts` — central API/fetch utilities
- `public/` — static assets

## Scripts

- `dev` — run Next.js in development
- `build` — build production app
- `start` — run built app

(Add `lint`, `test` and other scripts when tooling is enabled.)

## Development Notes & Recommendations

- Turn on TypeScript `strict` mode in `tsconfig.json` and prefer explicit prop types over `any`.
- Centralize network calls and error handling in `src/lib/api.ts` to keep components pure.
- Keep components small and focused; split UI and data logic (hooks or `lib/`) where helpful.

## Contributing

Please open an issue or PR. Add a short description of the change, the motivation, and any steps to reproduce or test.
