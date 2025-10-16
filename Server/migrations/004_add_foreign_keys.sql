\c food_delivery;

ALTER TABLE ONLY public.role_permissions 
    ADD CONSTRAINT role_permissions_permission_id_fkey 
    FOREIGN KEY (permission_id) REFERENCES public.permissions(id);

ALTER TABLE ONLY public.role_permissions 
    ADD CONSTRAINT role_permissions_role_id_fkey 
    FOREIGN KEY (role_id) REFERENCES public.roles(id);

ALTER TABLE ONLY public.users 
    ADD CONSTRAINT users_role_id_fkey 
    FOREIGN KEY (role_id) REFERENCES public.roles(id);

ALTER TABLE order_items 
    ADD CONSTRAINT fk_order_items_order_id 
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items 
    ADD CONSTRAINT fk_order_items_product_id 
    FOREIGN KEY (product_id) REFERENCES public.products(id);