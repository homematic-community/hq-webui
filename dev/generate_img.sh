#!/bin/sh
rm -r tmp
mkdir -p tmp/hq-webui/js
mkdir -p tmp/hq-webui/css
mkdir -p tmp/hq-webui/img


#cat edit_area/edit_area_full.js > tmp/script-bundle.js
#cat js/lostorage.min.js >> tmp/script-bundle.js
#java -jar dev/yuicompressor-2.4.7.jar --charset ISO-8859-1 js/i18n/grid.locale-de.js >> tmp/script-bundle.js
#cat js/jquery.jqGrid.min.js >> tmp/script-bundle.js
#java -jar dev/yuicompressor-2.4.7.jar --charset ISO-8859-1 js/hq-webui.js >> tmp/script-bundle.js


cp -a edit_area/ tmp/hq-webui/edit_area/
cp -a js/* tmp/hq-webui/js/

cp -a css/* tmp/hq-webui/css/
cp -a img/* tmp/hq-webui/img/
cp index.html tmp/hq-webui/
cp dev/update_script tmp/
cp dev/hobbyquaker-webui tmp/
cd tmp
tar -czvf ../hq-webui.tar.gz *
