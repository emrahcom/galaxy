#### kratos

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

#### mailslurper

Stop this container and remove it from auto-start group.
