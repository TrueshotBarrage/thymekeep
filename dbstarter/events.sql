CREATE TABLE IF NOT EXISTS events (
  event_id    serial      PRIMARY KEY ,
  user_id     integer     FOREIGN KEY ,
  start_time  timestamptz NOT NULL    ,
  end_time    timestamptz NOT NULL    
);