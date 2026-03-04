# DSA Guide Web App

Next.js frontend for the DSA Guide content and progress tracker.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Static Export (GitHub Pages)

This app is configured with `output: "export"` in `next.config.ts`.

```bash
npm run build
```

Static files are generated in `web/out/`.

## Notes

- Run commands from the `web/` directory.
- Content markdown is read from repository folders (`phases/`, `topics/`, `interview/`, `tracking/`).
- Progress data is stored in browser localStorage under `dsa-mastery-progress`.
