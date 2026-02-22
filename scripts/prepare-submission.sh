#!/usr/bin/env bash
# Prepare a clean copy for Raycast Store submission.
# Usage: ./scripts/prepare-submission.sh [target-dir]
#
# Copies only the files needed for the raycast/extensions PR,
# stripping dev tooling, tests, and internal docs.

set -euo pipefail

TARGET="${1:-dist/submission}"

rm -rf "$TARGET"
mkdir -p "$TARGET"

# Copy store-required files
cp -r assets src package.json package-lock.json tsconfig.json \
      eslint.config.mjs README.md CHANGELOG.md "$TARGET/" 2>/dev/null || true

# Remove dev-only files from the copy
rm -rf "$TARGET"/src/__mocks__
find "$TARGET"/src -name '*.test.ts' -delete 2>/dev/null || true
rm -f "$TARGET"/vitest.config.ts

# Remove files that shouldn't be in the store
for f in PLAN.md TODO.md .mcp.json; do
  rm -f "$TARGET/$f"
done
rm -rf "$TARGET"/.claude

echo "Submission copy ready at: $TARGET"
echo ""
echo "Files:"
find "$TARGET" -type f | sort | sed "s|^$TARGET/|  |"
