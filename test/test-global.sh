#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test-global
# -----------------------------------------------------------------------------
out=/tmp/out
[[ -z "$apilink" ]] && apilink="http://127.0.0.1:8000"

TOKEN=$(curl -sX POST -H "Content-Type: application/json" \
    -d @json/login-account-valid.json $apilink/api/token/ | \
    jq '.jwt' | cut -d '"' -f2)
[[ "$TOKEN" = "null" ]] && echo "token error" && false
[[ -z "$TOKEN" ]] && echo "token error" && false

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
[[ "$(jq '.message' $out)" != '"Unauthorized"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>> not found (with invalid token)'
curl -s -H "Authorization: Bearer invalid-token" \
    $apilink/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"Unauthorized"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>> not found (with token)'
curl -s -H "Authorization: Bearer $TOKEN" \
    $apilink/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"NotFound"' ]] && \
    echo " <<< error" && false
echo; echo
