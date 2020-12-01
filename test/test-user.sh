#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test user api
# -----------------------------------------------------------------------------
out=/tmp/out

echo '>>> TOKEN'
TOKEN=$(curl -sX POST -H "Content-Type: application/json" -d @json/login.json \
    http://127.0.0.1:8000/api/token/ | jq '.jwt' | cut -d '"' -f2)
echo $TOKEN; echo

echo '>>>  user GET (id)'
curl -s -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/user/123 | tee $out
[[ "$(jq '.message' $out)" != '"user, get"' ]] && echo " <<< error" && false
echo; echo

echo '>>>  user GET (no id)'
curl -s -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/user/ | tee $out
[[ "$(jq '.message' $out)" != '"user, get"' ]] && echo " <<< error" && false
echo; echo

echo '>>>  user GET (invalid token)'
curl -s -H "Authorization: Bearer invalid-token" \
    http://127.0.0.1:8000/api/user/123 | tee $out
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error" && false
echo; echo

echo '>>>  user POST'
curl -sX POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/user.json \
    http://127.0.0.1:8000/api/user/ | tee $out
[[ "$(jq '.message' $out)" != '"user, post"' ]] && echo " <<< error" && false
echo; echo

echo '>>>  user DELETE'
curl -sX DELETE -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/user/123 | tee $out
[[ "$(jq '.message' $out)" != '"user, delete"' ]] && echo " <<< error" && false
echo; echo

echo '>>>  user PUT'
curl -sX PUT -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/user.json \
    http://127.0.0.1:8000/api/user/id | tee $out
[[ "$(jq '.message' $out)" != '"user, put"' ]] && echo " <<< error" && false
echo; echo

echo '>>>  user PATCH'
curl -sX PATCH -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/email.json \
    http://127.0.0.1:8000/api/user/id | tee $out
[[ "$(jq '.message' $out)" != '"user, patch"' ]] && echo " <<< error" && false
echo; echo

echo '>>>  user UNKNOWN METHOD'
curl -sX UNKNOWN -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/user/id | tee $out
[[ "$(jq '.message' $out)" != '"method not allowed"' ]] && echo " <<< error" && false
echo; echo
