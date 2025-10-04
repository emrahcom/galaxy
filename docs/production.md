#### eb-kratos

Update SMTP URI and restart the container. Use URI encoded username and
password.

e.g. `myname@mydomain.corp` should be `myname%40mydomain.corp`

_/home/kratos/config/kratos.yml_

```conf
courier:
  smtp:
    connection_uri: smtps://encoded_user:encoded_password@mail.mydomain.corp:465/
    from_address: myname@mydomain.corp
```

```bash
lxc-attach -n eb-kratos -- reboot
```

#### host

##### ssh

- key only
- port

##### swap

```bash
dd if=/dev/zero of=/swapfile bs=1M count=4096
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none  swap  sw  0  0' >>/etc/fstab
```

##### letsencrypt

```bash
set-letsencrypt-cert mydomain.corp,app.mydomain.corp,id.mydomain.corp
```

#### test

- Try `forget password` and check mailbox.
- Add and remove meetings
