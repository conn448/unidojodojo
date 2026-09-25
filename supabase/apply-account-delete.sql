-- UniDojo: self serve account deletion.
-- Run once in the SQL editor for the nbdqzqmrousbfgslgkzm project.
--
-- Deleting a row from auth.users needs rights that the browser key does not
-- have, so this runs SECURITY DEFINER. search_path is pinned to public so a
-- caller cannot shadow the tables it touches.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;

  delete from public.quiz_answers        where user_id = auth.uid();
  delete from public.lesson_progress     where user_id = auth.uid();
  delete from public.society_memberships where user_id = auth.uid();
  delete from public.feedback            where user_id = auth.uid();
  delete from public.user_roles          where user_id = auth.uid();
  delete from public.profiles            where id      = auth.uid();
  delete from auth.users                 where id      = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
