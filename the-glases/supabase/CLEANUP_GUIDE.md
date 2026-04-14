# Database Cleanup Guide

## Removed Files
- ✅ `scripts/seed_glasses.js` (duplicate seed file)
- ✅ `supabase/seed_data.sql` (duplicate seed file)

## Files to Use
- **`supabase/cleanup_duplicates.sql`** - Run this FIRST to clear all duplicate data
- **`supabase/seed.sql`** - Run this SECOND to re-seed with clean, deduplicated data

## How to Apply Cleanup

### Step 1: Clear All Duplicates
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to the **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/cleanup_duplicates.sql`
5. Click **Run** and confirm

### Step 2: Re-seed Clean Data
1. In the same SQL Editor, click **New Query**
2. Copy the contents of `supabase/seed.sql`
3. Click **Run**

## What Was Changed
- **Before**: Multiple duplicate seed files causing duplicate entries in database
- **After**: Single source of truth with `seed.sql` containing only unique products, categories, and coupons

## Database Constraints (Preventing Future Duplicates)
- **Products**: `slug` must be unique
- **Categories**: `slug` must be unique  
- **Coupons**: `code` must be unique

These constraints prevent duplicate entries from being inserted again.
