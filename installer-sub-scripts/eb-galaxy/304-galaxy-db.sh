# ------------------------------------------------------------------------------
# GALAXY-DB.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="eb-postgres"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"

# ------------------------------------------------------------------------------
# INIT
# ------------------------------------------------------------------------------
[[ "$DONT_RUN_GALAXY_DB" = true ]] && exit

echo
echo "------------------------ GALAXY DB ------------------------"

# ------------------------------------------------------------------------------
# BACKUP
# ------------------------------------------------------------------------------
[[ -f $ROOTFS/etc/postgresql/13/main/pg_hba.conf ]] && \
    cp $ROOTFS/etc/postgresql/13/main/pg_hba.conf \
        $OLD_FILES/pg_hba.conf.before_galaxy

# ------------------------------------------------------------------------------
# DROP DATABASE & ROLE
# ------------------------------------------------------------------------------
# drop the old database if RECREATE_GALAXY_DB_IF_EXISTS is set
if [[ "$RECREATE_GALAXY_DB_IF_EXISTS" = true ]]; then
    lxc-attach -n eb-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    set -e
    dropdb -f --if-exists galaxy
EOSS
EOS

    lxc-attach -n eb-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    set -e
    dropuser --if-exists galaxy
EOSS
EOS
fi

# ------------------------------------------------------------------------------
# EXISTENCE CHECK
# ------------------------------------------------------------------------------
IS_DB_EXIST=$(lxc-attach -n eb-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    set -e
    psql -At <<< '\l galaxy'
EOSS
EOS
)

IS_ROLE_EXIST=$(lxc-attach -n eb-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    set -e
    psql -At <<< '\dg galaxy'
EOSS
EOS
)

# ------------------------------------------------------------------------------
# CREATE ROLE & DATABASE
# ------------------------------------------------------------------------------
[[ -z "$IS_ROLE_EXIST" ]] && lxc-attach -n eb-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    set -e
    createuser -l galaxy
EOSS
EOS

cp $MACHINES/eb-app-api/home/api/galaxy/database/*.sql $ROOTFS/tmp/

[[ -z "$IS_DB_EXIST" ]] && lxc-attach -n eb-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    set -e
    createdb -T template0 -O galaxy -E UTF-8 -l en_US.UTF-8 galaxy
    psql -d galaxy -e -f /tmp/02-create-galaxy-tables.sql
EOSS
EOS

# ------------------------------------------------------------------------------
# UPDATE PASSWD
# ------------------------------------------------------------------------------
# get current passwd if exists
DB_GALAXY_PASSWD=$(egrep '^galaxy:' $ROOTFS/root/postgresql-passwd.txt | \
    tail -n1 | cut -d: -f2)

# generate a new one if there is no passwd
if [[ -z "$DB_GALAXY_PASSWD" ]]; then
    DB_GALAXY_PASSWD=$(openssl rand -hex 20)
    echo "galaxy:$DB__GALAXY_PASSWD" >> $ROOTFS/root/postgresql-passwd.txt
fi

chmod 600 $ROOTFS/root/postgresql-passwd.txt
echo "DB_GALAXY_PASSWD=$DB_GALAXY_PASSWD" >> $INSTALLER/000-source

lxc-attach -n eb-postgres -- zsh <<EOS
set -e
su -l postgres -s /usr/bin/psql <<PSQL
    ALTER ROLE galaxy WITH PASSWORD '$DB_GALAXY_PASSWD';
PSQL
EOS

# ------------------------------------------------------------------------------
# ALLOWED HOSTS
# ------------------------------------------------------------------------------
lxc-attach -n eb-postgres -- zsh <<EOS
set -e
sed -i '/galaxy/d' /etc/postgresql/13/main/pg_hba.conf
EOS

cat etc/postgresql/13/main/pg_hba.conf.galaxy \
    >>$ROOTFS/etc/postgresql/13/main/pg_hba.conf

# ------------------------------------------------------------------------------
# RESTART POSTGRESQL SERVICE
# ------------------------------------------------------------------------------
lxc-attach -n eb-postgres -- systemctl restart postgresql.service

# wait for postgresql
lxc-attach -n $MACH -- zsh <<EOS
set -e
for try in \$(seq 1 9); do
    systemctl is-active postgresql.service && break || sleep 1
done
EOS
