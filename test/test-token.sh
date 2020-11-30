#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test token api
# -----------------------------------------------------------------------------

echo '>>> token POST'
curl -X POST -H "Content-Type: application/json" -d @json/login.json \
    http://127.0.0.1:8000/api/token/
echo; echo

echo '>>> token POST (invalid login data)'
curl -X POST -H "Content-Type: application/json" -d "{}" \
    http://127.0.0.1:8000/api/token/
echo; echo

echo '>>> token DELETE (unsupported method)'
curl -X DELETE -H "Content-Type: application/json" -d @json/login.json \
    http://127.0.0.1:8000/api/token/
echo; echo
