# Bali Aviation Community

## Run the site and news API locally

The news page reads public stories through the Go API. Only editors with the configured admin token can publish articles. Start the API from the `backend` folder, and run the site from the repository root:

```sh
cd backend
NEWS_ADMIN_TOKEN='set-a-long-random-secret' go run ./cmd/server
```

In another terminal:

```sh
npm run dev
```

Vite forwards `/api` requests to `http://127.0.0.1:8080`. The API stores stories in `backend/data/news.json` by default; set `NEWS_DATA_FILE` to change the path or `NEWS_ADDR` to change its listen address.

The API provides:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/news` | List public news; optionally filter with `?category=Aircraft` |
| `GET` | `/api/admin/session` | Verify an editor token |
| `POST` | `/api/news` | Publish an article (requires `Authorization: Bearer <NEWS_ADMIN_TOKEN>`) |

Categories are `Aircraft`, `Plane spotting`, `Airline routes`, and `Community`. The previous `Spotting`, `Industry`, `Events`, and `Learning` categories are migrated when the news file is loaded. Articles no longer have TBA or completion states.

The file-backed store is intended as a lightweight starter backend. The editor token is held in browser memory only, and the API refuses all publishing when `NEWS_ADMIN_TOKEN` is unset. The API has no accounts, moderation workflow, or rate limiting, so use a strong secret and HTTPS and do not expose it directly to the public internet until appropriate deployment controls are in place. Back up `data/news.json` when hosting the service.

Run backend tests and builds from `backend` with `go test ./...` and `go build ./cmd/server`; build the frontend from the repository root with `npm run build`.
