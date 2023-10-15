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

[[ -z "$APP_FQDN" ]] && echo "APP_FQDN not found" && false
[[ -z "$KRATOS_FQDN" ]] && echo "KRATOS_FQDN not found" && false

if [[ "$SKIP_DNS_CHECK" != true ]]; then
  if [[ -z "$(dig +short $APP_FQDN)" ]]; then
    cat <<EOF
Unresolvable APP_FQDN: $APP_FQDN
if this is a test setup, please set SKIP_DNS_CHECK before installation
    export SKIP_DNS_CHECK=true
EOF
    false
  fi

  if [[ -z "$(dig +short $KRATOS_FQDN)" ]]; then
    cat <<EOF
Unresolvable APP_FQDN: $KRATOS_FQDN
if this is a test setup, please set SKIP_DNS_CHECK before installation
    export SKIP_DNS_CHECK=true
EOF
    false
  fi
fi

# ------------------------------------------------------------------------------
# INSTALLER CONFIGURATION
# ------------------------------------------------------------------------------
cp -ap ../$TAG-base/* .
