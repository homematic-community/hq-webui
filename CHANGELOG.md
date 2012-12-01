Changelog
=========

2.0-beta4
---------
* Favoriten diverse Detailverbesserungen HTML/CSS
* jQuery UI select und input, Plugin Multiselect hinzugefügt
* Favoriten Spaltenanzahl "automatisch" wird nun sinnvoll dargestellt
* Favoriten Ausrichtung links/zentriert wird nun sinnvoll dargestellt
* Favoriten Datenpunktformatierung und Formatierung für Datenpunkt State in Abhängigkeit vom Gerät hinzugefügt. Konfigurierbar in config.js

2.0-beta3
---------
* Favoriten diverse Detailverbesserungen HTML/CSS
* Favoriten geänderter HTML Aufbau

2.0-beta2
---------
* Fehler behoben Ausrichtung der id nach inline-Edit
* Performance-Optimierung beim Laden der Geräteliste
* verschiedene Änderungen an Tabellen- und Spaltenbreiten
* Favoriten passen sich nun auch in der Höhe dem Browserfenster an
* Favoriten "Separatoren" werden angezeigt
* Favoriten des eingeloggten Users werden nun angezeigt (hqConf.favoriteUsername entfällt damit)
* Favoriten Fehler behoben bei Anzeige des Namens von verknüpften Variablen
* Favoriten Einstellung Namens-Position links/oben wird ausgewertet


2.0-beta1
---------
* Funk: Einheit dBm bei RX/TX hinzugefügt
* Zusätzliche Spalte für Buttons bei Programme und Variablen
* Programme Play-Button hinzugefügt
* Aufräumaktion (mehrfach verwendete jQuery Selektoren)
* Fehler behoben beim Laden der Sortierung der Favoriten-Bereiche der dazu geführt hat das die Favoriten nicht mehr bedienbar waren
* Namensänderung von Kanal 0 unterbunden
* Button für manuellen Refresh der Favoritenansicht hinzugefügt
* Überflüssige Dateien im Verzeichnis edit_area entfernt


2.0-alpha6
----------
* Umlaut-Workaround in hmscript.cgi eingebaut.
* Programm-Namen und Beschreibungen sind editierbar, Programme können aktiviert und deaktiviert werden
* Darstellung passt sich nun an beliebige Fenstergrößen an
* Favoriten-Gerüst neu aufgebaut mit Tabelle - stellt jetzt die in der CCU konfigurierte Anzahl an Spalten dar
* HTML <img> Tags in Zeichenketten-Variablen werden nun im Tab Variablen escaped und im Tab Favoriten angezeigt


2.0-alpha5
----------
* Umbennen von Geräten und Kanälen (via Doppelklick)
* Soriertung nach ise_id gefixt
* Fehler behoben bei der Anzeige von Wertelisten/Werten
* Systemprotokoll: Sortierreihenfolge umgedreht, neueste Einträge nun ganz oben
* Geräte: Falsch beschriftete Reload-Buttons korrigiert
* Zentrale: Grid-Größe Protokoll und Infos angepasst
* Favoriten: Icon-Anzeige für Tür-Fenster-Kontakte und Drehgriff
* Favoriten: Anzeige der Einheit von Systemvariablen
* Fehler behoben beim Löschen des Systemprotokolls


2.0-alpha4
----------
* Fehler behoben bei der Anzeige des AES Modus im Tab Funk
* Fehler behoben der zur mehrfachen Anzeige mancher Protokolleinträge geführt hat
* Fehler beim löschen des Protokolls behoben
* Alle XML-API Aufrufe durch JSON RPC oder Remote TCL Scripts ersetzt, das HQ WebUI kann ab sofort ohne XML-API genutzt werden

2.0-alpha3
----------
* Diverse kleine Fehler behoben beim Laden der Favoriten und Geräteansicht

2.0-alpha2
----------
* Fehler behoben der Ausführung von HMScripts verhinderte

2.0-alpha1
---------
* JSON RPC Interface - Login, Session
* Editor: Ausführung von XML und JSON RPC Abfragen
* Editor: Ausführung von TCL Scripten
* Editor: Ausführung von Shell Scripten
* Neue Verzeichnisstruktur (/www/addons/hq/api und /www/addons/hq/ui)
* Neuer Tab "Zentrale"
* Die auf der CCU vorhandenen Geräte-Icons werden nun in der Geräteliste angezeigt. (abschaltbar und um weitere Typen erweiterbar in config.js)
* kleine Style Korrekturen im Script-Editor
* Die Anzeige der Zeilennummer in der Fehlermeldung des Script-Editors funktioniert nun auch ohne Zugriff auf /var/log/messages. Konfigurierbar in config.js
* Hilfe und Doku Buttons hinzugefügt

1.4.6
-----
* Die einzelnen Favoritenbereiche lassen sich nun via Drag&Drop sortieren

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

