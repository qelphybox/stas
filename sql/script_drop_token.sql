insert into stas_dict(key, value)
values('token', '')
on conflict (key) do update set value = '';
