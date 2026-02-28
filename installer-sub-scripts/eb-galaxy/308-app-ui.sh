# ------------------------------------------------------------------------------
# APP-UI.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="$TAG-app-ui"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/$TAG-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo APP_UI="$IP" >> $INSTALLER/000-source

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
[[ "$DONT_RUN_APP_UI" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

curl -sf "$LOGGER/?text=$APP_TEMPLATE-app-ui" || true

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_APP_UI_IF_EXISTS" != true ]]; then
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
lxc-stop -n $TAG-trixie
lxc-wait -n $TAG-trixie -s STOPPED
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
lxc-copy -n $TAG-trixie -N $MACH -p /var/lib/lxc/

# the shared directories
mkdir -p $SHARED/cache

# the container config
rm -rf $ROOTFS/var/cache/apt/archives
mkdir -p $ROOTFS/var/cache/apt/archives

cat >> /var/lib/lxc/$MACH/config <<EOF

# Start options
lxc.start.auto = 1
lxc.start.order = 308
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
apt-get $APT_PROXY -y install nginx
apt-get $APT_PROXY -y install postgresql-client
apt-get $APT_PROXY -y install gnupg tree
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

# nodejs
cp etc/apt/sources.list.d/nodesource.list $ROOTFS/etc/apt/sources.list.d/

lxc-attach -n $MACH -- zsh <<EOS
set -e
wget -T 30 -qO /tmp/nodesource.gpg.key \
    https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key
cat /tmp/nodesource.gpg.key | gpg --dearmor >/usr/share/keyrings/nodesource.gpg
apt-get $APT_PROXY update
EOS

lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY -y install nodejs
EOS

# yarn
cp etc/apt/sources.list.d/yarn.list $ROOTFS/etc/apt/sources.list.d/

lxc-attach -n $MACH -- zsh <<EOS
set -e
wget -T 30 -qO /tmp/yarn.gpg.key https://dl.yarnpkg.com/debian/pubkey.gpg
cat /tmp/yarn.gpg.key | gpg --dearmor >/usr/share/keyrings/yarn.gpg
apt-get $APT_PROXY update
EOS

lxc-attach -n $MACH -- zsh <<EOS
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get $APT_PROXY -y install yarn
EOS

# ------------------------------------------------------------------------------
# SYSTEM CONFIGURATION
# ------------------------------------------------------------------------------
# nginx
rm $ROOTFS/etc/nginx/sites-enabled/default
cp etc/nginx/sites-available/ui.conf $ROOTFS/etc/nginx/sites-available/
ln -s ../sites-available/ui.conf $ROOTFS/etc/nginx/sites-enabled/

lxc-attach -n $MACH -- systemctl stop nginx.service
lxc-attach -n $MACH -- systemctl start nginx.service

# ------------------------------------------------------------------------------
# UI USER
# ------------------------------------------------------------------------------
lxc-attach -n $MACH -- zsh <<EOS
set -e
adduser ui --system --group --disabled-password --home /home/ui --shell /bin/zsh
EOS

cp $MACHINE_COMMON/home/user/.tmux.conf $ROOTFS/home/ui/
cp $MACHINE_COMMON/home/user/.zshrc $ROOTFS/home/ui/
cp $MACHINE_COMMON/home/user/.vimrc $ROOTFS/home/ui/
cat $MACHINE_COMMON/home/user/.vimrc.svelte >>$ROOTFS/home/ui/.vimrc
cat $MACHINE_COMMON/home/user/.vimrc.typescript >>$ROOTFS/home/ui/.vimrc

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown ui:ui /home/ui/.tmux.conf
chown ui:ui /home/ui/.vimrc
chown ui:ui /home/ui/.zshrc
EOS

# ------------------------------------------------------------------------------
# KRATOS UI (/id)
# ------------------------------------------------------------------------------
lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l ui <<EOSS
    set -e
    wget -T 30 -O /tmp/kratos-ui.tar.gz $KRATOS_UI_RELEASE
    tar zxf /tmp/kratos-ui.tar.gz -C /tmp/
    mv /tmp/kratos-selfservice-ui-node-* /home/ui/kratos-ui
EOSS
EOS

lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l ui <<EOSS
    set -e
    cd kratos-ui
    npm ci --fetch-timeout=600000
    npm run build
EOSS
EOS

# kratos-ui systemd service
cp etc/systemd/system/kratos-ui.service $ROOTFS/etc/systemd/system/
sed -i "s~___KRATOS_FQDN___~$KRATOS_FQDN~g" \
    $ROOTFS/etc/systemd/system/kratos-ui.service

COOKIE_SECRET=$(openssl rand -hex 16)
CSRF_COOKIE_NAME="kratos-ui-x-csrf-token"
CSRF_COOKIE_SECRET=$(openssl rand -hex 16)
sed -i "s/___COOKIE_SECRET___/$COOKIE_SECRET/g" \
    $ROOTFS/etc/systemd/system/kratos-ui.service
sed -i "s/___CSRF_COOKIE_NAME___/$CSRF_COOKIE_NAME/g" \
    $ROOTFS/etc/systemd/system/kratos-ui.service
sed -i "s/___CSRF_COOKIE_SECRET___/$CSRF_COOKIE_SECRET/g" \
    $ROOTFS/etc/systemd/system/kratos-ui.service

lxc-attach -n $MACH -- zsh <<EOS
set -e
systemctl daemon-reload
systemctl enable kratos-ui.service
systemctl start kratos-ui.service
EOS

# ------------------------------------------------------------------------------
# GALAXY UI (dev)
# ------------------------------------------------------------------------------
cp -arp home/ui/upgrade-galaxy-dev $ROOTFS/home/ui/
cp -arp home/ui/galaxy-dev $ROOTFS/home/ui/

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown ui:ui /home/ui/upgrade-galaxy-dev
chown ui:ui /home/ui/galaxy-dev -R
su -l ui <<EOSS
    set -e
    cd /home/ui/galaxy-dev
    yarn install
EOSS
EOS

# ------------------------------------------------------------------------------
# GALAXY UI (prod)
# ------------------------------------------------------------------------------
lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l ui <<EOSS
    set -e
    cd /home/ui/galaxy-dev
    yarn run build
EOSS
EOS

lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l ui <<EOSS
    set -e
    ln -s galaxy-dev/build /home/ui/galaxy-build
EOSS
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
