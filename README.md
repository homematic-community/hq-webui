HQ WebUI
========
Leichtgewichtiges und schnelles Webfrontend zur Bedienung der Homematic CCU.


Mit diesem WebUI können Variablen und Datenpunkte angezeigt und geändert werden, Programme können gestartet werden und das Systemprotokoll kann angezeigt und gelöscht werden. Geräte-Konfiguration oder das Anlegen von Variablen oder Programmen und Verknüpfungen u.Ä. ist nicht vorgesehen. Achtung: Wie bei XML-API Anwendungen üblich findet keine Authentifizierung statt, das HQ WebUI ist also ohne Passwortschutz erreichbar.

Die Idee hinter diesem WebUI ist nicht das originale Homematic WebUI vollständig zu ersetzen, es ist vielmehr als schnelle ergänzende Oberfläche für den Homematic-"Administrator" gedacht der komfortabel und schnell z.B. einen Datenpunkt oder eine Variable editieren möchte, eine ise_id nachschauen oder ein Script erstellen will.
Benötigt eine modifizierte Version der XML API (mindestens Version 1.2-hq9) - zu finden hier: https://github.com/hobbyquaker/hq-xmlapi

Das HQ WebUI lädt die benötigten jQuery Bibliotheken vom CDN ("Content Delivery Network") googleapis.com - so kann der Speicherplatz den die Bibliotheken auf der CCU belegen würden eingespart werden. Allerdings ist deshalb zur Benutzung ein funktionierender Web-Zugang erforderlich.

Getestet wird das HQ WebUI primär mit Google Chrome. Firefox und Safari Kompatibilität wird angestrebt. Opera und dem Internet Explorer wird keine Beachtung geschenkt, vielleicht funktioniert es, wenn nicht - Pech.

Diese Software darf kostenfrei verwendet, modifiziert und weiterverbreitet werden, allerdings ohne jegliche Garantien, die Benutzung erfolgt auf eigenes Risiko. Bei einer Weiterverbreitung bitte dieses Readme beibehalten!

Allgemeines Feedback, Verbesserungsvorschläge, Wünsche und Fehlerberichte sind jederzeit willkommen!

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
In der Datei "config.js" (zu finden im Unterordner "js") die URL der CCU anpassen. Die Variable ccuUrl (zu finden in den ersten paar Zeilen des Scripts) auf 'http://IP-Adresse-der-CCU' (also z.B. 'http://192.168.1.20') setzen. Nun einfach die index.html im Browser aufrufen.
**Achtung Firefox-Benutzer**: Das HQ WebUI kann im Firefox nicht lokal über eine file:// URL aufgerufen werden. Es muss ein Webserver verwendet werden oder die Installation auf der CCU muss durchgeführt werden. Mit http:// URLs tritt das Problem nicht auf.


Bedienung
=========
Allgemein
---------
Links unten bei jeder Tabellen-Ansicht befindet sich ein Reload-Button um die Daten neu zu laden. Bei den Systemprotokollen ist hier außerdem ein Lösch-Button zu finden.

Favoriten
---------
Der Tab Favoriten zeigt defaultmäßig nur die Favoriten des Users _USER1004 (bei mir der Admin) an - sollen hier die Favoriten eines anderen Users angezeigt werden muss die Variable favoriteUser in der Datei config.js entsprechend angepasst werden.
Die Favoritenansicht ist fix zwei-spaltig und zeigt leider keine "Separatoren" an.

Geräte und Variablen
--------------------
In der Geräteliste befindet sich ganz links in der Tabelle bei jedem Gerät ein + Symbol. Hierüber können Geräte "aufgeklappt" werden, dann werden Kanäle sichtbar. Diese verfügen ihrerseits wieder über ein + zum aufklappen, dann werden die Datenpunkte sichtbar.
Datenpunkte und Variablen lassen sich einfach über Doppelklick auf die Tabellenzeile editieren.

Programme
---------
Programme werden über Doppelklick auf die Tabellenzeile gestartet.

Script-Editor
-------------
Man sollte sich nicht auf die Speichern-Funktion des Script-Editors verlassen. Die Scripte werden im "LocalStorage" gespeichert, das ist nichts weiter als eine modernere Art Browser-Cookie und kann durchaus mal verloren gehen.

Todo/Bekannte Fehler
====================
* Script-Editor buggt im Firefox. Fehler in edit_area/autocompletion.js
* Bei der ausführung eines Fehlerhaften Scripts versucht das HQ WebUI die Fehlermeldung in /var/log/messages zu finden. Das funktioniert allerdings nicht wenn man auf einen externen Syslog loggt.
* Befindet man sich in der letzten Zeile eines Scriptes buggt die Autovervollständigung (Anfangsbuchstabe erscheint doppelt)

Todo/Ideen
==========

* Systemprotokoll: Standard-Sortierreihenfolge umkehren, neueste ganz oben
* Überflüssige Dateien im Verzeichnis edit_area entfernen
* Mehr Infos für die Info-Tabelle: z.B.: Inventarscript integrieren, CCU FW-Version, Uptime, ...
* Scriptkonsole: ACE Editor statt area_edit?!
* Favoriten: Variablen-Einheiten anzeigen
* Favoriten: TFK Offen/Zu statt Aus/An -> xmlapi favoritelist.cgi erweitern - benötige Gerätetyp
* Tastenkürzel für Buttons in Scriptkonsole
* rssilist: Einfärben der RX/TX Werte. Einheit (dBm?) in überschrift hinzufügen
* Mehr Icons - Datenpunkt-Typen, True/False, Geräte-Typen (auf CCU vorhandene Bilder benutzen?), ...
* Intelligenter und Ressourcenschonender automatischer Refresh-Mechanismus (-> xmlapi state.cgi erweitern um Möglichkeit mehrere ise_id zu übergeben?, Nutzeraktivität erkennen? Erkennen welche Daten sichtbar sind und nur diese Updaten?)
* Tab Favoriten: Manueller Refresh
* Favoriten: Auswahlmöglichkeit für angezeigten User?
* Favoriten: nicht bedienbare disablen
* Scripteditor: Links auf die HM-Script Dokumentation, das Forum, hm-inside, ... als 3. Button (zum aufklappen)?
* Refresh Button je Variable und Datenpunkt bzw Favoritenbereich (-> xmlapi state.cgi erweitern um Möglichkeit mehrere ise_id zu übergeben?)
* Variablen vom Typ Zahl: beim Editieren gleich auf [0-9.]* und min/max prüfen.?
* Programme aktivieren/deaktivieren?
* Geräte (ent)sperren?
* Raumthermostat Modus setzen?
* Servicemeldungen bestätigen?
* Dienste starten/stoppen (ftpd etc)
* Shell integrieren? (eigentlich reicht mir ein "normales" telnet ja - also eher nicht)
* TCL-Script Editor integrieren? (Zusätzlicher Tab, oder im Script-Editor eine Auswahl ob man HMScript oder TCL erstellen möchte) - Top wäre eine Möglichkeit die Scripte gleich auf der CCU zu speichern...
* Möglichkeit erweiteterte  CCU Infos abfragen (/proc/loadavg, memfree, df -h, ps ax, ....)?
* CCU-Dateibrowser? (Mit möglichkeit eine Datei auszuführen bzw anzusehen/downzuloaden)
* Auth?
* Verzicht auf xmlapi? komplett auf Remote Script und xmlrpc umsteigen? -> allow-origin nervt - will das ja via XHR machen, also vermutlich bleibts bei xmlapi.
* generate_img.sh Skript erweitern - automatisches minifizieren und mergen der .js und .css Dateien, automatisches ändern der js includes in index.html, automatisches "reinigen" der conf Datei?



Changelog
=========



1.4.5
-----
* Sortierung der Rssilist nach RX/TX gefixt
* diverse Fehlerbehebungen im Script-Editor (der leider immer noch an einigen Stellen buggt)

1.4.4
-----
* Fehler behoben der bewirkte dass ein Grid überflüssigerweise erneut die index.html geladen hat
* Autocompletion im Firefox erstmal deaktiviert - so ist die Scriptkonsole wenigstens benutzbar

1.4.3
-----
* Datenpunkt-Edit-Dialog überarbeitet, Slider, Input und Radio verhalten sich nun so wie man es erwartet
* Neuer Punkt in der Info-Tabelle: CCU Batteriestatus
* Sortierung der Variablen in Scriptkonsole gefixt

1.4.2
-----
* Favoriten: langen und kurzen Tastendruck hinzugefügt
* Favoriten: Es werden nun alle Datenpunkte dargestellt
* config.js überarbeitet - nur noch ein Objekt im globalen Namensraum
* Servicemeldungen werden als Icon im Geräte-Reiter angezeigt
* Alarmmeldungen werden als Icon im Variablen-Reiter angezeigt

1.4.1
-----
* separates Config-File: config.js im Unterordner js
* diverse Icons
* neue Spalten Sichtbar und Protokolliert in Variablen-Ansicht
* div. kleine Änderungen an den Grid-Formattern
* Favoriten werden jetzt zweispaltig angezeigt
* Navigation mit vor und zurück Buttons ist jetzt möglich
* Fehler in hq-webui.js behoben der dazu führte dass die Favoriten in Firefox nicht korrekt dargestellt wurden
* in der Favoritenansicht können nun Programme gestartet werden

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




in HQ WebUI verwendete Software
===============================
* jQuery http://jquery.com/
* jQuery UI http://jqueryui.com/
* jqGrid http://www.trirand.com/blog/
* editarea http://www.cdolivet.com/editarea/
* lostorage.js https://github.com/js-coder/loStorage.js


Copyright, Lizenz, Bedingungen
==============================
HQ WebUI - lightweight and fast Webfrontend for the Homematic CCU

Copyright (c) 2012 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

**deutsche Übersetzung**: http://www.gnu.de/documents/gpl.de.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!