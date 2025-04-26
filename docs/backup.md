# Backup and restore

### backup

Before backup, stop all services which use the database.

```bash
df -h

lxc-stop eb-reverse-proxy
lxc-stop eb-app-ui
lxc-stop eb-app-api
lxc-stop eb-kratos
```

```bash
lxc-attach eb-postgres
su -l postgres

pg_dump kratos >/tmp/kratos_$(date +'%Y%m%d').sql
pg_dump galaxy >/tmp/galaxy_$(date +'%Y%m%d').sql

exit
exit

cd
DATE=$(date +'%Y%m%d')
mkdir -p backup/$DATE
mv /var/lib/lxc/eb-postgres/rootfs/tmp/kratos_*.sql backup/$DATE/
mv /var/lib/lxc/eb-postgres/rootfs/tmp/galaxy_*.sql backup/$DATE/
chown root: backup/$DATE -R

df -h

tar czf backup/$DATE.tar.gz backup/$DATE
```

Don't forget to copy backups on a remote system.

Start the services again:

```bash
lxc-start eb-kratos
lxc-start eb-app-api
lxc-start eb-app-ui
lxc-start eb-reverse-proxy
```

### restore

Before restoring, stop all services which use the database.

```bash
lxc-stop eb-reverse-proxy
lxc-stop eb-app-ui
lxc-stop eb-app-api
lxc-stop eb-kratos
```

```bash
cp kratos.sql /var/lib/lxc/eb-postgres/rootfs/tmp/
cp galaxy.sql /var/lib/lxc/eb-postgres/rootfs/tmp/

lxc-attach eb-postgres
su -l postgres

psql kratos
  drop schema public cascade;
  create schema public authorization pg_database_owner;
  \dn
  exit

psql galaxy
  drop schema public cascade;
  create schema public authorization pg_database_owner;
  \dn
  exit

psql kratos </tmp/kratos.sql
psql galaxy </tmp/galaxy.sql

exit
exit
```

Start the services again:

```bash
lxc-start eb-kratos
lxc-start eb-app-api
lxc-start eb-app-ui
lxc-start eb-reverse-proxy
```
