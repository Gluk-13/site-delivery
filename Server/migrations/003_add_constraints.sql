--Добавляем ограничения

\c food_delivery;

-- Primary Keys
ALTER TABLE ONLY public.permissions ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.role_permissions ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);

-- Unique Constraints
ALTER TABLE ONLY public.permissions ADD CONSTRAINT permissions_code_key UNIQUE (code);
ALTER TABLE ONLY public.roles ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);
