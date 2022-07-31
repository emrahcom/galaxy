# galaxy

`Galaxy` is a web application for `Jitsi` admins and users to organize their
Jitsi meetings, meeting schedules and attendees.

### Prerequisites

- `Debian 11 Bullseye` server
- At least 1 GB RAM
- An `FQDN` for the web application. e.g. `app.galaxy.corp`
- An `FQDN` for the identity service. e.g. `id.galaxy.corp`
- A DNS `A record` for the web application pointing to the server.
- A DNS `A record` for the identity service pointing to the server.

### Installation

Run the following commands as `root`.

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
