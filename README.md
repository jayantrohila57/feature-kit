# Feature Kit

Open-source UI kits for product engineering:

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

## Develop

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), then **[`/docs`](http://localhost:3000/docs)** for kit overviews and live previews (FormKit, FieldKit, DataTable, Uploader, layout utilities, and more). Legacy `/examples`, `/form`, and `/table` redirect into the docs.

**Documentation** — Fumadocs MDX in `apps/web/content/docs` (no sidebar; horizontal kit nav). Runnable demos are embedded on kit pages and under `/docs/examples/*`.

## License

MIT
