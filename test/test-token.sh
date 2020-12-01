#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test token api
# -----------------------------------------------------------------------------
out=/tmp/out

echo '>>> token POST'
curl -sX POST -H "Content-Type: application/json" -d @json/login.json \
    http://127.0.0.1:8000/api/token/ | tee $out
[[ -z "$(jq '.jwt' $out)" ]] && echo " <<< error 1" && false
[[ "$(jq '.jwt' $out)" = 'null' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> token POST (invalid login data)'
curl -sX POST -H "Content-Type: application/json" -d "{}" \
    http://127.0.0.1:8000/api/token/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> token DELETE (unsupported method)'
curl -sX DELETE -H "Content-Type: application/json" -d @json/login.json \
    http://127.0.0.1:8000/api/token/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error 2" && false
echo; echo
