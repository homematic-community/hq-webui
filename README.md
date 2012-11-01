HQ WebUI 1.0
============
Alternatives leichtgewichtiges und schnelles WebUI zur Bedienung der Homematic CCU.

Mit diesem WebUI können Variablen und Datenpunkte angezeigt und geändert werden, Programme können gestartet werden und das Systemprotokoll kann angezeigt und gelöscht werden. Geräte-Konfiguration u.Ä. ist nicht vorgesehen.

Benötigt eine modifizierte Version der XML API (mindestens Version 1.2-hq4) - zu finden hier: https://github.com/hobbyquaker/hq-xmlapi

Baut auf jQuery UI auf - d.h. die Optik ist über jQuery UI Themes einfach anpassbar. Hier kann man sich eigene Themes "zusammenklicken": http://jqueryui.com/themeroller/

Screenshots gibt es hier: https://github.com/hobbyquaker/hq-webui/tree/master/screenshots

Siehe auch diesen Foren-Thread: http://homematic-forum.de/forum/viewtopic.php?f=31&t=10559

Installation
============
Dateien irgendwo ablegen (kann auf einem beliebigen Webserver sein, kann auf der CCU (z.B. in /www/config/hq-webui/) sein, kann aber auch einfach lokal benutzt werden).
In der Datei "hq-webui.js" (zu finden im Unterordner "js") die URL der CCU anpassen. Wird das HQ WebUI auf der CCU installiert diese Variable leer lassen (auf "" setzen), anderenfalls auf "http://IP-Adresse-der-CCU" (also z.B. "http://192.168.1.20") setzen. Nun einfach die index.html im Browser aufrufen.

