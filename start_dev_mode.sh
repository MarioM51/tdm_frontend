#!/bin/bash
set -e 
source .env

echo "DEV_OUTPUT:" $DEV_OUTPUT
echo "deploy_output:" $deploy_output

npx tailwindcss --watch --config ./tailwind.config.cjs --input ./src/common/input.css --output $DEV_OUTPUT/../tailwin.css &
PIDS[0]=$!
npx vite build --watch --base $HOST/admin/ --outDir ./../api/public/admin-spa &
PIDS[1]=$!
npx rollup --watch --config ./rollup.config.js & 
PIDS[2]=$!

trap "kill ${PIDS[*]}" SIGINT

wait