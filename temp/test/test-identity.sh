#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test-identity
# -----------------------------------------------------------------------------
out=/tmp/out
[[ -z "$apilink" ]] && apilink="http://127.0.0.1:8000"

TOKEN=$(curl -sX POST -H "Content-Type: application/json" \
    -d @json/credential-valid.json $apilink/api/token/ | \
    jq '.jwt' | cut -d '"' -f2)
[[ "$TOKEN" = "null" ]] && echo "user token error" && false
[[ -z "$TOKEN" ]] && echo "user token error" && false

# -----------------------------------------------------------------------------
# identity
# -----------------------------------------------------------------------------
echo '>>>  identity GET (id)'
curl -s -H "Authorization: Bearer $TOKEN" \
    $apilink/api/identity/123 | tee $out
[[ "$(jq '.message' $out)" != '"identity, get"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  identity GET (no id)'
curl -s -H "Authorization: Bearer $TOKEN" \
    $apilink/api/identity/ | tee $out
[[ "$(jq '.message' $out)" != '"identity, get"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  identity GET (invalid token)'
curl -s -H "Authorization: Bearer invalid-token" \
    $apilink/api/identity/123 | tee $out
[[ "$(jq '.message' $out)" != '"Unauthorized"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  identity DELETE'
curl -sX DELETE -H "Authorization: Bearer $TOKEN" \
    $apilink/api/identity/123 | tee $out
[[ "$(jq '.message' $out)" != '"identity, delete"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  identity PUT'
curl -sX PUT -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/identity.json \
    $apilink/api/identity/id | tee $out
[[ "$(jq '.message' $out)" != '"identity, put"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  identity PATCH'
curl -sX PATCH -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" -d @json/email.json \
    $apilink/api/identity/id | tee $out
[[ "$(jq '.message' $out)" != '"identity, patch"' ]] && \
    echo " <<< error" && false
echo; echo

echo '>>>  identity UNKNOWN METHOD'
curl -sX UNKNOWN -H "Authorization: Bearer $TOKEN" \
    $apilink/api/identity/id | tee $out
[[ "$(jq '.message' $out)" != '"MethodNotAllowed"' ]] && \
    echo " <<< error" && false
echo; echo
