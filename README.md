# fxter

A board of guitar and sound effect pedals that runs in the browser. Eleven pedals, one at a time: Grain, Tail (reverb), Comp, Drive, Gate, Wah, Morph, Swirl, EQ, Tape and a Scope/tuner. Every pedal has a black pixel OLED that shows what the effect is doing, live.

Built with plain HTML, CSS and JavaScript and the Web Audio API. No framework, no dependencies, no build step needed to run it.

## Run

Open the published page, or serve the folder locally:

    python3 -m http.server

then open `http://localhost:8000`. On iPhone use Share, then Add to Home Screen to install it as an app. It works offline after the first visit.

## GitHub Pages

Upload the whole folder (keep `css/`, `js/` and `icons/` next to `index.html`), then Settings, Pages, deploy from the `main` branch root.

## Layout

    index.html            markup only
    css/style.css         styles (built from src/css)
    js/app.js             application (built from src/js)
    sw.js, manifest.webmanifest   offline and install
    icons/, screenshots/
    src/                  the same code split into sectors
    pack.py               joins the sectors into css/style.css and js/app.js

The JavaScript sectors share one scope, so they work only joined. After editing `src/`, run `python3 pack.py`.

## Screenshots

| Grain | Comp | Drive |
|---|---|---|
| ![](screenshots/01-grain.png) | ![](screenshots/02-comp.png) | ![](screenshots/03-drive.png) |

## License

MIT, see `LICENSE`.
