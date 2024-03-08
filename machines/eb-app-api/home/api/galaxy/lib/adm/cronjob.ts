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
export default async function () {
  await delDomainInvite();
  await delDomainPartnerCandidate();
  await delRoomPartnerCandidate();
  await delMeetingMemberCandidate();
}
