# ------------------------------------------------------------------------------
# APP-API.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="eb-app-api"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/eb-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo APP_API="$IP" >> $INSTALLER/000-source

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
[[ "$DONT_RUN_APP_API" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_APP_API_IF_EXISTS" != true ]]
then
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
sed -i '/^lxc\.net\./d' /var/lib/lxc/$MACH/config
sed -i '/^# Network configuration/d' /var/lib/lxc/$MACH/config

cat >> /var/lib/lxc/$MACH/config <<EOF

# Network configuration
lxc.net.0.type = veth
lxc.net.0.link = $BRIDGE
lxc.net.0.name = eth0
lxc.net.0.flags = up
lxc.net.0.ipv4.address = $IP/24
lxc.net.0.ipv4.gateway = auto

# Start options
lxc.start.auto = 1
lxc.start.order = 306
lxc.start.delay = 2
lxc.group = eb-group
lxc.group = onboot
EOF

# start the container
lxc-start -n $MACH -d
lxc-wait -n $MACH -s RUNNING

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
apt-get $APT_PROXY_OPTION -y install git patch unzip
apt-get $APT_PROXY_OPTION -y install postgresql-client
EOS

# deno
lxc-attach -n $MACH -- zsh <<EOS
set -e
LATEST=$(curl -sSf https://github.com/denoland/deno/releases | \
    grep -o "/denoland/deno/releases/download/.*/deno-.*linux.*\.zip" | \
    head -n1)

cd /tmp
wget -O deno.zip https://github.com/\$LATEST
unzip deno.zip
cp /tmp/deno /usr/local/bin/
deno --version
EOS

# ------------------------------------------------------------------------------
# API
# ------------------------------------------------------------------------------
# api user
lxc-attach -n $MACH -- zsh <<EOS
set -e
adduser api --system --group --disabled-password --shell /bin/zsh --gecos ''
adduser api-adm --system --group --disabled-password --gecos ''
adduser api-pri --system --group --disabled-password --gecos ''
adduser api-pub --system --group --disabled-password --gecos ''
EOS

cp $MACHINE_COMMON/home/user/.tmux.conf $ROOTFS/home/api/
cp $MACHINE_COMMON/home/user/.vimrc $ROOTFS/home/api/
cp $MACHINE_COMMON/home/user/.zshrc $ROOTFS/home/api/

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown api:api /home/api/.tmux.conf
chown api:api /home/api/.vimrc
chown api:api /home/api/.zshrc
EOS

# galaxy-api
cp -arp home/api/galaxy $ROOTFS/home/api/
rm -rf $ROOTFS/home/api/galaxy/database
rm -rf $ROOTFS/home/api/galaxy/test
sed -i "s/___DB_PASSWD___/$DB_GALAXY_PASSWD/" $ROOTFS/home/api/galaxy/config.ts

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown api:api /home/api/galaxy -R
EOS

# galaxy-api systemd services
cp etc/systemd/system/galaxy-adm-api.service $ROOTFS/etc/systemd/system/
cp etc/systemd/system/galaxy-pri-api.service $ROOTFS/etc/systemd/system/
cp etc/systemd/system/galaxy-pub-api.service $ROOTFS/etc/systemd/system/

lxc-attach -n $MACH -- zsh <<EOS
set -e
systemctl daemon-reload
systemctl enable galaxy-adm-api.service
systemctl enable galaxy-pri-api.service
systemctl enable galaxy-pub-api.service
systemctl start galaxy-adm-api.service
systemctl start galaxy-pri-api.service
systemctl start galaxy-pub-api.service
EOS

# ------------------------------------------------------------------------------
# CONTAINER SERVICES
# ------------------------------------------------------------------------------
lxc-stop -n $MACH
lxc-wait -n $MACH -s STOPPED
lxc-start -n $MACH -d
lxc-wait -n $MACH -s RUNNING
