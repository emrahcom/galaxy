#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test all
# -----------------------------------------------------------------------------
export apilink="http://127.0.0.1:8000"

echo '>>>>>>>>> GLOBAL <<<<<<<<<<'
bash test-global.sh

echo '>>>>>>>>> ADMIN <<<<<<<<<<<'
bash test-admin.sh

echo '>>>>>>>>> TOKEN <<<<<<<<<<<'
bash test-token.sh

echo '>>>>>>>> ACCOUNT <<<<<<<<<<'
bash test-account.sh

echo
echo COMPLETED
