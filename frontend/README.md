This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Running this project

Some projects on this site (like the Kanban board) fetch data from the Python
backend in `../backend`. To see everything working, run both servers at once,
in two separate terminals:

**Terminal 1: backend**

```bash
cd ../backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

See `../backend/README.md` if you haven't set up the virtual environment yet.

**Terminal 2: frontend**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

If the backend isn't running, the frontend still loads, but any project that
depends on it (e.g. the Kanban board) will show a "could not reach the
backend" error instead of its data.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
