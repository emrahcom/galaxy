# galaxy

`Galaxy` is a web application for `Jitsi` admins and users to organize their
Jitsi meetings, meeting schedules and attendees.

### Features

- Add as many Jitsi servers as you want
- Allow your partners to access your Jitsi server for different use-cases:
  - `domain partnership`: allow them to access the whole Jitsi server without
    sharing your secret key
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
- Ability to attach each profile for a specific meeting
- Unpredictable room name support. Create secure rooms on anonymous Jitsi
  servers (such as `meet.jit.si`) and share a static link with your members.
  Although the room link is updated periodically in the background, members can
  access the active meeting room using their static link.
- Built-in JWT support
- Transfer all your Jitsi resources (rooms, meetings, partners, members, etc.)
  in one simple step to a new Jitsi server.

### Prerequisites

- `Debian 11 Bullseye` server
- At least 1 GB RAM
- An `FQDN` for the web application. e.g. `app.galaxy.corp`
- An `FQDN` for the identity service. e.g. `id.galaxy.corp`
- A DNS `A record` for the web application pointing to the server.
- A DNS `A record` for the identity service pointing to the server.
- Allow the following ports if the server is behind a firewall
  - `TCP/80`
  - `TCP/443`

### Installation

Run the following commands as `root`.

_Update the value of `APP_FQDN` and `KRATOS_FQDN` according to your domain
names._

```bash
wget https://raw.githubusercontent.com/emrahcom/emrah-bullseye-base/main/installer/eb
wget https://raw.githubusercontent.com/emrahcom/galaxy/main/installer/eb-galaxy.conf

export APP_FQDN=app.galaxy.corp
export KRATOS_FQDN=id.galaxy.corp
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
