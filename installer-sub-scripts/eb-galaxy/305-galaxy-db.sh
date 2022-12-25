# ------------------------------------------------------------------------------
# GALAXY-DB.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="$TAG-postgres"
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
    lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    dropdb -f --if-exists galaxy
EOSS
EOS

    lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    dropuser --if-exists galaxy
EOSS
EOS
fi

# ------------------------------------------------------------------------------
# EXISTENCE CHECK
# ------------------------------------------------------------------------------
IS_DB_EXIST=$(lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    psql -v ON_ERROR_STOP=1 -At <<< '\l galaxy'
EOSS
EOS
)

IS_ROLE_EXIST=$(lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    psql -v ON_ERROR_STOP=1 -At <<< '\dg galaxy'
EOSS
EOS
)

# ------------------------------------------------------------------------------
# CREATE ROLE & DATABASE
# ------------------------------------------------------------------------------
[[ -z "$IS_ROLE_EXIST" ]] && lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    createuser -l galaxy
EOSS
EOS

cp $MACHINES/$TAG-app-api/home/api/galaxy/database/*.sql $ROOTFS/tmp/

[[ -z "$IS_DB_EXIST" ]] && lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
su -l postgres <<EOSS
    createdb -T template0 -O galaxy -E UTF-8 -l en_US.UTF-8 galaxy
    psql -v ON_ERROR_STOP=1 -d galaxy -e -f /tmp/02-create-galaxy-tables.sql
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
    echo "galaxy:$DB_GALAXY_PASSWD" >> $ROOTFS/root/postgresql-passwd.txt
fi

chmod 600 $ROOTFS/root/postgresql-passwd.txt
echo "DB_GALAXY_PASSWD=$DB_GALAXY_PASSWD" >> $INSTALLER/000-source

lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
su -l postgres -s /usr/bin/psql -- -v ON_ERROR_STOP=1 <<PSQL
    ALTER ROLE galaxy WITH PASSWORD '$DB_GALAXY_PASSWD';
PSQL
EOS

# ------------------------------------------------------------------------------
# ALLOWED HOSTS
# ------------------------------------------------------------------------------
lxc-attach -n $TAG-postgres -- zsh <<EOS
set -e
sed -i '/galaxy/d' /etc/postgresql/13/main/pg_hba.conf
EOS

cat etc/postgresql/13/main/pg_hba.conf.galaxy \
    >>$ROOTFS/etc/postgresql/13/main/pg_hba.conf

# ------------------------------------------------------------------------------
# RESTART POSTGRESQL SERVICE
# ------------------------------------------------------------------------------
lxc-attach -n $TAG-postgres -- systemctl restart postgresql.service

# wait for postgresql
lxc-attach -n $MACH -- zsh <<EOS
set -e
for try in \$(seq 1 9); do
    systemctl is-active postgresql.service && break || sleep 1
done
EOS
