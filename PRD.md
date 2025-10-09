# Command Clipboard — PRD

## Overview

Command Clipboard is a lightweight web app designed to help developers organize, store, and quickly copy frequently used CLI commands — especially for Salesforce CLI workflows.

Users can create command groups (e.g., Salesforce → Project → Commands), save commands with placeholders, and easily copy full commands or parts of them up to the next placeholder.

## 🎯 Goals

- Provide a structured repository for frequently used CLI commands
- Enable quick copying of entire commands or portions up to placeholders
- Allow grouping and nesting of commands by category
- Persist all data securely via Supabase with auth & storage
- Keep UX simple, fast, and intuitive with a clean Tailwind UI

## 🧱 Tech Stack

| Layer           | Tech                                                  |
| --------------- | ----------------------------------------------------- |
| Frontend        | Vite + React + TailwindCSS                            |
| Backend         | Supabase (Auth + Postgres DB + API)                   |
| Hosting         | Vercel                                                |
| Auth            | Supabase Auth (email/password, GitHub login optional) |
| Version Control | GitHub                                                |

## 🧑‍💻 User Stories

### 1. Authentication

- As a user, I can sign up / log in using email and password
- As a user, I can log out securely
- As a user, I can see only my own command groups and commands

### 2. Command Groups

- As a user, I can create command groups (e.g., "Salesforce", "Git", "Docker")
- As a user, I can create subgroups (e.g., Salesforce → Project)
- As a user, I can rename or delete groups

### 3. Command Management

- As a user, I can add a command with:
  - A title (e.g., "Retrieve GlobalValueSet")
  - A command string (e.g., `sf project retrieve start -o <org> -m GlobalValueSet`)
  - Tags or placeholders (e.g., `<org>`, `<object>`)
- As a user, I can edit and delete commands
- As a user, I can search commands by name or tag

### 4. Copying Features

As a user, I can:

- Copy the entire command with one click
- Copy command segments up to the next placeholder (for partially filling in parameters)
- Optionally replace placeholders with user-provided values before copying

### 5. UX / UI

- Commands and groups should be displayed in a nested accordion view
- Each command card includes:
  - Command title
  - Command preview (monospace)
  - Buttons: Copy, Edit, Delete
- Highlight placeholders visually (e.g., different color for `<placeholder>`)
- Use Tailwind's light neutral theme

## 🗃️ Database Schema (Supabase)

### Tables

**users**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (Supabase Auth UID) |
| email | text | User email |

**groups**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References users.id |
| name | text | Group name |
| parent_id | uuid | Optional reference to another groups.id (for nesting) |
| created_at | timestamp | Default now() |

**commands**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| group_id | uuid | References groups.id |
| title | text | Command title |
| command_text | text | Full CLI command |
| created_at | timestamp | Default now() |

## ⚙️ Core Components

| Component          | Purpose                                                     |
| ------------------ | ----------------------------------------------------------- |
| AuthPage           | Handles login/signup with Supabase Auth                     |
| Dashboard          | Displays groups and commands after login                    |
| GroupTree          | Recursive component to show nested groups                   |
| CommandCard        | Displays individual command with copy/edit/delete actions   |
| CommandEditorModal | Modal for adding/editing commands                           |
| CopyMenu           | Provides copy options: full / partial / placeholder replace |
| Header             | App title + logout button                                   |
| SupabaseClient     | Centralized client connection for DB and Auth               |

## 🧠 Feature Details

### Placeholder Detection

- Regex pattern: `/\<[^>]+\>/g`
- Highlight placeholders in UI (e.g., `<org>`, `<object>`)
- When copying:
  - "Copy until next placeholder" → substring from start → next `<…>` occurrence
  - Optional modal for filling placeholders

### Copy Flow

- Uses the browser clipboard API
- Visual feedback: "✅ Copied!" toast (via Tailwind + Framer Motion)

## 🚀 Future Enhancements (Phase 2)

- Command import/export as JSON or CSV
- Team sharing & collaboration
- Tags and filters (CLI, category, language)
- Chrome extension for quick access

## 🧭 MVP Scope

### ✅ Must have:

- Auth (login/signup)
- CRUD for groups and commands
- Nested group structure
- Copy full/partial commands
- Responsive UI (mobile + desktop)

### ❌ Won't have (yet):

- Team sharing
- Placeholder variable injection prompts
- CLI integration

## 🧩 GitHub Setup

- `main` → production
- `dev` → development
- PR checks via GitHub Actions (lint + build)
- Deployment: Vercel or GitHub Pages (via Actions)

## 🧪 Example Command Tree

```
Salesforce
 ├─ Project
 │   ├─ Retrieve GlobalValueSet
 │   └─ Deploy Changes
 └─ Org
     ├─ Create Scratch Org
     ├─ Authorize DevHub
     └─ Delete Org
```

Each command entry:

- **Title**: Retrieve GlobalValueSet
- **Command**: `sf project retrieve start -o <org> -m GlobalValueSet`
