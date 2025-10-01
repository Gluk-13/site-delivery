--
-- PostgreSQL database dump
--

\restrict 6wWbc5VTmJWEClpQPdgNbmvoImfyHQ3zzGRqNshtIBCzEQOyIKC67gujsNsCcsL

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-27 20:59:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS food_delivery;
--
-- TOC entry 4844 (class 1262 OID 16388)
-- Name: food_delivery; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE food_delivery WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';


ALTER DATABASE food_delivery OWNER TO postgres;

\unrestrict 6wWbc5VTmJWEClpQPdgNbmvoImfyHQ3zzGRqNshtIBCzEQOyIKC67gujsNsCcsL
\connect food_delivery
\restrict 6wWbc5VTmJWEClpQPdgNbmvoImfyHQ3zzGRqNshtIBCzEQOyIKC67gujsNsCcsL

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 24604)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    code character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24603)
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- TOC entry 4845 (class 0 OID 0)
-- Dependencies: 221
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- TOC entry 225 (class 1259 OID 24667)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    discount_percent numeric(5,2) DEFAULT NULL::numeric,
    discount_price numeric(10,2) GENERATED ALWAYS AS ((price * ((1)::numeric - (discount_percent / (100)::numeric)))) STORED,
    category character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url character varying(100),
    rating numeric(2,1),
    CONSTRAINT products_discount_percent_check CHECK (((discount_percent > (0)::numeric) AND (discount_percent < (100)::numeric))),
    CONSTRAINT products_price_check CHECK ((price > (0)::numeric))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24666)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 4846 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 223 (class 1259 OID 24614)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24581)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(250) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24580)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4847 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 220 (class 1259 OID 24590)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(200) NOT NULL,
    role_id integer,
    name character varying(255) DEFAULT 'Unknown'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24589)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4658 (class 2604 OID 24607)
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- TOC entry 4659 (class 2604 OID 24670)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4655 (class 2604 OID 24584)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4656 (class 2604 OID 24593)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4835 (class 0 OID 24604)
-- Dependencies: 222
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, code, description) FROM stdin;
1	view_products	Џа®б¬®ва в®ў а®ў
2	create_product	‘®§¤ ­ЁҐ в®ў а®ў
3	edit_product	ђҐ¤ ЄвЁа®ў ­ЁҐ в®ў а®ў
4	delete_product	“¤ «Ґ­ЁҐ в®ў а®ў
5	view_orders	Џа®б¬®ва § Є §®ў
6	edit_order	ђҐ¤ ЄвЁа®ў ­ЁҐ § Є §®ў
7	manager_users	“Їа ў«Ґ­ЁҐ Ї®«м§®ў вҐ«п¬Ё
\.


--
-- TOC entry 4838 (class 0 OID 24667)
-- Dependencies: 225
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, discount_percent, category, created_at, updated_at, image_url, rating) FROM stdin;
1	Г/Ц Блинчики с мясом вес, Россия	50.50	50.00	meat	2025-08-28 17:58:14.763315	2025-08-28 17:58:14.763315	product1.png	2.0
3	Комбайн КЗС-1218 «ДЕСНА-ПОЛЕСЬЕ GS12»	599.99	\N	meat	2025-08-28 18:02:26.986562	2025-08-28 18:02:26.986562	product2.png	2.0
4	Молоко ПРОСТОКВАШИНО паст. питьевое цельное отборное...	140.50	50.00	milk	2025-09-14 16:11:56.380854	2025-09-14 16:11:56.380854	product3.png	2.5
5	Молоко сгущенное РОГАЧЕВ Егорка, цельное с сахаром...	168.50	50.00	milk	2025-09-14 16:11:56.380854	2025-09-14 16:11:56.380854	product4.png	2.5
6	Колбаса сырокопченая МЯСНАЯ ИСТОРИЯ Сальчичон и Тоскан...	50.50	25.00	meat	2025-09-14 16:11:56.380854	2025-09-14 16:11:56.380854	product5.png	5.0
7	Сосиски вареные МЯСНАЯ ИСТОРИЯ Молочные и С сыро...	50.50	15.00	meat	2025-09-14 16:11:56.380854	2025-09-14 16:11:56.380854	product6.png	4.5
8	Говядина вырезка	650.00	25.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product1.png	4.8
9	Свиная шея	480.00	30.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product2.png	4.5
10	Куриное филе	320.00	20.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product3.png	4.6
11	Индейка грудка	450.00	25.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product4.png	4.7
12	Баранина на кости	750.00	35.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product5.png	4.9
13	Свиные ребрышки	520.00	30.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product6.png	4.4
14	Куриные окорочка	280.00	20.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product7.png	4.3
15	Говяжий фарш	380.00	25.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product8.png	4.5
16	Свиная вырезка	550.00	30.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product9.png	4.7
17	Утка целиком	890.00	40.00	meat	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product10.png	4.6
18	Молоко 3.2%	85.00	20.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product11.png	4.2
19	Йогурт греческий	120.00	25.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product12.png	4.5
20	Сметана 20%	95.00	20.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product13.png	4.3
21	Творог 5%	130.00	25.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product14.png	4.6
22	Сыр Гауда	450.00	30.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product15.png	4.8
23	Кефир 2.5%	75.00	20.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product16.png	4.1
24	Сливки 33%	180.00	25.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product17.png	4.4
25	Масло сливочное	280.00	30.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product18.png	4.7
26	Ряженка 4%	80.00	20.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product19.png	4.3
27	Моцарелла	380.00	35.00	milk	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product20.png	4.9
28	Помидоры черри	250.00	25.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product21.png	4.6
29	Огурцы грунтовые	180.00	20.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product22.png	4.4
30	Картофель молодой	90.00	20.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product23.png	4.3
31	Морковь свежая	60.00	20.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product24.png	4.2
32	Лук репчатый	70.00	20.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product25.png	4.1
33	Капуста белокочанная	85.00	20.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product26.png	4.0
34	Болгарский перец	320.00	30.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product27.png	4.7
35	Баклажаны	280.00	25.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product28.png	4.5
36	Кабачки цукини	210.00	25.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product29.png	4.4
37	Чеснок	150.00	20.00	vegetables	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product30.png	4.8
38	Яблоки Гренни Смит	190.00	20.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product31.png	4.5
39	Бананы	120.00	20.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product32.png	4.3
40	Апельсины	220.00	25.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product33.png	4.6
41	Клубника	450.00	35.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product34.png	4.9
42	Виноград зеленый	380.00	30.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product35.png	4.7
43	Персики	290.00	25.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product36.png	4.6
44	Груши Конференц	210.00	20.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product37.png	4.4
45	Мандарины	180.00	25.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product38.png	4.5
46	Лимоны	150.00	20.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product39.png	4.3
47	Авокадо	320.00	40.00	fruits	2025-09-14 16:32:11.058018	2025-09-14 16:32:11.058018	product40.png	4.8
\.


--
-- TOC entry 4836 (class 0 OID 24614)
-- Dependencies: 223
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
1	1
1	5
2	1
2	2
2	3
2	4
2	5
2	6
2	7
3	1
3	2
3	3
3	5
3	6
\.


--
-- TOC entry 4831 (class 0 OID 24581)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	customer
2	admin
3	manager
\.


--
-- TOC entry 4833 (class 0 OID 24590)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role_id, name) FROM stdin;
1	manager@example.com	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	3	Unknown
2	user@example.com	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	1	Unknown
3	admin@example.com	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	2	Unknown
4	art.nek.13@gmail.com	$2b$10$eIjgxgpKzd.GoBll11oKe.l2HvMscI55hRH7/dYWxGg9ZOHZHaWYC	\N	Артем
\.


--
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 221
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 7, true);


--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 47, true);


--
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4675 (class 2606 OID 24613)
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- TOC entry 4677 (class 2606 OID 24611)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4681 (class 2606 OID 24678)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4679 (class 2606 OID 24618)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- TOC entry 4667 (class 2606 OID 24588)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4669 (class 2606 OID 24586)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4671 (class 2606 OID 24597)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4673 (class 2606 OID 24595)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4683 (class 2606 OID 24624)
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- TOC entry 4684 (class 2606 OID 24619)
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 4682 (class 2606 OID 24598)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- Completed on 2025-09-27 20:59:46

--
-- PostgreSQL database dump complete
--

\unrestrict 6wWbc5VTmJWEClpQPdgNbmvoImfyHQ3zzGRqNshtIBCzEQOyIKC67gujsNsCcsL

