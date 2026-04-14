-- -- Cleanup Duplicates Script
-- -- This script removes all duplicates from products, categories, and coupons

-- -- Clear all data to start fresh (in reverse dependency order)
-- DELETE FROM public.order_items;
-- DELETE FROM public.orders;
-- DELETE FROM public.reviews;
-- DELETE FROM public.tryon_sessions;
-- DELETE FROM public.products;
-- DELETE FROM public.coupons;
-- DELETE FROM public.categories;

-- -- Verify tables are empty
-- SELECT 'Categories cleared' as status, COUNT(*) as remaining FROM public.categories
-- UNION ALL
-- SELECT 'Products cleared', COUNT(*) FROM public.products
-- UNION ALL
-- SELECT 'Coupons cleared', COUNT(*) FROM public.coupons;
