-- Remove avatar_url column and add redbubble_link column to the artist table.
alter table artist drop column avatar_url;
alter table artist add column redbubble_link text;
