// -----------------------------------------------------------------------------
// Mailer config is not part of the main config.ts to make the system more
// customizable. The structure of "TRANSPORT_OPTIONS" depends on the mail
// system.
//
// This config must provide "TRANSPORT_OPTIONS" and "MAIL_FROM" (the sender
// address).
//
// See https://nodemailer.com/smtp for details.
// -----------------------------------------------------------------------------

// transporter settings
export const TRANSPORT_OPTIONS = {
  host: "___MAILER_HOST___",
  port: 465,
  secure: true,
  auth: {
    user: "___MAILER_USER___",
    pass: "___MAILER_PASS___",
  },
};

// the sender address
export const MAIL_FROM = "___MAILER_FROM___";
