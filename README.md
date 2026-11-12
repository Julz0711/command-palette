# Command Clipboard

A personal command library for developers: organize frequently used CLI commands, find them quickly, and copy exactly the part you need.

Designed around workflows such as Salesforce CLI, Git, and npm, with nested groups and highlighted placeholders.

[Features](#features) · [Quick start](#quick-start) · [Usage](#usage) · [Development](#development)

## Features

- **Nested groups:** organize commands by tool, project, or task.
- **Search:** filter commands by title or command text.
- **Flexible copying:** copy a full command or individual segments, including `<placeholders>`.
- **Drag and drop:** move commands between groups.
- **Personal accounts:** sign in with email/password or GitHub OAuth through Supabase.
- **Starter content:** new accounts receive Salesforce, Git, and npm groups with example commands.

Built with React, Vite, Tailwind CSS, Lucide icons, and Supabase Auth/Postgres. Database access is controlled by the row-level security policies in the setup SQL.

## Quick start

Use Node.js 22.12+ and npm, plus a Supabase project.

```sh
git clone https://github.com/Julz0711/command-palette.git
cd command-palette
npm ci
```

1. Run [supabase-setup.sql](supabase-setup.sql) in your Supabase SQL Editor to create the tables and policies.
2. Create `.env.local` with your project URL and public anon key:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```

3. Configure Supabase Auth's site and redirect URLs for your local app. To enable GitHub login, follow [GITHUB-OAUTH-SETUP.md](GITHUB-OAUTH-SETUP.md).
4. Start the app:

   ```sh
   npm run dev
   ```

Open the URL printed by Vite, normally [localhost:5173](http://localhost:5173). Use a public anon key in the frontend; keep Supabase service-role keys out of browser configuration.

## Usage

1. Sign up or sign in.
2. Create a group or subgroup, or use one of the starter groups.
3. Add a title and command, for example:

   ```sh
   sf project retrieve start -o <org> -m GlobalValueSet
   ```

4. Use the copy button for the full command, or click a segment to copy it.
5. Search, edit, or drag commands into another group as your library grows.

Commands are stored and copied as text. Replace placeholders before running a copied command in your terminal.

## Development

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite. |
| `npm run build` | Create the production build. |
| `npm run preview` | Preview the build locally. |
| `npm run lint` | Run ESLint. |

## Code map

| Path | Responsibility |
| --- | --- |
| [src/components/Dashboard.jsx](src/components/Dashboard.jsx) | Load, search, create, edit, and move commands and groups. |
| [src/components/GroupTree.jsx](src/components/GroupTree.jsx) | Nested group navigation. |
| [src/components/CommandCard.jsx](src/components/CommandCard.jsx) | Command display and copy interactions. |
| [src/components/AuthPage.jsx](src/components/AuthPage.jsx) | Account flows. |
| [src/lib/supabaseClient.js](src/lib/supabaseClient.js) | Supabase connection. |
| [supabase-setup.sql](supabase-setup.sql) | Schema and row-level security. |

See [SETUP.md](SETUP.md) for additional setup notes and [TESTING.md](TESTING.md) for manual verification guidance.

## Deployment

Build with `npm run build` and deploy `dist/` to a static host. Set both `VITE_SUPABASE_*` variables at build time, configure an SPA fallback, and add the deployed URL to Supabase Auth's allowed redirects. A Vercel configuration is included in [vercel.json](vercel.json).

## License

MIT.
