# Cafeteria MERN App

React/Vite frontend converted from the Figma cafeteria design, plus an Express + MongoDB/Mongoose API.

## Environment

Fill these values in `.env`:

```sh
MONGO_URI=
PORT=4000
```

`MONGO_URI` is intentionally an empty placeholder in `.env.example`.

## Seed Food Items

After adding `MONGO_URI`, push the cafeteria food items into MongoDB:

```sh
npm run seed
```

The seed data lives in `server/data/menuSeed.js`.

## Run Locally

Start the API:

```sh
npm run dev:api
```

Start the frontend in another terminal:

```sh
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Auth

Signup creates a real MongoDB user with a hashed password. Login checks email/password against MongoDB. There is no token storage and no browser cookie login. The API keeps the current logged-in user in memory while the API process is running, which is intentionally simple for this app.

## API

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/menu`
- `GET /api/menu/:itemId`
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:itemId`
- `DELETE /api/cart/:itemId`
- `GET /api/orders`
- `POST /api/orders`
- `POST /api/orders/:orderId/reorder`
