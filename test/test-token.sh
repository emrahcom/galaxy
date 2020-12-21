#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test token api
# -----------------------------------------------------------------------------
out=/tmp/out
[[ -z "$apilink" ]] && apilink="http://127.0.0.1:8000"

echo '>>> token POST'
curl -sX POST -H "Content-Type: application/json" \
    -d @json/account-valid.json $apilink/api/token/ | tee $out
[[ -z "$(jq '.jwt' $out)" ]] && echo " <<< error 1" && false
[[ "$(jq '.jwt' $out)" = 'null' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> token POST (invalid login data - 1)'
curl -sX POST -H "Content-Type: application/json" -d "{}" \
    $apilink/api/token/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> token POST (invalid login data - 2)'
curl -sX POST -H "Content-Type: application/json" \
    -d @json/account-invalid.json $apilink/api/token/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> token DELETE (unsupported method)'
curl -sX DELETE -H "Content-Type: application/json" \
    -d @json/account-valid.json $apilink/api/token/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error 2" && false
echo; echo
