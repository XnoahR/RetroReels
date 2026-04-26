# Retro Reels

Retro Reels is a retro music marketplace and social listening app built with Vue, Express, Prisma, and PostgreSQL. The app mixes a catalog storefront with a cassette/vinyl/VHS-inspired player, user profiles, and a social timeline for sharing music posts.

## Current Features

- Browse a music catalog with product detail pages, cart flow, favorites, and owned-library playback.
- Play purchased music in a themed player with mini-player and fullscreen cassette, vinyl, and VHS views.
- Create social posts with optional captions, optional album drops, and optional uploaded images.
- Like, comment, edit, and delete social posts.
- Visit public user profiles and view posts, liked posts, collections, and selling items.
- Update profile settings, including display name, bio, avatar upload, and password changes.
- Admin dashboard support for managing catalog products.

## Tech Stack

- Frontend: Vue 3, Vue Router, Vite, Tailwind CSS, PrimeVue, Lucide icons.
- Backend: Express, TypeScript, Prisma, PostgreSQL.
- Auth: JWT with bcrypt password hashing.
- Storage: uploaded social/profile images are saved under `client/public/image-upload`.

## Project Structure

```text
client/   Vue frontend
server/   Express API and Prisma schema
```

## Local Development

Install dependencies in both apps:

```bash
cd client
npm install

cd ../server
npm install
```

Create a server `.env` file with a PostgreSQL `DATABASE_URL` and JWT secret, then sync the database:

```bash
cd server
npx prisma db push
npm run seed
```

Run the apps in separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

The frontend is served by Vite, and API calls are handled by the Express server.
