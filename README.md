# Jay Bhavani Ornaments

Angular storefront and Express API for Jay Bhavani Ornaments. The application includes product collections, gold-rate estimates, wishlists, client registration/login, customer enquiries, and a protected admin inquiry dashboard. Product and inquiry data are stored in the local JSON database.

## Angular page structure

Route components are grouped under `src/app/page/`. Each page keeps its component logic, template, and styles together:

```text
src/app/page/
  home/       home-page.component.ts, .html, .css
  shop/       shop-page.component.ts, .html, .css
  product/    product-page.component.ts, .html, .css
  auth/       auth-page.component.ts, .html, .css
  wishlist/   wishlist-page.component.ts, .html, .css
  admin/      admin-page.component.ts, .html, .css
  not-found/  not-found-page.component.ts, .html
  shared/     page-data.ts
  index.ts    page component exports
```

Route definitions live in `src/app/app.routes.ts`; add new page components to the page exports in `src/app/page/index.ts`.

## Getting started

Install dependencies and configure the server environment:

```powershell
node --version # Use Node.js 22.12+, 24+, or 26+
npm install
Copy-Item .env.example .env
```

Set a private admin username and password in `.env`, and set `ADMIN_SESSION_SECRET` to a random secret with at least 32 characters. To send automatic WhatsApp notifications for new website enquiries, activate CallMeBot for the shop's WhatsApp account and put its real `CALLMEBOT_API_KEY` in `.env`. Notifications go to the configured shop WhatsApp number, `+91 90540 49570`. The example placeholder does not send notifications. Restart the Express server after changing `.env`. The API response distinguishes a saved enquiry from a notification request accepted by the provider; provider acceptance does not guarantee final delivery. Without the integration configured, enquiries are still saved and visible in the admin dashboard.

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

## Code formatting

Format application and server code with `npm run format`, and check formatting with `npm run format:check`. The checked-in database and local build/cache files are intentionally excluded.

Run the WhatsApp notification integration tests with `npm test`. They mock the provider request and never send a real WhatsApp message.
