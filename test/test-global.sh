#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test-global
# -----------------------------------------------------------------------------
out=/tmp/out
[[ -z "$apilink" ]] && apilink="http://127.0.0.1:8000"

ADMIN_TOKEN=$(curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-admin-valid.json $apilink/api/admin/ | \
    jq '.jwt' | cut -d '"' -f2)
[[ "$ADMIN_TOKEN" = "null" ]] && echo "admin token error" && false
[[ -z "$ADMIN_TOKEN" ]] && echo "admin token error" && false

TOKEN=$(curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-account-valid.json $apilink/api/token/ | \
    jq '.jwt' | cut -d '"' -f2)
[[ "$TOKEN" = "null" ]] && echo "user token error" && false
[[ -z "$TOKEN" ]] && echo "user token error" && false

# -----------------------------------------------------------------------------
# global
# -----------------------------------------------------------------------------
echo '>>> about'
curl -s $apilink/api/about | tee $out
[[ "$(jq '.message' $out)" != '"galaxy"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>> not found (without token)'
curl -s $apilink/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>> not found (with invalid token)'
curl -s -H "Authorization: Bearer invalid-token" \
    $apilink/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>> not found (with token)'
curl -s -H "Authorization: Bearer $TOKEN" \
    $apilink/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"not found"' ]] && \
    echo " <<< error" && false
echo; echo
