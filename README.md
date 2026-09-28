# Tagalog Trainer

Next.js app with seven guided beginner lessons, scheduled phrase reviews, and optional MiniMax role-play.

## Run locally

Use Node 22 or newer. Run `npm ci`, `npx prisma generate`, then `npm run dev`.
Guided lessons work without a database or API key. Chat requires PostgreSQL and MiniMax.

Server variables (never commit values):
- `DATABASE_URL`: PostgreSQL connection URL; initialize with `npx prisma db push` only for a new database.
- `MINIMAX_API_KEY`: MiniMax credential.
- `MINIMAX_BASE_URL`: defaults to `https://api.minimax.io/v1`.
- `MINIMAX_MODEL`: defaults to `MiniMax-M3`.

Legacy mixed-case `MiniMax_*` variables remain supported. Server settings replace the old browser settings, which were never used by the API.

## Learning and storage

`/learn` resumes the current step, teaches one pattern, offers optional role-play, and checks typed recall. New phrases return in one day; successful reviews advance through 3, 7, 14, and 30 days. Missed reviews return after ten minutes. Self-rated phrase recall and typed checks are not speaking or listening proficiency measurements.

Course progress and chat history live in the browser. Export/restore course backups from `/learn`. There is no cross-device account sync. The legacy server progress table is not used because it is global, not learner-specific. Existing server conversation records are preserved.

Playback uses an installed Filipino browser voice only, with an explicit unavailable message if none exists. This is synthetic audio, not a native-speaker recording or pronunciation score. Later course units and recording/scoring are not implemented.

## Verify

- `npm run build`
- `npm run lint`
- `node --experimental-strip-types tests/course.test.mjs` (Node 22.6+)
- Browser: start lesson, advance to practice, reload and confirm resume, complete recall, confirm progress, export and restore a backup.

## Docker

Build with `docker build -t tagalog-trainer .`. Supply server variables at runtime using a protected env file. Put the app and PostgreSQL on the same user-defined Docker network so the database hostname resolves. Preserve the old container/image for rollback; no schema migration is needed for this release.
