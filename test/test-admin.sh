#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test admin api
# -----------------------------------------------------------------------------
out=/tmp/out
[[ -z "$apilink" ]] && apilink="http://127.0.0.1:8000"

echo '>>> admin POST'
curl -sX POST -H "Content-Type: application/json" \
    -d @json/admin-valid.json $apilink/api/admin/ | tee $out
[[ -z "$(jq '.jwt' $out)" ]] && echo " <<< error 1" && false
[[ "$(jq '.jwt' $out)" = 'null' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> admin POST (invalid password)'
curl -sX POST -H "Content-Type: application/json" \
    -d @json/admin-invalid.json $apilink/api/admin/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error 2" && false
echo; echo

echo '>>> admin DELETE (unsupported method)'
curl -sX DELETE -H "Content-Type: application/json" \
    -d @json/admin-valid.json $apilink/api/admin/ | tee $out
[[ "$(jq '.jwt' $out)" != 'null' ]] && echo " <<< error 1" && false
[[ "$(jq '.message' $out)" != '"unauthorized"' ]] && echo " <<< error 2" && false
echo; echo
