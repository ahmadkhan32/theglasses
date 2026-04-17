# The Glasses

Production-ready eyewear ecommerce app with virtual glasses try-on, admin CRUD, and Supabase-backed data.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL + Storage)
- Face Detection: face-api.js
- Animations/UI: Framer Motion, GSAP, Lucide React
- Deployment: Frontend on Vercel, Backend on Render

## Monorepo Structure

```text
The Glasses/
  backend/
    package.json
    server.js
    src/
      app.js
      config/
      controllers/
      middleware/
      routes/
      utils/
    supabase/
      schema.sql
      seed.sql
  frontend/
    package.json
    src/
      App.jsx
      pages/
      components/
      services/
      hooks/
      context/
  README.md
```

## Features

### Storefront

- Product listing with category and search filters
- Product details page with:
  - brand, material, color, pattern
  - frame sizes and spec details
  - pricing, discount, stock indicators
- Cart and checkout flow
- Virtual try-on page with:
  - uploaded photo fitting
  - live webcam preview
  - face landmark alignment
  - manual fine-tuning for size, rotation, opacity, and drag position
  - preview download
  - optional Supabase storage upload

### Admin

- Admin dashboard with quick navigation
- Product management: Create, Read, Update, Delete
- Category management: Create, Read, Update, Delete
- Orders management: Read + update order status
- Users management: Read, Update, Delete
- Coupons management: Create, Read, Update, Delete

### Backend API

- Health endpoint
- Product CRUD
- Category CRUD
- Shared error middleware

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase project

## 1) Environment Variables

### Backend

Create file: backend/.env

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
PORT=5000
NODE_ENV=development
```

The backend also accepts `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as fallbacks for local compatibility.

### Frontend

Create file: frontend/.env

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Optional Storage Setup

For try-on preview uploads, create a public Supabase Storage bucket named `tryon-previews`.

## 2) Database Setup (Supabase)

Run SQL files in Supabase SQL Editor in this order:

1. backend/supabase/schema.sql
2. backend/supabase/seed.sql

This creates core tables including:

- users
- categories
- products
- orders
- order_items
- reviews
- coupons

The current seed file loads eyewear inventory including aviators, blue-light glasses, round frames, wayfarers, sunglasses, and cat-eye styles.

If you previously seeded clothing data, clear products and categories first or reseed into a fresh Supabase project so the catalog matches the glasses storefront.

Note: The schema includes Row Level Security and policies. For full admin write access, ensure admin policy and authenticated admin user are configured in Supabase.

## 3) Install Dependencies

From project root, install both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 4) Run Locally

### Backend

```bash
cd backend
npm run dev
```

Backend default URL: http://localhost:5000

### Frontend

```bash
cd frontend
npm run dev
```

Frontend default URL: http://localhost:5173

## API Reference

Base URL: http://localhost:5000/api

### Health

- GET /health

### Products

- GET /products
- GET /products/:slug
- POST /products
- PUT /products/:id
- DELETE /products/:id

### Categories

- GET /categories
- POST /categories
- PUT /categories/:id
- DELETE /categories/:id

## Admin Routes (Frontend)

- /admin
- /admin/products
- /admin/categories
- /admin/orders
- /admin/users
- /admin/coupons

## Scripts

### Backend scripts

- npm run dev
- npm run start

### Frontend scripts

- npm run dev
- npm run build
- npm run preview
- npm run start
- npm run lint
- npm run check

## Deployment

### Backend on Render

- Root directory: backend
- Build command: npm install
- Start command: npm run start
- Environment variables:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - PORT
  - NODE_ENV=production

### Frontend on Vercel

- Root directory: frontend
- Build command: npm run build
- Output directory: dist
- Environment variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

## Production Notes

- Current frontend still uses Supabase directly for several reads and admin operations.
- Current backend exposes product/category API routes.
- Try-on preview upload expects a `tryon-previews` storage bucket.
- Recommended hardening for production:
  - Route all admin writes through backend APIs
  - Add JWT-based role guard for all admin routes
  - Restrict Supabase policies to least privilege
  - Move anon-key-only operations behind server-side validation where needed

## Troubleshooting

- Build warning about face-api.js and fs externalization in Vite can appear in browser builds; this is expected for some dependencies.
- If try-on preview upload fails, verify the `tryon-previews` bucket exists and its policies allow upload.
- If admin writes fail, verify Supabase RLS policies and authenticated admin role.
- If products/categories do not load, check frontend env keys and Supabase URL/key validity.

## Status

Implemented and validated:

- Backend setup
- Frontend setup
- Supabase schema and seed
- Glasses product and category CRUD
- Admin pages (products, categories, orders, users, coupons)
- Virtual glasses try-on with face alignment, download, and storage upload path
- Frontend production build
