verbose curl
============
```bash
curl -v http://127.0.0.1:8000/api/about
```

save output
===========
```bash
curl -o /tmp/out.json http://127.0.0.1:8000/api/about
```

get token (create credential)
=============================
```bash
curl -X POST -H "Content-Type: application/json" -d @login.json \
    http://127.0.0.1:8000/api/auth/login

curl -sX POST -H "Content-Type: application/json" -d @login.json \
    http://127.0.0.1:8000/api/auth/login | jq '.jwt' | cut -d '"' -f2

TOKEN=$(curl -sX POST -H "Content-Type: application/json" -d @login.json \
        http://127.0.0.1:8000/api/auth/login | jq '.jwt' | cut -d '"' -f2)
echo $TOKEN
```

get (read or list)
==================
```bash
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8000/api/user/id
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8000/api/user/
```

post (create)
=============
```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @user.json \
    http://127.0.0.1:8000/api/user/
```

delete
======
```bash
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/user/id
```

put (update)
============
```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @user.json \
    http://127.0.0.1:8000/api/user/id
```

patch (partial update)
======================
```bash
curl -X PATCH -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @email.json \
    http://127.0.0.1:8000/api/user/id
```
