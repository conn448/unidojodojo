-- UniDojo: prove that row level security is actually switched on.
--
-- Read only. Nothing here changes anything, so it is safe to run any time.
-- Run each block in the SQL editor for the nbdqzqmrousbfgslgkzm project and
-- compare the output against supabase/apply-all.sql.
--
-- Why this exists: a policy that only ever lived in a .sql file that was never
-- pasted is indistinguishable from a policy that is live, until someone reads
-- another learner's data. Outside the database there is no way to tell the two
-- apart, so this is the check that settles it.


-- ============================================================
-- 1. Is RLS switched on for every table?
-- EXPECT: rls_enabled = true on all 8 rows.
-- If any row says false, that table is world readable/writable with the
-- publishable key that ships in the browser bundle. That is the emergency.
-- ============================================================
select c.relname                as table_name,
       c.relrowsecurity         as rls_enabled,
       count(p.policyname)      as policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p
       on p.schemaname = n.nspname
      and p.tablename = c.relname
where n.nspname = 'public'
  and c.relkind = 'r'
group by c.relname, c.relrowsecurity
order by c.relrowsecurity, c.relname;


-- ============================================================
-- 2. What does each policy actually allow, and to whom?
-- EXPECT every row to be scoped to the caller, not to `true`.
-- The one deliberate exception is societies_public_read, which is `true` for
-- anon and authenticated by design. See the note at the bottom.
-- ============================================================
select tablename,
       policyname,
       cmd        as applies_to,
       roles,
       qual       as read_rule,
       with_check as write_rule
from pg_policies
where schemaname = 'public'
order by tablename, policyname;


-- ============================================================
-- 3. Does every table that holds a user's data have a user_id or id column
--    that the policies can match on?
-- EXPECT the four user-data tables to each key on their own user.
-- ============================================================
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and column_name in ('id', 'user_id', 'created_by')
order by table_name, column_name;


-- ============================================================
-- 4. Is the signup trigger installed? Without it a brand new account has no
--    profiles row. The frontend self-heals by inserting one on first sight,
--    so this is not fatal either way, but it should be present.
-- ============================================================
select trigger_name, event_object_schema, event_object_table, action_timing, event_manipulation
from information_schema.triggers
where trigger_schema = 'public'
   or event_object_schema = 'auth'
order by event_object_table, trigger_name;


-- ============================================================
-- 5. Is the account deletion function present?
-- EXPECT exactly one row.
-- ============================================================
select routine_name, security_type
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('delete_my_account', 'has_role', 'create_student_profile');


-- ============================================================
-- OPTIONAL HARDENING — not run by default, decide first.
-- ============================================================

-- (a) societies.join_code is readable by signed-out visitors.
-- The policy `societies_public_read` uses `using (true)` and anon holds SELECT,
-- so anyone holding the publishable key can list every society's join code. A
-- join code is the secret that lets a person join, so that is a real weakness.
-- Nothing breaks today because the app has no society UI, but it should be
-- closed before one ships. Either stop public reads:
--
--   revoke select on public.societies from anon;
--   drop policy "societies_public_read" on public.societies;
--   create policy "societies_signed_in_read" on public.societies
--     for select to authenticated using (true);
--
-- or keep public reads and grant columns instead of the whole table:
--
--   revoke select on public.societies from anon;
--   grant select (id, name, university, crest_url, created_at)
--     on public.societies to anon;

-- (b) XP and streak live only in the browser, so they do not follow a learner to
-- a second device. Lessons, quiz answers and accuracy DO follow, because they are
-- in Supabase. Adding the two columns below is only half the job — the frontend
-- has to read and write them too, so treat it as a small project rather than a
-- quick fix.
--
--   alter table public.profiles add column xp integer not null default 0;
--   alter table public.profiles add column streak integer not null default 0;
