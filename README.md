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

Open [http://localhost:3000](http://localhost:3000), then **Browse examples** (`/examples`) for runnable FormKit, FieldKit, DataTable, and Uploader samples (basic, validation, filters, bulk actions, URL sync, spreadsheet import, and more). The examples layout shows **breadcrumbs** and a **back** control above the main column; see `/examples/layout/utility-buttons` for the shared icon-button pattern. Legacy `/form` and `/table` redirect to the basic examples.

**Documentation** — short kit overviews at [`/docs`](http://localhost:3000/docs) (Fumadocs MDX in `apps/web/content/docs`). Each page points to the matching [`/examples`](/examples) playground route.

## License

MIT
