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

curl -sf "$LOGGER/?text=$APP_TEMPLATE-init" || true

# ------------------------------------------------------------------------------
# CHECKS
# ------------------------------------------------------------------------------
echo

if [[ -z "$APP_FQDN" ]]; then
  cat <<EOF
Error: APP_FQDN not found

Please set APP_FQDN before installation, e.g.

    export APP_FQDN=app.mydomain.corp
EOF
  false
fi

if [[ -z "$KRATOS_FQDN" ]]; then
  cat <<EOF
Error: KRATOS_FQDN not found

Please set KRATOS_FQDN before installation, e.g.

    export KRATOS_FQDN=id.mydomain.corp
EOF
  false
fi

if [[ "$SKIP_DNS_CHECK" != true ]]; then
  if [[ -z "$(dig +short $APP_FQDN)" ]]; then
    cat <<EOF
Error: Unresolvable APP_FQDN: $APP_FQDN

If this is a test setup and you don't have a resolvable APP_FQDN,
please set SKIP_DNS_CHECK before installation

    export SKIP_DNS_CHECK=true
EOF
    false
  fi

  if [[ -z "$(dig +short $KRATOS_FQDN)" ]]; then
    cat <<EOF
Error: Unresolvable KRATOS_FQDN: $KRATOS_FQDN

If this is a test setup and you don't have a resolvable KRATOS_FQDN,
please set SKIP_DNS_CHECK before installation

    export SKIP_DNS_CHECK=true
EOF
    false
  fi
fi

if [[ -z "$SMTP_CONNECTION_URI" ]]; then
  cat <<EOF
Error: SMTP_CONNECTION_URI not found

Please set SMTP_CONNECTION_URI before installation, e.g.

    export SMTP_CONNECTION_URI="smtp://username:password@mail.mydomain.corp:587"
EOF
  false
fi

if [[ -z "$SMTP_FROM_ADDRESS" ]]; then
  cat <<EOF
Error: SMTP_FROM_ADDRESS not found

Please set SMTP_FROM_ADDRESS before installation, e.g.

    export SMTP_FROM_ADDRESS="no-reply@mydomain.corp"
EOF
  false
fi

# ------------------------------------------------------------------------------
# INSTALLER CONFIGURATION
# ------------------------------------------------------------------------------
cp -ap ../$TAG-base/* .
