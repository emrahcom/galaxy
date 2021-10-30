#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# test all
# -----------------------------------------------------------------------------
export apilink="http://127.0.0.1:8000"

echo '>>>>>>>>> GLOBAL <<<<<<<<<<'
bash test-global.sh

echo '>>>>>>>>> TOKEN <<<<<<<<<<<'
bash test-token.sh

echo '>>>>>>>> IDENTITY <<<<<<<<<'
bash test-identity.sh

echo
echo COMPLETED
