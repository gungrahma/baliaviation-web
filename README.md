# Bali Aviation Community

## Run the site and news API locally

The news page reads and writes stories through the Go API. Run both services in separate terminals from the repository root:

```sh
go run ./cmd/server
npm run dev
```

Vite forwards `/api` requests to `http://127.0.0.1:8080`. The API stores stories in `data/news.json` by default; set `NEWS_DATA_FILE` to change the path or `NEWS_ADDR` to change its listen address.

The API provides:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/news` | List community updates |
| `POST` | `/api/news` | Create a TBA or announced update |
| `PATCH` | `/api/news/{id}` | Change an update between TBA and announced |

The file-backed store is intended as a lightweight starter backend. The API has no accounts, moderation, or rate limiting, so do not expose it directly to the public internet until those controls are added. Back up `data/news.json` when hosting the service.

Run the backend tests with `go test ./...`; build the frontend with `npm run build`.
