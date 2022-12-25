#!/bin/bash

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
[[ -z "$(dig +short $APP_FQDN)" ]] && echo "unresolvable APP_FQDN" && false
[[ -z "$(dig +short $KRATOS_FQDN)" ]] && \
    echo "unresolvable KRATOS_FQDN" && false

# ------------------------------------------------------------------------------
# INSTALLER CONFIGURATION
# ------------------------------------------------------------------------------
cp -ap ../$TAG-base/* .
