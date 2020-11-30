#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test user api
# -----------------------------------------------------------------------------

echo '>>> TOKEN'
TOKEN=$(curl -sX POST -H "Content-Type: application/json" -d @json/login.json \
    http://127.0.0.1:8000/api/token/ | jq '.jwt' | cut -d '"' -f2)
echo $TOKEN; echo

echo '>>>  user GET (id)'
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8000/api/user/123
echo; echo

echo '>>>  user GET (no id)'
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8000/api/user/
echo; echo

echo '>>>  user GET (invalid token)'
curl -H "Authorization: Bearer invalid-token" \
    http://127.0.0.1:8000/api/user/123
echo; echo

echo '>>>  user POST'
curl -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/user.json \
    http://127.0.0.1:8000/api/user/
echo; echo

echo '>>>  user DELETE'
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/user/123
echo; echo

echo '>>>  user PUT'
curl -X PUT -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/user.json \
    http://127.0.0.1:8000/api/user/id
echo; echo

echo '>>>  user PATCH'
curl -X PATCH -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/email.json \
    http://127.0.0.1:8000/api/user/id
echo; echo
