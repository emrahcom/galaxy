import { GALAXY_FQDN } from "../../config.ts";
import { MAILER_FROM, MAILER_TRANSPORT_OPTIONS } from "../../config.mailer.ts";
import { getIdentity, getIdentityByPhoneCode } from "../database/identity.ts";
import { getPhonePrivatesByCode } from "../database/phone.ts";
import {
  getContactByIdentity,
  getContactIdentity,
} from "../database/contact.ts";
import { createTransport } from "npm:nodemailer";
import type { MeetingSessionForReminder } from "../database/types.ts";

// -----------------------------------------------------------------------------
export async function sendMail(
  mailTo: string,
  mailSubject: string,
  mailText: string,
) {
  try {
    const transporter = createTransport(MAILER_TRANSPORT_OPTIONS);
    const mailOptions = {
      from: MAILER_FROM,
      to: mailTo,
      subject: mailSubject,
      text: mailText,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
export async function mailMissedCall(caller: string, callee: string) {
  try {
    const calleeIdentities = await getIdentity(callee);
    const calleeIdentity = calleeIdentities[0];
    if (!calleeIdentity) throw "callee not found";

    const mailTo = calleeIdentity.identity_attr.email;
    if (!mailTo) throw "email not found";

    const calleeContacts = await getContactByIdentity(callee, caller);
    const calleeContact = calleeContacts[0];
    if (!calleeContact) throw "contact not found for callee";

    const contactId = calleeContact.id;
    const callerName = calleeContact.name;
    const callbackLink = `https://${GALAXY_FQDN}/pri/contact/call/${contactId}`;

    const mailSubject = `${callerName} called you`;
    const mailText = `
      Missed call:
      ${callerName} called you

      ${callbackLink}
    `.replace(/^ +/gm, "");

    const res = await sendMail(mailTo, mailSubject, mailText);
    if (!res) throw "sendMail failed";

    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
export async function mailPhoneCall(code: string) {
  try {
    const ownerIdentities = await getIdentityByPhoneCode(code);
    const ownerIdentity = ownerIdentities[0];
    if (!ownerIdentity) throw "owner not found";

    const mailTo = ownerIdentity.identity_attr.email;
    if (!mailTo) throw "email not found";

    const virtualPhones = await getPhonePrivatesByCode(code);
    const virtualPhone = virtualPhones[0];
    if (!virtualPhone) throw "phone not found";

    const recommendedLink = `https://${GALAXY_FQDN}/pri/phone`;
    const mailSubject = `Your virtual phone is ringing, ${virtualPhone}`;
    const mailText = `
      Your virtual phone is ringing
      ${virtualPhone}

      ${recommendedLink}
    `.replace(/^ +/gm, "");

    const res = await sendMail(mailTo, mailSubject, mailText);
    if (!res) throw "sendMail failed";

    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
export async function mailMeetingSession(
  meetingSession: MeetingSessionForReminder,
) {
  try {
    const mailTo = meetingSession.email;
    if (!mailTo) throw "email not found";

    let meetingName = meetingSession.meeting_name;
    if (meetingSession.meeting_schedule_name) {
      meetingName = `${meetingName} (${meetingSession.meeting_schedule_name})`;
    }

    const baseLinkForRole = `https://${GALAXY_FQDN}/pri/${meetingSession.role}`;
    const meetingLink = `${baseLinkForRole}/wait/${meetingSession.id}`;

    const mailSubject = `You have a meeting in 30 minutes, ${meetingName}`;
    const mailText = `
      You have a meeting in 30 minutes:
      ${meetingName}

      ${meetingLink}
    `.replace(/^ +/gm, "");

    const res = await sendMail(mailTo, mailSubject, mailText);
    if (!res) throw "sendMail failed";

    return true;
  } catch {
    return false;
  }
}
// -----------------------------------------------------------------------------
export async function getMailAttributesForCandidate(
  identityId: string,
  contactId: string,
) {
  // use contactId to get the identity id of the contact
  const ownerContacts = await getContactIdentity(identityId, contactId);
  const ownerContact = ownerContacts[0];
  if (!ownerContact) throw "contact not found for owner";
  const callee = ownerContact.id;

  const calleeIdentities = await getIdentity(callee);
  const calleeIdentity = calleeIdentities[0];
  if (!calleeIdentity) throw "callee not found";

  const mailTo = calleeIdentity.identity_attr.email;
  if (!mailTo) throw "email not found";

  const calleeContacts = await getContactByIdentity(callee, identityId);
  const calleeContact = calleeContacts[0];
  if (!calleeContact) throw "contact not found for callee";
  const ownerName = calleeContact.name;

  return {
    mailTo: mailTo,
    ownerName: ownerName,
  };
}

// -----------------------------------------------------------------------------
export async function mailToDomainPartnerCandidate(
  identityId: string,
  contactId: string,
  candidacyId: string,
) {
  try {
    const attr = await getMailAttributesForCandidate(identityId, contactId);

    const baseLink = `https://${GALAXY_FQDN}/pri/domain/partner/candidacy`;
    const acceptCandidacyLink = `${baseLink}/accept/${candidacyId}`;

    const mailSubject =
      `${attr.ownerName} invites you to be a meeting domain partner`;
    const mailText = `
      ${attr.ownerName} invites you to be a meeting domain partner:

      ${acceptCandidacyLink}
    `.replace(/^ +/gm, "");

    const res = await sendMail(attr.mailTo, mailSubject, mailText);
    if (!res) throw "sendMail failed";

    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
export async function mailToRoomPartnerCandidate(
  identityId: string,
  contactId: string,
  candidacyId: string,
) {
  try {
    const attr = await getMailAttributesForCandidate(identityId, contactId);

    const baseLink = `https://${GALAXY_FQDN}/pri/room/partner/candidacy`;
    const acceptCandidacyLink = `${baseLink}/accept/${candidacyId}`;

    const mailSubject =
      `${attr.ownerName} invites you to be a meeting room partner`;
    const mailText = `
      ${attr.ownerName} invites you to be a meeting room partner:

      ${acceptCandidacyLink}
    `.replace(/^ +/gm, "");

    const res = await sendMail(attr.mailTo, mailSubject, mailText);
    if (!res) throw "sendMail failed";

    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
export async function mailToMeetingMemberCandidate(
  identityId: string,
  contactId: string,
  candidacyId: string,
) {
  try {
    const attr = await getMailAttributesForCandidate(identityId, contactId);

    const baseLink = `https://${GALAXY_FQDN}/pri/meeting/member/candidacy`;
    const acceptCandidacyLink = `${baseLink}/accept/${candidacyId}`;

    const mailSubject = `${attr.ownerName} invites you to be a meeting member`;
    const mailText = `
      ${attr.ownerName} invites you to be a meeting member:

      ${acceptCandidacyLink}
    `.replace(/^ +/gm, "");

    const res = await sendMail(attr.mailTo, mailSubject, mailText);
    if (!res) throw "sendMail failed";

    return true;
  } catch {
    return false;
  }
}
