
--Создаем первые таблицы

CREATE TABLE public.permissions (
    id integer DEFAULT nextval('public.permissions_id_seq'::regclass) NOT NULL,
    code character varying(100) NOT NULL,
    description text
);

CREATE TABLE public.products (
    id integer DEFAULT nextval('public.products_id_seq'::regclass) NOT NULL,
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

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);

CREATE TABLE public.roles (
    id integer DEFAULT nextval('public.roles_id_seq'::regclass) NOT NULL,
    name character varying(250) NOT NULL
);

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(200) NOT NULL,
    role_id integer,
    name character varying(255) DEFAULT 'Unknown'::character varying NOT NULL
);