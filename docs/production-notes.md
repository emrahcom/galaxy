#### eb-kratos

Update SMTP URI and restart the container. Use URI encoded username and
password.

e.g. `myname@mydomain.corp` should be `myname%40mydomain.corp`

_/home/kratos/config/kratos.yml_

```conf
courier:
  smtp:
    connection_uri: smtp://encoded_user:encoded_password@mail.mydomain.corp:587/
    from_address: myname@mydomain.corp
```

```bash
lxc-attach -n eb-kratos -- reboot
```

#### eb-mailslurper

Stop this container and remove it from auto-start group.

#### eb-app-ui

##### build

Build static files.

```bash
su -l ui

cd galaxy-dev
npm run build

rm -rf /home/ui/galaxy-static
cp -arp /home/ui/galaxy-dev/build /home/ui/galaxy-static
```

##### nginx

Update `nginx` site config and restart `nginx`.

_/etc/nginx/sites-enabled/ui.conf_

```conf
    # --------------------------------------------------------------------------
    # dev
    # --------------------------------------------------------------------------
    #location / {
    #    proxy_pass http://$ui;
    #    proxy_set_header Host $host;
    #}

    # --------------------------------------------------------------------------
    # prod
    # --------------------------------------------------------------------------
    location / {
        root /home/ui/galaxy-static;
        try_files $uri $uri.html /index.html;
    }
```

```bash
systemctl restart nginx
```

#### test

- try `forget password` and check mailbox.
- add and remove meetings
