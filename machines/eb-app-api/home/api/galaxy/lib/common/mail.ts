import { GALAXY_FQDN } from "../../config.ts";
import { MAILER_FROM, MAILER_TRANSPORT_OPTIONS } from "../../config.mailer.ts";
import { getIdentity } from "../database/identity.ts";
import { getContactByIdentity } from "../database/contact.ts";
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

    const mailSubject = `${callerName} called you`;
    const mailText = `
      Missed call:
      ${callerName} called you

      https://${GALAXY_FQDN}/pri/contact/call/${contactId}
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
    const meetingLink = `${baseLinkForRole}/waiting/${meetingSession.id}`;

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
