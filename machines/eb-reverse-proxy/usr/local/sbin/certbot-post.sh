#!/usr/bin/bash

if [[ -d "/etc/letsencrypt/archive" ]]; then
    find /etc/letsencrypt/archive -name 'privkey*.pem' -exec chmod 640 {} \;
    chmod 750 /etc/letsencrypt/archive
    chown root:ssl-cert /etc/letsencrypt/archive -R
fi

if [[ -d "/etc/letsencrypt/live" ]]; then
    chmod 750 /etc/letsencrypt/live
    chown root:ssl-cert /etc/letsencrypt/live -R
fi

systemctl is-active nginx.service && systemctl reload nginx.service
