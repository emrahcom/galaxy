import { GALAXY_FQDN } from "../../config.ts";
import { MAIL_FROM, TRANSPORT_OPTIONS } from "../../config.mailer.ts";
import { getIdentity } from "../database/identity.ts";
import { getContactByIdentity } from "../database/contact.ts";
import { createTransport } from "npm:nodemailer";

// -----------------------------------------------------------------------------
export async function sendMail(
  mailTo: string,
  mailSubject: string,
  mailText: string,
) {
  try {
    const transporter = createTransport(TRANSPORT_OPTIONS);
    const mailOptions = {
      from: MAIL_FROM,
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
  } catch {
    // do nothing
  }
}
