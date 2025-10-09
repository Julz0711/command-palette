# Command Clipboard 🧩

A lightweight web app designed to help developers organize, store, and quickly copy frequently used CLI commands — especially for Salesforce CLI workflows.

## 🎯 Features

- **Organized Command Groups**: Create hierarchical groups and subgroups (e.g., Salesforce → Project → Commands)
- **Placeholder Support**: Use `<placeholder>` syntax for variables in commands
- **Smart Copying**: Copy entire commands or click individual segments to copy
- **Drag & Drop**: Move commands between groups with visual feedback
- **Multiple Auth Methods**: Sign in with email/password OR GitHub OAuth
- **Default Groups**: Auto-created Salesforce, Git, NPM groups for new users
- **Secure Storage**: All data persisted via Supabase with Row Level Security
- **Dark Theme**: Modern dark UI with purple accents
- **Clean UI**: Built with TailwindCSS for a fast, intuitive experience

## 🧱 Tech Stack

- **Frontend**: Vite + React + TailwindCSS
- **Backend**: Supabase (Auth + Postgres DB)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Hosting**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- A Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd command-palette
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy your Project URL and anon/public key

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:

   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. **Set up database tables**

   Run the SQL from `supabase-setup.sql` in your Supabase SQL Editor to create tables and policies.

6. **(Optional) Set up GitHub OAuth**

   See [GITHUB-OAUTH-SETUP.md](./GITHUB-OAUTH-SETUP.md) for detailed instructions on enabling GitHub authentication.

7. **Start the development server**

   ```sql
   -- Create groups table
   CREATE TABLE groups (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     parent_id UUID REFERENCES groups(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create commands table
   CREATE TABLE commands (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     command_text TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
   ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

   -- Create policies for groups
   CREATE POLICY "Users can view their own groups"
     ON groups FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own groups"
     ON groups FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own groups"
     ON groups FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own groups"
     ON groups FOR DELETE
     USING (auth.uid() = user_id);

   -- Create policies for commands
   CREATE POLICY "Users can view commands in their groups"
     ON commands FOR SELECT
     USING (EXISTS (
       SELECT 1 FROM groups
       WHERE groups.id = commands.group_id
       AND groups.user_id = auth.uid()
     ));

   CREATE POLICY "Users can insert commands in their groups"
     ON commands FOR INSERT
     WITH CHECK (EXISTS (
       SELECT 1 FROM groups
       WHERE groups.id = commands.group_id
       AND groups.user_id = auth.uid()
     ));

   CREATE POLICY "Users can update commands in their groups"
     ON commands FOR UPDATE
     USING (EXISTS (
       SELECT 1 FROM groups
       WHERE groups.id = commands.group_id
       AND groups.user_id = auth.uid()
     ));

   CREATE POLICY "Users can delete commands in their groups"
     ON commands FOR DELETE
     USING (EXISTS (
       SELECT 1 FROM groups
       WHERE groups.id = commands.group_id
       AND groups.user_id = auth.uid()
     ));
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

### Creating Your First Command

1. **Sign up** or **log in** 
   - Use email/password, OR
   - Click "GitHub" to sign in with GitHub
2. You'll see **3 default groups** automatically created: Salesforce, Git, NPM
3. Click **"New Group"** to create additional groups, or click **+** on existing groups
4. Click the **+** icon on a group to add a command
5. Enter a title and command with placeholders:
   - **Title**: `Retrieve GlobalValueSet`
   - **Command**: `sf project retrieve start -o <org> -m GlobalValueSet`
6. Click **"Create Command"**

### Copying Commands

- **Copy All**: Click the purple button to copy the entire command
- **Click Segments**: Click any part of the command to copy just that segment
- **Placeholders**: Highlighted in purple - click to copy just the placeholder
- Example: `sf org create -a <alias>` - click `<alias>` to copy just that part

### Organizing Commands

- **Drag & Drop**: Click and drag the ☰ grip icon to move commands between groups
- **Create subgroups** using the folder icon
- **Edit** group names by clicking the pencil icon
- **Delete** groups or commands (with confirmation)
- Use the **search bar** to filter commands

## 🗂️ Example Command Structure

```
Salesforce
 ├─ Project
 │   ├─ Retrieve GlobalValueSet
 │   │   → sf project retrieve start -o <org> -m GlobalValueSet
 │   └─ Deploy Changes
 │       → sf project deploy start -o <org> -d force-app
 └─ Org
     ├─ Create Scratch Org
     │   → sf org create scratch -f config/project-scratch-def.json -a <alias>
     ├─ Authorize DevHub
     │   → sf org login web -a <devhub-alias> -d
     └─ Delete Org
         → sf org delete scratch -o <org>
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Don't forget to add these in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🧪 Future Enhancements (Phase 2)

- [ ] Command import/export (JSON/CSV)
- [ ] Team sharing & collaboration
- [ ] Tags and advanced filters
- [ ] Chrome extension for quick access
- [ ] Placeholder variable injection prompts
- [ ] Command history and usage analytics

## 📝 Database Schema

### Tables

**users** (handled by Supabase Auth)

- `id` (uuid, primary key)
- `email` (text)

**groups**

- `id` (uuid, primary key)
- `user_id` (uuid, references users.id)
- `name` (text)
- `parent_id` (uuid, optional reference to groups.id)
- `created_at` (timestamp)

**commands**

- `id` (uuid, primary key)
- `group_id` (uuid, references groups.id)
- `title` (text)
- `command_text` (text)
- `created_at` (timestamp)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙋 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ for developers who love efficiency
