#!/bin/bash
set -e 

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
  echo "--output_dir: output building files directory required"
  exit 1
fi

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd $SCRIPTPATH


#Compile tailwind styles
npm run wc_build_styles

#Build spa admin
npm run build
#---changes to avoid problems of deliver spa in a sub-folder, and not in root-folder

sed -i -e 's|/assets/|./assets/|g' ./dist/public/admin-spa/index.html

sed -i -e 's|/favicon.ico|./favicon.ico|g' ./dist/public/admin-spa/index.html

sed -i -e 's|assets/|./admin/assets/|g' ./dist/public/admin-spa/assets/index.*.js

sed -i -e 's|"/favicon.ico|"./favicon.ico|g' ./dist/public/admin-spa/assets/*.js
sed -i -e 's|"favicon.ico|"./favicon.ico|g' ./dist/public/admin-spa/assets/*.js


#Bulld web components for the go templates
npm run wc_build

#Copy static (not generated) files
cp -v ./src/00_assets/blog_content.css ./dist/public/static
cp -v ./public/favicon.ico ./dist/public/static

#Copy generated files to dist folder
cp -v -r ./dist/public/ $output_dir

echo "#### frontend building finish"