# ------------------------------------------------------------------------------
# CERTIFICATES.SH
# ------------------------------------------------------------------------------
set -e
source $INSTALLER/000-source

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
cd

# ------------------------------------------------------------------------------
# INIT
# ------------------------------------------------------------------------------
[[ "$DONT_RUN_CERTIFICATES" = true ]] && exit

echo
echo "---------------------- CERTIFICATES -----------------------"

# ------------------------------------------------------------------------------
# SELF-SIGNED CERTIFICATE
# ------------------------------------------------------------------------------
cd /root/$TAG-certs
rm -f /root/$TAG-certs/$TAG-galaxy.*

# the extension file for multiple hosts:
# the container IP, the host IP and the host names
cat >$TAG-galaxy.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
EOF

# FQDNs
echo "DNS.1 = $APP_FQDN" >>$TAG-galaxy.ext
echo "DNS.2 = $KRATOS_FQDN" >>$TAG-galaxy.ext

# internal IPs
i=1
for addr in $(egrep '^address=' /etc/dnsmasq.d/$TAG-galaxy); do
    ip=$(echo $addr | rev | cut -d '/' -f1 | rev)
    echo "IP.$i = $ip" >> $TAG-galaxy.ext
    (( i += 1 ))
done

# external IPs
echo "IP.$i = $REMOTE_IP" >>$TAG-galaxy.ext
(( i += 1 ))
[[ -n "$EXTERNAL_IP" ]] && [[ "$EXTERNAL_IP" != "$REMOTE_IP" ]] \
    && echo "IP.$i = $EXTERNAL_IP" >>$TAG-galaxy.ext \
    || true

# the domain key and the domain certificate
openssl req -nodes -newkey rsa:2048 \
    -keyout $TAG-galaxy.key -out $TAG-galaxy.csr \
    -subj "/O=$TAG/OU=$TAG-galaxy/CN=$APP_FQDN"
openssl x509 -req -CA $TAG-CA.pem -CAkey $TAG-CA.key -CAcreateserial \
    -days 10950 -in $TAG-galaxy.csr -out $TAG-galaxy.pem \
    -extfile $TAG-galaxy.ext
