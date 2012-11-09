#!/bin/sh
rm -r tmp
mkdir -p tmp/hq-webui/js
mkdir -p tmp/hq-webui/css
mkdir -p tmp/hq-webui/img
cp -a edit_area/ tmp/hq-webui/edit_area/
cp -a js/ tmp/hq-webui/js/
cp -a css/* tmp/hq-webui/css/
cp -a img/* tmp/hq-webui/img/
cp index.html tmp/hq-webui/
cp update_script tmp/
cp hobbyquaker-webui tmp/
cd tmp
tar -czvf ../hq-webui.tar.gz *
