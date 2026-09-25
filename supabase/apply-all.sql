-- UniDojo schema for the nbdqzqmrousbfgslgkzm project.
-- Combined from the three files in supabase/migrations, in order.
-- Run this once in the SQL editor. Safe to paste whole.

-- ===== 20260922183013_ecc1150e-b6eb-4fb4-a088-d5fe0041d0ad.sql =====
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  university text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','ar','both')),
  topics text[] NOT NULL DEFAULT '{}',
  reduce_motion boolean NOT NULL DEFAULT false,
  text_scale numeric NOT NULL DEFAULT 1 CHECK (text_scale BETWEEN 0.9 AND 1.3),
  notifications boolean NOT NULL DEFAULT true,
  leaderboard_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_own_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_own_delete" ON public.profiles FOR DELETE TO authenticated USING (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_own_read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE TABLE public.societies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  university text NOT NULL,
  join_code text NOT NULL UNIQUE CHECK (char_length(join_code) BETWEEN 4 AND 12),
  crest_url text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.societies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.societies TO authenticated;
GRANT ALL ON public.societies TO service_role;
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "societies_public_read" ON public.societies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "societies_create" ON public.societies FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "societies_owner_update" ON public.societies FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "societies_owner_delete" ON public.societies FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE TABLE public.society_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id uuid NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  member_role text NOT NULL DEFAULT 'member' CHECK (member_role IN ('member','organiser')),
  leaderboard_visible boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(society_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.society_memberships TO authenticated;
GRANT ALL ON public.society_memberships TO service_role;
ALTER TABLE public.society_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "memberships_own_read" ON public.society_memberships FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "memberships_own_insert" ON public.society_memberships FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "memberships_own_update" ON public.society_memberships FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "memberships_own_delete" ON public.society_memberships FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text NOT NULL,
  track_id text NOT NULL,
  current_step integer NOT NULL DEFAULT 0 CHECK (current_step >= 0),
  completed boolean NOT NULL DEFAULT false,
  score integer CHECK (score BETWEEN 0 AND 100),
  time_spent_seconds integer NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_own_all" ON public.lesson_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text NOT NULL,
  question_id text NOT NULL,
  answer jsonb NOT NULL,
  correct boolean NOT NULL,
  answered_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_answers TO authenticated;
GRANT ALL ON public.quiz_answers TO service_role;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "answers_own_all" ON public.quiz_answers FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  topic text NOT NULL,
  message text NOT NULL DEFAULT '',
  locale text NOT NULL DEFAULT 'en' CHECK (locale IN ('en','ar')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.feedback TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback_anon_create" ON public.feedback FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "feedback_auth_create" ON public.feedback FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "feedback_own_read" ON public.feedback FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "feedback_own_delete" ON public.feedback FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.learning_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  anonymous_id text,
  event_name text NOT NULL CHECK (event_name IN ('screen_view','lesson_start','lesson_complete','quiz_answer','language_switch','society_join','share_click','feedback_submit')),
  properties jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);
GRANT INSERT ON public.learning_events TO anon;
GRANT SELECT, INSERT, DELETE ON public.learning_events TO authenticated;
GRANT ALL ON public.learning_events TO service_role;
ALTER TABLE public.learning_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_anon_create" ON public.learning_events FOR INSERT TO anon WITH CHECK (user_id IS NULL AND anonymous_id IS NOT NULL);
CREATE POLICY "events_auth_create" ON public.learning_events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "events_own_read" ON public.learning_events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "events_own_delete" ON public.learning_events FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER societies_touch BEFORE UPDATE ON public.societies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER progress_touch BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.create_student_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name','')) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER create_profile_after_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_student_profile();

CREATE INDEX progress_user_idx ON public.lesson_progress(user_id, updated_at DESC);
CREATE INDEX memberships_society_idx ON public.society_memberships(society_id);
CREATE INDEX events_name_created_idx ON public.learning_events(event_name, created_at DESC);

-- ===== 20260922183024_e376f00a-4c75-4e04-9171-20d0ced996cf.sql =====
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.create_student_profile() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_student_profile() TO service_role;

-- ===== 20260922183032_cfffa200-0da5-439f-88d0-9e362175441b.sql =====
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

