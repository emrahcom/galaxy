# galaxy

`Galaxy` is a web application for `Jitsi` admins and users to organize their
Jitsi meetings, meeting schedules and attendees.

This version has a built-in identity managment system. Check
[Galaxy-kc](https://github.com/emrahcom/galaxy-kc) for version that uses
`Keycloak` as the identity management system.

### Try it

Try `Galaxy` using publicly available implementation on
[https://eparto.net](https://eparto.net)

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
- Waiting room for scheduled meeting
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

- `Debian 12 Bookworm` server
- At least 1 GB RAM
- An `FQDN` for the web application. e.g. `app.galaxy.corp`
- An `FQDN` for the identity service. e.g. `id.galaxy.corp`
- Both FQDNs must be subdomains of the same domain.
- A DNS `A record` for the web application pointing to the server.
- A DNS `A record` for the identity service pointing to the server.
- An email account for SMTP.
- Allow the following ports if the server is behind a firewall
  - `TCP/80` (_needed for Let's Encrypt certificate_)
  - `TCP/443`

### Installation

Run the following commands as `root`.

_Update the value of `APP_FQDN` and `KRATOS_FQDN` according to your domain
names._

_Update the value of `SMTP_CONNECTION_URI` and `SMTP_FROM_ADDRESS` according to
your email system._

_`username` and `password` in `SMTP_CONNECTION_URI` should be
URL encoded if there is special character in it. For example if SMTP's username
is `noreply@mydomain.corp` then you should set it as
`smtp://noreply%40mydomain.corp:mypassword@mail.mydomain.corp:587`._

_For more details about `SMTP_CONNECTION_URI`, see SMTP configuration inside
[Ory Kratos reference](https://www.ory.sh/docs/kratos/reference/configuration)._

```bash
wget https://raw.githubusercontent.com/emrahcom/bookworm-lxc-base/main/installer/eb
wget https://raw.githubusercontent.com/emrahcom/galaxy/main/installer/eb-galaxy.conf

export APP_FQDN=app.galaxy.corp
export KRATOS_FQDN=id.galaxy.corp
export SMTP_CONNECTION_URI="smtp://username:password@mail.mydomain.corp:587"
export SMTP_FROM_ADDRESS="noreply@mydomain.corp"
bash eb eb-galaxy
```

_If this is a test setup and you don't have resolvable FQDNs, please set
`SKIP_DNS_CHECK` before installation_

```bash
export SKIP_DNS_CHECK=true
```

### Let's Encrypt certificate

Let's say the host address of the web application is `app.galaxy.corp` and the
host address of the identity service is `id.galaxy.corp`. To set the Let's
Encrypt certificate:

```bash
set-letsencrypt-cert app.galaxy.corp,id.galaxy.corp
```

_Be careful, no space between host addresses._
