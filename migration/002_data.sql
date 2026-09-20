--
-- PostgreSQL database dump
--

\restrict OvWcRlXzMKfv24bhl7BBdiTUOzlhAlPsLYgOdxATfCwuGEiK7H8zKtlPHOghZ8G

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10

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

--
-- Data for Name: fn_profiles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: fn_loads; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: fn_bids; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: fn_bookings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: fn_company_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: fn_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: fn_notifications; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: fn_requests; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: loads; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ops_snapshots; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: portal_access_requests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.portal_access_requests (id, email, full_name, company, role, status, note, created_at, authorized_at) VALUES ('c259f5de-f7f6-4293-b8b7-77c8cb031daf', 'chriss@primarycompanies.com', 'Chris Sturma', 'Primary Companies', 'customer', 'authorized', NULL, '2026-09-16 19:13:02.592424+00', NULL);
INSERT INTO public.portal_access_requests (id, email, full_name, company, role, status, note, created_at, authorized_at) VALUES ('23da6982-9e2d-4401-be36-d3970fd5b50f', 'justdrivetransportationllc@gmail.com', 'Arthur', 'Just drive Transportation', 'carrier', 'authorized', NULL, '2026-09-14 01:02:23.121254+00', NULL);


--
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: shipment_events; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: ops_snapshots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ops_snapshots_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict OvWcRlXzMKfv24bhl7BBdiTUOzlhAlPsLYgOdxATfCwuGEiK7H8zKtlPHOghZ8G

