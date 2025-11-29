--
-- PostgreSQL database dump
--

\restrict eF7uvZlTnbG5wWlfdxnlCKaEHl9bOc6rdc6U5AYMjpGXarxap2yqd8OrHBbto5R

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-3.pgdg24.04+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: avnadmin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO avnadmin;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: avnadmin
--

COMMENT ON SCHEMA public IS '';


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: avnadmin
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'processing',
    'delivered',
    'cancelled'
);


ALTER TYPE public.order_status OWNER TO avnadmin;

--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: avnadmin
--

CREATE TYPE public.payment_method AS ENUM (
    'cod',
    'razorpay'
);


ALTER TYPE public.payment_method OWNER TO avnadmin;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: avnadmin
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'success'
);


ALTER TYPE public.payment_status OWNER TO avnadmin;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: avnadmin
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'developer',
    'user'
);


ALTER TYPE public.user_role OWNER TO avnadmin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: menu; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.menu (
    id text NOT NULL,
    name text NOT NULL,
    image character varying(255)
);


ALTER TABLE public.menu OWNER TO avnadmin;

--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.menu_items (
    id text NOT NULL,
    category_id text NOT NULL,
    name text NOT NULL,
    variants jsonb NOT NULL
);


ALTER TABLE public.menu_items OWNER TO avnadmin;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    status public.order_status NOT NULL,
    payment_method public.payment_method NOT NULL,
    payment_status public.payment_status NOT NULL,
    razorpay_order_id text,
    razorpay_payment_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    items jsonb
);


ALTER TABLE public.orders OWNER TO avnadmin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    refresh_token character varying(256) NOT NULL,
    access_token character varying(400),
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    fcm_token text,
    location text
);


ALTER TABLE public.users OWNER TO avnadmin;

--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.menu (id, name, image) FROM stdin;
a797fb80-971c-463c-9474-e58a16d7f322	रोल	https://spicecravings.com/wp-content/uploads/2020/12/Paneer-kathi-Roll-Featured-1.jpg
e180ee01-acd6-4ee3-8e13-07ddc6cd4a83	चाउमीन	https://images.getrecipekit.com/20221130023757-untitled-design-12-3.png?aspect_ratio=16:9&quality=90&
ea6e16ba-527d-494d-b346-a0c86b05d3b1	रोटी	https://media.istockphoto.com/id/516359240/photo/bhendi-masala-or-bhindi-masala-ladies-finger-curry-with-chapati.jpg?s=612x612&w=0&k=20&c=0mGnvNM2lxl-dTTJlhAfVJE5WidxYmmvrvNs1NZUKvs=
9931fc10-196b-4956-9d34-5e669713236f	अंडा	https://media.istockphoto.com/id/520889612/photo/boiled-eggs-in-bowl.jpg?s=612x612&w=0&k=20&c=wwes11nnPnZu7IFz6SSSjhsfoBK-ZcTFsqH9Em72ClA=
1b9f526a-2095-4b4f-8a80-8fc42b3b5e06	सलाद	https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?cs=srgb&dl=pexels-chanwalrus-1059905.jpg&fm=jpg
95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन	https://www.whiskaffair.com/wp-content/uploads/2021/01/Chicken-Masala-2-3-1.jpg
5776b12d-ea42-45ba-aaea-130b63c9a540	बिरयानी	https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/chicken-biryani-recipe.jpg
f27698b5-60cc-45b3-ba80-c13800271e54	राईस	https://www.hyderabadiruchulu.com/wp-content/uploads/2018/09/masala-rice-500x360.png
0c035160-1f23-4e77-8e0b-a46b3de4f42f	बर्गर	https://www.chicken.ca/wp-content/uploads/2017/09/Jalapeno-Popper-Chicken-Burgers-1.jpg
e2724601-4a1d-49ce-bc2f-9f5383251d3e	मोमोज	https://www.thespruceeats.com/thmb/UnVh_-znw7ikMUciZIx5sNqBtTU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/steamed-momos-wontons-1957616-hero-01-1c59e22bad0347daa8f0dfe12894bc3c.jpg
f3ced821-2ed5-456b-a0ca-e97947e7bb8a	सूप	https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/goodvegetablesoup_73412_16x9.jpg
0a24821d-2300-4033-aa2f-83e6f9919fcd	मटन	https://www.foodiaq.com/wp-content/uploads/2024/08/mutton-curry.jpg
185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर	https://www.cubesnjuliennes.com/wp-content/uploads/2023/12/Tawa-Paneer-Masala-Recipe.jpg
bf932a1d-12d7-4550-b96c-1fa65b4744e6	मंचूरियन	https://atanurrannagharrecipe.com/wp-content/uploads/2023/01/Veg-Manchurian-for-website.jpg
dd760774-f458-4893-b2e0-8438b648f047	मशरूम	https://static.toiimg.com/thumb/75534551.cms?imgsize=2437474&width=600&height=400
20acfe22-bd5f-45e6-b199-3f1395e59723	पकौड़ा 	https://www.cookingwithsiddhi.com/wp-content/uploads/2017/12/lauki-pyaz-ke-pakode.jpg
66c4be12-21ff-4f9c-8d6c-78c0503824f7	वाटर बोतल	https://pbs.twimg.com/media/FExdg_zVEAcs2Fz.jpg
0c4ab2e9-e089-4002-8f1f-38d8bbc826df	कोल्ड ड्रिंक	https://gadegal-homestay.himwebx.com/wp-content/uploads/2023/10/cold-drink.jpeg
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.menu_items (id, category_id, name, variants) FROM stdin;
99215e77-0e64-4213-b7e2-a81fc0ee7596	e180ee01-acd6-4ee3-8e13-07ddc6cd4a83	भेज चाउमीन 	"[{\\"name\\":\\"Half\\",\\"price\\":25},{\\"name\\":\\"Full\\",\\"price\\":40}]"
db196c61-a1b6-4abc-bd12-a300dc891256	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर मशाला 	"[{\\"name\\":\\"Half\\",\\"price\\":110},{\\"name\\":\\"Full\\",\\"price\\":200}]"
1362f8ef-0cad-4d86-b227-edd82add185f	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर दो प्याजा	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":220}]"
eff12584-3b5c-4a4c-978e-1320ab356406	e180ee01-acd6-4ee3-8e13-07ddc6cd4a83	एग चाउमीन	"[{\\"name\\":\\"Half\\",\\"price\\":40},{\\"name\\":\\"Full\\",\\"price\\":70}]"
980172f5-eb94-4b83-84e2-58ab482a05c8	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर बटर मशाला	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":220}]"
5841e919-727c-4a5a-b738-d9482335775c	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर कड़ाही	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":220}]"
4aabb2ed-c97a-44d8-a410-8d7ab4038cfa	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर लवदार	"[{\\"name\\":\\"Half\\",\\"price\\":110},{\\"name\\":\\"Full\\",\\"price\\":220}]"
b081029d-546f-4a53-9d55-43533cd29bb0	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर हांडी	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":230}]"
96032f32-b613-4d5f-a818-a0ac46140cfe	185e4d5e-b642-4929-80e5-438e807b9ff9	शाही पनीर कोरमा	"[{\\"name\\":\\"Half\\",\\"price\\":150},{\\"name\\":\\"Full\\",\\"price\\":280}]"
23aa7d9e-7f99-43f2-8d13-eb98c8ee5d2a	185e4d5e-b642-4929-80e5-438e807b9ff9	मटर पनीर	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":180}]"
406b0a86-3a76-4b26-b932-3191960cf0f4	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर चिल्ली	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":180}]"
0fecbd9e-d6a2-4e39-a782-8baa77b4e371	185e4d5e-b642-4929-80e5-438e807b9ff9	पनीर चिल्ली ड्राई 	"[{\\"name\\":\\"Half\\",\\"price\\":100},{\\"name\\":\\"Full\\",\\"price\\":200}]"
f99c2526-61c3-4900-b5e0-efe8e33ac250	dd760774-f458-4893-b2e0-8438b648f047	मशरूम मशाला	"[{\\"name\\":\\"Half\\",\\"price\\":110},{\\"name\\":\\"Full\\",\\"price\\":200}]"
49f08786-a198-4a16-8cef-5c1720c73d9f	dd760774-f458-4893-b2e0-8438b648f047	मशरूम बटर मशाला 	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":220}]"
a9e7122d-2b45-4a88-852c-ecc9a2af740a	dd760774-f458-4893-b2e0-8438b648f047	मशरूम दो प्याजा	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":220}]"
58030940-a56f-4634-87e9-e772013dfaf5	dd760774-f458-4893-b2e0-8438b648f047	मशरूम कड़ाही 	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":220}]"
e6f40d24-8dde-406c-bcc2-890e9326e937	dd760774-f458-4893-b2e0-8438b648f047	मशरूम चिल्ली 	"[{\\"name\\":\\"Half\\",\\"price\\":100},{\\"name\\":\\"Full\\",\\"price\\":180}]"
3475b7be-d923-46ac-ad79-4ab2653d0fcb	dd760774-f458-4893-b2e0-8438b648f047	मशरूम चिल्ली ड्राई 	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":200}]"
6b9c3026-5c93-403e-9f2e-902a5c260e72	bf932a1d-12d7-4550-b96c-1fa65b4744e6	भेज मंचूरियन 	"[{\\"name\\":\\"Half\\",\\"price\\":60},{\\"name\\":\\"Full\\",\\"price\\":100}]"
29ee2f46-4147-4e4a-a6b0-e5dfc62d40ee	bf932a1d-12d7-4550-b96c-1fa65b4744e6	पनीर मंचूरियन 	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":180}]"
b2a088c1-06d7-4e01-be9b-6e02dff98532	bf932a1d-12d7-4550-b96c-1fa65b4744e6	चिकन मंचूरियन 	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":180}]"
819f6772-0baa-48c3-b378-bccb49e2127a	a797fb80-971c-463c-9474-e58a16d7f322	भेज रोल 	"[{\\"name\\":\\"Custom\\",\\"price\\":30}]"
bcf6ffbd-5ad1-4ca6-94ff-9f03ccdfdd4d	a797fb80-971c-463c-9474-e58a16d7f322	पनीर रोल 	"[{\\"name\\":\\"Custom\\",\\"price\\":60}]"
3b970e3f-10e9-4de7-8697-929896c67828	a797fb80-971c-463c-9474-e58a16d7f322	एग रोल सिंगल अंडा 	"[{\\"name\\":\\"Custom\\",\\"price\\":40}]"
e626d712-7ee0-48c1-bd03-b18007f1cca9	a797fb80-971c-463c-9474-e58a16d7f322	एग रोल डबल अंडा 	"[{\\"name\\":\\"Custom\\",\\"price\\":45}]"
581b6f7a-741e-49cb-8450-25a404e8f7a3	a797fb80-971c-463c-9474-e58a16d7f322	एग चिकन रोल	"[{\\"name\\":\\"Custom\\",\\"price\\":90}]"
f8dfec4c-e972-408b-84af-ba9a779caa4a	a797fb80-971c-463c-9474-e58a16d7f322	एग पनीर रोल	"[{\\"name\\":\\"Custom\\",\\"price\\":80}]"
5065751a-f11b-4e1a-805f-f7a3776bb814	e180ee01-acd6-4ee3-8e13-07ddc6cd4a83	चिकन चाउमीन	"[{\\"name\\":\\"Half\\",\\"price\\":60},{\\"name\\":\\"Full\\",\\"price\\":110}]"
a7426f2e-0abb-49db-baf8-0865b72ee1b3	e180ee01-acd6-4ee3-8e13-07ddc6cd4a83	मिक्स चाउमीन 	"[{\\"name\\":\\"Half\\",\\"price\\":70},{\\"name\\":\\"Full\\",\\"price\\":140}]"
e730cb76-c034-4934-b39d-0af7699a4b74	e180ee01-acd6-4ee3-8e13-07ddc6cd4a83	पनीर चाउमीन 	"[{\\"name\\":\\"Half\\",\\"price\\":60},{\\"name\\":\\"Full\\",\\"price\\":110}]"
5b0fe9b4-2bb7-49ed-89f3-b7117ca8a6dd	ea6e16ba-527d-494d-b346-a0c86b05d3b1	प्लेन रोटी 	"[{\\"name\\":\\"Custom\\",\\"price\\":6}]"
658c8d1c-dfc7-4583-aec6-e4eac71558f3	ea6e16ba-527d-494d-b346-a0c86b05d3b1	बटर रोटी	"[{\\"name\\":\\"Custom\\",\\"price\\":12}]"
b4721cfb-2a40-4820-bc9f-c52e9cc43529	ea6e16ba-527d-494d-b346-a0c86b05d3b1	पराठा	"[{\\"name\\":\\"Custom\\",\\"price\\":15}]"
fbe652ef-7247-4930-a714-4ff99ff383da	ea6e16ba-527d-494d-b346-a0c86b05d3b1	लच्छा पराठा	"[{\\"name\\":\\"Custom\\",\\"price\\":20}]"
09c9cbb2-ee4c-4c95-8682-e3b503e43a01	9931fc10-196b-4956-9d34-5e669713236f	अंडा कड़ी 	"[{\\"name\\":\\"Half\\",\\"price\\":80},{\\"name\\":\\"Full\\",\\"price\\":130}]"
f2f5f11e-55e6-4f69-acac-044547c5c690	9931fc10-196b-4956-9d34-5e669713236f	एग दो प्याजा	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":160}]"
57b3bc23-95b7-4791-92e5-e868e4c2e6b9	1b9f526a-2095-4b4f-8a80-8fc42b3b5e06	ऑनियन सलाद 	"[{\\"name\\":\\"Custom\\",\\"price\\":30}]"
7c28edd4-d440-4714-a3db-9a6313ab62e0	1b9f526a-2095-4b4f-8a80-8fc42b3b5e06	ग्रीन सलाद 	"[{\\"name\\":\\"Custom\\",\\"price\\":40}]"
6d08af50-2017-4f96-b856-44add49f0d10	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन मशाला	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":220}]"
a6948ab3-28a0-4f50-bccb-b158857170ad	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन बटर मशाला	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":230}]"
7a9fbce6-288e-4d0a-aeaa-60c2b7d9b040	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन दो प्याजा	"[{\\"name\\":\\"Half\\",\\"price\\":120},{\\"name\\":\\"Full\\",\\"price\\":230}]"
76baad76-951e-4e29-bb33-2bd30ee282a5	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन कड़ाही	"[{\\"name\\":\\"Half\\",\\"price\\":110},{\\"name\\":\\"Full\\",\\"price\\":220}]"
628ebd7e-911a-4735-8d9c-a6fe5c1a5e8a	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन देहाती	"[{\\"name\\":\\"Half\\",\\"price\\":180},{\\"name\\":\\"Full\\",\\"price\\":340}]"
98477939-d321-49ab-b21b-0999dc6074c3	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन शाही कोरमा	"[{\\"name\\":\\"Half\\",\\"price\\":125},{\\"name\\":\\"Full\\",\\"price\\":250}]"
80d8d8ee-9674-42e5-a935-954b516e9054	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन लवदार 	"[{\\"name\\":\\"Half\\",\\"price\\":140},{\\"name\\":\\"Full\\",\\"price\\":280}]"
7b85994a-eada-479f-8f3d-324995c858ec	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन गारलिक	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":170}]"
bdc4b1e3-8aa5-4d08-bf33-9b3e8ab8a5d9	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन चिल्ली बोनलेस	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":180}]"
ee7dfe1c-d825-4d5a-bd39-3a942a4d673e	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन चिल्ली बोन	"[{\\"name\\":\\"Half\\",\\"price\\":90},{\\"name\\":\\"Full\\",\\"price\\":180}]"
c59f642c-ecb7-49db-b43f-d431bf9333df	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन चिल्ली बोनलेस ड्राई	"[{\\"name\\":\\"Half\\",\\"price\\":100},{\\"name\\":\\"Full\\",\\"price\\":200}]"
f6ba6b08-7b0f-4973-8ba6-e18c29cc6424	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन लॉलीपॉप	"[{\\"name\\":\\"Custom\\",\\"price\\":220}]"
b4e10415-4a6e-46ea-8585-7ee539a8ce26	95ebf245-5e35-4dbf-ad20-611ec48f6369	चिकन हांडी ( ½ kg, 1kg )	"[{\\"name\\":\\"Half\\",\\"price\\":300},{\\"name\\":\\"Full\\",\\"price\\":560}]"
b405e167-d0cd-4df9-8035-55417190fdbb	5776b12d-ea42-45ba-aaea-130b63c9a540	भेज बिरयानी 	"[{\\"name\\":\\"Custom\\",\\"price\\":130}]"
31f20efa-20bc-411b-aa4e-e67dbccf7db6	5776b12d-ea42-45ba-aaea-130b63c9a540	पनीर बिरयानी 	"[{\\"name\\":\\"Custom\\",\\"price\\":160}]"
81960d06-bdd8-4416-8ec9-5d8b0df33dae	5776b12d-ea42-45ba-aaea-130b63c9a540	एग बिरयानी 	"[{\\"name\\":\\"Custom\\",\\"price\\":150}]"
e49f517c-40cd-405f-acfc-72e56b799dbd	5776b12d-ea42-45ba-aaea-130b63c9a540	चिकन बिरयानी 	"[{\\"name\\":\\"Custom\\",\\"price\\":160}]"
3b643f72-3750-4f82-8a37-fa799716469e	f27698b5-60cc-45b3-ba80-c13800271e54	जीरा राईस 	"[{\\"name\\":\\"Half\\",\\"price\\":40},{\\"name\\":\\"Full\\",\\"price\\":170}]"
220d6c31-d88c-4181-9251-612bb40a843c	f27698b5-60cc-45b3-ba80-c13800271e54	भेज फ्राईराईस 	"[{\\"name\\":\\"Half\\",\\"price\\":40},{\\"name\\":\\"Full\\",\\"price\\":70}]"
0f0f110a-c68a-4de1-9fb0-ff5b9e2e4589	f27698b5-60cc-45b3-ba80-c13800271e54	चिकन फ्राईराईस 	"[{\\"name\\":\\"Half\\",\\"price\\":60},{\\"name\\":\\"Full\\",\\"price\\":120}]"
6b74e569-ea0b-4925-a29b-54235c531251	f27698b5-60cc-45b3-ba80-c13800271e54	एग फ्राईराईस 	"[{\\"name\\":\\"Half\\",\\"price\\":50},{\\"name\\":\\"Full\\",\\"price\\":190}]"
462a806b-6163-4ce5-8241-97c516bb21dc	f27698b5-60cc-45b3-ba80-c13800271e54	मिक्स फ्राईराईस 	"[{\\"name\\":\\"Half\\",\\"price\\":80},{\\"name\\":\\"Full\\",\\"price\\":150}]"
4ae0bbf6-6e6a-4e88-aa34-94bf1a16d9f9	0c035160-1f23-4e77-8e0b-a46b3de4f42f	भेज बर्गर 	"[{\\"name\\":\\"Custom\\",\\"price\\":40}]"
46760d44-2a7c-43e5-85cd-c1795c96a648	0c035160-1f23-4e77-8e0b-a46b3de4f42f	पनीर बर्गर 	"[{\\"name\\":\\"Custom\\",\\"price\\":70}]"
0934be6f-4595-46f7-98c5-821a4bf763d9	0c035160-1f23-4e77-8e0b-a46b3de4f42f	चिज बर्गर 	"[{\\"name\\":\\"Custom\\",\\"price\\":100}]"
40571205-3fc9-4256-b1a9-e0b0fd15c789	e2724601-4a1d-49ce-bc2f-9f5383251d3e	भेज मोमोज स्टीम 	"[{\\"name\\":\\"Half\\",\\"price\\":25},{\\"name\\":\\"Full\\",\\"price\\":40}]"
d4648f4d-8916-4830-81c0-3931ae20de12	e2724601-4a1d-49ce-bc2f-9f5383251d3e	चिकन मोमोज स्टीम 	"[{\\"name\\":\\"Half\\",\\"price\\":35},{\\"name\\":\\"Full\\",\\"price\\":70}]"
09dd8feb-1368-4634-8c68-619ff8fa7721	e2724601-4a1d-49ce-bc2f-9f5383251d3e	भेज मोमोज फ्राई 	"[{\\"name\\":\\"Half\\",\\"price\\":30},{\\"name\\":\\"Full\\",\\"price\\":50}]"
55fae367-3165-413b-b61b-9dc51c32680d	e2724601-4a1d-49ce-bc2f-9f5383251d3e	चिकन मोमोज फ्राई 	"[{\\"name\\":\\"Half\\",\\"price\\":40},{\\"name\\":\\"Full\\",\\"price\\":80}]"
79ad53aa-71b0-449d-9917-7cde0ce58135	e2724601-4a1d-49ce-bc2f-9f5383251d3e	भेज चिल्ली मोमोज 	"[{\\"name\\":\\"Half\\",\\"price\\":50},{\\"name\\":\\"Full\\",\\"price\\":100}]"
cf56f962-78f4-41a9-921b-f8166d01e229	e2724601-4a1d-49ce-bc2f-9f5383251d3e	चिकन चिल्ली मोमोज	"[{\\"name\\":\\"Half\\",\\"price\\":60},{\\"name\\":\\"Full\\",\\"price\\":110}]"
69848c79-ef90-481c-a09f-83ddfcdec622	e2724601-4a1d-49ce-bc2f-9f5383251d3e	भेज कुरकुरे मोमोज	"[{\\"name\\":\\"Half\\",\\"price\\":70},{\\"name\\":\\"Full\\",\\"price\\":140}]"
dbb82c79-0888-44d3-8692-92571969948a	e2724601-4a1d-49ce-bc2f-9f5383251d3e	चिकन कुरकुरे मोमोज	"[{\\"name\\":\\"Half\\",\\"price\\":80},{\\"name\\":\\"Full\\",\\"price\\":160}]"
1862fe79-1984-496d-9fdd-207cb97f6fde	f3ced821-2ed5-456b-a0ca-e97947e7bb8a	भेज सूप 	"[{\\"name\\":\\"Custom\\",\\"price\\":50}]"
061f9eee-cc0e-41a4-9cd6-6fa81c316df3	f3ced821-2ed5-456b-a0ca-e97947e7bb8a	हॉट एंड सावर सूप 	"[{\\"name\\":\\"Custom\\",\\"price\\":70}]"
858d44b4-e3bb-4b81-ab2e-ba8e68c7498c	f3ced821-2ed5-456b-a0ca-e97947e7bb8a	चिकन सूप 	"[{\\"name\\":\\"Custom\\",\\"price\\":80}]"
4627f96a-0958-48d7-b9ca-eefce5e7903d	20acfe22-bd5f-45e6-b199-3f1395e59723	पनीर पकौड़ा 	"[{\\"name\\":\\"Custom\\",\\"price\\":200}]"
b3aea0d3-9942-4ba2-9ac2-360a4fc8c011	20acfe22-bd5f-45e6-b199-3f1395e59723	चिकन पकौड़ा 	"[{\\"name\\":\\"Custom\\",\\"price\\":180}]"
569ce1a3-c153-49a0-bf59-2317225c487c	0a24821d-2300-4033-aa2f-83e6f9919fcd	मटन 	"[{\\"name\\":\\"Custom\\",\\"price\\":210}]"
2f7b01e0-ddf5-4d17-b933-df4fb481e26c	0a24821d-2300-4033-aa2f-83e6f9919fcd	हांडी मटन ( 1 kg )	"[{\\"name\\":\\"Custom\\",\\"price\\":1050}]"
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.orders (id, user_id, amount, status, payment_method, payment_status, razorpay_order_id, razorpay_payment_id, created_at, items) FROM stdin;
2373f01b-5c36-41fd-8660-283ac78b13be	88d2a55f-1f4d-4b5c-968d-eda55f0e891e	65.00	pending	cod	success	\N	\N	2025-11-29 10:15:33.336734	"[{\\"id\\":\\"99215e77-0e64-4213-b7e2-a81fc0ee7596\\",\\"category_id\\":\\"e180ee01-acd6-4ee3-8e13-07ddc6cd4a83\\",\\"name\\":\\"भेज चाउमीन \\",\\"variants\\":[{\\"name\\":\\"Half\\",\\"price\\":25},{\\"name\\":\\"Full\\",\\"price\\":40}],\\"quantity\\":1,\\"variant\\":{\\"name\\":\\"Half\\",\\"price\\":25}}]"
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.users (id, email, full_name, refresh_token, access_token, role, created_at, fcm_token, location) FROM stdin;
88d2a55f-1f4d-4b5c-968d-eda55f0e891e	kaushalkrishnax@gmail.com	Kaushal Krishna	1660f72d30ae3f1dc1fb1d017d045d1a430027265f01cbe642a40852ac4b3cece0f3e9f7123447bd96ddde73a0e8054ea91c8c44b09182eb8d72d7076f566f81	\N	user	2025-11-29 10:08:21.395671	f6Z1ikOE_VxRqS0Z6pmjl1:APA91bFB5gqHtpN7wqh0nJHnq7yAk2gjBqjr0NNlzivcZmbEmPnBmrpU_lDunvGHHciGLEaCrxnx_dLQ3o1dVrCf_RmLVfdLX4ZfFf5kgW_Vdn0D6ybF2Lk	\N
641eec02-afb2-46cc-90ae-e622d936d35c	kaushalkrishna011@gmail.com	Kaushal Krishna	0f0cc172414e87ba1bfbce7c0e4d9bfccc886d293efcc10d219eb9f841c9bb87dac7e1b6735d8216587ac86babaaf42355f730a5d23a48ed92c25789518c1373	\N	user	2025-11-29 09:52:11.85135	f6Z1ikOE_VxRqS0Z6pmjl1:APA91bFB5gqHtpN7wqh0nJHnq7yAk2gjBqjr0NNlzivcZmbEmPnBmrpU_lDunvGHHciGLEaCrxnx_dLQ3o1dVrCf_RmLVfdLX4ZfFf5kgW_Vdn0D6ybF2Lk	\N
\.


--
-- Name: menu menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.menu(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: avnadmin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--
