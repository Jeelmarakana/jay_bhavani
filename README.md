Jay Bhavani is a Next.js storefront with a local JSON data store and an admin inquiry dashboard.

## Getting Started

Install dependencies and configure local environment variables:

```bash
npm install
Copy-Item .env.example .env.local
```

Set a private admin username and password in `.env.local`, and set `ADMIN_SESSION_SECRET` to a random value at least 32 characters long. Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin inquiries are available at [http://localhost:3000/admin](http://localhost:3000/admin). The admin session is stored in a signed, HTTP-only cookie; inquiry reads require a valid session.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
