# Upgrade to Trixie

Upgrading from `Debian 12 Bookworm` to `Debian 13 Trixie`.

Before starting, get a backup of the database. See the [backup](backup.md)
guide.

## OS upgrade

Update `/etc/apt/sources.list` for Trixie and upgrade the operating system.

```bash
apt-get update
apt-get update -dy
apt-get dist-upgrade -dy

apt-get upgrade
apt-get dist-upgrade

reboot
```

## Initial test

Test it using the web interface. It should work without any issue.

## Upgrade the installer

```bash
mv eb eb.old
cp eb-galaxy.conf eb-galaxy.conf.old

wget https://raw.githubusercontent.com/emrahcom/lxc-trixie-base/main/installer/eb
```

Update `eb-galaxy.conf` for Trixie:

```
# Replace these lines
#export RELEASE="bookworm"
#export BASE_REPO="https://github.com/emrahcom/bookworm-lxc-base.git"
#export DONT_RUN_BOOKWORM=true
#export DONT_RUN_BOOKWORM_CUSTOM=true
#export DONT_RUN_BOOKWORM_UPDATE=true
#export REINSTALL_BOOKWORM_IF_EXISTS=true

# with
#export RELEASE="trixie"
#export BASE_REPO="https://github.com/emrahcom/lxc-trixie-base.git"
#export DONT_RUN_TRIXIE=true
#export DONT_RUN_TRIXIE_CUSTOM=true
#export DONT_RUN_TRIXIE_UPDATE=true
#export REINSTALL_TRIXIE_IF_EXISTS=true
```

## Upgrade Postgres

Upgrade the Postgres container:

```bash
lxc-stop eb-reverse-proxy
lxc-stop eb-app-ui
lxc-stop eb-app-api
lxc-stop eb-kratos
lxc-ls -f

# attach to the Postgres container
lxc-attach eb-postgres

# Edit /etc/apt/sources.list
# Replace "bookworm" with "trixie"
vim /etc/apt/sources.list

apt-get update
apt-get upgrade -dy
apt-get dist-upgrade -dy

# Accept upgrading the cluster from 15 to 17 when asked
apt-get upgrade
apt-get dist-upgrade

# Copy customizations
cp /etc/postgresql/15/main/conf.d/eb-listen.conf /etc/postgresql/17/main/conf.d/

# Reboot "the container" after waiting ~1 min
reboot
```

## Upgrade Galaxy

The following should be uncommented in `eb-galaxy.conf` during upgrading. Revert
them after the upgrading.

```
export REINSTALL_TRIXIE_IF_EXISTS=true
export REINSTALL_KRATOS_IF_EXISTS=true
export REINSTALL_APP_API_IF_EXISTS=true
export REINSTALL_APP_UI_IF_EXISTS=true
export REINSTALL_REVERSE_PROXY_IF_EXISTS=true
```

Run the installer:

```bash
bash eb eb-galaxy.conf

# Update certificates according to domains
set-letsencrypt-cert app.galaxy.corp,id.galaxy.corp

reboot
```

## Second test

Test it using the web interface. It should work without any issue.

## Clean up

Update the mountpoint in `eb-postgres`:

```bash
lxc-stop eb-reverse-proxy
lxc-stop eb-app-ui
lxc-stop eb-app-api
lxc-stop eb-kratos
lxc-stop eb-postgres
lxc-ls -f
```

Update the mountpoint in `/var/lib/lxc/eb-postgres/config` as:

```
lxc.mount.entry = /usr/local/eb/cache/trixie-apt-archives var/cache/apt/archives none bind 0 0
```

Attach to the Postgres container and remove the old cluster:

```bash
lxc-start eb-postgres

# attach to the Postgres container
lxc-attach eb-postgres

pg_dropcluster 15 main

exit
```

Remove the Bookworm container and the old archive:

```bash
lxc-destroy eb-bookworm
rm -rf /usr/local/eb/cache/bookworm-apt-archives
```

Reboot

```bash
reboot
```

## Last test

Test it using the web interface. It should work without any issue.
