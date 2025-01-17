# galaxy

`Galaxy` is a web application for `Jitsi` admins and users to organize their
Jitsi meetings, meeting schedules and attendees.

This version has a built-in identity management system. Check
[Galaxy-kc](https://github.com/emrahcom/galaxy-kc) for version that uses
`Keycloak` as the identity management system.

### Try it

Try `Galaxy` using publicly available implementation on
[https://eparto.net](https://eparto.net)

Also check out
[Eparto Virtual Phone](https://github.com/emrahcom/eparto-virtual-phone) if you
want to use your browser as a virtual phone and make calls directly, without
needing to open any websites.

### Features

- Built-in highly secure identity management system. No need for external
  services. Thanks go to [Ory/Kratos](https://github.com/ory/kratos)
- Add as many Jitsi servers as you want
- Allow your partners to access your Jitsi server for different use-cases:
  - `domain partnership`: allow them to access the whole Jitsi server without
    sharing your secret key or the private key
  - `room partnership`: allow them to manage some Jitsi rooms
  - `meeting membership`: allow them to access some meetings as `moderator` or
    as `limited participant`
- Allow partnership using an invite link
- Allow membership using an invite link
- Create access links for unregistered users
- Create disposable or permanent access links
- Create scheduled meetings
- Calendar view for scheduled meetings
- Waiting room for scheduled meetings
- Direct call (_call other users just like a phone call_)
- Virtual phone (_receive calls from anyone, even those without an account_)
- Email notification for missed calls, upcoming meetings, etc.
- Manage your Jitsi profiles
- Ability to attach a profile to a specific meeting
- Unpredictable room name support. Create meeting links for anonymous Jitsi
  servers (such as `meet.jit.si`) and share these links with your members.
  Although the actual meeting link is updated periodically in the background
  (using some hashing algorithm), members can always join the meeting using its
  static `Galaxy` link. So, only your members can join this unprotected meeting
  room.
- Built-in JWT support
- Built-in [JaaS](https://jaas.8x8.vc) support
- Transfer all your Jitsi resources (rooms, meetings, partners, members, etc.)
  in one simple step to a new Jitsi server.

### Prerequisites

- `Debian 12 Bookworm` server\
  _Use a dedicated server, not shared one... It will be heavily customized._
- At least 2 GB RAM and 8 GB disk space
- An `FQDN` for the web application. e.g. `app.galaxy.corp`
- An `FQDN` for the identity service. e.g. `id.galaxy.corp`
- Both FQDNs must be subdomains of the same domain. The parent domain is
  `galaxy.corp` in this example.
- A DNS `A record` for the web application pointing to the server.
- A DNS `A record` for the identity service pointing to the server.
- An email account for SMTP.
- Allow the following ports if the server is behind a firewall
  - `TCP/80` (_needed for Let's Encrypt certificate_)
  - `TCP/443`

### Installation

Run the following commands as `root`:

- Update `GALAXY_FQDN` and `KRATOS_FQDN` according to your domain names.

- Update `MAILER_*` parameters according to your email system.

  _See [NodeMailer reference](https://nodemailer.com/smtp/) for more details_

- Update `KRATOS_SMTP_CONNECTION_URI` and `KRATOS_SMTP_FROM_ADDRESS` according
  to your email system. This step is actually repeating the previous step for
  Kratos.

  _`username` and `password` in `KRATOS_SMTP_CONNECTION_URI` should be URL
  encoded if there is special character in it. For example if SMTP's username is
  `noreply@galaxy.corp` then you should set it as_

  `smtp://noreply%40galaxy.corp:mypassword@mail.galaxy.corp:587`

  _For more details about `KRATOS_SMTP_CONNECTION_URI`, see SMTP configuration
  inside
  [Ory Kratos reference](https://www.ory.sh/docs/kratos/reference/configuration)._

- If this is a test setup and you don't have resolvable FQDNs, please set
  `SKIP_DNS_CHECK` before installation.

  ```bash
  export SKIP_DNS_CHECK=true
  ```

```bash
wget https://raw.githubusercontent.com/emrahcom/bookworm-lxc-base/main/installer/eb
wget https://raw.githubusercontent.com/emrahcom/galaxy/main/installer/eb-galaxy.conf

export GALAXY_FQDN="app.galaxy.corp"
export KRATOS_FQDN="id.galaxy.corp"
export MAILER_HOST="mail.galaxy.corp"
export MAILER_PORT=465
export MAILER_SECURE=true
export MAILER_USER="username"
export MAILER_PASS="password"
export MAILER_FROM="no-reply@galaxy.corp"
export KRATOS_SMTP_CONNECTION_URI="smtp://username:password@mail.galaxy.corp:587"
export KRATOS_SMTP_FROM_ADDRESS="noreply@galaxy.corp"

bash eb eb-galaxy
```

### Let's Encrypt certificate

Let's say the host address of the web application is `app.galaxy.corp` and the
host address of the identity service is `id.galaxy.corp`. To set the Let's
Encrypt certificate:

```bash
set-letsencrypt-cert app.galaxy.corp,id.galaxy.corp
```

_Be careful, no space between host addresses._
