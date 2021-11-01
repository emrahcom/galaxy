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

-- keep these two lines always at the top.
-- rollback if this is a prod server.
DELETE FROM param WHERE key = 'system-prod' AND value = '0';
INSERT INTO param VALUES (DEFAULT, 'system-prod', '0');

-- param
DELETE FROM param WHERE key != 'system-prod';

-- identity
DELETE FROM identity;
INSERT INTO identity VALUES (DEFAULT, 'myemail@mydomain.com', 'mypasswd', True,
    DEFAULT, DEFAULT);

-- profile
DELETE FROM profile;
INSERT INTO profile VALUES (DEFAULT,
    (SELECT id FROM IDENTITY WHERE email = 'myemail@mydomain.com'),
    'myname', 'myemail@mydomain.com', '', True, True, DEFAULT, DEFAULT);

COMMIT;
