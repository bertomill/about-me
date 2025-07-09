# Supabase Database Setup

Follow these steps to set up your Supabase database:

## 1. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Click on your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Project API Key** (anon, public)

## 2. Update Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

## 3. Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to create all tables and policies

## 4. Verify Database Setup

After running the SQL, you should see these tables in your **Table Editor**:
- `personal_info`
- `education`
- `experience`
- `key_stories`
- `awards`
- `strengths`
- `growth_areas`
- `questions_for_interviewer`

## 5. Test Connection

Once you've updated the environment variables and created the tables, restart your Next.js development server:

```bash
npm run dev
```

The application will now use Supabase instead of the local JSON file.

## Next Steps

After completing these steps, we'll:
1. Migrate your JSON data to Supabase tables
2. Build CRUD operations for managing your information
3. Update the search functionality to work with the database