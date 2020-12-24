-- ----------------------------------------------------------------------------
-- CREATE-GALAXY-TEST-DATA.SQL
-- ----------------------------------------------------------------------------
-- This script creates the test data on the database. Don't use on a production
-- machine. Tested on Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/create-galaxy-test-data.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f create-galaxy-test-data.sql
--
-- ----------------------------------------------------------------------------

BEGIN;

INSERT INTO account VALUES (DEFAULT, 'myemail@mydomain.com', 'mypasswd',
    'myname', DEFAULT, True, DEFAULT);

COMMIT;
