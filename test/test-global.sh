#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test global
# -----------------------------------------------------------------------------
out=/tmp/out

echo '>>> about'
curl -s http://127.0.0.1:8000/api/about | tee $out
[[ "$(jq '.message' $out)" != '"galaxy"' ]] && echo " <<< error" && false
echo; echo

echo '>>> not found (without token)'
curl -s http://127.0.0.1:8000/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error" && false
echo; echo

TOKEN=$(curl -sX POST -H "Content-Type: application/json" -d @json/login.json \
    http://127.0.0.1:8000/api/token/ | jq '.jwt' | cut -d '"' -f2)

echo '>>> not found (with invalid token)'
curl -s -H "Authorization: Bearer invalid-token" \
    http://127.0.0.1:8000/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error" && false
echo; echo

echo '>>> not found (with token)'
curl -s -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/not-exist-method | tee $out
[[ "$(jq '.message' $out)" != '"not found"' ]] && echo " <<< error" && false
echo; echo
