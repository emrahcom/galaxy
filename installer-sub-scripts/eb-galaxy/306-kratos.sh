# ------------------------------------------------------------------------------
# KRATOS.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="$TAG-kratos"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/$TAG-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo KRATOS="$IP" >> $INSTALLER/000-source

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
[[ "$DONT_RUN_KRATOS" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_KRATOS_IF_EXISTS" != true ]]; then
    echo KRATOS_SKIPPED=true >> $INSTALLER/000-source

    echo "Already installed. Skipped..."
    echo
    echo "Please set REINSTALL_KRATOS_IF_EXISTS in $APP_CONFIG"
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
lxc.start.order = 306
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

# the packages
lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY -y install postgresql-client
EOS

# ------------------------------------------------------------------------------
# KRATOS
# ------------------------------------------------------------------------------
# kratos user
lxc-attach -n $MACH -- zsh <<EOS
set -e
adduser kratos --system --group --disabled-password --home /home/kratos \
    --shell /bin/zsh
EOS

cp $MACHINE_COMMON/home/user/.tmux.conf $ROOTFS/home/kratos/
cp $MACHINE_COMMON/home/user/.vimrc $ROOTFS/home/kratos/
cp $MACHINE_COMMON/home/user/.zshrc $ROOTFS/home/kratos/

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown kratos:kratos /home/kratos/.tmux.conf
chown kratos:kratos /home/kratos/.vimrc
chown kratos:kratos /home/kratos/.zshrc
EOS

# kratos app
lxc-attach -n $MACH -- zsh <<EOS
set -e
wget -T 30 -O /tmp/kratos.tar.gz $KRATOS_RELEASE
tar zxf /tmp/kratos.tar.gz -C /tmp/
mv /tmp/kratos /usr/local/bin/
chmod 755 /usr/local/bin/kratos
kratos version
EOS

# kratos files
cp -arp home/kratos/config $ROOTFS/home/kratos/
cp -arp home/kratos/jsonnet $ROOTFS/home/kratos/

BASE_DOMAIN=
i=1
while true; do
    K=$(echo $KRATOS_FQDN | rev | cut -d. -f $i)
    [[ -z "$K" ]] && break

    S=$(echo $APP_FQDN | rev | cut -d. -f $i)
    [[ -z "$S" ]] && break

    [[ "$K" = "$S" ]] && BASE_DOMAIN=$(echo $BASE_DOMAIN $S) || break
    (( i += 1 ))
done
BASE_DOMAIN=$(echo $BASE_DOMAIN | rev | tr ' ' '.')
echo BASE_DOMAIN="$BASE_DOMAIN" >> $INSTALLER/000-source

COOKIE_SECRET=$(openssl rand -hex 32)
CIPHER_SECRET=$(openssl rand -hex 16)
[[ -z "$KRATOS_TOTP_ISSUER" ]] && KRATOS_TOTP_ISSUER="Galaxy"
sed -i "s/___COOKIE_SECRET___/$COOKIE_SECRET/g" $ROOTFS/home/kratos/config/*
sed -i "s/___CIPHER_SECRET___/$CIPHER_SECRET/g" $ROOTFS/home/kratos/config/*
sed -i "s/___KRATOS_FQDN___/$KRATOS_FQDN/g" $ROOTFS/home/kratos/config/*
sed -i "s/___APP_FQDN___/$APP_FQDN/g" $ROOTFS/home/kratos/config/*
sed -i "s/___BASE_DOMAIN___/$BASE_DOMAIN/g" $ROOTFS/home/kratos/config/*
sed -i "s/___DB_PASSWD___/$DB_KRATOS_PASSWD/g" $ROOTFS/home/kratos/config/*
sed -i "s/___KRATOS_TOTP_ISSUER___/$KRATOS_TOTP_ISSUER/g" $ROOTFS/home/kratos/config/*

lxc-attach -n $MACH -- zsh <<EOS
set -e
chmod 700 /home/kratos/config
chown kratos:kratos /home/kratos/config -R
chown kratos:kratos /home/kratos/jsonnet -R
EOS

# kratos database migration
if [[ "$DONT_RUN_KRATOS_DB" != true ]]; then
    lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l kratos <<EOSS
    kratos migrate sql -c /home/kratos/config/kratos.yml -e --yes
EOSS
EOS
fi

# kratos systemd service
cp etc/systemd/system/kratos.service $ROOTFS/etc/systemd/system/
cp etc/systemd/system/kratos-courier.service $ROOTFS/etc/systemd/system/

lxc-attach -n $MACH -- zsh <<EOS
set -e
systemctl daemon-reload
systemctl enable kratos.service
systemctl start kratos.service
systemctl enable kratos-courier.service
systemctl start kratos-courier.service
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
