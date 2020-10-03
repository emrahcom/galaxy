verbose curl
============
```bash
curl -v http://127.0.0.1:8000/about
```

save output
===========
```bash
curl -o /tmp/out.json http://127.0.0.1:8000/about
```

get
===
```bash
curl http://127.0.0.1:8000/user/id
```

post
====
```bash
curl -X POST -H "Content-Type: application/json" -d login.json \
    http://127.0.0.1:8000/auth/login
curl -X POST -H "Content-Type: application/json" -d user.json \
    http://127.0.0.1:8000/user/create
```

delete
======
```bash
curl -X DELETE http://127.0.0.1:8000/user/delete/id
```

put
===
```bash
curl -X PUT -H "Content-Type: application/json" -d user.json \
    http://127.0.0.1:8000/user/update/id
```

patch
=====
```bash
curl -X PATCH -H "Content-Type: application/json" -d email.json \
    http://127.0.0.1:8000/user/update/id
```

JWT
===
```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/user/delete/id
```
