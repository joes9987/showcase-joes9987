select count(*) as bad_rows
from public.showcase_members
where headline like '%ΓÇö%' or bio like '%ΓÇö%' or display_name like '%ΓÇö%';