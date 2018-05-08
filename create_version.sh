#!/usr/bin/env bash

cat > version.txt << EOF
{
  "commit_sha": "$COMMIT",
  "image": "nrgi/jade-portal:$BRANCH.$COMMIT"
}
EOF