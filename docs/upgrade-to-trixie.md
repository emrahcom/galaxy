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

apt-get update
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

## Upgrade Galaxy

```bash
bash eb eb-galaxy.conf

reboot
```

## Second test

Test it using the web interface. It should work without any issue.

## Upgrade Postgres

The Postgres container is still based on `Debian 12 Bookworm`. To upgrade it:

```bash
lxc-stop eb-reverse-proxy
lxc-stop eb-app-ui
lxc-stop eb-app-api
lxc-stop eb-kratos
lxc-ls -f

# attach to the Postgres container
lxc-attach eb-postgres

# Edit /etc/apt/sources.list
# Replace bookworm with trixie
vim /etc/apt/sources.list

apt-get update
apt-get upgrade -dy
apt-get dist-upgrade -dy

apt-get upgrade
apt-get dist-upgrade

# Copy customizations
cp /etc/postgresql/15/main/conf.d/eb-listen.conf /etc/postgresql/17/main/conf.d/

exit
```

Reboot after waiting ~1 min.

```bash
reboot
```

## Third test

Test it using the web interface. It should work without any issue.

## Clean up

Attach to the Postgres container and remove the old cluster:

```bash
# attach to the Postgres container
lxc-attach eb-postgres

pg_dropcluster 15 main

exit
```

Remove the Bookworm container

```bash
lxc-destroy eb-bookworm
```

Reboot

```bash
reboot
```

## Last test

Test it using the web interface. It should work without any issue.
