HQ WebUI 1.1
============
Alternatives leichtgewichtiges und schnelles WebUI zur Bedienung der Homematic CCU.

Mit diesem WebUI können Variablen und Datenpunkte angezeigt und geändert werden, Programme können gestartet werden und das Systemprotokoll kann angezeigt und gelöscht werden. Geräte-Konfiguration u.Ä. ist nicht vorgesehen. Achtung: Wie bei XML-API Anwendungen üblich findet keine Authentifizierung statt, das HQ WebUI ist also ohne Login erreichbar.

Benötigt eine modifizierte Version der XML API (mindestens Version 1.2-hq4) - zu finden hier: https://github.com/hobbyquaker/hq-xmlapi

Baut auf jQuery UI auf - d.h. die Optik ist über jQuery UI Themes einfach anpassbar. Hier kann man sich eigene Themes "zusammenklicken": http://jqueryui.com/themeroller/

Screenshots gibt es hier: https://github.com/hobbyquaker/hq-webui/tree/master/screenshots

Siehe auch diesen Foren-Thread: http://homematic-forum.de/forum/viewtopic.php?f=31&t=10559

Installation
============
Dateien irgendwo ablegen (kann auf einem beliebigen Webserver sein, kann auf der CCU (z.B. in /www/config/hq-webui/) sein, kann aber auch einfach lokal benutzt werden).
In der Datei "hq-webui.js" (zu finden im Unterordner "js") die URL der CCU anpassen. Wird das HQ WebUI auf der CCU installiert diese Variable leer lassen (auf "" setzen), anderenfalls auf "http://IP-Adresse-der-CCU" (also z.B. "http://192.168.1.20") setzen. Nun einfach die index.html im Browser aufrufen.



Changelog
=========

1.1
---
* Beim ersten Laden der Seite werden die einzelnen CGI für die "Erstbefüllung" der Grids eines nach dem anderen geladen.
* jqGrid Pager und Auswahl wieviele Einträge angezeigt werden hinzugefügt
* jqGrid Toolbar-Suche / Filter hinzugefügt
* jqGrid sortable aktiviert - Spalten können jetzt per Drag&Drop umsortiert werden
* Tab Geräte entfernt, Tab Status in Geräte umbenannt


Todo
====
* Timestamp formatieren
* Autorefresh?
* Mehr Variablentypen?
* Select bei Datenpunkt Edit?
* Favoriten anzeigen, mit schönen Selektoren und jQuery UI Slider für Float Werte
* Räume und Gewerke in Geräteliste
* in Geräteliste auf Unter-Listen verzichten - nur Datenpunkte anzeigen - und stattdessen Geräte- und Kanal-Infos als zusätzliche Spalten?
