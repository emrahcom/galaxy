# ------------------------------------------------------------------------------
# MAILSLURPER.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
MACH="$TAG-mailslurper"
cd $MACHINES/$MACH

ROOTFS="/var/lib/lxc/$MACH/rootfs"
DNS_RECORD=$(grep "address=/$MACH/" /etc/dnsmasq.d/$TAG-galaxy | head -n1)
IP=${DNS_RECORD##*/}
SSH_PORT="30$(printf %03d ${IP##*.})"
echo MAILSLURPER="$IP" >> $INSTALLER/000-source

# ------------------------------------------------------------------------------
# NFTABLES RULES
# ------------------------------------------------------------------------------
# the public ssh
nft delete element $TAG-nat tcp2ip { $SSH_PORT } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { $SSH_PORT : $IP }
nft delete element $TAG-nat tcp2port { $SSH_PORT } 2>/dev/null || true
nft add element $TAG-nat tcp2port { $SSH_PORT : 22 }
# tcp/4436
nft delete element $TAG-nat tcp2ip { 4436 } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { 4436 : $IP }
nft delete element $TAG-nat tcp2port { 4436 } 2>/dev/null || true
nft add element $TAG-nat tcp2port { 4436 : 4436 }
# tcp/4437
nft delete element $TAG-nat tcp2ip { 4437 } 2>/dev/null || true
nft add element $TAG-nat tcp2ip { 4437 : $IP }
nft delete element $TAG-nat tcp2port { 4437 } 2>/dev/null || true
nft add element $TAG-nat tcp2port { 4437 : 4437 }

# ------------------------------------------------------------------------------
# INIT
# ------------------------------------------------------------------------------
[[ "$DONT_RUN_MAILSLURPER" = true ]] && exit

echo
echo "-------------------------- $MACH --------------------------"

# ------------------------------------------------------------------------------
# REINSTALL_IF_EXISTS
# ------------------------------------------------------------------------------
EXISTS=$(lxc-info -n $MACH | egrep '^State' || true)
if [[ -n "$EXISTS" ]] && [[ "$REINSTALL_MAILSLURPER_IF_EXISTS" != true ]]; then
    echo MAILSLURPER_SKIPPED=true >> $INSTALLER/000-source

    echo "Already installed. Skipped..."
    echo
    echo "Please set REINSTALL_MAILSLURPER_IF_EXISTS in $APP_CONFIG"
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
#lxc.start.auto = 1
#lxc.start.order = 309
#lxc.start.delay = 2
#lxc.group = $TAG-group
#lxc.group = onboot
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
apt-get $APT_PROXY --install-recommends -y install git golang
EOS

# ------------------------------------------------------------------------------
# MAILSLURPER
# ------------------------------------------------------------------------------
# mailslurper user
lxc-attach -n $MACH -- zsh <<EOS
set -e
adduser mailslurper --system --group --disabled-password --shell /bin/zsh \
    --gecos ''
EOS

cp $MACHINE_COMMON/home/user/.tmux.conf $ROOTFS/home/mailslurper/
cp $MACHINE_COMMON/home/user/.vimrc $ROOTFS/home/mailslurper/
cp $MACHINE_COMMON/home/user/.zshrc $ROOTFS/home/mailslurper/

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown mailslurper:mailslurper /home/mailslurper/.tmux.conf
chown mailslurper:mailslurper /home/mailslurper/.vimrc
chown mailslurper:mailslurper /home/mailslurper/.zshrc
EOS

# mailslurper application
lxc-attach -n $MACH -- zsh <<EOS
set -e
su -l mailslurper <<EOSS
    set -e
    mkdir /home/mailslurper/src
    cd /home/mailslurper/src
    git clone https://github.com/mailslurper/mailslurper.git

    export CGO_CFLAGS="-g -O2 -Wno-return-local-addr"
    export PATH=$PATH:/home/mailslurper/go/bin
    cd /home/mailslurper/src/mailslurper/cmd/mailslurper/
    go get github.com/mjibson/esc
    go get
    go generate
    go build

    rm -rf /home/mailslurper/app
    cp -arp /home/mailslurper/src/mailslurper/cmd/mailslurper/ \
        /home/mailslurper/app
EOSS
EOS

# mailslurper config
mkdir $ROOTFS/home/mailslurper/config
cp /root/$TAG-certs/$TAG-galaxy.key \
    $ROOTFS/home/mailslurper/config/$TAG-cert.key
cp /root/$TAG-certs/$TAG-galaxy.pem \
    $ROOTFS/home/mailslurper/config/$TAG-cert.pem
cp home/mailslurper/config/config.json $ROOTFS/home/mailslurper/config/
sed -i "s/___APP_FQDN___/$APP_FQDN/g" \
    $ROOTFS/home/mailslurper/config/config.json

lxc-attach -n $MACH -- zsh <<EOS
set -e
chown mailslurper:mailslurper /home/mailslurper/config -R
chmod 700 /home/mailslurper/config
chmod 644 /home/mailslurper/config/$TAG-cert.pem
chmod 640 /home/mailslurper/config/$TAG-cert.key

mkdir /home/mailslurper/data
chown mailslurper:mailslurper /home/mailslurper/data
EOS

# mailslurper systemd service
cp etc/systemd/system/mailslurper.service $ROOTFS/etc/systemd/system/

lxc-attach -n $MACH -- zsh <<EOS
set -e
systemctl daemon-reload
systemctl enable mailslurper.service
systemctl start mailslurper.service
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

# keep closed, it's only useful in development environment
lxc-stop -n $MACH
lxc-wait -n $MACH -s STOPPED
