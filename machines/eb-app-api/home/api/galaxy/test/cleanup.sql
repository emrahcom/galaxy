-- -----------------------------------------------------------------------------
-- identity
-- -----------------------------------------------------------------------------
-- Deletes all test data.
-- -----------------------------------------------------------------------------
DELETE FROM identity
WHERE id IN (SELECT identity_id
             FROM profile
             WHERE name LIKE 'user.%'
               AND email LIKE 'user.%@galaxy.corp'
            );

-- -----------------------------------------------------------------------------
-- profile
-- -----------------------------------------------------------------------------
-- Deletes test data created by profile scripts.
-- Run these queries to rerun profile scripts without recreating identities.
-- -----------------------------------------------------------------------------
DELETE FROM profile
WHERE name
LIKE 'profile-%';

UPDATE profile
SET is_default = true
WHERE name LIKE 'user.%'
  AND email LIKE 'user.%@galaxy.corp';

-- -----------------------------------------------------------------------------
-- domain
-- -----------------------------------------------------------------------------
-- Deletes test data created by domain scripts.
-- -----------------------------------------------------------------------------
DELETE FROM domain
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- domain_invite
-- -----------------------------------------------------------------------------
-- Deletes test data created by domain-invite scripts.
-- -----------------------------------------------------------------------------
DELETE FROM domain_invite
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- domain_partner
-- -----------------------------------------------------------------------------
-- Deletes test data created by domain-partnerhip and domain-partner scripts.
-- -----------------------------------------------------------------------------
DELETE FROM domain_partner
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );
UPDATE domain_invite
SET enabled = true
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );
DELETE FROM contact
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- room
-- -----------------------------------------------------------------------------
-- Deletes test data created by room scripts.
-- -----------------------------------------------------------------------------
DELETE FROM room
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- room_invite
-- -----------------------------------------------------------------------------
-- Deletes test data created by room-invite scripts.
-- -----------------------------------------------------------------------------
DELETE FROM room_invite
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- room_partner
-- -----------------------------------------------------------------------------
-- Deletes test data created by room-partnerhip and room-partner scripts.
-- -----------------------------------------------------------------------------
DELETE FROM room_partner
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );
UPDATE room_invite
SET enabled = true
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );
DELETE FROM contact
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- meeting
-- -----------------------------------------------------------------------------
-- Deletes test data created by meeting scripts.
-- -----------------------------------------------------------------------------
DELETE FROM meeting
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- meeting_invite
-- -----------------------------------------------------------------------------
-- Deletes test data created by meeting-invite scripts.
-- -----------------------------------------------------------------------------
DELETE FROM meeting_invite
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- meeting_member
-- -----------------------------------------------------------------------------
-- Deletes test data created by meeting_memberhip and meeting_member scripts.
-- -----------------------------------------------------------------------------
DELETE FROM meeting_member
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );
UPDATE meeting_invite
SET enabled = true
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );
DELETE FROM contact
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );

-- -----------------------------------------------------------------------------
-- meeting_reuqest
-- -----------------------------------------------------------------------------
-- Deletes test data created by meeting-request scripts.
-- -----------------------------------------------------------------------------
DELETE FROM meeting_request
WHERE identity_id IN (SELECT identity_id
                      FROM profile
                      WHERE name LIKE 'user.%'
                        AND email LIKE 'user.%@galaxy.corp'
                     );
