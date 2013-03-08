# HQ WebUI 2.4

Schnelles alternatives Webfrontend zur Administration der Homematic CCU und zur Entwicklung von Homematic-Scripten.

## Features
* wesentlich schnellere Ladezeiten und geringere Belastung der CCU
* Übersichtliche Favoritenansicht
* Angenehmes Look&Feel, Themes, jQuery UI basiert
* Grafische Darstellung des Systemprotokolls mittels "Highcharts"
* Editor mit Syntax-Highlighting und Auto-Vervollständigung, unterstütztung für Homematic Script, TCL, Shell Script, XML RPC, JSON RPC
* Direktes Ausführen der Scripte und RPC aus dem Editor, automatisches Speichern im "LocalStorage"
* Anzeige der Variablen, Programme, Geräte/Kanäle/Datenpunkte in übersichtlichen Tabellen
* Zugriff auf alle Datenpunkte
* Ändern des Wertes eine Variable, umbenennen von Variablen, editieren der Beschreibung, aktivieren/deaktiveren der Protokollierung
* Anlegen und Löschen von Variablen, ändern des Variablentyps
* Zuordnung von Variablen zu Kanälen
* Starten, umbenennen und aktivieren/deaktivieren von Programmen
* Umbenennen von Geräten und Kanälen
* Anlegen, editieren und Löschen von Gewerken und Räumen
* Zuordnung von Kanälen zu Gewerken und Räumen
* Durch Login geschützt, sowohl im Frontend als auch im Backend
* ...geplante Features siehe "Todo"

Das HQ WebUI lädt alle Themes ausser dem Standard-Theme "Redmond" vom CDN ("Content Delivery Network") googleapis.com - so kann der Speicherplatz den die Themes auf der CCU belegen würden eingespart werden. Daher ist zur Benutzung von anderen Themes ein funktionierender Web-Zugang erforderlich.

Chrome, Safari oder Firefox erforderlich, Chrome empfohlen.

Diese Software darf kostenfrei verwendet, modifiziert und weiterverbreitet werden, allerdings ohne jegliche Garantien, die Benutzung erfolgt auf eigenes Risiko. Bei einer Weiterverbreitung bitte dieses Readme beibehalten!

Allgemeines Feedback, Verbesserungsvorschläge, Wünsche und Fehlerberichte sind jederzeit willkommen!

Siehe auch diesen Foren-Thread: http://homematic-forum.de/forum/viewtopic.php?f=31&t=10559



## Download

http://www.homematic-inside.de/software/download/item/hq-webui-addon


## Installation

**Achtung bei Updates:** vor dem installieren die alte Version deinstallieren. Bitte nach der Installation den Browsercache leeren.

Die Datei hq-webui_(version).tar.gz wird als Zusatzsoftware auf der CCU installiert. Das HQ WebUI ist dann unter http://IP-Adresse-der-CCU/addons/hq/ erreichbar.

**Achtung Safari Benutzer:** Safari packt in Standardeinstellung .tar.gz Dateien direkt nach dem Download aus - das ist schlecht - Zusatzsoftware muss immer als .tar.gz Datei auf die CCU geladen werden.

*Hinweis: Die Nutzung ohne Installation auf der CCU (wie sie mit Version 1.x möglich war) ist nicht mehr vorgesehen (wenn auch mit einigen Verrenkungen machbar)*


## Bedienung

### Anmeldung

Zur Anmeldung werden die gleichen Benutzernamen und Passwörter wie zur Anmeldung am originalen WebUI verwendet. Bitte darauf achten das auch Benuzternamen Groß-/Kleinschreibung relevant ist und der Standard-Benutzer auf der Homematic CCU sich "Admin" mit großem A schreibt.


### Allgemein

Links unten in jeder Tabellen-Ansicht befindet sich ein Reload-Button um die gecachten Daten neu zu laden. Alle Sichtbaren Datenpunkten werden ständig automatisch aktualisiert, die Reload-Buttons müssen nur dann verwendet werden wenn Änderungen ausserhalb des HQ WebUI vorgenommen wurden (z.B. neues Gerät angelernt oder Programm im originalen WebUI angelegt)
Im Einstellungsmenü (Zahnrad-Button oben rechts) kann man alle zwischengespeicherten Daten löschen.
Rechts oben befindet sich der Logout-Button, der Einstellungen-Button (in den Einstellungen kann das Theme gewählt werden und gespeicherte Login-Daten können gelöscht werden), sowie ein Hilfe-Button.
Eigene Themes können quasi ohne HTML/CSS-Kenntnisse hier zusammengecklickt werden: http://jqueryui.com/themeroller/
Diverse Konfigurationsoptionen können in der Datei ui/js/config.js editiert werden.

### Favoriten

Die Favoritenbereiche lassen sich per Drag&Drop sortieren, diese Einstellung wir automatisch im LocalStorage gespeichert.

### Variablen & Programme

Variablen und Programme können über einfach-Klick markiert werden, dann werden unten Links 2 Buttons aktiv, einer zum Ändern des Variablen-Werts (bzw zum starten eines Programms), einer zum editieren des Namens und der Beschreibung.

### Räume & Gewerke

Räume und Gewerke können über die Buttons unten Links bearbeitet werden.

### Geräte

In der Geräteliste befindet sich ganz links in den Tabellen-Zeilen bei jedem Gerät ein + Symbol. Hierüber können Geräte "aufgeklappt" werden, dann werden Kanäle sichtbar. Diese verfügen ihrerseits wieder über ein + zum aufklappen, dann werden die Datenpunkte sichtbar.
Datenpunkte lassen sich über einen Button rechts in der jeweiligen Zeile editieren, hier können auch Servicemeldungen bestätigt werden. Geräte und Kanäle können ebenfalls über den Button rechts umbenannt werden.

### Geräte/Servicemeldungen

Wenn Servicemeldungen vorhanden sind werden diese im Reiter Geräte mit Anzahl angezeigt. Klappt man Geräte und Kanäle mit aktiven Servicemeldungen auf kann man über den "Checkmark" Button die Servicemeldung bestätigen.


### Entwicklung

Beim Ausführen von JSON RPC muss der Parameter _session_id nicht angebeben werden, er wird automatisch mit der aktuellen Session-ID ergänzt.
Man sollte sich nicht auf die Speichern-Funktion des Script-Editors verlassen. Die Scripte werden im "LocalStorage" gespeichert, das ist nichts weiter als eine modernere Art Browser-Cookie und kann "verloren gehen".

### Zentrale/Systemprotokoll

Bitte beachten dass die Ladezeiten des Systemprotokolls sehr lange sind und die CCU stark belasten. Das Systemprotokoll wird deshalb erst dann geladen wenn der entsprechende Reiter das erste mal ausgewählt wird.

## Changelog

Siehe https://github.com/hobbyquaker/hq-webui/blob/master/CHANGELOG.md

## Roadmap/Todo/Ideen

### 2.5
* Script-Editor: Scripte auf CCU speichern und von CCU laden
* Script-Editor: Menü "Bearbeiten"
* Script-Editor: Einstellungs-Dialog
* Benchmark-Funktion für Homematic-Scripte
* Programme mit Script im Dann-Teil direkt aus dem Scripteditor heraus erzeugen

### 2.6
* Hinzufügen/Entfernen/Umbenennen von Favoritenbereichen
* Hinzufügen/Entfernen von Kanälen, Variablen und Programmen zu Favoriten
* Sortieren von Favoriten

### 2.7
* Programme anzeigen, anlegen, editieren, löschen
* Verlinkungen - Variablen und Programme die diese Variable nutzen, Programme die Geräte beinhalten etc


### 3.0
* Nutzung der "WebAPI", Verzeichnisse umstrukturieren, Verzeichnis "api" fliegt komplett raus.
* Code aufräumen, ordnen, kommentieren, refaktorieren
* hq-webui.js minifiziert ausliefern, eventuell javascript-files zusammenfassen
* http://homematic/ise/checkrega.cgi auswerten im Fehlerfall und entsprechende Meldung darstellen
* Session Fehler abfangen
* Kontextmenü (rechts-klick) in allen Tabellenansichten und in der File-Liste des Editors





### bald/irgendwann/vielleicht

* WebMatic Flags (r) (d) (nv) (g/...) beim Editieren von Variablen anbieten
* Tabellenheader anpassen (Sortierung, Filter - Selects)
* Programme-Drucken funktion implementieren (Anli?)
* Such-Funktion für Suche nach Variablen, Programmen, Geräten und Kanälen?
* Automatisches erstellen eines Programms zum Start eines TCL/Shellscripts aus dem Editor (wahlweise system.exec oder cuxd)
* neuer Tab "Kanäle"? Umschaltbare Ansicht im Tab Geräte um Kanalliste anzuzeigen?
* Tab Geräte: Wahlweise Übersetzungen/Texte von Werten, Datenpunkten und Servicemeldungen anzeigen (Checkbox im Einstellungen-Dialog)
* Editor-Ausgabe: Einbinden schöner (auf/zuklappbarer) Baumansichten für XML und JSON Ausgaben (Plugin auswählen! http://freebiesdesign.com/7-best-jquery-treeview-plugins/)
* Programme exportieren/importieren? Aufwendig - beim Import müssten Variablen/Kanäle komfortabel neu zugeordnet werden...
* CCU-Dateibrowser (Mit möglichkeit eine Datei auszuführen bzw anzusehen/downzuloaden/upzuloaden) (braucht man das? FTP und Telnet tun es doch?!?)
* Anlegen/Editieren/Löschen von Cronjobs
* Dienste starten/stoppen (inetd (telnet), ftpd etc)
* Selbst-Update / Auto-Update des HQ WebUI
* Zusatzsoftware installieren - optional ohne Zwangsreboot - und deinstallieren
* Mehr Infos für die Info-Tabelle: z.B.: Inventarscript integrieren, CCU FW-Version, Uptime, ...
* Ausbau des Tabs Funk, Einfärben der RX/TX Werte?
* Thermostatmodus setzen
* Favoriten-Separatoren per Einstellungs-Dialog abschaltbar machen (dann kann man sie zum "Auffüllen" benutzen bei ungleichmäßiger Spaltenverteilung)



## in HQ WebUI verwendete Software

* jQuery http://jquery.com/
* jQuery UI http://jqueryui.com/
* jqGrid http://www.trirand.com/blog/
* Codemirror http://http://codemirror.net/ mit diversen Addons
* Highcharts http://www.highcharts.com
* lostorage.js https://github.com/js-coder/loStorage.js
* jQuery UI Multiselect Widget https://github.com/ehynds/jquery-ui-multiselect-widget
* colResizable http://http://quocity.com/colresizable/

## Copyright, Lizenz, Bedingungen

HQ WebUI - fast Webfrontend for the Homematic CCU

Copyright (c) 2012, 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

**deutsche Übersetzung**: http://www.gnu.de/documents/gpl.de.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!