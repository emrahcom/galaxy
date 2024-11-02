# ------------------------------------------------------------------------------
# APP-API.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="$TAG-app-api"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/$TAG-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo APP_API="$IP" >> $INSTALLER/000-source

# ------------------------------------------------------------------------------
# NFTABLES RULES
# ------------------------------------------------------------------------------
# the public ssh
nft delete element $TAG-nat tcp2ip { $SSH_PORT } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { $SSH_PORT : $IP }
nft delete element $TAG-nat tcp2port { $SSH_PORT } 2>/dev/null || true
nft add element $TAG-nat tcp2port { $SSH_PORT : 22 }

# ------------------------------------------------------------------------------
# INIT
# ------------------------------------------------------------------------------
[[ "$DONT_RUN_APP_API" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

curl -sf "$LOGGER/?text=$APP_TEMPLATE-app-api" || true

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_APP_API_IF_EXISTS" != true ]]; then
    echo APP_API_SKIPPED=true >> $INSTALLER/000-source

    echo "Already installed. Skipped..."
    echo
    echo "Please set REINSTALL_APP_API_IF_EXISTS in $APP_CONFIG"
    echo "if you want to reinstall this container"
    exit
fi

# ------------------------------------------------------------------------------
# CONTAINER SETUP
# ------------------------------------------------------------------------------
# stop the template container if it's running
set +e
lxc-stop -n $TAG-bookworm
lxc-wait -n $TAG-bookworm -s STOPPED
set -e

# remove the old container if exists
set +e
lxc-stop -n $MACH
lxc-wait -n $MACH -s STOPPED
lxc-destroy -n $MACH
rm -rf /var/lib/lxc/$MACH
sleep 1
set -e

# create the new one
lxc-copy -n $TAG-bookworm -N $MACH -p /var/lib/lxc/

# the shared directories
mkdir -p $SHARED/cache

# the container config
rm -rf $ROOTFS/var/cache/apt/archives
mkdir -p $ROOTFS/var/cache/apt/archives

cat >> /var/lib/lxc/$MACH/config <<EOF

# Start options
lxc.start.auto = 1
lxc.start.order = 307
lxc.start.delay = 2
lxc.group = $TAG-group
lxc.group = onboot
EOF

# container network
cp $MACHINE_COMMON/etc/systemd/network/eth0.network $ROOTFS/etc/systemd/network/
sed -i "s/___IP___/$IP/" $ROOTFS/etc/systemd/network/eth0.network
sed -i "s/___GATEWAY___/$HOST/" $ROOTFS/etc/systemd/network/eth0.network

# start the container
lxc-start -n $MACH -d
lxc-wait -n $MACH -s RUNNING

# wait for the network to be up
for i in $(seq 0 9); do
    lxc-attach -n $MACH -- ping -c1 host.loc && break || true
    sleep 1
done

# ------------------------------------------------------------------------------
# HOSTNAME
# ------------------------------------------------------------------------------
lxc-attach -n $MACH -- zsh <<EOS
set -e
echo $MACH > /etc/hostname
sed -i 's/\(127.0.1.1\s*\).*$/\1$MACH/' /etc/hosts
hostname $MACH
EOS

# ------------------------------------------------------------------------------
# PACKAGES
# ------------------------------------------------------------------------------
# fake install
lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY -dy reinstall hostname
EOS

# update
lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY update
apt-get $APT_PROXY -y dist-upgrade
EOS

# packages
lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY -y install git patch unzip
apt-get $APT_PROXY -y install postgresql-client
EOS

# deno
lxc-attach -n $MACH -- zsh <<EOS
set -e
cd /tmp
wget -T 30 -O deno.zip \
    https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip
unzip -o deno.zip
cp /tmp/deno /usr/local/bin/
deno --version
EOS

# ------------------------------------------------------------------------------
# API
# ------------------------------------------------------------------------------
# api user
lxc-attach -n $MACH -- zsh <<EOS
set -e
adduser api --system --group --disabled-password --home /home/api \
    --shell /bin/zsh
adduser api-adm --system --group --disabled-password --home /home/api-adm
adduser api-pri --system --group --disabled-password --home /home/api-pri
adduser api-pub --system --group --disabled-password --home /home/api-pub
EOS

cp $MACHINE_COMMON/home/user/.tmux.conf $ROOTFS/home/api/
cp $MACHINE_COMMON/home/user/.zshrc $ROOTFS/home/api/
cp $MACHINE_COMMON/home/user/.vimrc $ROOTFS/home/api/
cat $MACHINE_COMMON/home/user/.vimrc.typescript >>$ROOTFS/home/api/.vimrc

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown api:api /home/api/.tmux.conf
chown api:api /home/api/.vimrc
chown api:api /home/api/.zshrc
EOS

# galaxy-api
cp -arp home/api/upgrade-galaxy $ROOTFS/home/api/
cp -arp home/api/galaxy $ROOTFS/home/api/
rm -rf $ROOTFS/home/api/galaxy/database
rm -rf $ROOTFS/home/api/galaxy/test

sed -i "s/___DB_PASSWD___/$DB_GALAXY_PASSWD/" $ROOTFS/home/api/galaxy/config.ts
sed -i "s/___KRATOS_FQDN___/$KRATOS_FQDN/" $ROOTFS/home/api/galaxy/config.ts

sed -i "s/___MAILER_HOST___/$MAILER_HOST/" \
    $ROOTFS/home/api/galaxy/config.mailer.ts
sed -i "s/___MAILER_USER___/$MAILER_USER/" \
    $ROOTFS/home/api/galaxy/config.mailer.ts
sed -i "s/___MAILER_PASS___/$MAILER_PASS/" \
    $ROOTFS/home/api/galaxy/config.mailer.ts
sed -i "s/___MAILER_FROM___/$MAILER_FROM/" \
    $ROOTFS/home/api/galaxy/config.mailer.ts
sed -i "s/port:.*/port: $MAILER_PORT,/" \
    $ROOTFS/home/api/galaxy/config.mailer.ts

if [[ "$MAILER_SECURE" = false ]]; then
  sed -i "s/secure:.*/secure: false,/" $ROOTFS/home/api/galaxy/config.mailer.ts
else
  sed -i "s/secure:.*/secure: true,/" $ROOTFS/home/api/galaxy/config.mailer.ts
fi

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown api:api /home/api/upgrade-galaxy
chown api:api /home/api/galaxy -R
EOS

lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l api-adm -s /bin/sh <<EOSS
    deno cache /home/api/galaxy/index-adm.ts
EOSS

su -l api-pri -s /bin/sh <<EOSS
    deno cache /home/api/galaxy/index-pri.ts
EOSS

su -l api-pub -s /bin/sh <<EOSS
    deno cache /home/api/galaxy/index-pub.ts
EOSS

su -l api -s /bin/sh <<EOSS
    deno cache /home/api/galaxy/index-adm.ts
    deno cache /home/api/galaxy/index-pri.ts
    deno cache /home/api/galaxy/index-pub.ts
EOSS
EOS

# galaxy-api systemd services
cp etc/systemd/system/galaxy-api-adm.service $ROOTFS/etc/systemd/system/
cp etc/systemd/system/galaxy-api-pri.service $ROOTFS/etc/systemd/system/
cp etc/systemd/system/galaxy-api-pub.service $ROOTFS/etc/systemd/system/

lxc-attach -n $MACH -- zsh <<EOS
set -e
systemctl daemon-reload
systemctl enable galaxy-api-adm.service
systemctl enable galaxy-api-pri.service
systemctl enable galaxy-api-pub.service
systemctl start galaxy-api-adm.service
systemctl start galaxy-api-pri.service
systemctl start galaxy-api-pub.service
EOS

# ------------------------------------------------------------------------------
# CONTAINER SERVICES
# ------------------------------------------------------------------------------
lxc-stop -n $MACH
lxc-wait -n $MACH -s STOPPED
lxc-start -n $MACH -d
lxc-wait -n $MACH -s RUNNING

# wait for the network to be up
for i in $(seq 0 9); do
    lxc-attach -n $MACH -- ping -c1 host.loc && break || true
    sleep 1
done
