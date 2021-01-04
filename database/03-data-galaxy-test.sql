-- ----------------------------------------------------------------------------
-- 03-DATA-GALAXY-TEST.SQL
-- ----------------------------------------------------------------------------
-- This script creates the test data on the database. Don't use it on a
-- production machine. Tested on Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/03-data-galaxy-test.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f 03-data-galaxy-test.sql
--
-- ----------------------------------------------------------------------------

BEGIN;

-- keep these two lines always at the top
-- rollback if this is a prod server
DELETE FROM param WHERE key = 'system-prod' AND value = '0';
INSERT INTO param VALUES (DEFAULT, 'system-prod', '0');

-- param
DELETE FROM param WHERE key != 'system-prod';
INSERT INTO param VALUES (DEFAULT, 'admin-passwd',
    crypt('test', gen_salt('bf', 8)));

-- account
DELETE FROM account;
INSERT INTO account VALUES (DEFAULT, 'myemail@mydomain.com', 'mypasswd', True,
    DEFAULT);

COMMIT;
