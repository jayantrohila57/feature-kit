# Feature Kit Documentation Rewrite Plan

**Status:** Draft for implementation  
**Date:** 2026-10-07  
**Scope:** Entire documentation site, examples, usage guidance, information architecture, writing style, API documentation, and documentation UX

---

## 1. Objective

Rebuild the Feature Kit documentation so it feels like a mature developer product rather than an internal package reference.

The target experience should combine:

- the clarity and progressive disclosure of shadcn/ui documentation,
- the copy-friendly, source-oriented mindset of modern open-code documentation,
- the practical workflow coverage expected from production admin applications,
- and the actual APIs and architecture already present in Feature Kit.

The result should help a developer answer five questions quickly:

1. **What is this?**
2. **Is it the right abstraction for my screen?**
3. **How do I install and wire it into my app?**
4. **How do I build my first working version?**
5. **How do I handle the real production cases once the basic version works?**

The documentation should teach developers how to use the kits, not merely describe what the exports are.

---

## 2. Core Documentation Positioning

### Recommended positioning direction

Feature Kit should be presented as a collection of **opinionated, composable building blocks for real product workflows**.

Avoid positioning it as a generic UI component library. The repository already has a lower-level `ui` package, while the feature packages solve workflow-level problems:

- forms with validation and submission lifecycle,
- data tables with filtering, URL state, selection, paging, actions, and persistence,
- application layout patterns,
- spreadsheet import flows.

The documentation should make that distinction obvious.

### Proposed conceptual model

```text
UI primitives
    ↓
Feature-level composition
    ↓
Workflow patterns
    ↓
Production application screens
```

For example:

```text
Input / Select / Dialog
        ↓
FieldKit / FormKit
        ↓
Create / Edit / Filter workflow
        ↓
Admin application screen
```

And:

```text
Table / Button / Checkbox / Dropdown
        ↓
DataTable
        ↓
Search + filter + sort + paging + selection
        ↓
Production listing screen
```

### What to borrow from shadcn

Use shadcn as a **documentation model**, not a copy source.

Borrow these principles:

- concise opening descriptions,
- strong visual previews,
- source-first examples,
- progressive complexity,
- installation before deep API detail,
- focused examples instead of one giant demonstration,
- clear explanation of design decisions,
- practical implementation notes,
- predictable headings and page structure,
- explicit framework/package prerequisites,
- excellent code presentation and copyability,
- documentation that teaches the underlying composition model.

Do **not** copy shadcn's sentences, taglines, page copy, example text, or brand language. Write Feature Kit-specific language around Feature Kit's own architecture and product philosophy.

---

## 3. Current-State Audit

### 3.1 What is already working

The current documentation has a strong foundation:

- Introduction
- Getting Started
- Form
- Data Table
- Layout
- Uploader
- UI
- Changelog
- Examples

The kit pages already use a useful flow similar to modern component documentation:

> choose → install → preview → usage → recipes → API → gotchas → examples

That structure should be retained, but made much more complete and consistent.

### 3.2 Main content problems

#### Problem: Documentation describes capabilities before teaching mental models

Current pages quickly move into props and implementation details. A new developer needs a clearer explanation of:

- what problem the kit solves,
- where it sits relative to the lower-level `ui` package,
- when to choose one kit over another,
- what state belongs to the host application,
- and what behavior the kit owns.

**Fix:** Add a short mental-model section to every major kit.

#### Problem: Examples are too thin

Most example MDX files are essentially:

```mdx
<ComponentPreview>
  <Example />
</ComponentPreview>
```

That is useful for visual browsing, but insufficient as documentation.

**Fix:** Examples should become first-class instructional pages with:

- a short explanation,
- a complete working preview,
- complete source code,
- integration notes,
- relevant configuration,
- edge cases,
- and links to the next related example.

#### Problem: API documentation is not deep enough for the real source surface

The source contains substantially more functionality than the current pages expose.

Examples of functionality that deserves dedicated documentation include:

- form field variants and skeletons,
- searchable single and multi-select controls,
- date/date-range/month/quarter/time fields,
- choice-card fields,
- server error mapping,
- cross-page table selection,
- row expansion,
- fullscreen table mode,
- filter panels and active filter chips,
- view options and persistence,
- CSV/XLSX bulk export,
- row action components,
- loading/error/empty states,
- uploader parsing helpers,
- uploader template generation,
- raw-file versus parsed-record transport,
- import history redirects.

**Fix:** Documentation should reflect the real public API surface while separating stable public exports from internal implementation modules.

#### Problem: Current language sometimes feels like internal engineering notes

Phrases such as source paths, internal implementation notes, and "gotchas" are useful, but too much of the page is written from the maintainer's perspective.

**Fix:** Reframe copy around the developer's task:

- "Use this when..."
- "This owns..."
- "Your app owns..."
- "For server-driven data..."
- "For embedded tables..."
- "For long forms..."
- "When the backend returns field errors..."

#### Problem: Installation is monorepo-specific without clearly separating environments

The current project is a pnpm monorepo and the packages are workspace packages. Documentation should not imply npm installation or public registry distribution unless that becomes a supported distribution model.

**Fix:** Separate documentation into:

1. **Using Feature Kit in this repository**
2. **Using Feature Kit from another application**
3. **Publishing / consuming packages** — only when actually supported

Never document a fictional package installation flow.

#### Problem: Some documentation refers to internal paths as if they were public APIs

For example, internal `apps/web` source paths and `@/packages/ui/...` aliases are useful for contributors but can confuse consumers.

**Fix:** Label examples explicitly as one of:

- **App integration**
- **Monorepo development**
- **Package API**
- **Internal implementation**

Only document an export as public when it is intentionally exposed by the package export map.

---

## 4. Documentation Philosophy

### 4.1 Explain the "why" before the "how"

For abstractions that solve non-trivial state problems, start with the design reason.

Bad:

> `syncUrl` controls whether table state is written to the URL.

Better:

> Use URL synchronization when the table state should survive refreshes, be linkable, or be shared with another person. Disable it for embedded tables whose state should remain local to the page.

Then document `syncUrl`.

### 4.2 Prefer progressive disclosure

Every major page should follow approximately this progression:

```text
Concept
  ↓
When to use it
  ↓
Minimal working example
  ↓
Common patterns
  ↓
Advanced patterns
  ↓
Reference
  ↓
Troubleshooting
```

### 4.3 Examples are executable teaching material

A developer should be able to copy an example and understand every important line.

Avoid snippets containing undefined variables such as:

```tsx
await saveProfile(values)
```

without explaining where `saveProfile` comes from.

Examples may use mocked functions, but mark them clearly:

```tsx
async function saveProfile(values: Profile) {
  // Replace with your mutation or API call.
}
```

### 4.4 Documentation should match source code

The source code is the authority for:

- public exports,
- prop names,
- defaults,
- types,
- return values,
- package subpaths.

The docs should never manually invent an API shape.

### 4.5 Avoid marketing language inside technical pages

Marketing language belongs on the homepage.

Docs should primarily use:

- direct statements,
- precise technical nouns,
- active voice,
- short paragraphs,
- meaningful headings,
- concrete examples.

Avoid filler such as:

- "simply",
- "super easy",
- "blazing fast",
- "magical",
- "seamlessly",
- "zero effort",
- "just plug it in".

### 4.6 Use real product language

Use domain examples such as:

- users,
- accounts,
- roles,
- invoices,
- audit events,
- transactions,
- imports,
- permissions,
- projects.

Avoid overusing:

- `foo`,
- `bar`,
- `thing`,
- `test123`.

---

## 5. Writing Style Guide

### Tone

Technical, calm, confident, direct, and practical.

### Sentence rules

- Prefer one idea per sentence.
- Use active voice.
- Put the action near the beginning of the sentence.
- Keep introductory paragraphs short.
- Explain specialized terms the first time they appear.
- Use contractions only when they improve readability.
- Avoid unnecessary disclaimers.

### Headline rules

Use task-oriented headings:

- `Installation`
- `Usage`
- `Create a form`
- `Handle server errors`
- `Sync table state with the URL`
- `Persist visible columns`
- `Import records`
- `Upload the original file`

Avoid vague headings:

- `Overview of things`
- `Advanced magic`
- `More details`
- `Miscellaneous`

### Terminology rules

Use one term consistently:

| Prefer | Avoid mixing with |
|---|---|
| DataTable | TableKit / Table / data table component, unless intentionally distinguishing concepts |
| FormKit | Form kit / FormComponent |
| FieldKit | Filter form / inline form, when referring to the actual package |
| upload mode | import mode / operation mode, unless the distinction matters |
| records | rows / objects, when referring to uploader records |
| host application | consumer app / client app / parent app, unless technically distinct |

### Code terminology

Use inline code for:

- component names,
- props,
- functions,
- package names,
- file names,
- path names,
- environment variables.

---

## 6. Proposed Information Architecture

The current sidebar should evolve from a package list into a learning path.

### Proposed top-level navigation

```text
Introduction
Getting Started

Fundamentals
  Architecture
  Installation
  Providers
  Theming
  UI primitives

Form
  Overview
  Basic form
  Fields
  Field types
  Validation
  Server errors
  Controlled fields
  FieldKit
  Multi-section forms
  Loading states
  Advanced usage
  API reference

Data Table
  Overview
  Basic table
  Columns
  Toolbar
  Filters
  Sorting
  Pagination
  URL synchronization
  Row selection
  Cross-page selection
  Bulk actions
  Row actions
  Expanded rows
  Column visibility
  Column persistence
  Fullscreen
  Loading states
  Empty states
  Error states
  Server-driven data
  Advanced usage
  API reference

Layout
  Overview
  Breadcrumbs
  Navigation
  Form layout
  Empty states
  Confirmation dialogs
  Utility actions
  API reference

Uploader
  Overview
  Basic import
  Templates
  Column configuration
  Create and update modes
  Validation
  Cross-row validation
  Parsed records transport
  Raw file transport
  Import history
  Redirects
  API reference

Examples
  Forms
  Tables
  Layout
  Uploader
  Full workflow examples

Reference
  Packages
  Exports
  Providers
  Configuration
  Troubleshooting

Changelog
Contributing
```

### Why this structure

The package pages remain the primary entry points, but their child pages allow the documentation to grow without creating giant 1,000-line MDX files.

It also mirrors the strongest part of shadcn's model: a predictable path from concept to installation to focused examples to reference.

---

## 7. New Homepage / Introduction Documentation

### Replace the current introduction with four jobs

#### Job 1: Explain Feature Kit

Answer in two or three sentences:

- what it is,
- who it is for,
- what workflows it covers.

#### Job 2: Show the primary capabilities

Use a compact visual section for:

- Forms
- Data tables
- Layout
- Spreadsheet imports

Each card should contain:

- preview,
- one-sentence use case,
- link to docs,
- link to examples.

#### Job 3: Explain the architecture

Show:

```text
ui
├── primitives and theme

feature/form
├── FormKit
├── FieldKit
└── field system

feature/data-table
├── DataTable
├── toolbar
├── filters
├── selection
├── actions
└── state synchronization

feature/layout
└── layout/workflow chrome

feature/uploader
├── parser
├── validator
└── import workflow
```

#### Job 4: Get developers to a first success

End with a clear path:

```text
Get started
→ Build a form
→ Build a data table
→ Explore examples
```

### Remove from technical documentation

The homepage can retain selective marketing content, but technical docs should not contain testimonial-style copy, even when clearly marked as illustrative. It distracts from the job developers came to do.

---

## 8. Getting Started Rewrite

### Proposed page structure

```text
Getting Started

Requirements
Install / clone
Run the docs playground
Understand the monorepo
Add a feature package
Configure Next.js
Configure providers
Load styles
Verify installation
Next steps
```

### Requirements section

Use the repository's declared engine requirements as the source of truth.

Document:

- Node.js requirement
- pnpm requirement
- supported framework assumptions
- TypeScript requirement, when relevant

Avoid duplicating versions in multiple places. The docs should have one canonical version source.

### Installation paths

Create tabs or clearly separated sections for:

- **Clone the repository**
- **Use a workspace package in an existing app**
- **Contribute to Feature Kit**

Do not use npm installation commands until packages are actually published and supported that way.

### Provider setup

Explain not only the provider code but **why each provider exists**.

| Provider | Why it exists |
|---|---|
| `NextIntlClientProvider` | localized labels and messages used by kits |
| `ThemeProvider` | application theme state |
| `TooltipProvider` | tooltip-driven controls |
| `ConfirmationDialogProvider` | centralized async confirmation flows |
| `DataTableNuqsAdapter` | URL state support for DataTable |

### Verification step

Add a small checklist:

```text
✓ Docs site starts
✓ A kit imports without module errors
✓ Theme works
✓ Tooltips work
✓ Confirmation dialog works
✓ URL-synced table updates correctly
```

---

## 9. Architecture Page

Create a dedicated `architecture.mdx` page.

### Goals

Explain:

- the monorepo,
- feature package boundaries,
- dependency direction,
- public package exports,
- `ui` versus `feature/*`,
- where application code belongs,
- and why the kits are intentionally composable.

### Include a dependency diagram

```text
                 ┌─────────────┐
                 │  apps/web   │
                 └──────┬──────┘
                        │
            ┌───────────┼───────────┐
            ↓           ↓           ↓
          form      data-table    layout
            │           │           │
            └───────────┼───────────┘
                        ↓
                       ui
```

Add uploader and supporting packages where they actually belong after confirming the dependency graph.

### Document ownership boundaries

This is especially important for Feature Kit:

| Concern | Owned by |
|---|---|
| UI primitives | `ui` |
| Schema validation | host + `form` |
| Business rules | host application |
| API calls | host application |
| Form lifecycle | `form` + host |
| URL state synchronization | `data-table` |
| Server-side data loading | host application |
| Import parsing | `uploader` |
| Import persistence / API processing | host application |

---

## 10. UI and Theming Documentation

The current UI page should become a proper foundation page instead of a package note.

### Recommended sections

```text
UI

What it is
Installation
Styles and tokens
Color system
Typography
Light and dark mode
Component primitives
Icons
Composition rules
Extending the system
Do / Don't
```

### Theming guidance

Take inspiration from shadcn's semantic token model.

Explain tokens in terms of **roles**, not specific colors:

```text
background
foreground
primary
primary-foreground
secondary
muted
accent
destructive
border
input
ring
```

Then explain:

- where tokens live,
- how dark mode works,
- how the feature kits consume them,
- how applications should override them,
- what should not be overridden locally.

### Add a token reference table

| Token | Used for | Example UI |
|---|---|---|
| `background` | application surfaces | page body |
| `foreground` | primary text | headings |
| `muted` | secondary content | descriptions |
| `border` | separation | tables/cards |
| `primary` | main action | submit button |
| `destructive` | destructive actions | delete |

### Add composition guidance

Show when developers should:

- use a Feature Kit component,
- use a lower-level UI primitive,
- create a local wrapper,
- contribute a shared primitive.

---

# 11. Form Documentation Rewrite

The form system should receive the largest documentation investment because it has the richest conceptual model.

## 11.1 Form overview

Start with a mental model:

```text
Zod schema
   ↓
FormKit
   ↓
Field registry
   ↓
Typed field controls
   ↓
Validation + state
   ↓
Submit / reset lifecycle
```

Explain that `FormKit` is the high-level workflow abstraction while `FieldKit` is the controlled/uncontrolled field surface for inline filter or state-driven experiences.

### Add a "Choose your API" table

| Need | Use |
|---|---|
| Create/edit form with submit lifecycle | `FormKit` |
| Controlled filter or inline state | `FieldKit` |
| Custom field rendering | `field` exports |
| Reusable searchable select | combobox exports |
| Server error mapping | form utilities |

## 11.2 Basic form

The first example should contain:

- schema,
- default values,
- fields,
- section,
- submit action,
- reset action,
- success state.

Keep it small.

Then progressively add features.

## 11.3 Field types

Create a dedicated page rather than a single table.

Each field should have:

- live preview,
- field name,
- typical use case,
- minimal configuration,
- controlled/uncontrolled notes where relevant,
- validation example,
- accessibility notes,
- related fields.

### Field catalog

Document at minimum:

- text
- textarea
- select
- multi-select
- checkbox
- switch
- checkbox choice card
- switch choice card
- radio choice card
- radio group
- date
- date range
- month
- quarter
- time

### Field page template

```text
Field name
Short description
Preview
Usage
Common props
Schema example
Controlled behavior
Validation
States
Accessibility
Related fields
API Reference
```

## 11.4 Validation

Teach validation through increasing complexity:

1. required string,
2. email,
3. enum/select,
4. numeric coercion,
5. conditional validation,
6. cross-field validation,
7. server-side validation.

### Important explanation

Explicitly distinguish:

```text
Client validation
    ≠
Server validation
```

Explain that client validation improves interaction while the backend remains responsible for authoritative business validation.

## 11.5 Server errors

This deserves a dedicated page.

Explain:

- `mapServerError`,
- `applyServerErrors`,
- field-level errors,
- form-level errors,
- unknown errors,
- focus behavior after submit failure.

Show a realistic API response and how it becomes field errors.

## 11.6 Pending/loading states

Document:

- `isPending`,
- pending submit label,
- disabled controls,
- field skeletons,
- initial loading versus mutation loading.

Use a state matrix:

| State | What users see |
|---|---|
| idle | normal controls |
| validating | inline errors |
| submitting | disabled action + pending copy |
| success | success state / reset behavior |
| server error | field/form errors |
| loading initial data | skeletons |

## 11.7 Multi-section forms

Explain:

- `FormSection`,
- `FormLayout`,
- long-page scrolling,
- sticky actions,
- preserving user context,
- responsive layout.

## 11.8 FieldKit

Explain the state ownership difference clearly.

```text
FormKit
  Form owns values
  Form owns submit lifecycle

FieldKit
  Parent owns values
  Parent receives value changes
  No submit lifecycle required
```

Include:

- controlled mode,
- uncontrolled mode,
- URL-backed filters,
- debounced search where appropriate,
- table integration.

## 11.9 Advanced form recipes

Add recipes for:

- edit form with server-fetched defaults,
- dependent select fields,
- searchable remote options,
- conditional fields,
- nested sections,
- reset after success,
- preserve dirty values,
- server error mapping,
- first-invalid-field focus,
- date conversion,
- numeric inputs without losing leading zeros.

---

# 12. Data Table Documentation Rewrite

The DataTable deserves a complete documentation chapter.

The existing page already covers the basics, but the source exposes a considerably richer system.

## 12.1 Start with the philosophy

Use a short explanation of why a feature-level table kit exists.

The page should explain that DataTable handles the repeated product behavior around a table:

```text
Columns
+ search
+ filters
+ sorting
+ pagination
+ selection
+ actions
+ URL state
+ persistence
+ loading/error/empty states
```

It should also explicitly say what DataTable does **not** own:

- your API,
- your database query,
- your business rules,
- your server authorization,
- your domain-specific cell logic.

## 12.2 Basic table

Start with the smallest possible table:

- typed rows,
- columns,
- data,
- stable row key,
- no URL synchronization.

Then layer features onto it.

## 12.3 Columns

Create a dedicated column guide.

Cover:

- `ColumnDef`,
- accessor columns,
- display columns,
- headers,
- `DataTableColumnHeader`,
- common selection column,
- filter metadata,
- custom cell rendering.

Include examples for:

- text,
- status badges,
- dates,
- numeric values,
- linked values,
- action columns.

## 12.4 Toolbar

Dedicated page.

Explain the toolbar composition model:

```text
Search
Filters
Active filters
Add filter
View options
Custom actions
```

Show both a simple toolbar and a full enterprise toolbar.

## 12.5 Filters

This should be one of the most detailed pages.

Document:

- text search,
- faceted options,
- filter chips,
- add-filter menu,
- column filters,
- filter definitions,
- server-provided options,
- active filter state,
- clearing filters.

Explain why server-provided facet options are often preferable to deriving options from the current page.

## 12.6 Sorting

Show:

- client-side sorting,
- server-driven sorting,
- column header sort controls,
- URL synchronization.

Document how sort state is represented when URL sync is enabled.

## 12.7 Pagination

Separate:

- client-side pagination,
- server-driven pagination.

Show `rowCount` and `pageCount` together and explain which source owns the actual data fetch.

## 12.8 URL synchronization

Make this a complete guide rather than a subsection.

Explain:

```text
Table interaction
      ↓
state change
      ↓
query string
      ↓
router / server refresh
      ↓
new data
```

Cover:

- `DataTableNuqsAdapter`,
- `syncUrl`,
- shallow routing,
- server refresh,
- refresh-safe links,
- browser back/forward,
- embedded tables where URL state should be disabled.

## 12.9 Row selection

Explain:

- per-row selection,
- select-all behavior,
- disabled rows,
- stable `selectionKey`,
- cross-page selection.

## 12.10 Cross-page selection

Dedicated advanced page.

This is a meaningful feature and should not be hidden inside a bulk-actions example.

Show:

```text
Page 1 → select rows
Page 2 → select rows
Page 3 → select rows
           ↓
     selected IDs
           ↓
     bulk operation
```

Explain what the host application should send to the API.

## 12.11 Bulk actions

Cover:

- clear selection,
- CSV export,
- XLSX export,
- destructive actions,
- confirmation dialog integration,
- pending states,
- success/error feedback.

## 12.12 Row actions

Dedicated page for:

- View
- Edit
- Delete
- custom row actions
- destructive confirmation
- disabled/conditional actions.

## 12.13 Expanded rows

Add a new example and documentation page.

Document:

- `expandColumn`,
- expand toggle,
- expand-all behavior,
- `getRowCanExpand`,
- `renderExpanded`.

Show a real use case such as an account row that expands to display recent activity.

## 12.14 Column visibility and view options

The current source has a significant view-options subsystem.

Document:

- visible columns,
- hidden columns,
- persisted preferences,
- reordering where supported,
- drag-and-drop interaction,
- resetting the view,
- `tableId` as a persistence key.

Explain persistence consequences clearly.

## 12.15 Fullscreen

Create a dedicated example for large datasets.

Explain:

- toggle,
- placeholder,
- dialog mode,
- when fullscreen improves productivity,
- accessibility/keyboard behavior.

## 12.16 Loading, empty, and error states

Do not treat these as footnotes.

Create a state page with a matrix:

| State | Trigger | Recommended treatment |
|---|---|---|
| loading | first fetch | skeleton/table loading state |
| fetching | refetch | preserve context + indicate refresh |
| empty | no matching data | empty state + next action |
| error | request failed | actionable error state |
| filtered empty | filters exclude all rows | clear filters CTA |

## 12.17 Server-driven tables

Provide a complete example showing:

- route/search params,
- server-side data fetching,
- DataTable props,
- row count,
- page count,
- sort/filter mapping.

This should be the canonical production recipe.

---

# 13. Layout Documentation Rewrite

Reframe Layout as **application workflow chrome**, not just a bag of navigation components.

### Major concepts

```text
Wayfinding
  Breadcrumbs
  GoBackButton

Page structure
  FormSection
  FormLayout

Application states
  EmptyState

Destructive interactions
  ConfirmationDialog

Utility actions
  Refresh / Docs / Info / Utility buttons
```

### Breadcrumbs page

Document:

- route-derived crumbs,
- custom labels,
- long labels,
- ellipsis behavior,
- tooltips,
- copy-link behavior,
- loading state.

### Navigation page

Document:

- back behavior,
- fallback URLs,
- browser history edge cases,
- loading state.

### Confirmation dialog page

Explain the promise-based interaction model:

```text
await confirm(...)
       ↓
boolean result
       ↓
perform destructive action
```

Add examples for:

- delete,
- archive,
- revoke access,
- unsaved changes.

### Empty states

Distinguish:

- no data,
- no search results,
- no permission,
- setup required.

Provide a recommended copy pattern:

```text
Title
One-sentence explanation
Primary action
Optional secondary action
```

---

# 14. Uploader Documentation Rewrite

The uploader should be positioned as a **workflow**, not merely a file input.

## 14.1 Explain the pipeline

```text
Choose mode
    ↓
Download template
    ↓
Choose file
    ↓
Parse
    ↓
Validate columns
    ↓
Validate rows
    ↓
Validate cross-row rules
    ↓
Submit
    ↓
Import history / redirect
```

This diagram should appear near the beginning.

## 14.2 Basic import

The first example should show:

- config,
- template download,
- file type restriction,
- create mode,
- parsed records,
- submit handler.

## 14.3 Column configuration

Give `UploaderColumn` its own reference page.

Explain:

- `key`,
- `header`,
- `requiredIn`,
- `description`,
- `sample`.

Show create and update differences.

## 14.4 Create vs update

Show why the same spreadsheet can require different fields depending on the selected mode.

Example:

| Column | Create | Update |
|---|---:|---:|
| code | required | required |
| name | required | optional |
| status | optional | optional |

## 14.5 Validation

Document validation at three levels:

```text
1. File validation
2. Column / cell validation
3. Cross-row validation
```

Show realistic row errors containing:

- row number,
- column,
- message.

## 14.6 Records transport vs file transport

This distinction must become explicit.

### Records transport

Use when:

- the client should parse and validate before submission,
- the API expects structured records.

### File transport

Use when:

- the server owns spreadsheet parsing,
- large files should not be fully parsed in the browser,
- the backend expects the original file.

Show both flows side-by-side.

## 14.7 Templates

Document `downloadUploaderTemplate` and explain why downloadable templates reduce header/data mismatch.

Show:

- header generation,
- sample values,
- required columns,
- filename conventions.

## 14.8 Import history

Document `historyHref` and `buildSuccessRedirectHref` as a complete workflow.

Example:

```text
Import
  ↓
API creates import job
  ↓
redirect to Import History
  ↓
filter history by filename / format
```

## 14.9 Dynamic formats

Create an example for:

- format loaders,
- dynamic format options,
- backend-defined formats.

## 14.10 Large-file guidance

Explain the browser parsing tradeoff without exaggeration.

The docs should teach the architecture decision:

```text
small / interactive import
    → client parse

large / server-controlled import
    → raw file transport
```

---

# 15. Examples Rewrite Strategy

Examples should become a major navigation surface rather than a collection of small demo wrappers.

## 15.1 Example page standard

Every example page should contain:

```text
Title
One-sentence purpose
Preview
Code
How it works
Common customization
Related examples
```

Optional sections:

- API notes,
- accessibility notes,
- server/client notes,
- edge cases.

## 15.2 Example page anatomy

Recommended MDX pattern:

```mdx
---
title: DataTable with URL sync
description: Keep filters, sorting, search, and pagination in the URL.
---

<ExampleIntro />

<ComponentPreview
  code={`...complete copyable code...`}>
  <TableUrlSyncExample />
</ComponentPreview>

## How it works

...

## Customize it

...

## Related

...
```

## 15.3 Proposed example inventory

### Forms

Create these examples:

1. Basic form
2. All field types
3. FieldKit filters
4. Validation
5. Server validation errors
6. Loading form
7. Pending submit
8. Multi-section form
9. Choice-card form
10. Searchable select
11. Searchable multi-select
12. Date range form
13. Dependent fields
14. Reset-on-success
15. Controlled field surface
16. Advanced form workflow

### Data tables

Create these examples:

1. Basic table
2. Custom cells
3. Sortable columns
4. Search
5. Faceted filters
6. Active filter chips
7. Add-filter menu
8. Pagination
9. Server pagination
10. URL sync
11. Row selection
12. Cross-page selection
13. Bulk actions
14. CSV export
15. XLSX export
16. Row actions
17. Delete confirmation
18. Expanded rows
19. Expand all
20. Column visibility
21. Persisted view options
22. Fullscreen
23. Loading
24. Empty
25. Filtered empty
26. Error state
27. Full production listing

### Layout

1. Breadcrumbs
2. Breadcrumbs with long labels
3. Back navigation
4. Form sections
5. Long form layout
6. Empty state
7. Confirmation dialog
8. Utility buttons
9. Full page shell composition

### Uploader

1. Basic import
2. Create mode
3. Update mode
4. Template download
5. Validation errors
6. Cross-row validation
7. Parsed records transport
8. Raw file transport
9. Dynamic format selection
10. Import history redirect
11. Full production import flow

---

# 16. Full Workflow Examples

Add a section that combines multiple kits into realistic product screens.

These examples are especially valuable because Feature Kit is about workflow composition.

### Workflow 1: User management

```text
Breadcrumbs
FormSection
FormKit
DataTable
RowActions
ConfirmationDialog
```

### Workflow 2: Account management

```text
DataTable
Filters
URL sync
Bulk export
Row actions
Expanded details
```

### Workflow 3: Spreadsheet onboarding

```text
EmptyState
Uploader
Validation
Import History
```

### Workflow 4: Settings page

```text
GoBackButton
Breadcrumbs
FormLayout
FormKit
Pending submit
Server errors
```

These should be treated as **reference implementations**, not merely visual demos.

---

# 17. API Reference Strategy

Current API props tables should become more systematic.

## 17.1 Every API reference should answer

- What is this API?
- What does it own?
- What are the required props?
- What are the defaults?
- What are common combinations?
- What types are exported?
- What subpath can it be imported from?
- Does it require a provider?
- Is it client-only?

## 17.2 Standard API table

Use this column structure:

| Prop | Type | Default | Description |
|---|---|---|---|

Do not omit defaults when they exist.

## 17.3 Group complex props

Instead of one giant prop table, use sections:

```text
Core props
State props
Rendering props
Data props
Integration props
Accessibility props
Advanced props
```

## 17.4 Document exports separately

Add an exports table:

| Export | Import | Purpose |
|---|---|---|

Example:

```text
import { DataTable } from "data-table"
import { useCrossPageSelection } from "data-table"
```

Use actual package exports as the authority.

## 17.5 Do not expose internals by accident

The docs should distinguish:

```text
Public API
Public subpath
Internal file
Implementation helper
```

Only the first three belong in consumer documentation when intentionally exposed.

---

# 18. Documentation UX Improvements

The content rewrite should be accompanied by improvements to the reading experience.

## 18.1 Preview/code tabs

Every meaningful example should allow:

```text
Preview | Code
```

Keep code copyable.

## 18.2 Installation tabs

Where installation differs, use tabs:

```text
pnpm
npm
yarn
bun
```

Only include a tab when that package manager is actually supported.

For monorepo-specific usage, use dedicated tabs or sections rather than pretending every environment has the same installation flow.

## 18.3 On-page navigation

Major pages should expose their internal structure:

```text
On this page
- Overview
- Installation
- Usage
- Examples
- API
- Troubleshooting
```

## 18.4 Previous / next navigation

Every documentation page should end with sensible navigation.

## 18.5 Copy controls

Provide one-click copy for:

- install command,
- import statement,
- code examples.

## 18.6 Deep links

All meaningful headings should support anchor links.

## 18.7 Source links

Where appropriate, add:

```text
View source
Open example
```

The goal is to move easily from documentation to real implementation.

## 18.8 Responsive examples

Large tables should not force every example page into a horizontally cramped mobile layout.

Use appropriate full-width preview modes for table examples.

---

# 19. Search and Discovery

The documentation should make a developer's second attempt at finding something easier than the first.

### Search index should include

- component names,
- package names,
- prop names,
- function names,
- concepts,
- example titles,
- common problem phrases.

For example, searching for:

```text
URL params
```

should find:

- DataTable URL sync,
- `useTableUrlSync`,
- `syncUrl`,
- server refresh.

Searching:

```text
server validation
```

should find:

- FormKit server errors,
- `applyServerErrors`,
- validation examples.

---

# 20. AI / LLM-Ready Documentation

Take inspiration from the direction of modern open-code documentation, but make it Feature Kit-specific.

The documentation should be easy for coding agents to consume.

## Required properties

- predictable headings,
- stable terminology,
- complete code examples,
- no API ambiguity,
- explicit import paths,
- explicit client/server boundaries,
- explicit defaults,
- raw Markdown availability,
- source links,
- structured frontmatter,
- concise descriptions.

## Add an LLM guidance page

Create a short `ai.mdx` or `llms.mdx` reference page explaining:

- how to interpret the docs,
- where public APIs are defined,
- how examples map to packages,
- how to avoid using internal files,
- and how to compose Feature Kit components.

Do not turn the entire documentation into prompts. Keep normal human documentation primary and make the structure machine-readable as a side effect of good documentation design.

---

# 21. Accessibility Documentation

Each major kit should have a small accessibility section.

### Form

Cover:

- labels,
- required state,
- descriptions,
- error messages,
- keyboard navigation,
- focus behavior.

### Data table

Cover:

- keyboard interaction,
- row/checkbox labels,
- action menu semantics,
- expanded rows,
- focus when filters/dialogs open.

### Layout

Cover:

- button labels,
- tooltip dependence,
- dialog focus behavior.

### Uploader

Cover:

- file input labels,
- validation feedback,
- error announcement,
- keyboard access.

The goal is not to write a generic accessibility essay. Document the accessibility behavior developers need to preserve when composing or extending the kit.

---

# 22. Client / Server Documentation

Feature Kit is closely tied to React/Next.js application architecture, so every relevant page should identify execution boundaries.

Use a visible convention:

```text
Client component
Server component
Client + server composition
```

### Form

Call out client-only requirements.

### DataTable

Explain where:

- server fetching happens,
- client interaction happens,
- URL state lives,
- RSC refresh happens.

### Uploader

Explain client parsing versus raw file transport.

### Layout

Mark hooks/providers/components requiring client execution.

---

# 23. Gotchas → Troubleshooting Rewrite

Keep a concise "Gotchas" section on each page, but add a global troubleshooting guide.

### Suggested troubleshooting categories

```text
Installation
Module resolution
Next.js / transpilePackages
Providers
Client/server errors
URL synchronization
i18n
Styling
Table state
File parsing
TypeScript errors
```

### Example troubleshooting format

```text
## DataTable URL sync throws

### Symptom
...

### Cause
...

### Fix
...

### Verify
...
```

This format is significantly more useful than a list of disconnected warnings.

---

# 24. Versioning and Changelog

The changelog should stay concise, but documentation changes should explain behavior changes that affect users.

For each release:

```text
Added
Changed
Fixed
Breaking changes
Documentation
```

For breaking changes, include:

- old usage,
- new usage,
- migration steps.

Do not make developers reverse-engineer a migration from a commit message.

---

# 25. Contributing Documentation

Add a small contributor section.

### Include

- repository structure,
- local development,
- how to add a feature package,
- how to add a docs page,
- how to add an example,
- how to update API documentation,
- type checks,
- linting,
- tests,
- documentation validation.

### Documentation contribution rule

Every new feature should ship with:

```text
Source
Example
Usage documentation
API documentation
Relevant edge case / gotcha
```

This should become part of the project's definition of done.

---

# 26. Proposed File Structure

A practical target structure is:

```text
apps/web/content/docs/
├── index.mdx
├── getting-started.mdx
├── architecture.mdx
├── installation.mdx
├── providers.mdx
├── theming.mdx
├── ui.mdx
├── troubleshooting.mdx
├── contributing.mdx
├── changelog.mdx
│
├── form/
│   ├── index.mdx
│   ├── basic.mdx
│   ├── fields.mdx
│   ├── validation.mdx
│   ├── server-errors.mdx
│   ├── loading.mdx
│   ├── layout.mdx
│   ├── field-kit.mdx
│   ├── advanced.mdx
│   └── api.mdx
│
├── data-table/
│   ├── index.mdx
│   ├── basic.mdx
│   ├── columns.mdx
│   ├── toolbar.mdx
│   ├── filters.mdx
│   ├── sorting.mdx
│   ├── pagination.mdx
│   ├── url-sync.mdx
│   ├── selection.mdx
│   ├── bulk-actions.mdx
│   ├── row-actions.mdx
│   ├── expanded-rows.mdx
│   ├── view-options.mdx
│   ├── fullscreen.mdx
│   ├── loading-empty-error.mdx
│   ├── server-data.mdx
│   ├── advanced.mdx
│   └── api.mdx
│
├── layout/
│   ├── index.mdx
│   ├── breadcrumbs.mdx
│   ├── navigation.mdx
│   ├── forms.mdx
│   ├── empty-states.mdx
│   ├── confirmation.mdx
│   ├── utility-actions.mdx
│   └── api.mdx
│
├── uploader/
│   ├── index.mdx
│   ├── basic.mdx
│   ├── columns.mdx
│   ├── modes.mdx
│   ├── validation.mdx
│   ├── transports.mdx
│   ├── templates.mdx
│   ├── history.mdx
│   ├── formats.mdx
│   └── api.mdx
│
└── examples/
    ├── index.mdx
    ├── form/
    ├── table/
    ├── layout/
    ├── uploader/
    └── workflows/
```

### Important implementation note

Do not create dozens of pages merely for navigation. Split a page only when one of these is true:

- the concept is independently useful,
- the page would become difficult to scan,
- it deserves its own search result,
- it has multiple examples,
- or it has a distinct troubleshooting story.

---

# 27. Current → Target Content Mapping

| Current file/page | Target | Action |
|---|---|---|
| `index.mdx` | `index.mdx` | Rewrite positioning and learning path |
| `getting-started.mdx` | `getting-started.mdx` | Rewrite installation and verification |
| `form.mdx` | `form/index.mdx` + child pages | Split into concept + focused guides |
| `data-table.mdx` | `data-table/index.mdx` + child pages | Split into workflow topics |
| `layout.mdx` | `layout/index.mdx` + child pages | Split by workflow concern |
| `uploader.mdx` | `uploader/index.mdx` + child pages | Expand workflow model |
| `ui.mdx` | `ui.mdx` | Rewrite as foundation/theming guide |
| `changelog.mdx` | `changelog.mdx` | Keep, improve release structure |
| `examples/index.mdx` | `examples/index.mdx` | Make it a curated learning hub |
| current example wrappers | richer example pages | Add explanation + source + customization |
| root `meta.json` | updated hierarchy | Reorganize navigation |
| example `meta.json` files | updated examples | Rename/order pages by learning progression |

---

# 28. Example Source Quality Rules

Every example should pass these rules before publishing.

### Copy-paste test

A developer should be able to copy the code without discovering missing imports or hidden prerequisites.

### Context test

The example must explain:

- what data shape it expects,
- whether it is client-side,
- what provider is required,
- whether state is local or server-driven.

### Realism test

Use a credible product scenario.

### Complexity test

One example should demonstrate one concept well. Do not turn every example into a giant dashboard.

### Regression test

Examples should be treated as live regression fixtures. When source APIs change, update the example at the same time.

---

# 29. Content Component Improvements

Create reusable documentation components to avoid repeated MDX formatting.

Recommended components:

```text
<ExampleIntro />
<ComponentPreview />
<InstallationTabs />
<ImportBlock />
<Requirements />
<ProviderRequirement />
<SourceLink />
<APIReference />
<PropsTable />
<Recipe />
<Callout />
<Warning />
<GoodBad />
<NextSteps />
```

### `Recipe` component

Could standardize production patterns:

```mdx
<Recipe
  title="Server-driven pagination"
  problem="Your API returns one page at a time."
  recommendation="Use manual pagination with rowCount and pageCount."
/>
```

The exact component API should follow the existing docs implementation conventions rather than introducing a large new abstraction prematurely.

---

# 30. API Documentation Generation

The long-term goal should be reducing manually duplicated API tables.

### Recommended approach

Use TypeScript source as the authority and generate or partially generate:

- export lists,
- prop tables,
- type summaries.

Then keep manually authored descriptions and usage guidance in MDX.

Conceptually:

```text
TypeScript source
      ↓
API metadata
      ↓
Docs components
      ↓
Reference page
```

This reduces drift while preserving the explanatory value of human-written documentation.

---

# 31. Documentation Metadata

Standardize frontmatter.

Recommended fields:

```yaml
---
title: Data table URL synchronization
description: Keep DataTable state in the URL for refresh-safe, shareable listings.
---
```

Potential optional fields:

```yaml
package: data-table
category: data-table
status: stable
client: true
providers:
  - DataTableNuqsAdapter
```

Only add metadata that the docs application can actually consume. Do not create decorative metadata with no functional use.

---

# 32. SEO / Searchable Descriptions

Descriptions should be useful both for search engines and developers.

Bad:

> Learn about tables.

Better:

> Add sorting, filtering, pagination, row selection, bulk actions, and URL state to TanStack Table listings.

Use specific technical terms developers search for.

---

# 33. Documentation Page Template

Every major page should begin from a consistent template.

```mdx
---
title: ...
description: ...
---

One-paragraph definition.

## Use this when

Decision guidance.

## Installation

Dependencies and provider requirements.

## Usage

Minimal working example.

## How it works

Mental model / state ownership.

## Examples

Focused examples.

## Common patterns

Production recipes.

## API Reference

Props / exports / types.

## Accessibility

Relevant behavior.

## Troubleshooting

Common problems.

## Related

Next logical docs.
```

Not every page needs every heading, but the structure should be predictable.

---

# 34. Recommended Form Page Template

```text
Form

What it solves
Choose FormKit or FieldKit

Installation

Basic usage

Fields
Validation
Submission lifecycle
Server errors
Loading states
Multi-section layouts
Advanced recipes

API Reference

Accessibility

Troubleshooting

Examples
```

---

# 35. Recommended DataTable Page Template

```text
Data table

What it solves
What it owns / does not own

Installation

Basic table

Columns
Toolbar
Search
Filters
Sorting
Pagination
URL synchronization
Selection
Bulk actions
Row actions
Expanded rows
View options
Fullscreen
Loading / empty / error
Server-driven data

API Reference

Accessibility

Troubleshooting

Examples
```

---

# 36. Recommended Uploader Page Template

```text
Uploader

What it solves
Import pipeline

Installation

Basic import

Templates
Columns
Create / update modes
Validation
Cross-row validation
Records transport
File transport
Format selection
Import history
Redirects

API Reference

Accessibility

Troubleshooting

Examples
```

---

# 37. Recommended Layout Page Template

```text
Layout

What it solves

Installation

Navigation
Breadcrumbs
Back button
Form layout
Empty states
Confirmation dialogs
Utility actions

API Reference

Accessibility

Troubleshooting

Examples
```

---

# 38. Documentation Cross-Linking Strategy

Every page should recommend the next logical concept.

Examples:

```text
FormKit
→ Field types
→ Validation
→ Server errors
→ Form layout
```

```text
DataTable
→ Filters
→ URL sync
→ Server data
→ Bulk actions
```

```text
Uploader
→ Templates
→ Validation
→ Transport
→ Import history
```

Avoid generic "see also" lists. Link based on actual task progression.

---

# 39. Reference Mapping to shadcn Documentation Patterns

The rewrite should explicitly study these shadcn patterns while remaining original in wording and product scope.

### Introduction

Reference the shadcn introduction's focus on explaining the philosophy before dumping implementation details.

Apply that idea to Feature Kit with its own philosophy:

```text
Feature Kit is workflow-level composition.
UI is primitive-level composition.
Applications own business behavior.
```

### Component pages

Reference the shadcn component page progression:

```text
Short description
Preview
Code
Installation
Usage
Focused examples
API / notes
```

Apply this to each Feature Kit capability.

### Forms

Reference shadcn's approach of teaching forms through schemas, field composition, validation, and multiple field examples.

Feature Kit should go further on:

- FormKit,
- FieldKit,
- server errors,
- pending states,
- application integration.

### Data table

Reference the shadcn data-table approach of progressive complexity:

```text
basic
→ pagination
→ sorting
→ filtering
→ visibility
→ selection
→ reusable patterns
```

Feature Kit should extend the same progression with:

- URL state,
- cross-page selection,
- bulk actions,
- row actions,
- expanded rows,
- fullscreen,
- server-driven data.

### Theming

Reference shadcn's semantic-token model rather than documenting only raw CSS values.

### Blocks / examples

Reference shadcn's emphasis on copyable examples and task-focused blocks.

Feature Kit should use this pattern for **workflow examples** instead of generic UI blocks.

---

# 40. Content QA Checklist

Before publishing a page, verify:

### Accuracy

- [ ] Component/export name matches source
- [ ] Import path matches package exports
- [ ] Props are spelled correctly
- [ ] Defaults are accurate
- [ ] Type signatures are accurate
- [ ] Provider requirements are accurate
- [ ] Client/server requirement is accurate

### Examples

- [ ] Example compiles
- [ ] Example is runnable in the docs site
- [ ] Imports are complete
- [ ] Variables are defined
- [ ] The preview matches the code
- [ ] Example has a real use case
- [ ] Edge cases are explained

### Writing

- [ ] Opening description explains the purpose
- [ ] "Use this when" guidance exists
- [ ] No unnecessary marketing copy
- [ ] Paragraphs are concise
- [ ] Terminology is consistent
- [ ] No unexplained internal paths

### UX

- [ ] Installation is easy to find
- [ ] Code can be copied
- [ ] Preview is visible before deep reference
- [ ] Links point to useful next steps
- [ ] Page works well on mobile

---

# 41. Regression / Build QA

The documentation should be part of the project's engineering quality bar.

Run:

```bash
pnpm check-types
pnpm lint
pnpm build
```

In addition, add a documentation verification step that checks:

- every docs link resolves,
- every example component exists,
- every documented package import exists,
- every example can compile,
- every page has required frontmatter.

Long term, docs CI should fail when an example references a removed export.

---

# 42. Implementation Phases

## Phase 0 — Documentation foundation

**Priority: P0**

Tasks:

- finalize positioning,
- finalize terminology,
- define page template,
- define example template,
- define metadata conventions,
- define navigation hierarchy,
- remove duplicated/manual API assumptions.

Deliverable:

A stable documentation system before rewriting every page.

## Phase 1 — Core entry experience

**Priority: P0**

Rewrite:

- Introduction
- Getting Started
- Architecture
- Installation
- Providers
- UI / Theming

Deliverable:

A new user can understand the project and run a first example without reading a package reference.

## Phase 2 — Form

**Priority: P0**

Rewrite Form docs and build the full field/example matrix.

Deliverable:

Form becomes the reference-quality model page for the rest of the documentation.

## Phase 3 — DataTable

**Priority: P0**

Split the monolithic DataTable documentation into focused pages.

Deliverable:

A developer can build a production listing without needing to inspect source files.

## Phase 4 — Uploader

**Priority: P1**

Document the complete import pipeline and both transport modes.

## Phase 5 — Layout

**Priority: P1**

Turn layout components into practical workflow documentation.

## Phase 6 — Examples and workflows

**Priority: P0**

Expand thin preview wrappers into instructional examples.

Build full workflow examples.

## Phase 7 — Reference automation

**Priority: P1**

Reduce API drift using source-derived metadata where practical.

## Phase 8 — Search / AI / polish

**Priority: P2**

Add:

- improved search indexing,
- raw Markdown / machine-readable content,
- source links,
- contributor docs,
- deeper troubleshooting.

---

# 43. Recommended First 10 Pages to Rewrite

For maximum impact, rewrite these first:

1. `docs` / Introduction
2. `getting-started`
3. `architecture`
4. `form`
5. `form/field-types`
6. `form/server-errors`
7. `data-table`
8. `data-table/filters`
9. `data-table/url-sync`
10. `uploader`

These establish the documentation voice and cover the highest-value workflows.

---

# 44. What the Finished Documentation Should Feel Like

A developer arriving from a search result should experience this sequence:

```text
I know what this feature does.
        ↓
I know whether it fits my screen.
        ↓
I can see it working.
        ↓
I can copy the smallest useful example.
        ↓
I know what provider/configuration I need.
        ↓
I can find the production recipe I need.
        ↓
I can inspect the full API without leaving the page.
        ↓
I know what happens in loading/error/empty states.
        ↓
I can combine it with another Feature Kit capability.
```

That should be the standard for every major page.

---

# 45. Definition of Done

The documentation rewrite is complete when:

- [ ] Introduction clearly explains the purpose and architecture.
- [ ] Getting Started works for a fresh clone.
- [ ] Every primary kit has a clear mental model.
- [ ] Every primary kit has a minimal working example.
- [ ] Every significant feature has a focused example.
- [ ] API references match actual exports and types.
- [ ] Client/server boundaries are documented.
- [ ] Providers are documented with reasons, not just code.
- [ ] Form docs cover every supported field type.
- [ ] Form docs cover validation and server errors.
- [ ] DataTable docs cover filters, sorting, paging, URL state, selection, actions, expansion, persistence, fullscreen, and server data.
- [ ] Layout docs cover navigation, sections, empty states, confirmations, and utility controls.
- [ ] Uploader docs cover templates, validation, modes, both transport strategies, and history/redirect workflows.
- [ ] Examples contain copyable source and explanatory context.
- [ ] Full workflow examples demonstrate composition across kits.
- [ ] Troubleshooting exists for common installation/runtime problems.
- [ ] Changelog documents meaningful user-facing changes.
- [ ] Documentation links are validated in CI.
- [ ] Example code is validated in CI where practical.
- [ ] Documentation can be consumed easily by humans and coding agents.
- [ ] The language is original to Feature Kit and does not reproduce shadcn copy.

---

# 46. Final Direction

The main change is not "write more documentation."

The change is to move Feature Kit documentation from:

```text
package reference
```

toward:

```text
workflow documentation + source examples + API reference
```

The documentation should show the **progression from primitive to feature to application workflow**.

Shadcn is the strongest reference for the presentation model because its docs make the source, preview, installation, usage, examples, and composition model easy to follow. Feature Kit should adopt those strengths while making the content specifically about its own feature-level abstractions and production admin workflows.

The final docs should be useful to a developer who has never seen the repository and still be precise enough for an experienced maintainer to use as the canonical reference for the codebase.

---

# 47. Reference Sources Used for This Plan

## Feature Kit

- Feature Kit documentation: `https://feature-kits.vercel.app/docs`
- Feature Kit getting started: `https://feature-kits.vercel.app/docs/getting-started`
- Feature Kit form docs: `https://feature-kits.vercel.app/docs/form`
- Feature Kit data table docs: `https://feature-kits.vercel.app/docs/data-table`
- Feature Kit layout docs: `https://feature-kits.vercel.app/docs/layout`
- Feature Kit uploader docs: `https://feature-kits.vercel.app/docs/uploader`
- Feature Kit examples: `https://feature-kits.vercel.app/docs/examples`
- Feature Kit repository: `https://github.com/jayantrohila57/feature-kit`

## shadcn/ui

- Introduction: `https://ui.shadcn.com/docs`
- Installation: `https://ui.shadcn.com/docs/installation`
- Components: `https://ui.shadcn.com/docs/components`
- Button: `https://ui.shadcn.com/docs/components/button`
- Field: `https://ui.shadcn.com/docs/components/field`
- Forms: `https://ui.shadcn.com/docs/forms`
- Data Table: `https://ui.shadcn.com/docs/components/data-table`
- Theming: `https://ui.shadcn.com/docs/theming`
- Dark Mode: `https://ui.shadcn.com/docs/dark-mode`
- Blocks: `https://ui.shadcn.com/blocks`

---

# 48. One-Sentence North Star

> **Every Feature Kit page should teach a developer how to make a real product screen, not just tell them what a component's props are.**
