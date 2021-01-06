#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test-admin
# -----------------------------------------------------------------------------
out=/tmp/out
[[ -z "$apilink" ]] && apilink="http://127.0.0.1:8000"

ADMIN_TOKEN=$(curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-admin-valid.json $apilink/api/admin_token/ | \
    jq '.jwt' | cut -d '"' -f2)
[[ "$ADMIN_TOKEN" = "null" ]] && echo "admin token error" && false
[[ -z "$ADMIN_TOKEN" ]] && echo "admin token error" && false

# -----------------------------------------------------------------------------
# admin api
# -----------------------------------------------------------------------------
echo '>>> admin POST'
curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-admin-valid.json $apilink/api/admin_token/ | tee $out
[[ -z "$(jq '.jwt' $out)" ]] && echo " <<< error 1" && false
[[ "$(jq '.jwt' $out)" = 'null' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> admin POST (invalid password)'
curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-admin-invalid.json $apilink/api/admin_token/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && \
    echo " <<< error 2" && false
echo; echo

echo '>>> admin DELETE (unsupported method)'
curl -sX DELETE -H "Content-Type: application/json" \
    -d @json/login-admin-valid.json $apilink/api/admin_token/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && \
    echo " <<< error 2" && false
echo; echo
