# ------------------------------------------------------------------------------
# APP-UI.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="eb-app-ui"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/eb-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo APP_UI="$IP" >> $INSTALLER/000-source

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
[[ "$DONT_RUN_APP_UI" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_APP_UI_IF_EXISTS" != true ]]
then
    echo APP_UI_SKIPPED=true >> $INSTALLER/000-source

    echo "Already installed. Skipped..."
    echo
    echo "Please set REINSTALL_APP_UI_IF_EXISTS in $APP_CONFIG"
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
apt-get $APT_PROXY_OPTION -y install nginx
apt-get $APT_PROXY_OPTION -y install git patch npm unzip
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
# SYSTEM CONFIGURATION
# ------------------------------------------------------------------------------
# nginx
rm $ROOTFS/etc/nginx/sites-enabled/default
cp etc/nginx/sites-available/eb-app.conf $ROOTFS/etc/nginx/sites-available/
ln -s ../sites-available/eb-app.conf $ROOTFS/etc/nginx/sites-enabled/

lxc-attach -n $MACH -- systemctl stop nginx.service
lxc-attach -n $MACH -- systemctl start nginx.service

# ------------------------------------------------------------------------------
# UI
# ------------------------------------------------------------------------------
# ui user
lxc-attach -n $MACH -- zsh <<EOS
set -e
adduser ui --system --group --disabled-password --shell /bin/zsh --gecos ''
EOS

cp $MACHINE_COMMON/home/user/.tmux.conf $ROOTFS/home/ui/
cp $MACHINE_COMMON/home/user/.vimrc $ROOTFS/home/ui/
cp $MACHINE_COMMON/home/user/.zshrc $ROOTFS/home/ui/

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown ui:ui /home/ui/.tmux.conf
chown ui:ui /home/ui/.vimrc
chown ui:ui /home/ui/.zshrc
EOS

# kratos ui
lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l app-ui <<EOSS
    set -e
    git clone https://github.com/ory/kratos-selfservice-ui-node.git kratos
    cd kratos
    git checkout $KRATOS_VERSION

    npm ci
    npm run build
EOSS
EOS

# kratos-ui systemd service (disabled by default)
cp etc/systemd/system/kratos-ui.service $ROOTFS/etc/systemd/system/
sed -i "s/___KRATOS_FQDN___/$KRATOS_FQDN/g" \
    $ROOTFS/etc/systemd/system/kratos-ui.service
sed -i "s/___APP_FQDN___/$APP_FQDN/g" \
    $ROOTFS/etc/systemd/system/kratos-ui.service

# galaxy ui
cp -arp /home/ui/galaxy $ROOTFS/home/ui/
lxc-attach -n $MACH -- zsh <<EOS
set -e
chown ui:ui /home/ui/galaxy -R
su -l ui <<EOSS
    cd /home/ui/galaxy
    npm install
EOSS
EOS

sed -i "s/___KRATOS_FQDN___/$KRATOS_FQDN/g" \
    $ROOTFS/home/ui/galaxy/src/lib/config.ts
sed -i "s/___APP_FQDN___/$APP_FQDN/g" \
    $ROOTFS/home/ui/galaxy/src/lib/config.ts

# galaxy-ui systemd service
cp etc/systemd/system/galaxy-ui.service $ROOTFS/etc/systemd/system/

lxc-attach -n $MACH -- zsh <<EOS
set -e
systemctl daemon-reload
systemctl enable galaxy-ui.service
systemctl start galaxy-ui.service
EOS

# ------------------------------------------------------------------------------
# CONTAINER SERVICES
# ------------------------------------------------------------------------------
lxc-stop -n $MACH
lxc-wait -n $MACH -s STOPPED
lxc-start -n $MACH -d
lxc-wait -n $MACH -s RUNNING
