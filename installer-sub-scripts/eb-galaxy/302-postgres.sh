# ------------------------------------------------------------------------------
# POSTGRES.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="eb-postgres"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/eb-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo POSTGRES="$IP" >> $INSTALLER/000-source

# ------------------------------------------------------------------------------
# NFTABLES RULES
# ------------------------------------------------------------------------------
# the public ssh
nft delete element eb-nat tcp2ip { $SSH_PORT } 2>/dev/null || true
nft add element eb-nat tcp2ip { $SSH_PORT : $IP }
nft delete element eb-nat tcp2port { $SSH_PORT } 2>/dev/null || true
nft add element eb-nat tcp2port { $SSH_PORT : 22 }

# ------------------------------------------------------------------------------
# INIT
# ------------------------------------------------------------------------------
[[ "$DONT_RUN_POSTGRES" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_POSTGRES_IF_EXISTS" != true ]]; then
    echo POSTGRES_SKIPPED=true >> $INSTALLER/000-source

    echo "Already installed. Skipped..."
    echo
    echo "Please set REINSTALL_POSTGRES_IF_EXISTS in $APP_CONFIG"
    echo "if you want to reinstall this container"
    exit
fi

# ------------------------------------------------------------------------------
# CONTAINER SETUP
# ------------------------------------------------------------------------------
# stop the template container if it's running
set +e
lxc-stop -n eb-bullseye
lxc-wait -n eb-bullseye -s STOPPED
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
lxc-copy -n eb-bullseye -N $MACH -p /var/lib/lxc/

# the shared directories
mkdir -p $SHARED/cache

# the container config
rm -rf $ROOTFS/var/cache/apt/archives
mkdir -p $ROOTFS/var/cache/apt/archives

cat >> /var/lib/lxc/$MACH/config <<EOF

# Start options
lxc.start.auto = 1
lxc.start.order = 302
lxc.start.delay = 2
lxc.group = eb-group
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
apt-get $APT_PROXY_OPTION -dy reinstall hostname
EOS

# update
lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY_OPTION update
apt-get $APT_PROXY_OPTION -y dist-upgrade
EOS

# the packages
lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY_OPTION -y install postgresql postgresql-contrib
EOS

# ------------------------------------------------------------------------------
# POSTGRESQL
# ------------------------------------------------------------------------------
cp etc/postgresql/13/main/conf.d/*.conf $ROOTFS/etc/postgresql/13/main/conf.d/
lxc-attach -n $MACH -- systemctl restart postgresql.service

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
# POSTGRESQL SERVICE
# ------------------------------------------------------------------------------
# wait for postgresql
lxc-attach -n $MACH -- zsh <<EOS
set -e
for try in \$(seq 1 9); do
    systemctl is-active postgresql.service && break || sleep 1
done
EOS
