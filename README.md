# Connect Orchestration Service

A small Node.js REST API starter built with Express 5.

## Requirements

- Node.js 20 or newer
- npm

## Setup

```sh
npm install
cp .env.example .env
```

Set `PORT` in `.env` if you want to use a port other than `3000`.

## Run

```sh
npm run dev
```

For production, run `npm start`.

## Endpoints

- `GET /health` — service status and timestamp
- `GET /api/v1` — API welcome response

Unknown routes return a JSON 404. The service logs request method, path, status, and duration; request bodies are not logged.

## Test

```sh
npm test
```
