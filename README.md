# Finding Founders

Founders Fridays: food, games and conversations for founders in Lagos.

## GitHub Pages

Live site: https://kayziewest.github.io/finding-founders/

Pushes to main publish automatically with GitHub Actions. Run `node scripts/build-pages.mjs` to build the static site into `_site`. All routes and assets are adapted to the project URL. Node 24 is recommended.

## RSVP email

GitHub Pages uses FormSubmit to send the complete RSVP to ai@oysterskin.com. The recipient must activate FormSubmit through its confirmation email before receiving submissions. CAPTCHA remains enabled. All date preferences, activities, interests and introduction consent are included. RSVPs are handled through email; GitHub Pages does not run the organiser database or automatic match suggestions. Never commit guest information.

## Local development

`npm ci`, `npm test`, then `node scripts/dev.mjs`. The local preview uses SQLite and includes the optional Worker-based RSVP backend. The GitHub Pages build uses email instead.
