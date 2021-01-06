#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test-account
# -----------------------------------------------------------------------------
out=/tmp/out
[[ -z "$apilink" ]] && apilink="http://127.0.0.1:8000"

ADMIN_TOKEN=$(curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-admin-valid.json $apilink/api/admin_token/ | \
    jq '.jwt' | cut -d '"' -f2)
[[ "$ADMIN_TOKEN" = "null" ]] && echo "admin token error" && false
[[ -z "$ADMIN_TOKEN" ]] && echo "admin token error" && false

TOKEN=$(curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-account-valid.json $apilink/api/token/ | \
    jq '.jwt' | cut -d '"' -f2)
[[ "$TOKEN" = "null" ]] && echo "user token error" && false
[[ -z "$TOKEN" ]] && echo "user token error" && false

# -----------------------------------------------------------------------------
# account
# -----------------------------------------------------------------------------
echo '>>>  account GET (id)'
curl -s -H "Authorization: Bearer $TOKEN" \
    $apilink/api/account/123 | tee $out
[[ "$(jq '.message' $out)" != '"account, get"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account GET (no id)'
curl -s -H "Authorization: Bearer $TOKEN" \
    $apilink/api/account/ | tee $out
[[ "$(jq '.message' $out)" != '"account, get"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account GET (invalid token)'
curl -s -H "Authorization: Bearer invalid-token" \
    $apilink/api/account/123 | tee $out
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account POST'
curl -sX POST -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" -d @json/account.json \
    $apilink/api/account/ | tee $out
[[ "$(jq '.message' $out)" != '"account, post"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account POST (invalid token)'
curl -sX POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/account.json \
    $apilink/api/account/ | tee $out
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account DELETE'
curl -sX DELETE -H "Authorization: Bearer $TOKEN" \
    $apilink/api/account/123 | tee $out
[[ "$(jq '.message' $out)" != '"account, delete"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account PUT'
curl -sX PUT -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/account.json \
    $apilink/api/account/id | tee $out
[[ "$(jq '.message' $out)" != '"account, put"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account PATCH'
curl -sX PATCH -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/email.json \
    $apilink/api/account/id | tee $out
[[ "$(jq '.message' $out)" != '"account, patch"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  account UNKNOWN METHOD'
curl -sX UNKNOWN -H "Authorization: Bearer $TOKEN" \
    $apilink/api/account/id | tee $out
[[ "$(jq '.message' $out)" != '"method not allowed"' ]] && \
    echo " <<< error" && false
echo; echo
