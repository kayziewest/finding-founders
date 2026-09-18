# Finding Founders

Founders Fridays: food, games and conversations for founders in Lagos.

## Run

Requires Node.js 24 or newer.

```sh
npm ci
npm test
npm run build
node scripts/dev.mjs
```

Local preview: http://127.0.0.1:4175

## Hosting

Hosted with Sites and a D1 database. The Worker handles RSVP submissions and owner-only organiser access. GitHub Pages alone cannot run the RSVP backend.

Production: https://finding-founders.ai-f0dc.chatgpt.site

The deployment is currently private. Guest names and contact details are not stored in this repository.
