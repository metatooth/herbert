 create table readings (
   id serial primary key,
   meter varchar(255) not null,
   temperature numeric not null,
   humidity numeric not null,
   created_at timestamp not null default now()
 );

