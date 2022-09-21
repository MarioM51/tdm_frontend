#!/bin/bash
set -e 
source .env

echo "#### frontend building start"

output_dir=${output_dir:-null}

while [ $# -gt 0 ]; do
   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
        # echo $1 $2 // Optional to see the parameter:value result
   fi
  shift
done


if [ "$output_dir" == "null" ]; then
  echo "--output_dir: not defined, leaving build folder result in the same place"
fi

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $SCRIPTPATH


#Compile tailwind styles
npx tailwindcss \
  --config ./tailwind.config.cjs \
  --input ./src/common/input.css \
  --output ./build/public/static_$STATIC_FILES_VERSION/tailwin.css

#Build spa admin
npx vite build \
  --base $HOST/admin/ \
  --outDir ./build/public/admin-spa

#Bulld web components for the go templates
npx rollup \
  --config ./rollup.config.js \
  --environment BUILD:deploy

#Copy static (not generated) files to build folder
cp -v ./src/00_assets/blog_content.css ./build/public/static_$STATIC_FILES_VERSION
cp -v ./public/favicon.ico ./build/public/static_$STATIC_FILES_VERSION

#Copy generated files to dist folder
if [ "$output_dir" != "null" ]; then
  cp -v -r ./build/public/ $output_dir
fi


echo "#### frontend building finish"

