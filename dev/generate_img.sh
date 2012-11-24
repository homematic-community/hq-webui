#!/bin/sh
rm -r tmp
mkdir -p tmp/hq/ui/js
mkdir -p tmp/hq/ui/css
mkdir -p tmp/hq/ui/img
mkdir -p tmp/hq/api

#cat edit_area/edit_area_full.js > tmp/script-bundle.js
#cat js/lostorage.min.js >> tmp/script-bundle.js
#java -jar dev/yuicompressor-2.4.7.jar --charset ISO-8859-1 js/i18n/grid.locale-de.js >> tmp/script-bundle.js
#cat js/jquery.jqGrid.min.js >> tmp/script-bundle.js
#java -jar dev/yuicompressor-2.4.7.jar --charset ISO-8859-1 js/hq-webui.js >> tmp/script-bundle.js

cp -a ui/edit_area/ tmp/hq/ui/edit_area/
cp -a ui/js/* tmp/hq/ui/js/
cp -a ui/css/* tmp/hq/ui/css/
cp -a ui/img/* tmp/hq/ui/img/
cp -a api/* tmp/hq/api/
cp ui/index.html tmp/hq/ui/
cp dev/update_script tmp/
cp dev/hobbyquaker-webui tmp/
cd tmp
tar -czvf ../hq-webui.tar.gz *
