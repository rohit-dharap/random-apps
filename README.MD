# Personal mini apps

Each mini app lives in its own folder under `apps/` and is published at
`https://<account>.github.io/<repository>/<app-name>/` when active. The Pages
workflow builds a site artifact from every active app in `apps.json`; changing
one app or its config triggers a rebuild, while each app keeps its own URL.

## App lifecycle

Edit `apps.json` to control each app:

- `activated_at`: optional ISO-8601 timestamp; the app is hidden before it.
- `expires_at`: optional ISO-8601 timestamp; the app is removed at or after it.
- `path`: source folder for that app.

`Diwali_Padva_2026` is enabled for a 48-hour window starting November 9, 2026
at 15:39:54 UTC. The scheduled Pages workflow checks expiry once a day and
republishes the active set. You can also run **Publish active mini apps**
manually from the Actions tab to publish a lifecycle change immediately. To
take an app down early, set its `expires_at` to a past timestamp and run the
workflow.

## GitHub Pages setup

In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**. The workflow needs Pages write and OIDC permissions, which
are declared in `.github/workflows/pages.yml`.

## Updating the Padva surprise

Edit `apps/Diwali_Padva_2026/config.json` to point to your assets. Set
`resourcePath` to a folder relative to the app directory, then set each entry
under `assets` to a filename in that folder. For example, use
`"resourcePath": "./resources/"` and `"portrait": "her-photo.jpg"`. The
Amazon gift-card URL can be changed in that config too. The current SVG stays
as a fallback if the config cannot be loaded.
