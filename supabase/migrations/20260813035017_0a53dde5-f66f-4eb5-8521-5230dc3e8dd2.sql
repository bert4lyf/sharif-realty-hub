-- ROLES
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'agent');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','super_admin'));
$$;

CREATE POLICY "profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "roles readable by authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "super admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PROPERTIES
CREATE TYPE public.property_status AS ENUM ('for_sale', 'pending', 'sold', 'for_rent', 'rented');
CREATE TYPE public.listing_type AS ENUM ('buy', 'rent', 'commercial');

CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  status public.property_status NOT NULL DEFAULT 'for_sale',
  listing_type public.listing_type NOT NULL DEFAULT 'buy',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  zip text NOT NULL DEFAULT '',
  latitude numeric,
  longitude numeric,
  beds integer NOT NULL DEFAULT 0,
  baths numeric NOT NULL DEFAULT 0,
  sqft integer NOT NULL DEFAULT 0,
  year_built integer,
  features text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads live properties" ON public.properties FOR SELECT TO anon USING (is_archived = false);
CREATE POLICY "staff read all properties" ON public.properties FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR is_archived = false);
CREATE POLICY "admins manage properties" ON public.properties FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER properties_updated BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LEADS
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'in_contract', 'closed');
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  source text NOT NULL DEFAULT 'website',
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  status public.lead_status NOT NULL DEFAULT 'new',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits a lead" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "authenticated submits a lead" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "staff read leads" ON public.leads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff update leads" ON public.leads FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "admins delete leads" ON public.leads FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_location text,
  rating integer NOT NULL DEFAULT 5,
  quote text NOT NULL,
  avatar_url text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads approved reviews" ON public.reviews FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "staff read reviews" ON public.reviews FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR is_approved = true);
CREATE POLICY "admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads faqs" ON public.faqs FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "staff read faqs" ON public.faqs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR is_published = true);
CREATE POLICY "admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- CASE STUDIES
CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  address text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  story text NOT NULL DEFAULT '',
  days_on_market integer,
  percent_of_asking numeric,
  sale_price numeric,
  image_url text,
  client_name text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads case studies" ON public.case_studies FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "staff read case studies" ON public.case_studies FOR SELECT TO authenticated USING (public.is_staff(auth.uid()) OR is_published = true);
CREATE POLICY "admins manage case studies" ON public.case_studies FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  ga4_measurement_id text,
  maps_api_key text,
  phone text NOT NULL DEFAULT '+1 (305) 555-0142',
  whatsapp text NOT NULL DEFAULT '13055550142',
  email text NOT NULL DEFAULT 'hello@sharifrealty.com',
  office_address text NOT NULL DEFAULT '1200 Brickell Ave, Suite 900, Miami, FL 33131',
  office_hours text NOT NULL DEFAULT 'Mo-Fr 09:00-19:00, Sa 10:00-16:00',
  latitude numeric NOT NULL DEFAULT 25.7617,
  longitude numeric NOT NULL DEFAULT -80.1918,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads settings" ON public.site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "authenticated reads settings" ON public.site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "super admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.site_settings (id) VALUES (1);

-- SEED PROPERTIES
INSERT INTO public.properties (slug, title, description, price, status, listing_type, address, city, state, zip, latitude, longitude, beds, baths, sqft, year_built, features, images, is_featured) VALUES
('1420-sunset-key-drive', 'Sunset Key Waterfront Villa', 'A rare waterfront villa with 60 feet of private dockage, a sunken living room framed in floor-to-ceiling glass, and a summer kitchen overlooking the bay. Chef-grade appliances, imported limestone floors, and a primary suite with dual dressing rooms.', 4250000, 'for_sale', 'buy', '1420 Sunset Key Drive', 'Key Biscayne', 'FL', '33149', 25.6907, -80.1653, 5, 5.5, 6120, 2019, ARRAY['Private dock','Infinity pool','Smart home','Summer kitchen','3-car garage'], ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'], true),
('880-brickell-sky-residence', 'Brickell Sky Residence 47B', 'Corner residence on the 47th floor with wraparound terraces, sunrise-to-sunset exposure, and a private elevator landing. Building amenities include a spa level, resident lounge, and 24-hour concierge.', 2185000, 'for_sale', 'buy', '880 Brickell Avenue #47B', 'Miami', 'FL', '33131', 25.7645, -80.1918, 3, 3.5, 2640, 2021, ARRAY['Private elevator','Wraparound terrace','Concierge','Spa level'], ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80'], true),
('37-coral-grove-estate', 'Coral Grove Garden Estate', 'Behind a coral wall and a canopy of oaks, this Coconut Grove estate pairs original 1938 architecture with a fully reimagined interior, guest cottage, and lap pool.', 3390000, 'pending', 'buy', '37 Coral Grove Lane', 'Coconut Grove', 'FL', '33133', 25.7279, -80.2436, 4, 4, 4380, 1938, ARRAY['Guest cottage','Lap pool','Historic details','Mature oaks'], ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80'], true),
('215-wynwood-lofts-4a', 'Wynwood Artist Loft 4A', 'Double-height loft in the heart of the arts district with polished concrete, steel-framed windows, and a private roof cabana. Walkable to galleries and the design district.', 7400, 'for_rent', 'rent', '215 NW 24th Street #4A', 'Miami', 'FL', '33127', 25.7995, -80.1994, 2, 2, 1780, 2018, ARRAY['Roof cabana','Double-height ceilings','Secure parking'], ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80'], false),
('900-design-district-retail', 'Design District Flagship Retail', 'Ground-floor flagship space with 34 feet of frontage on a pedestrian promenade, 18-foot ceilings, and dedicated loading. Ideal for luxury retail or a chef-driven concept.', 12500, 'for_rent', 'commercial', '900 NE 40th Street', 'Miami', 'FL', '33137', 25.8131, -80.1934, 0, 2, 3900, 2016, ARRAY['Corner frontage','18ft ceilings','Loading access','Grease trap ready'], ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'], false),
('58-palmetto-bay-ranch', 'Palmetto Bay Family Ranch', 'A one-story ranch on a half-acre lot with a screened lanai, new impact windows, and a school district families move for. Move-in ready with a brand new roof.', 985000, 'for_sale', 'buy', '58 SW 144th Terrace', 'Palmetto Bay', 'FL', '33158', 25.6229, -80.3235, 4, 3, 2610, 1994, ARRAY['Screened lanai','New roof','Impact windows','Half-acre lot'], ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1600&q=80'], true),
('12-star-island-compound', 'Star Island Bayfront Compound', 'Gated bayfront compound with 150 feet of water frontage, a two-slip dock, tennis pavilion, and unobstructed skyline views across Biscayne Bay.', 18900000, 'for_sale', 'buy', '12 Star Island Drive', 'Miami Beach', 'FL', '33139', 25.7712, -80.1553, 7, 8.5, 11400, 2015, ARRAY['150ft water frontage','Two-slip dock','Tennis pavilion','Staff quarters'], ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'], true),
('404-aventura-office-suite', 'Aventura Executive Office Suite', 'Turnkey professional suite with six private offices, a conference room, and covered parking directly off Biscayne Boulevard.', 8900, 'for_rent', 'commercial', '404 Biscayne Boulevard, Suite 300', 'Aventura', 'FL', '33180', 25.9564, -80.1392, 0, 2, 3100, 2009, ARRAY['Six private offices','Conference room','Covered parking'], ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'], false);

-- SEED REVIEWS
INSERT INTO public.reviews (author_name, author_location, rating, quote, avatar_url, is_approved) VALUES
('Danielle Marsh', 'Key Biscayne, FL', 5, 'Majeed answered my first message in under ten minutes at 9pm on a Sunday. That responsiveness never let up. We were under contract in nine days, over asking.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', true),
('Andre Boulos', 'Coral Gables, FL', 5, 'We had been passed around by three other agents. Sharif Realty priced our home correctly, staged it in a week, and handled every inspection issue without drama.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', true),
('Priya Raman', 'Brickell, Miami', 5, 'As a first-time buyer I asked a hundred questions. I got a hundred straight answers, plus a lender who actually closed on time.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', true),
('Tomas Vega', 'Palmetto Bay, FL', 5, 'They sold our ranch in 8 days for 102% of asking while we were relocating out of state. Everything handled remotely and cleanly.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', true),
('Lauren Whitfield', 'Miami Beach, FL', 5, 'The market analysis they brought to our first meeting was more thorough than anything we saw from the big brokerages.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', true);

-- SEED FAQS
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('How quickly will someone respond to my inquiry?', 'Within 15 minutes during business hours, and almost always within the hour outside of them. Every inquiry routes to a licensed agent, not a call center.', 'Working With Us', 1),
('How much do I need for a down payment?', 'Conventional loans commonly start at 5% down, FHA at 3.5%, and VA loans at 0% for eligible buyers. Putting 20% down avoids mortgage insurance. We introduce you to lenders who will quote you in writing.', 'Buying', 2),
('What closing costs should a buyer expect in Florida?', 'Budget roughly 2%-5% of the purchase price. That typically covers lender fees, title insurance, appraisal, inspection, recording fees, and prepaid taxes and insurance.', 'Closing Costs', 3),
('What does a seller pay at closing?', 'Sellers generally cover brokerage compensation as negotiated, documentary stamp taxes on the deed, title and settlement charges by local custom, and prorated taxes. We provide a written net-proceeds estimate before you list.', 'Closing Costs', 4),
('How long does it take to sell a home?', 'Our listings averaged 14 days to contract last year, versus 38 for the wider market. Correct pricing, professional photography, and pre-inspection are what compress that timeline.', 'Selling', 5),
('Should I get pre-approved before touring homes?', 'Yes. Pre-approval sharpens your budget and makes your offer credible. In competitive segments, sellers rarely consider offers without it.', 'Financing', 6),
('Do you help with investment and rental property?', 'We do. We model gross yield, expenses, and realistic vacancy for long-term and seasonal rentals, and can refer vetted property managers.', 'Buying', 7),
('Can I break my listing agreement?', 'Our agreements include a straightforward exit clause. If we are not performing, you are not trapped.', 'Selling', 8);

-- SEED CASE STUDIES
INSERT INTO public.case_studies (slug, title, address, summary, story, days_on_market, percent_of_asking, sale_price, image_url, client_name) VALUES
('palmetto-bay-ranch-8-days', 'Sold in 8 days at 102% of asking', '58 SW 144th Terrace, Palmetto Bay', 'A relocating family needed a clean, fast sale without being in town for showings.', 'We pre-inspected, repaired the two items likely to derail a deal, and photographed the home the day the lanai screens were replaced. Twelve showings in the first weekend produced four offers. We negotiated an as-is contract with a 14-day inspection waiver and a rent-back so the family could finish the school year.', 8, 102, 1005000, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80', 'The Vega Family'),
('brickell-tower-record-price', 'Record price per square foot in the building', '880 Brickell Avenue #38A', 'An owner had been listed for seven months with another brokerage and no offers.', 'The unit was priced against the wrong comparables. We repositioned it as a corner-line residence, restaged for evening light, and launched to a targeted international buyer list. Under contract in 19 days at a building record of $842 per square foot.', 19, 99, 2222000, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80', 'Private Seller'),
('coconut-grove-off-market-buy', 'Bought off-market, $310K under comps', '37 Coral Grove Lane, Coconut Grove', 'Buyers had lost three bidding wars and were ready to give up on the Grove.', 'We canvassed owners of historic homes on the two streets our clients loved and found a seller planning to list in spring. We negotiated privately before it hit the market, with an appraisal contingency intact, and closed $310,000 below neighborhood comparables.', 0, 91, 3080000, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80', 'The Okonjo Family'),
('wynwood-portfolio-lease-up', 'Full lease-up of a 12-unit loft building', '215 NW 24th Street, Wynwood', 'An investor took over a newly converted loft building with zero tenants.', 'We built a leasing funnel with same-day tour scheduling and a 15-minute response standard, priced by line and exposure, and leased all twelve units in 34 days at 4% above the pro forma rent.', 34, 104, NULL, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80', 'Bayline Capital');