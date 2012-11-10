HQ WebUI
========
Alternatives leichtgewichtiges und schnelles WebUI zur Bedienung der Homematic CCU.

Mit diesem WebUI können Variablen und Datenpunkte angezeigt und geändert werden, Programme können gestartet werden und das Systemprotokoll kann angezeigt und gelöscht werden. Geräte-Konfiguration oder das Anlegen von Variablen oder Programmen und Verknüpfungen u.Ä. ist nicht vorgesehen. Achtung: Wie bei XML-API Anwendungen üblich findet keine Authentifizierung statt, das HQ WebUI ist also ohne Passwortschutz erreichbar.

Die Idee hinter diesem WebUI ist nicht das originale vollständig zu ersetzen, es ist vielmehr als schnelles ergänzendes GUI für den Homematic-"Administrator" gedacht der komfortabel und schnell einen Datenpunkt oder eine Variable editieren möchte, eine ise_id nachschauen muss oder Ähnliches.

Benötigt eine modifizierte Version der XML API (mindestens Version 1.2-hq9) - zu finden hier: https://github.com/hobbyquaker/hq-xmlapi

Das HQ WebUI lädt die benötigten jQuery Bibliotheken vom CDN ("Content Delivery Network") googleapis.com - so kann der Speicherplatz den die Bibliotheken auf der CCU belegen würden eingespart werden. Allerdings ist deshalb zur Benutzung ein funktionierender Web-Zugang erforderlich.

Siehe auch diesen Foren-Thread: http://homematic-forum.de/forum/viewtopic.php?f=31&t=10559

Installation
============

Download
--------
https://github.com/hobbyquaker/hq-webui/zipball/master
Diese Zip Datei beinhaltet sowohl die Quellen (die Standalone genutzt werden können) als auch die .tar.gz Datei für die Installation als Zusatzsoftware auf der CCU

Installation auf der CCU
------------------------

Die Datei hq-webui-(version).tar.gz kann als Zusatzsoftware auf der CCU installiert werden. Das HQ WebUI ist dann unter http://IP-Adresse-der-CCU/addons/hq-webui/ erreichbar.


Ohne Installation auf der CCU
-----------------------------
Dateien irgendwo ablegen (kann auf einem beliebigen Webserver sein, kann aber auch einfach lokal benutzt werden).
In der Datei "hq-webui.js" (zu finden im Unterordner "js") die URL der CCU anpassen. Die Variable ccuUrl (zu finden in den ersten paar Zeilen des Scripts) auf 'http://IP-Adresse-der-CCU' (also z.B. 'http://192.168.1.20') setzen. Nun einfach die index.html im Browser aufrufen.


Bedienung
=========
Links unten bei jeder Tabellen-Ansicht befindet sich ein Reload-Button um die Daten neu zu laden. Bei den Systemprotokollen ist hier außerdem ein Lösch-Button zu finden.
Datenpunkte und Variablen lassen sich einfach über Doppelklick auf die Tabellenzeile editieren, Programme werden auch über Doppelklick auf die Tabellenzeile gestartet.
In der Geräteliste befindet sich ganz links in der Tabelle bei jedem Gerät ein + Symbol. Hierüber können Geräte "aufgeklappt" werden, dann werden Kanäle sichtbar. Diese verfügen ihrerseits wieder über ein + zum aufklappen, dann werden die Datenpunkte sichtbar. Analog dazu befinden sich auch in der Raum und Gewerkeliste diese Aufklapp-Buttons.
Der Tab Favoriten zeigt defaultmäßig nur die Favoriten des Users _USER1004 (bei mir der Admin) an - sollen hier die Favoriten eines anderen Users angezeigt werden muss die Variable favoriteUser in der Datei hq-webui.js entsprechend angepasst werden.
Bitte nicht auf die Speichern-Funktion des Script-Editors verlassen. Die Scripte werden im "LocalStorage" gespeichert, das ist nichts weiter als eine modernere Art von Cookie im Browser und kann durchaus mal verloren gehen.

Changelog
=========


1.4.0
-----
* lostorage.js eingebunden
* Ausgewähltes Theme wird nun gespeichert
* Editor erweitert - man kann nun parallel mehrere Scripte bearbeiten
* Scripteditor speichert die Scripte nun automatisch ab (spätestens wenn ein Script ausgeführt wird).
* devicelist.cgi, roomlist.cgi und functionlist.cgi werden nun lokal gecached, um den Cache zu leeren gibt es ein neuen Button rechts in der Toolbar


1.3.3
-----
* Fehler bei Parameter xmlapiPath gefixt...

1.3.2
-----
* Neue Scriptkonsole: Editor mit Syntax Highlight und Autocomplete, Debug-Modus mit Ausgabe der Fehlermeldungen aus /var/log/messages (benötigt xmlapi 1.2-hq9)
* Parameter xmlapiPath hinzugefügt

1.3.1
-----
* diverse kleine Fehler behoben


1.3.0
-----
* Als Erweiterung installierbar (nicht wie zuvor als Update)
* Tab Favoriten hinzugefügt (favoritelist.cgi)
* jQuery UI Slider bei Datenpunkten (noch nicht ganz fertig)
* Tab Funk (xmlapi rssilist.cgi) hinzugefügt
* Tab Script-Konsole hinzugefügt (dafür exec.cgi von http://homematic-forum.de/forum/viewtopic.php?f=31&t=7014 in xmlapi 1.2-hq6 integriert)
* Tab Info hinzugefügt
* Tabs Räume und Gewerke wieder entfernt
* hq-webui.js aufgeräumt
* Räume, Gewerke und Servicemeldungen voll in Geräteübersicht integriert
* Neue Spalten in Geräteliste
* CDN auf googleapis.com umgestellt, jQuery UI css und img werden nun ebenfalls aus dem CDN geladen

1.2.3
-----
* Raum- und Gewerkeliste neu formatiert

1.2.2
-----
* Typos

1.2.1
-----
* jQuery Selektoren aufgeräumt
* Fehler behoben der Select/Option bei Wertelisten verhindert hat
* True/False Select/Option beim editieren von Bool Datenpunkten
* Float-Werte bei Variablen und Datenpunkten auf 2 Nachkommastellen formatiert
* Timestamps formatiert
* Anzeige der Einheit beim Variablen editieren
* Geräteliste neu formatiert

1.2.0
-----
* Neue Tabs Räume und Gewerke
* Räume und Gewerke werden unter Geräte angezeigt

1.1.3
-----
* Fehler behoben der dazu geführt hat dass hin und wieder leere Grids geladen wurden
* Eventuelle Ajax Fehler beim Laden der Grids abgefangen

1.1.2
-----
* Variablentyp wird als Text dargestellt
* Buttons entfernt und in jqGrid Navbar hinzugefügt
* Kleinere Aufräumaktionen

1.1.1
-----
* Encoding Fehler behoben
* CDN für jQuery und jQuery UI
* .img Datei hinzugefügt für einfach Installation auf der CCU

1.1
---
* Beim ersten Laden der Seite werden die einzelnen CGI für die "Erstbefüllung" der Grids eines nach dem anderen geladen.
* jqGrid Pager und Auswahl wieviele Einträge angezeigt werden hinzugefügt
* jqGrid Toolbar-Suche / Filter hinzugefügt
* jqGrid sortable aktiviert - Spalten können jetzt per Drag&Drop umsortiert werden
* Tab Geräte entfernt, Tab Status in Geräte umbenannt


Todo/Ideen
==========

* Refresh-Button für Räume, Gewerke und Geräte
* Tastenkürzel für Buttons in Scriptkonsole
* Header und Footer des areaedit mit jQuery UI Styles und Icons umbauen
* Sortierung Scriptkonsole-Variablen fixen
* STDOUT Fenter hübscher machen (gleicher Header und Rahmen wie Variablengrid darunter, auch zum zuklappen)
* Speichern und Laden von Scripten
* Datenpunkte: Slider beim editieren fertigstellen
* Warnzeichen im Geräte-Reiter wenn Service-Meldungen vorhanden sind
* Theme-Button -> Icon statt Text
* Favoriten: Anzeige von mehr Datenpunkttypen
* Icons - Datenpunkt-Typen, True/False, Geräte-Typen, ...
* Intelligenter und Ressourcenschonender Refresh-Mechanismus (-> xmlapi update.cgi brauchbar? state.cgi erweitern um Möglichkeit mehrere ise_id zu übergeben?, Nutzeraktivität erkennen? Erkennen welche Daten sichtbar sind und nur diese Updaten?)
* Tab Favoriten: Manueller Refresh
* Favoriten: Auswahlmöglichkeit für angezeigten User?
* Datenpunkte: angepasste Darstellung je nach Gerätetyp?
* Warnzeichen für Alarmmeldungen? Wo unterbringen?
* Favoriten: nicht bedienbare disablen
* Refresh Button je Variable und Datenpunkt bzw Favoritenbereich (-> xmlapi state.cgi erweitern um Möglichkeit mehrere ise_id zu übergeben?)
* Variablen vom Typ Zahl: beim Editieren gleich auf [0-9.]* und min/max prüfen.?
* generate_img.sh Skript erweitern - automatisches minifizieren und mergen der .js und .css Dateien, automatisches entfernen der ccuUrl
* Programme aktivieren/deaktivieren? Geräte sperren? Raumthermostat Modus setzen? Servicemeldungen bestätigen? (xmlrpc?)
* Auth?
* Verzicht auf xmlapi? komplett auf Remote Script und xmlrpc umsteigen?


Verwendete Software
===================

* jQuery http://jquery.com/
* jQuery UI http://jqueryui.com/
* jqGrid http://www.trirand.com/blog/
* editarea http://www.cdolivet.com/editarea/
* lostorage.js https://github.com/js-coder/loStorage.js


Lizenz
======
GNU GPL v3