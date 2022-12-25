# ------------------------------------------------------------------------------
# REVERSE-PROXY.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="$TAG-reverse-proxy"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/$TAG-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo REVERSE_PROXY="$IP" >> $INSTALLER/000-source

# ------------------------------------------------------------------------------
# NFTABLES RULES
# ------------------------------------------------------------------------------
# the public ssh
nft delete element $TAG-nat tcp2ip { $SSH_PORT } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { $SSH_PORT : $IP }
nft delete element $TAG-nat tcp2port { $SSH_PORT } 2>/dev/null || true
nft add element $TAG-nat tcp2port { $SSH_PORT : 22 }
# the public http
nft delete element $TAG-nat tcp2ip { 80 } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { 80 : $IP }
nft delete element $TAG-nat tcp2port { 80 } 2>/dev/null || true
nft add element $TAG-nat tcp2port { 80 : 80 }
# the public https
nft delete element $TAG-nat tcp2ip { 443 } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { 443 : $IP }
nft delete element $TAG-nat tcp2port { 443 } 2>/dev/null || true
nft add element $TAG-nat tcp2port { 443 : 443 }
# tcp/3000 sveltekit wss (only for development environment)
nft delete element $TAG-nat tcp2ip { 3000 } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { 3000 : $IP }
nft delete element $TAG-nat tcp2port { 3000 } 2>/dev/null || true
nft add element $TAG-nat tcp2port { 3000 : 3000 }

# ------------------------------------------------------------------------------
# INIT
# ------------------------------------------------------------------------------
[[ "$DONT_RUN_REVERSE_PROXY" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_REVERSE_PROXY_IF_EXISTS" != true ]]
then
    echo REVERSE_PROXY_SKIPPED=true >> $INSTALLER/000-source

    echo "Already installed. Skipped..."
    echo
    echo "Please set REINSTALL_REVERSE_PROXY_IF_EXISTS in $APP_CONFIG"
    echo "if you want to reinstall this container"
    exit
fi

# ------------------------------------------------------------------------------
# CONTAINER SETUP
# ------------------------------------------------------------------------------
# stop the template container if it's running
set +e
lxc-stop -n $TAG-bullseye
lxc-wait -n $TAG-bullseye -s STOPPED
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
lxc-copy -n $TAG-bullseye -N $MACH -p /var/lib/lxc/

# the shared directories
mkdir -p $SHARED/cache

# the container config
rm -rf $ROOTFS/var/cache/apt/archives
mkdir -p $ROOTFS/var/cache/apt/archives

cat >> /var/lib/lxc/$MACH/config <<EOF

# Start options
lxc.start.auto = 1
lxc.start.order = 309
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
apt-get $APT_PROXY -y install ssl-cert ca-certificates certbot
apt-get $APT_PROXY -y install nginx
EOS

# ------------------------------------------------------------------------------
# SYSTEM CONFIGURATION
# ------------------------------------------------------------------------------
# certs
cp /root/$TAG-certs/$TAG-galaxy.key $ROOTFS/etc/ssl/private/$TAG-cert.key
cp /root/$TAG-certs/$TAG-galaxy.pem $ROOTFS/etc/ssl/certs/$TAG-cert.pem

# nginx
rm $ROOTFS/etc/nginx/sites-enabled/default
cp etc/nginx/sites-available/$TAG-default.conf \
    $ROOTFS/etc/nginx/sites-available/
ln -s ../sites-available/$TAG-default.conf $ROOTFS/etc/nginx/sites-enabled/
cp etc/nginx/sites-available/$TAG-kratos.conf \
    $ROOTFS/etc/nginx/sites-available/
ln -s ../sites-available/$TAG-kratos.conf $ROOTFS/etc/nginx/sites-enabled/
cp etc/nginx/sites-available/$TAG-app.conf $ROOTFS/etc/nginx/sites-available/
ln -s ../sites-available/$TAG-app.conf $ROOTFS/etc/nginx/sites-enabled/
cp etc/nginx/sites-available/$TAG-app-wss.conf \
    $ROOTFS/etc/nginx/sites-available/
ln -s ../sites-available/$TAG-app-wss.conf $ROOTFS/etc/nginx/sites-enabled/

sed -i "s/___KRATOS_FQDN___/$KRATOS_FQDN/g" $ROOTFS/etc/nginx/sites-available/*
sed -i "s/___APP_FQDN___/$APP_FQDN/g" $ROOTFS/etc/nginx/sites-available/*

lxc-attach -n $MACH -- systemctl stop nginx.service
lxc-attach -n $MACH -- systemctl start nginx.service

# set-letsencrypt-cert
cp $MACHINES/common/usr/local/sbin/set-letsencrypt-cert $ROOTFS/usr/local/sbin/
chmod 744 $ROOTFS/usr/local/sbin/set-letsencrypt-cert

# certbot service
mkdir -p $ROOTFS/etc/systemd/system/certbot.service.d
cp $MACHINES/common/etc/systemd/system/certbot.service.d/override.conf \
    $ROOTFS/etc/systemd/system/certbot.service.d/
lxc-attach -n $MACH -- systemctl daemon-reload

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

# ------------------------------------------------------------------------------
# HOST CUSTOMIZATION FOR REVERSE PROXY
# ------------------------------------------------------------------------------
cp $MACHINES/galaxy-host/usr/local/sbin/set-letsencrypt-cert /usr/local/sbin/
chmod 744 /usr/local/sbin/set-letsencrypt-cert
