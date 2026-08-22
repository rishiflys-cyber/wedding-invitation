# Rishabh & Ananya — Wedding Invitation (Vercel-ready)

Cinematic, music-synced mobile wedding invitation.

## Deploy to Vercel

1. Push this folder to a GitHub repo **or** drag-and-drop the zip in the Vercel dashboard.
2. Framework Preset: **Other** (static).
3. Root Directory: leave blank (or the folder that contains `index.html`).
4. Deploy.

After deploy, update the RSVP WhatsApp link in `index.html` (`https://wa.me/YOURNUMBER`) and, for perfect social previews, change the `og:image` / `twitter:image` meta tags to absolute URLs (e.g. `https://your-domain.vercel.app/wedding-page.webp`).

## How it works

1. Guest taps the wax seal → envelope opens (3D flap).
2. Short heartfelt intro note.
3. “Begin the Celebrations” starts **Ranjha.mp3** and auto-scrolls through Mehendi → Sangeet → Haldi → Wedding → Dinner → Closing, timed to the song.
4. Final seconds: Nazar (evil-eye) drop → photo collage + RSVP.

Music can be paused/resumed with the ♫ button. Film-grain, vignette, Ken Burns zooms and particle effects give a movie-like feel.

## Files

- `index.html`, `style.css`, `script.js` — site
- `*.webp` — artwork
- `Ranjha.mp3` — soundtrack (~82 s)
- `vercel.json` — caching + security headers
- `favicon.svg`

