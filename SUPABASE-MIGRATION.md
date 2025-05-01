# Affidavit App - Supabase Migration Guide

This document provides instructions for migrating the Affidavit App from SQLite with Prisma to Supabase.

## Prerequisites

- Supabase account
- Access to your project's Supabase dashboard
- Node.js and npm

## Step 1: Install Required Packages

```bash
npm install @supabase/supabase-js @supabase/ssr dotenv uuid
```

## Step 2: Set Up Environment Variables

Update your `.env` and `.env.local` files with Supabase credentials:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Next Auth Configuration (maintain for transition period)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# General
LOG_LEVEL=info
```

## Step 3: Create Database Schema in Supabase

1. Access your Supabase SQL Editor
2. Execute the SQL migration script in `supabase-migration.sql`
3. Verify that all tables, functions, and triggers were created successfully

## Step 4: Set Up Supabase Storage Buckets

1. In your Supabase dashboard, go to "Storage"
2. Create two buckets:
   - `affidavits` - for storing generated PDF files
   - `templates` - for storing template logos and other assets
3. Configure appropriate permissions for these buckets

## Step 5: Migrate Data

Run the data migration script:

```bash
npx ts-node scripts/migrate-to-supabase.ts
```

This will:
1. Migrate users and create matching auth accounts
2. Migrate all business data (patients, providers, etc.)
3. Upload files to Supabase Storage
4. Update references to point to the new storage URLs

## Step 6: Update API Routes

Replace Prisma queries with Supabase queries in your API routes. Use the examples in `src/app/api/patients/route.supabase.ts` as a reference.

Key patterns to follow:
- Initialize Supabase client in API routes
- Use proper typing with the Database type
- Handle null checks and empty arrays appropriately
- Format response data consistently

## Step 7: Update Authentication

1. Replace NextAuth.js with Supabase Auth
2. Update middleware to use Supabase authentication
3. Update client components to use Supabase auth hooks

## Step 8: Test and Validate

1. Test all API endpoints
2. Verify authentication works
3. Check file uploads and retrieval
4. Ensure proper permissions are enforced

## Common Patterns

### Initializing Supabase Client (Server Component)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase';

export async function someServerFunction() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  // Use supabase client here
}
```

### Handling File Uploads

```typescript
async function uploadPdf(fileBuffer: Buffer, fileName: string) {
  const { data, error } = await supabase
    .storage
    .from('affidavits')
    .upload(fileName, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase
    .storage
    .from('affidavits')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
```

## Troubleshooting

- **Auth Issues:** Check the JWT expiration and refresh token configuration
- **RLS Policies:** Review Row Level Security policies if data access is being denied
- **Missing Data:** Verify FKs and constraints on your schema
- **File Access:** Check bucket permissions in Supabase Storage 