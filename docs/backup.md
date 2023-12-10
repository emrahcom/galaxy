# Backup and restore


### backup

```bash
lxc-attach eb-postgres
su -l postgres

pg_dump kratos >/tmp/kratos_$(date +'%Y%m%d').sql
pg_dump galaxy >/tmp/galaxy_$(date +'%Y%m%d').sql

exit
exit

cd
mkdir -p backup
mv /var/lib/lxc/eb-postgres/rootfs/tmp/kratos_*.sql backup/
mv /var/lib/lxc/eb-postgres/rootfs/tmp/galaxy_*.sql backup/
```
