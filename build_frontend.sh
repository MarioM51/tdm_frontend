#!/bin/bash
echo "#### frontend building start"

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PUBLIC_DIR=$SCRIPTPATH/../dist/public

cd $SCRIPTPATH

if ! [ -d $APP_DIR ]; then
  mkdir -v $APP_DIR
fi

#Compile tailwind styles
npm run wc_build_styles
cp ./src/00_assets/blog_content.css  $PUBLIC_DIR/static/

#Build spa admin
npm run build
#---changes to avoid problems of deliver spa in a sub-folder, and not in root-folder
cd $PUBLIC_DIR/admin-spa
cp favicon.ico ../static/

sed -i -e 's|/assets/|./assets/|g' index.html

sed -i -e 's|/favicon.ico|./favicon.ico|g' index.html

sed -i -e 's|assets/|./admin/assets/|g' ./assets/index.*.js

sed -i -e 's|"/favicon.ico|"./favicon.ico|g' ./assets/*.js
sed -i -e 's|"favicon.ico|"./favicon.ico|g' ./assets/*.js

cd $SCRIPTPATH

#Bulld web components for the go templates
npm run wc_build

echo "#### frontend building finish"