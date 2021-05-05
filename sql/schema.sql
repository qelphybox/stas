create table if not exists stas_dict
(
	key varchar not null,
	value varchar not null,

	constraint stas_dict_pk primary key (key)
);

comment on table stas_dict is 'Simple key-value storage';

create unique index if not exists stas_dict_key_uindex
	on stas_dict (key);
