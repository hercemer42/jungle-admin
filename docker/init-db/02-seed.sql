--
-- PostgreSQL database dump
--

\restrict vKweP0bKJ6EHmVwxtALAe5weQU223f3aui7AYSBkFrjxszHOQlYdURSywwoPRcH

-- Dumped from database version 17.8 (Debian 17.8-0+deb13u1)
-- Dumped by pg_dump version 17.8 (Debian 17.8-0+deb13u1)

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
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    parent_id integer
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    address text,
    city character varying(100),
    country character varying(100) DEFAULT 'US'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    status character varying(30) DEFAULT 'pending'::character varying,
    total_amount numeric(10,2),
    shipping_address text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock_quantity integer DEFAULT 0,
    category_id integer,
    sku character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    customer_id integer NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, description, parent_id) FROM stdin;
1	Electronics	Electronic devices and accessories	\N
2	Clothing	Apparel and fashion	\N
3	Home & Garden	Home improvement and garden supplies	\N
4	Laptops	Portable computers	1
5	Phones	Mobile phones and accessories	1
6	Men	Menswear	2
7	Women	Womenswear	2
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customers (id, first_name, last_name, email, phone, address, city, country, created_at, updated_at) FROM stdin;
1	Alice	Johnson	alice.johnson@example.com	555-0101	123 Maple St	Portland	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
2	Bob	Smith	bob.smith@example.com	555-0102	456 Oak Ave	Seattle	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
3	Carol	Williams	carol.w@example.com	555-0103	789 Pine Rd	San Francisco	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
4	David	Brown	david.b@example.com	555-0104	321 Elm Blvd	Austin	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
5	Eva	Martinez	eva.m@example.com	555-0105	654 Cedar Ln	Denver	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
6	Frank	Garcia	frank.g@example.com	555-0106	12 Birch Way	Chicago	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
7	Grace	Lee	grace.lee@example.com	555-0107	88 Willow Dr	New York	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
8	Henry	Wilson	henry.w@example.com	555-0108	44 Spruce Ct	Boston	US	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
9	Irene	Taylor	irene.t@example.com	555-0109	7 Ash St	Toronto	CA	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
10	James	Anderson	james.a@example.com	555-0110	99 Redwood Pl	London	GB	2026-02-17 11:05:29.883839	2026-02-17 11:05:29.883839
11	Kevin	Chen	kevin.chen@example.com	555-0111	201 Magnolia Ave	Los Angeles	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
12	Laura	Nguyen	laura.n@example.com	555-0112	302 Dogwood St	Houston	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
13	Marcus	Patel	marcus.p@example.com	555-0113	45 Cypress Ct	Phoenix	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
14	Nina	Kim	nina.kim@example.com	555-0114	678 Juniper Way	Philadelphia	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
15	Oscar	Rivera	oscar.r@example.com	555-0115	112 Hawthorn Dr	San Antonio	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
16	Priya	Sharma	priya.s@example.com	555-0116	89 Sycamore Blvd	San Diego	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
17	Quinn	O'Brien	quinn.ob@example.com	555-0117	33 Chestnut Ln	Dallas	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
18	Rosa	Fernandez	rosa.f@example.com	555-0118	567 Poplar Ave	Miami	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
19	Samuel	Jackson	samuel.j@example.com	555-0119	234 Alder St	Atlanta	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
20	Tara	Singh	tara.singh@example.com	555-0120	901 Linden Rd	Minneapolis	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
21	Umar	Ali	umar.ali@example.com	555-0121	15 Beech Pl	Detroit	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
22	Valerie	Thompson	valerie.t@example.com	555-0122	440 Hickory Dr	Nashville	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
23	Walter	Kowalski	walter.k@example.com	555-0123	78 Walnut Ct	Milwaukee	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
24	Xena	Papadopoulos	xena.p@example.com	555-0124	162 Fir St	Salt Lake City	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
25	Yusuf	Hassan	yusuf.h@example.com	555-0125	305 Hemlock Ave	Charlotte	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
26	Zoe	Martin	zoe.martin@example.com	555-0126	29 Sequoia Blvd	Vancouver	CA	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
27	Adrian	Dubois	adrian.d@example.com	555-0127	84 Rue de Lyon	Montreal	CA	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
28	Bianca	Rossi	bianca.r@example.com	555-0128	17 Via Roma	Rome	IT	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
29	Carlos	Mendez	carlos.m@example.com	555-0129	56 Calle Mayor	Madrid	ES	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
30	Diana	Müller	diana.m@example.com	555-0130	23 Berliner Str	Berlin	DE	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
31	Ethan	Brooks	ethan.b@example.com	555-0131	410 Maple Cir	Portland	US	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
32	Fatima	Al-Rashid	fatima.ar@example.com	555-0132	72 Palm Dr	Dubai	AE	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
33	George	Nakamura	george.n@example.com	555-0133	9 Sakura Ave	Tokyo	JP	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
34	Hannah	Okonkwo	hannah.o@example.com	555-0134	31 Baobab Rd	Lagos	NG	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
35	Ivan	Petrov	ivan.petrov@example.com	555-0135	88 Nevsky Prospect	St Petersburg	RU	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
36	Julia	Costa	julia.c@example.com	555-0136	145 Rua Augusta	Sao Paulo	BR	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
37	Kyle	Fitzgerald	kyle.f@example.com	555-0137	60 Shamrock Ln	Dublin	IE	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
38	Leila	Johansson	leila.j@example.com	555-0138	22 Birka Vägen	Stockholm	SE	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
39	Miguel	Santos	miguel.s@example.com	555-0139	103 Alameda Ave	Lisbon	PT	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
40	Nadia	Leblanc	nadia.l@example.com	555-0140	47 Rue Principale	Paris	FR	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
41	Oliver	Wright	oliver.w@example.com	555-0141	519 King St	Sydney	AU	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
42	Petra	Novak	petra.n@example.com	555-0142	8 Hradčany Sq	Prague	CZ	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
43	Rafael	Torres	rafael.t@example.com	555-0143	200 Reforma Ave	Mexico City	MX	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
44	Sofia	Andersson	sofia.a@example.com	555-0144	65 Drottninggatan	Gothenburg	SE	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
45	Thomas	Weber	thomas.w@example.com	555-0145	14 Mozartstr	Vienna	AT	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
46	Uma	Krishnan	uma.k@example.com	555-0146	37 MG Road	Bangalore	IN	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
47	Victor	Larsen	victor.l@example.com	555-0147	91 Nyhavn	Copenhagen	DK	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
48	Wendy	Chang	wendy.c@example.com	555-0148	128 Zhongshan Rd	Taipei	TW	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
49	Xavier	Moreau	xavier.m@example.com	555-0149	53 Av des Champs	Lyon	FR	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
50	Yara	El-Amin	yara.ea@example.com	555-0150	11 Nile Corniche	Cairo	EG	2026-02-20 14:00:14.843694	2026-02-20 14:00:14.843694
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price) FROM stdin;
1	1	1	1	1999.00
2	1	6	1	59.99
3	2	9	1	449.00
4	3	4	1	849.00
5	4	1	1	1999.00
6	5	7	1	289.00
7	5	6	1	59.99
8	6	3	1	799.00
9	7	7	1	289.00
10	8	2	1	1549.00
11	9	10	2	34.99
12	9	8	1	120.00
13	10	5	1	999.00
14	11	10	1	34.99
15	12	6	1	59.99
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, customer_id, status, total_amount, shipping_address, notes, created_at, updated_at) FROM stdin;
1	1	delivered	2058.99	123 Maple St, Portland	\N	2026-01-18 11:05:29.887373	2026-02-17 11:05:29.887373
2	1	shipped	449.00	123 Maple St, Portland	Leave at front door	2026-02-14 11:05:29.887373	2026-02-17 11:05:29.887373
3	2	confirmed	849.00	456 Oak Ave, Seattle	\N	2026-02-16 11:05:29.887373	2026-02-17 11:05:29.887373
4	3	pending	1999.00	789 Pine Rd, San Francisco	Gift wrap please	2026-02-17 11:05:29.887373	2026-02-17 11:05:29.887373
5	4	delivered	349.98	321 Elm Blvd, Austin	\N	2026-01-03 11:05:29.887373	2026-02-17 11:05:29.887373
6	5	cancelled	799.00	654 Cedar Ln, Denver	Customer changed mind	2026-02-07 11:05:29.887373	2026-02-17 11:05:29.887373
7	6	shipped	289.00	12 Birch Way, Chicago	\N	2026-02-12 11:05:29.887373	2026-02-17 11:05:29.887373
8	7	delivered	1549.00	88 Willow Dr, New York	\N	2025-12-19 11:05:29.887373	2026-02-17 11:05:29.887373
9	8	pending	154.98	44 Spruce Ct, Boston	\N	2026-02-17 11:05:29.887373	2026-02-17 11:05:29.887373
10	9	confirmed	999.00	7 Ash St, Toronto	International shipping	2026-02-15 11:05:29.887373	2026-02-17 11:05:29.887373
11	10	delivered	34.99	99 Redwood Pl, London	International shipping	2026-01-28 11:05:29.887373	2026-02-17 11:05:29.887373
12	2	delivered	59.99	456 Oak Ave, Seattle	\N	2025-11-19 11:05:29.887373	2026-02-17 11:05:29.887373
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, description, price, stock_quantity, category_id, sku, is_active, created_at) FROM stdin;
1	MacBook Pro 14"	Apple M3 Pro chip, 18GB RAM, 512GB SSD	1999.00	25	4	ELEC-LAP-001	t	2026-02-17 11:05:29.879772
2	ThinkPad X1 Carbon	Intel i7, 16GB RAM, 512GB SSD	1549.00	40	4	ELEC-LAP-002	t	2026-02-17 11:05:29.879772
3	iPhone 16	128GB, Midnight	799.00	100	5	ELEC-PHN-001	t	2026-02-17 11:05:29.879772
4	Galaxy S25	256GB, Phantom Black	849.00	80	5	ELEC-PHN-002	t	2026-02-17 11:05:29.879772
5	Pixel 9 Pro	256GB, Obsidian	999.00	35	5	ELEC-PHN-003	t	2026-02-17 11:05:29.879772
6	Classic Oxford Shirt	100% cotton, slim fit	59.99	200	6	CLO-MEN-001	t	2026-02-17 11:05:29.879772
7	Wool Overcoat	Italian wool blend, charcoal	289.00	30	6	CLO-MEN-002	t	2026-02-17 11:05:29.879772
8	Silk Blouse	Relaxed fit, ivory	120.00	65	7	CLO-WMN-001	t	2026-02-17 11:05:29.879772
9	Standing Desk	Electric height adjustable, 60"	449.00	15	3	HG-DESK-001	t	2026-02-17 11:05:29.879772
10	Ceramic Planter Set	Set of 3, matte white	34.99	150	3	HG-PLNT-001	t	2026-02-17 11:05:29.879772
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, customer_id, rating, comment, created_at) FROM stdin;
1	1	1	5	Absolutely love this laptop. Best purchase this year.	2026-01-28 11:05:29.8957
2	1	8	4	Great machine but runs a bit warm under heavy load.	2025-12-29 11:05:29.8957
3	2	7	5	Perfect for work. Keyboard is amazing.	2025-12-24 11:05:29.8957
4	4	2	4	Beautiful display, camera is outstanding.	2026-02-16 11:05:29.8957
5	6	1	5	Fits perfectly, great quality cotton.	2026-01-23 11:05:29.8957
6	6	4	3	Decent shirt but sizing runs a bit large.	2026-01-08 11:05:29.8957
7	7	6	5	Stunning coat. Worth every penny.	2026-02-13 11:05:29.8957
8	9	1	4	Solid desk but assembly took a while.	2026-02-15 11:05:29.8957
9	10	10	5	Beautiful planters, arrived well-packaged.	2026-02-02 11:05:29.8957
10	5	9	4	Great phone, Android experience is smooth. Battery could be better.	2026-02-16 11:05:29.8957
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 7, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_id_seq', 50, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 15, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 12, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 10, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 10, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: reviews reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- PostgreSQL database dump complete
--

\unrestrict vKweP0bKJ6EHmVwxtALAe5weQU223f3aui7AYSBkFrjxszHOQlYdURSywwoPRcH

