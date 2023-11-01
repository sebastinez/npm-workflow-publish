#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# -------------------------------------------------------
# ✅ NB: Run this from the root of the repository
# -------------------------------------------------------

cd dist

packages=(
"ts/sdk/mix-fetch/cjs"
"ts/sdk/mix-fetch/cjs-full-fat"
"ts/sdk/mix-fetch/esm"
"ts/sdk/mix-fetch/esm-full-fat"
)

pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd > /dev/null
}

echo "Summary of versions of packages to publish:"
echo ""

for item in "${packages[@]}"
do
  pushd "$item"
  cat package.json | jq -r '. | "📦 " + .version + "   " +.name'
  popd
done

echo ""
echo ""

COUNTER=0

for item in "${packages[@]}"
do
  (( COUNTER++ ))
  pushd "$item"
  # echo "🚀 Publishing ${item}... (${COUNTER} of ${#packages[@]})"
  echo "🚀 Publishing ${item}..."
  cat package.json | jq -r '. | .name + " " +.version'
  # npm publish --access=public
  popd
  echo ""
done
echo ""
echo "✅ Done"
