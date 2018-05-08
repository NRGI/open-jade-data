#!/usr/bin/env bash

cat > version.txt << EOF
{
  "commit_sha": "$COMMIT",
  "image": "nrgi/open-jade-data:$BRANCH.$COMMIT"
}
EOF
