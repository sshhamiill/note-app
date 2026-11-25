# Notes App

The React app stores notes in `db.json` through JSON Server and uses a React
Context provider for shared note state.

## Run locally

Install dependencies, then run the frontend and API in separate terminals:

```sh
npm install
npm run server
npm run dev
```

The frontend is served by Vite and JSON Server listens on
`http://localhost:3001`.

## API

JSON Server exposes the standard REST routes for the `notes` collection:

- `GET /notes`
- `POST /notes`
- `PUT /notes/:id`
- `PATCH /notes/:id`
- `DELETE /notes/:id`

Each note has an `id`, `title`, `content`, `color`, `tags`, `archived`,
`stock`, `createdAt`, and `updatedAt`. The existing pinned-note UI is also
preserved with an optional `pinned` property.
