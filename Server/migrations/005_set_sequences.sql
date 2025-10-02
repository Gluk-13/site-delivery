--Устанавливаем значения последовательностей

\c food_delivery;

SELECT setval('public.permissions_id_seq', COALESCE((SELECT MAX(id) FROM public.permissions), 1), false);
SELECT setval('public.products_id_seq', COALESCE((SELECT MAX(id) FROM public.products), 1), false);
SELECT setval('public.roles_id_seq', COALESCE((SELECT MAX(id) FROM public.roles), 1), false);
SELECT setval('public.users_id_seq', COALESCE((SELECT MAX(id) FROM public.users), 1), false);