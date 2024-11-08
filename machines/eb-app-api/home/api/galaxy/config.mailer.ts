// -----------------------------------------------------------------------------
// Mailer config is not part of the main config.ts to make the system more
// customizable. The structure of "transportOptions" depends on the mail system.
//
// This config must provide "transportOptions" and "mailFrom" (the sender
// address).
// See https://nodemailer.com/smtp for details.
// -----------------------------------------------------------------------------

// transporter settings
export const transportOptions = {
  host: "___MAILER_HOST___",
  port: 465,
  secure: true,
  auth: {
    user: "___MAILER_USER___",
    pass: "___MAILER_PASS___",
  },
};

// the sender address
export const mailFrom = "___MAILER_FROM___";
