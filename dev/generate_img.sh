#!/bin/sh
rm -r tmp
mkdir -p tmp/hq/ui/js
mkdir -p tmp/hq/ui/cm
mkdir -p tmp/hq/ui/css
mkdir -p tmp/hq/ui/img
mkdir -p tmp/hq/api

#cat edit_area/edit_area_full.js > tmp/script-bundle.js
#cat js/lostorage.min.js >> tmp/script-bundle.js
#java -jar dev/yuicompressor-2.4.7.jar --charset ISO-8859-1 js/i18n/grid.locale-de.js >> tmp/script-bundle.js
#cat js/jquery.jqGrid.min.js >> tmp/script-bundle.js

#java -jar dev/yuicompressor-2.4.7.jar --charset ISO-8859-1 ui/js/hq-webui.js >> ui/js/hq-webui.min.js

cp -a ui/js/* tmp/hq/ui/js/
cp -a ui/js/cm tmp/hq/ui/js/cm
#rm tmp/hq/ui/js/hq-webui.js
cp -a ui/css/* tmp/hq/ui/css/
cp -a ui/img/* tmp/hq/ui/img/
cp -a api/* tmp/hq/api/
cp index.html tmp/hq/index.html
#cp ui/index.min.html tmp/hq/ui/index.html
cp ui/index.html tmp/hq/ui/index.html
cp ui/cache.html tmp/hq/ui/cache.html
cp ui/backup.html tmp/hq/ui/backup.html
cp dev/update_script tmp/
cp dev/hobbyquaker-webui tmp/
cd tmp
tar -czvf ../hq-webui_2.5.2.tar.gz *
cd ..
rm -rf tmp
