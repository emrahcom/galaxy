import { query } from "../database/common.ts";

// -----------------------------------------------------------------------------
async function execute(sql: string) {
  const sqlObject = { text: sql };

  try {
    await query(sqlObject);
  } catch (e) {
    console.error(e);
  }
}

// -----------------------------------------------------------------------------
async function delDomainInvite() {
  const sql = `
    DELETE FROM domain_invite
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delRoomInvite() {
  const sql = `
    DELETE FROM room_invite
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delMeetingInvite() {
  const sql = `
    DELETE FROM meeting_invite
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delMeetingRequest() {
  const sql = `
    DELETE FROM meeting_request
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delDomainPartnerCandidate() {
  const sql = `
    DELETE FROM domain_partner_candidate
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delRoomPartnerCandidate() {
  const sql = `
    DELETE FROM room_partner_candidate
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delMeetingMemberCandidate() {
  const sql = `
    DELETE FROM meeting_member_candidate
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delMeetingSession() {
  const sql = `
    DELETE FROM meeting_session
    WHERE ended_at + interval '20 mins' < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delMeetingSchedule() {
  const sql = `
    DELETE FROM meeting_schedule s
    WHERE updated_at + interval '10 mins' < now()
      AND NOT EXISTS (SELECT 1
                      FROM meeting_session
                      WHERE meeting_schedule_id = s.id
                     )
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
async function delIntercom() {
  const sql = `
    DELETE FROM intercom
    WHERE expired_at < now()
  `;
  await execute(sql);
}

// -----------------------------------------------------------------------------
export default async function () {
  console.log("housekeeping...");

  await delDomainInvite();
  await delRoomInvite();
  await delMeetingInvite();
  await delMeetingRequest();
  await delDomainPartnerCandidate();
  await delRoomPartnerCandidate();
  await delMeetingMemberCandidate();
  await delMeetingSession();
  await delMeetingSchedule();
  await delIntercom();
}
