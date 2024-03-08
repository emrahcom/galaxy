import { query } from "../database/common.ts";

// -----------------------------------------------------------------------------
async function delDomainPartnerCandidate() {
  const sql = {
    text: `
      DELETE FROM domain_partner_candidate
      WHERE expired_at < now()`,
  };
  await query(sql);
}

// -----------------------------------------------------------------------------
async function delRoomPartnerCandidate() {
  const sql = {
    text: `
      DELETE FROM room_partner_candidate
      WHERE expired_at < now()`,
  };
  await query(sql);
}

// -----------------------------------------------------------------------------
async function delMeetingMemberCandidate() {
  const sql = {
    text: `
      DELETE FROM meeting_member_candidate
      WHERE expired_at < now()`,
  };
  await query(sql);
}

// -----------------------------------------------------------------------------
export default async function () {
  await delDomainPartnerCandidate();
  await delRoomPartnerCandidate();
  await delMeetingMemberCandidate();
}
