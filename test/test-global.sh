#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test global
# -----------------------------------------------------------------------------

echo '>>> about'
curl http://127.0.0.1:8000/api/about
echo; echo

echo '>>> not found (without token)'
curl http://127.0.0.1:8000/api/not-exist-method
echo; echo

TOKEN=$(curl -sX POST -H "Content-Type: application/json" -d @login.json \
    http://127.0.0.1:8000/api/token/ | jq '.jwt' | cut -d '"' -f2)

echo '>>> not found (with invalid token)'
curl -H "Authorization: Bearer invalid-token" \
    http://127.0.0.1:8000/api/not-exist-method
echo; echo

echo '>>> not found (with token)'
curl -H "Authorization: Bearer $TOKEN" \
    http://127.0.0.1:8000/api/not-exist-method
echo; echo
