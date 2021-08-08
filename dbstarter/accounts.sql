CREATE TABLE IF NOT EXISTS accounts (
  user_id    serial      PRIMARY KEY     ,
	email      text        UNIQUE NOT NULL ,
	created_on timestamp   NOT NULL        ,
  last_login timestamp                   ,
  schedule   boolean[96]                 
);