--
-- PostgreSQL database dump
--

\restrict zIivBDVg2HlDF4biHEftcmUwbKerkfP0C1jqLMwnAVDgWfc1wYONmvGyO1yhbTS

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id_cliente integer NOT NULL,
    nombre character varying(100) NOT NULL,
    appaterno character varying(100) NOT NULL,
    apmaterno character varying(100),
    ci character varying(20) NOT NULL,
    telefono character varying(20),
    zona character varying(100),
    activo integer DEFAULT 1
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: clientes_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_cliente_seq OWNER TO postgres;

--
-- Name: clientes_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_cliente_seq OWNED BY public.clientes.id_cliente;


--
-- Name: log_acceso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_acceso (
    id_log integer NOT NULL,
    id_usuario integer NOT NULL,
    ip character varying(45) NOT NULL,
    evento character varying(20) NOT NULL,
    browser character varying(150) NOT NULL,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.log_acceso OWNER TO postgres;

--
-- Name: log_acceso_id_log_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_acceso_id_log_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_acceso_id_log_seq OWNER TO postgres;

--
-- Name: log_acceso_id_log_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_acceso_id_log_seq OWNED BY public.log_acceso.id_log;


--
-- Name: log_accesos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_accesos (
    id_log integer NOT NULL,
    username character varying(50) NOT NULL,
    fecha character varying(50) NOT NULL,
    ip character varying(45) NOT NULL,
    navegador character varying(150) NOT NULL,
    tipo character varying(15) NOT NULL
);


ALTER TABLE public.log_accesos OWNER TO postgres;

--
-- Name: log_accesos_id_log_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_accesos_id_log_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_accesos_id_log_seq OWNER TO postgres;

--
-- Name: log_accesos_id_log_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_accesos_id_log_seq OWNED BY public.log_accesos.id_log;


--
-- Name: ordenes_trabajo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ordenes_trabajo (
    id_orden integer NOT NULL,
    id_vehiculo integer NOT NULL,
    id_mecanico integer NOT NULL,
    descripcion_falla text NOT NULL,
    monto_total numeric(10,2) NOT NULL,
    estado character varying(20) DEFAULT 'en_proceso'::character varying NOT NULL,
    fecha_ingreso timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_estado CHECK (((estado)::text = ANY ((ARRAY['en_proceso'::character varying, 'terminado'::character varying])::text[])))
);


ALTER TABLE public.ordenes_trabajo OWNER TO postgres;

--
-- Name: ordenes_trabajo_id_orden_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ordenes_trabajo_id_orden_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ordenes_trabajo_id_orden_seq OWNER TO postgres;

--
-- Name: ordenes_trabajo_id_orden_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ordenes_trabajo_id_orden_seq OWNED BY public.ordenes_trabajo.id_orden;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    appaterno character varying(100) NOT NULL,
    apmaterno character varying(100),
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    ci character varying(20) NOT NULL,
    rol character varying(30) NOT NULL,
    activo integer DEFAULT 1 NOT NULL,
    CONSTRAINT chk_rol CHECK (((rol)::text = ANY ((ARRAY['admin'::character varying, 'recepcionista'::character varying, 'mecanico_chaperia'::character varying, 'mecanico_pintura'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    id_vehiculo integer NOT NULL,
    placa character varying(15) NOT NULL,
    marca character varying(50) NOT NULL,
    modelo character varying(50) NOT NULL,
    color character varying(30),
    id_cliente integer NOT NULL,
    anio integer,
    activo integer DEFAULT 1
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- Name: vehiculos_id_vehiculo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehiculos_id_vehiculo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculos_id_vehiculo_seq OWNER TO postgres;

--
-- Name: vehiculos_id_vehiculo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehiculos_id_vehiculo_seq OWNED BY public.vehiculos.id_vehiculo;


--
-- Name: clientes id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id_cliente SET DEFAULT nextval('public.clientes_id_cliente_seq'::regclass);


--
-- Name: log_acceso id_log; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_acceso ALTER COLUMN id_log SET DEFAULT nextval('public.log_acceso_id_log_seq'::regclass);


--
-- Name: log_accesos id_log; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_accesos ALTER COLUMN id_log SET DEFAULT nextval('public.log_accesos_id_log_seq'::regclass);


--
-- Name: ordenes_trabajo id_orden; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_trabajo ALTER COLUMN id_orden SET DEFAULT nextval('public.ordenes_trabajo_id_orden_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Name: vehiculos id_vehiculo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos ALTER COLUMN id_vehiculo SET DEFAULT nextval('public.vehiculos_id_vehiculo_seq'::regclass);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id_cliente, nombre, appaterno, apmaterno, ci, telefono, zona, activo) FROM stdin;
4	Ana	López	Vargas	9012345 LP	74567890	16 de Julio	1
5	Luis	Quispe	Mamani	9123456 LP	75678901	Achumani	1
6	Patricia	Gutiérrez	Rojas	9234567 LP	76789012	Calacoto	1
7	Marco	Condori	Apaza	9345678 LP	77890123	Obrajes	1
8	Sandra	Flores	Mendoza	9456789 LP	78901234	Miraflores	1
9	Víctor	Torrez	Mamani	9567890 LP	79012345	Villa Fátima	1
10	Daniela	Rojas	Quispe	9678901 LP	70123456	Munaypata	1
11	Juan	Perez	Lopez	12345678	77777777	Miraflores	1
1	Carlos	Mamani	Quispe	6789012 LP	70000000	Villa Adela	1
12	Ribaldo	Mamani	Tarqui	9935778	60573721	El Alto	0
13	Yhungaro	Mamani	Laura	1234567	777799219	La Paz	0
14	Erin	Mamani	Tarqui	88765467	70706969	La Paz	1
2	María	Choque	Flores	7890123 LP	72345678	Cruce Villa Adela	1
3	José Luis	Apaza	Condori	8901234 LP	73456789	Senkata	1
\.


--
-- Data for Name: log_acceso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_acceso (id_log, id_usuario, ip, evento, browser, fecha_hora) FROM stdin;
1	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 11:25:44.677389
2	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 11:26:10.38001
3	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 11:34:19.257914
4	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:01:18.925907
5	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:01:36.317601
6	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 14:03:03.242627
7	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 14:03:09.071292
8	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 14:06:07.796907
9	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 14:06:21.929696
10	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:06:41.091215
11	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:12:11.643664
12	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 14:12:29.316758
13	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 14:12:31.216678
14	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:12:50.088763
15	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:14:29.371914
16	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:20:43.259485
17	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:21:14.446985
18	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:21:43.040805
19	1	::ffff:127.0.0.1	ingreso	Thunder Client (https://www.thunderclient.com)	2026-06-01 14:23:17.688914
20	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.122.1 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36	2026-06-01 14:26:27.782324
21	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.122.1 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36	2026-06-01 14:27:15.231233
22	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:27:46.325945
23	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:28:42.358871
24	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:29:07.753652
25	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:33:58.706329
26	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 14:36:52.108798
27	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 15:18:57.251561
28	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-01 18:42:23.602039
29	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 08:44:43.332148
30	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 17:42:16.03953
31	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 17:43:13.407265
32	8	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 17:43:58.810575
33	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 17:52:14.479772
34	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-02 17:57:42.670212
35	1	::1	ingreso	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.123.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36	2026-06-09 07:13:26.631385
\.


--
-- Data for Name: log_accesos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_accesos (id_log, username, fecha, ip, navegador, tipo) FROM stdin;
\.


--
-- Data for Name: ordenes_trabajo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ordenes_trabajo (id_orden, id_vehiculo, id_mecanico, descripcion_falla, monto_total, estado, fecha_ingreso) FROM stdin;
1	1	2	Golpe en guardabarro delantero izquierdo	1200.00	terminado	2026-05-10 00:00:00
2	2	3	Rayones profundos en puerta derecha	850.00	terminado	2026-05-11 00:00:00
4	4	5	Abolladura en capó por granizo	950.00	terminado	2026-05-13 00:00:00
6	6	3	Reparación de puerta trasera y pintura	1600.00	terminado	2026-05-15 00:00:00
7	7	4	Enderezado de chasis frontal	3200.00	en_proceso	2026-05-16 00:00:00
8	8	5	Pulido y restauración de pintura	700.00	terminado	2026-05-17 00:00:00
9	9	6	Cambio de guardabarro y pintura	1400.00	terminado	2026-05-18 00:00:00
10	10	2	Reparación de golpe lateral completo	2800.00	en_proceso	2026-05-19 00:00:00
11	3	1	Choque guardabarro derecho	500.00	terminado	2026-06-01 21:11:53.604885
12	5	4	Choque frontal, parachoques	300.00	terminado	2026-06-01 21:48:54.504168
3	3	4	Cambio y pintado de parachoques delantero	1800.00	terminado	2026-05-12 00:00:00
5	5	2	Pintado completo lateral izquierdo	2500.00	terminado	2026-05-14 00:00:00
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre, appaterno, apmaterno, username, password_hash, ci, rol, activo) FROM stdin;
1	Ribaldo	Mamani	\N	ribaldo_admin	008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601	9999999-LP	admin	1
2	Carlos	Condori	Mamani	ccondori	008c70392e3abfbd0fa6fadd4cde6e4f9e4b0c6d2d5d4de0f1a6f6b8d7f6d8a5	7894561	recepcionista	1
3	Juan	Flores	Quispe	jflores	008c70392e3abfbd0fa6fadd4cde6e4f9e4b0c6d2d5d4de0f1a6f6b8d7f6d8a5	4561237	mecanico_chaperia	1
4	Pedro	Mamani	Choque	pmamani	008c70392e3abfbd0fa6fadd4cde6e4f9e4b0c6d2d5d4de0f1a6f6b8d7f6d8a5	8521479	mecanico_chaperia	1
5	Luis	Quispe	Ticona	lquispe	008c70392e3abfbd0fa6fadd4cde6e4f9e4b0c6d2d5d4de0f1a6f6b8d7f6d8a5	9632587	mecanico_pintura	1
6	Marco	Apaza	Huanca	mapaza	008c70392e3abfbd0fa6fadd4cde6e4f9e4b0c6d2d5d4de0f1a6f6b8d7f6d8a5	7418529	mecanico_pintura	1
7	Zacarias	Mamani	\N	zacmamani	ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f	123451234	mecanico_chaperia	1
8	Juan	Perez	Mamani	jperez	008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601	12345567	mecanico_chaperia	1
\.


--
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehiculos (id_vehiculo, placa, marca, modelo, color, id_cliente, anio, activo) FROM stdin;
3	3456CDE	Nissan	Versa	Negro	3	2019	1
4	4567DEF	Toyota	Yaris	Rojo	4	2017	1
5	5678EFG	Kia	Rio	Azul	5	2021	1
6	6789FGH	Hyundai	Accent	Gris	6	2018	1
7	7890GHI	Suzuki	Swift	Blanco	7	2022	1
8	8901HIJ	Nissan	Sentra	Negro	8	2019	1
9	9012IJK	Toyota	Hilux	Plomo	9	2021	1
10	0123JKL	Kia	Sportage	Azul	10	2023	1
11	123ABC	Toyota	Corolla	Blanco	1	\N	1
1	1234ABC	Toyota	Corolla	negro	1	2018	1
12	1234PLA	TOYOTA	PRADO	NEGRO	2	\N	0
2	2345BCD	Suzuki	Vitara	Oro	2	2020	1
\.


--
-- Name: clientes_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_cliente_seq', 14, true);


--
-- Name: log_acceso_id_log_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_acceso_id_log_seq', 35, true);


--
-- Name: log_accesos_id_log_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_accesos_id_log_seq', 1, false);


--
-- Name: ordenes_trabajo_id_orden_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ordenes_trabajo_id_orden_seq', 12, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 8, true);


--
-- Name: vehiculos_id_vehiculo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehiculos_id_vehiculo_seq', 12, true);


--
-- Name: clientes clientes_ci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_ci_key UNIQUE (ci);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id_cliente);


--
-- Name: log_acceso log_acceso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_acceso
    ADD CONSTRAINT log_acceso_pkey PRIMARY KEY (id_log);


--
-- Name: log_accesos log_accesos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_accesos
    ADD CONSTRAINT log_accesos_pkey PRIMARY KEY (id_log);


--
-- Name: ordenes_trabajo ordenes_trabajo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_trabajo
    ADD CONSTRAINT ordenes_trabajo_pkey PRIMARY KEY (id_orden);


--
-- Name: usuarios usuarios_ci_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_ci_key UNIQUE (ci);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: vehiculos vehiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (id_vehiculo);


--
-- Name: vehiculos vehiculos_placa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_placa_key UNIQUE (placa);


--
-- Name: log_acceso fk_log_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_acceso
    ADD CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: ordenes_trabajo fk_orden_mecanico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_trabajo
    ADD CONSTRAINT fk_orden_mecanico FOREIGN KEY (id_mecanico) REFERENCES public.usuarios(id_usuario) ON DELETE RESTRICT;


--
-- Name: ordenes_trabajo fk_orden_vehiculo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordenes_trabajo
    ADD CONSTRAINT fk_orden_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES public.vehiculos(id_vehiculo) ON DELETE CASCADE;


--
-- Name: vehiculos fk_vehiculo_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT fk_vehiculo_cliente FOREIGN KEY (id_cliente) REFERENCES public.clientes(id_cliente) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict zIivBDVg2HlDF4biHEftcmUwbKerkfP0C1jqLMwnAVDgWfc1wYONmvGyO1yhbTS

