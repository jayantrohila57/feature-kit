# Changelog workflow

The public changelog lives at [/docs/changelog](http://localhost:3000/docs/changelog) and is edited as MDX in the repo—no CMS.

## Where to edit

| What | Path |
| --- | --- |
| Public page content | `apps/web/content/docs/changelog.mdx` |
| Sidebar order | `apps/web/content/docs/meta.json` (`changelog` entry) |
| RSS feed (auto) | Parsed from `changelog.mdx`; route `apps/web/src/app/docs/changelog/rss.xml/route.ts` |

## Entry template

Add a new `##` section at the **top** of `changelog.mdx` (below the intro paragraphs and `<ChangelogRssLink />`):

```md
## Month YYYY — Short title

Optional one-sentence summary.

- **Docs** — User-visible change.
- **Packages** — Workspace package or API change.
```

Use em dashes (`—`) in headings to match existing entries. Link to docs routes with root-relative paths (`/docs/form`, etc.).

## RSS

Subscribers can use [/docs/changelog/rss.xml](http://localhost:3000/docs/changelog/rss.xml). The feed reads `##` sections from `changelog.mdx`; no separate file is required.

## When to write an entry

- Shipped user-facing docs or site changes worth announcing.
- Notable package releases or breaking API changes.
- Skip typo-only or internal refactors unless they affect contributors.
