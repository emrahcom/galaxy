import { query } from "../database/common.ts";

// -----------------------------------------------------------------------------
async function deleteDomainPartnerCandidate() {
  const sql = {
    text: `
      DELETE FROM domain_partner_candidate
      WHERE expired_at < now()`,
  };
  await query(sql);
}

// -----------------------------------------------------------------------------
async function deleteMeetingMemberCandidate() {
  const sql = {
    text: `
      DELETE FROM meeting_member_candidate
      WHERE expired_at < now()`,
  };
  await query(sql);
}

// -----------------------------------------------------------------------------
export default async function () {
  await deleteMeetingMemberCandidate();
}
