# Featureskit

**Live docs:** [feature-kits.vercel.app](https://feature-kits.vercel.app)

Featureskit (repo and registry namespace: `feature-kit`) is a set of open-source UI kits for product engineering:

- **form** — schema-driven fields, `FieldKit`, and `FormKit` (React Hook Form + Zod)
- **data-table** — TanStack Table toolbar, filters, pagination, selection, and bulk actions
- **layout** — breadcrumbs, utility icon buttons (back, docs, shared tooltip/loading), form section chrome, and shared empty/confirm patterns used by the kits
- **uploader** — spreadsheet import dialog, parse/validate, and template download
- **ui** — shadcn-style primitives (Field\*, inputs, overlays)

## Repository layout

```
apps/web          # Next.js playground and documentation shell
feature/form
feature/data-table
feature/layout
feature/uploader
feature/export
feature/preferences
packages/ui
packages/format
packages/config   # shared TypeScript config
```

## Use the kits in your app

The workspace packages are `private` and are not published to npm. There are two ways to use them:

1. **shadcn registry (external apps):** the kits are served as a shadcn registry. Each kit resolves to `https://feature-kits.vercel.app/r/<kit>.json` (item names: `form`, `data-table`, `dashboard-shell`, `layout`, `breadcrumb`, `auth`, `theme`, `uploader`). The CLI copies the source into your project:

   ```bash
   npx shadcn@latest add https://feature-kits.vercel.app/r/form.json
   ```

   See [Installation](https://feature-kits.vercel.app/docs/installation) for configuring the `@feature-kit` namespace.

2. **Workspace packages (inside this monorepo):** add `"form": "workspace:*"` (and so on) to an app in this repo and list the packages in `transpilePackages`.

## Develop

Requires Node.js 24+ and pnpm 9+ (`engines` in `package.json`; the repo pins `pnpm@10.12.1`).

```bash
git clone https://github.com/jayantrohila57/feature-kit.git
cd feature-kit
pnpm install
pnpm dev
```

`pnpm registry:build` regenerates the registry; `pnpm build` runs it and then builds the docs app.

Open [http://localhost:3000](http://localhost:3000), then **[`/docs`](http://localhost:3000/docs)** for kit overviews and live previews (FormKit, FieldKit, DataTable, Uploader, layout utilities, and more). Legacy `/examples`, `/form`, and `/table` redirect into the docs.

**Documentation** — Fumadocs MDX in `apps/web/content/docs` (no sidebar; horizontal kit nav). Runnable demos are embedded on kit pages and under `/docs/examples/*`.

## License

[MIT](LICENSE)

## Sponsor

If you find this project useful, consider supporting its development:

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-db61a2?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayantrohila57)
