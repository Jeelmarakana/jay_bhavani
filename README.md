# Jay Bhavani Ornaments

Angular storefront and Express API for Jay Bhavani Ornaments. The application includes product collections, gold-rate estimates, wishlists, client registration/login, customer enquiries, and a protected admin inquiry dashboard. Product and inquiry data are stored in the local JSON database.

## Getting started

Install dependencies and configure the server environment:

```powershell
node --version # Use Node.js 22.12+, 24+, or 26+
npm install
Copy-Item .env.example .env
```

Set a private admin username and password in `.env`, and set `ADMIN_SESSION_SECRET` to a random secret with at least 32 characters. Optionally configure `CALLMEBOT_API_KEY` for server-side WhatsApp notifications.

Start the Angular development server and Express API together:

```powershell
npm run dev
```

Open [http://localhost:4200](http://localhost:4200). Angular proxies `/api` requests to the Express server on port 3001. Admin inquiries are available at [http://localhost:4200/admin](http://localhost:4200/admin).

## Production

Build the Angular application and start the Express server:

```powershell
npm run build
npm start
```

The Express server serves the built Angular app and its JSON API from the configured `PORT` (3001 by default). The writable database is created under `.data/` from `src/data/database.json` on first use.
