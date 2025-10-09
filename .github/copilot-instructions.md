# Command Clipboard - GitHub Copilot Instructions

## Project Overview

Command Clipboard is a web application for organizing and copying CLI commands with placeholder support. Built with Vite + React + TailwindCSS + Supabase.

## Tech Stack

- **Frontend**: Vite, React 19, TailwindCSS v4
- **Backend**: Supabase (Auth + Postgres)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build**: Vite
- **Deployment**: Vercel

## Project Status

✅ **Setup Complete** - All components created and configured
✅ **Build Successful** - Production build tested and working
✅ **Dev Server Running** - http://localhost:5174

## Key Components

- `AuthPage.jsx` - Authentication (login/signup)
- `Dashboard.jsx` - Main application interface
- `GroupTree.jsx` - Recursive nested groups
- `CommandCard.jsx` - Command display with copy
- `CommandEditorModal.jsx` - Add/edit commands
- `Header.jsx` - Navigation and logout

## Important Notes

### TailwindCSS v4

- Uses `@import "tailwindcss";` instead of `@tailwind` directives
- PostCSS plugin: `@tailwindcss/postcss`
- No `tailwind.config.js` needed for basic setup

### Supabase Setup Required

Users must:

1. Create Supabase account
2. Set up `.env` with credentials
3. Run SQL scripts to create tables and RLS policies

### Database Schema

- `groups` - Command groups with hierarchical structure
- `commands` - CLI commands linked to groups
- RLS policies ensure users see only their own data

## Development Commands

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

- Configured for Vercel via `vercel.json`
- GitHub Actions workflow for CI/CD
- Environment variables needed in production

## Code Style

- Use functional components with hooks
- ESLint enforced
- Prefer arrow functions
- Use TailwindCSS utility classes
- Keep components modular and reusable
