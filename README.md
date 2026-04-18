This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment (Vercel + GitHub Actions)

This app is intended to be deployed by **Vercel Git Integration**.

- `main` push: Vercel automatically triggers production deploy.
- Pull request: Vercel automatically creates preview deployment.
- GitHub Actions is used for CI quality gates (lint and build), not VPS/SSH deployment.

### Workflows

- `.github/workflows/ci.yml`
	- Runs on PR and push to `main`
	- Installs deps with `npm ci --legacy-peer-deps`
	- Runs `npx eslint src`
	- Runs `npm run build`

- `.github/workflows/security-audit.yml`
	- Weekly audit
	- Runs `npm audit --audit-level=high`

### Vercel checklist

- Repository is connected to the correct Vercel project.
- Production branch is `main` in Vercel settings.
- Required environment variables are set in Vercel (Production/Preview as needed).
- Framework preset is Next.js and root directory points to this app if using monorepo setup.
