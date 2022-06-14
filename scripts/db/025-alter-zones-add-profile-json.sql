begin;

alter table zones add column profileconfig jsonb not null default
      '{ "timezone": "America/New_York", "lampstart": "07:00:00", "lampduration": "{ hours: 10 }", "lampontemperature": "18.3", "lamponhumidity": "21", "lampofftemperature": "12.8", "lampoffhumidity": "21", "bloweractive": "180", "blowercycle": "180", "irrigationperday": "2", "irrigationduration": "300" }';

commit;

