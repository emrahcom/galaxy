import { mailFrom, transportOptions } from "../../config.mailer.ts";
import { getIdentity } from "../database/identity.ts";
import { getDefaultProfile } from "../database/profile.ts";
import { createTransport } from "npm:nodemailer";

// -----------------------------------------------------------------------------
export async function sendMail(
  mailTo: string,
  mailSubject: string,
  mailText: string,
) {
  try {
    const transporter = createTransport(transportOptions);
    const mailOptions = {
      from: mailFrom,
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
export async function mailMissingCall(caller: string, callee: string) {
  try {
    const calleeIdentities = await getIdentity(callee);
    const calleeIdentity = calleeIdentities[0];
    if (!calleeIdentity) throw "callee not found";

    const mailTo = calleeIdentity.identity_attr.email;
    if (!mailTo) throw "email not found";

    const callerProfiles = await getDefaultProfile(caller);
    const callerProfile = callerProfiles[0];
    if (!callerProfile) throw "caller not found";
    const callerName = callerProfile.name;

    const mailSubject = `${callerName} called you`;
    const mailText = `Missed call:
      ${callerName} called you
    `;

    const res = await sendMail(mailTo, mailSubject, mailText);
    if (!res) throw "sendMail failed";
  } catch {
    // do nothing
  }
}
