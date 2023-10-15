# ------------------------------------------------------------------------------
# INIT.SH
# ------------------------------------------------------------------------------
set -e

# ------------------------------------------------------------------------------
# ENVIRONMENT
# ------------------------------------------------------------------------------
cd $INSTALLER

# ------------------------------------------------------------------------------
# INIT
# ------------------------------------------------------------------------------
[[ "$DONT_RUN_INIT" = true ]] && exit

# ------------------------------------------------------------------------------
# CHECKS
# ------------------------------------------------------------------------------
echo

[[ -z "$APP_FQDN" ]] && echo "Error: APP_FQDN not found" && false
[[ -z "$KRATOS_FQDN" ]] && echo "Error: KRATOS_FQDN not found" && false

if [[ "$SKIP_DNS_CHECK" != true ]]; then
  if [[ -z "$(dig +short $APP_FQDN)" ]]; then
    cat <<EOF
Error: Unresolvable APP_FQDN: $APP_FQDN

if this is a test setup and you don't have a resolvable APP_FQDN,
please set SKIP_DNS_CHECK before installation

    export SKIP_DNS_CHECK=true
EOF
    false
  fi

  if [[ -z "$(dig +short $KRATOS_FQDN)" ]]; then
    cat <<EOF
Error: Unresolvable APP_FQDN: $KRATOS_FQDN

if this is a test setup and you don't have a resolvable KRATOS_FQDN,
please set SKIP_DNS_CHECK before installation

    export SKIP_DNS_CHECK=true
EOF
    false
  fi
fi

# ------------------------------------------------------------------------------
# INSTALLER CONFIGURATION
# ------------------------------------------------------------------------------
cp -ap ../$TAG-base/* .
