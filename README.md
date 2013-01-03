HQ WebUI 2.0
============
Leichtgewichtiges ergänzendes Webfrontend zur Administration der Homematic CCU und zur Entwicklung von Scripten.


Features
========
* schnelle Ladezeit
* geringere Belastung der CCU
* Durch Login geschützt, sowohl im Frontend als auch im Backend
* Editor mit Syntax-Highlighting und Auto-Vervollständigung
* Editor unterstützt Homematic Script, TCL, Shell Script, XML RPC, JSON RPC
* Direktes Ausführen der Scripte und RPC aus dem Editor, automatisches Speichern im "LocalStorage"
* Anzeige von Geräten/Kanälen/Datenpunkten, Variablen, Programmen
* Anzeige von diversen Informationen und dem Systemprotokoll, löschen des Systemprotokolls
* Schreibender Zugriff auf Datenpunkte
* Ändern des Wertes eine Variable
* Starten, umbenennen und aktivieren/deaktivieren von Programmen
* Umbenennen von Geräten und Kanälen
* Übersichtliche Favoritenansicht
* Themes, jQuery UI basiert.
* ...geplante Features siehe "Todo"

Das HQ WebUI lädt die benötigten jQuery Bibliotheken vom CDN ("Content Delivery Network") googleapis.com - so kann der Speicherplatz den die Bibliotheken auf der CCU belegen würden eingespart werden. Allerdings ist deshalb zur Benutzung ein funktionierender Web-Zugang erforderlich.

Getestet wird das HQ WebUI primär mit Google Chrome. Firefox und Safari Kompatibilität wird angestrebt. Opera und der Internet Explorer werden nicht von mir getestet. Vielleicht funktioniert es, vielleicht aber auch nicht...

Diese Software darf kostenfrei verwendet, modifiziert und weiterverbreitet werden, allerdings ohne jegliche Garantien, die Benutzung erfolgt auf eigenes Risiko. Bei einer Weiterverbreitung bitte dieses Readme beibehalten!

Allgemeines Feedback, Verbesserungsvorschläge, Wünsche und Fehlerberichte sind jederzeit willkommen!

Siehe auch diesen Foren-Thread: http://homematic-forum.de/forum/viewtopic.php?f=31&t=10559

Download
========
http://www.homematic-inside.de/software/download/item/hq-webui-addon


Installation
============
Die Datei hq-webui-(version).tar.gz wird als Zusatzsoftware auf der CCU installiert. Das HQ WebUI ist dann unter http://IP-Adresse-der-CCU/addons/hq/ui/ erreichbar.

*Hinweis: Die Nutzung ohne Installation auf der CCU (wie sie mit Version 1.x möglich war) ist nicht mehr vorgesehen (wenn auch mit einigen Verrenkungen machbar)*

**Achtung bei Updates:** vor dem installieren die alte Version deinstallieren. Bitte nach der Installation den Browsercache leeren.

Bedienung
=========

Allgemein
---------
Links unten in jeder Tabellen-Ansicht befindet sich ein Reload-Button um die Daten neu zu laden. Bei den Systemprotokollen ist hier außerdem ein Lösch-Button zu finden.
Die Gerätedaten, die Räume und die Gewerke werden lokal zwischengespeichert und lassen sich über den zweiten Reload-Button in der Geräteansicht unten Links aktualisieren, der erste Reload-Button lädt lediglich die Status der Datenpunkte neu.
Rechts oben befindet sich der Logout-Button, der Einstellungen-Button (in den Einstellungen kann das Theme gewählt werden und gespeicherte Login-Daten können gelöscht werden), sowie ein Hilfe-Button.
Eigene Themes können quasi ohne HTML/CSS hier "zusammengecklickt" werden: http://jqueryui.com/themeroller/

Favoriten
---------
Die Favoritenbereiche lassen sich per Drag&Drop sortieren, diese Einstellung wir automatisch im LocalStorage gespeichert. Unten Links befindet sich ein Refresh-Button.

Geräte und Variablen
--------------------
In der Geräteliste befindet sich ganz links in der Tabelle bei jedem Gerät ein + Symbol. Hierüber können Geräte "aufgeklappt" werden, dann werden Kanäle sichtbar. Diese verfügen ihrerseits wieder über ein + zum aufklappen, dann werden die Datenpunkte sichtbar.
Datenpunkte und Variablen lassen sich einfach über Doppelklick auf die Tabellenzeile editieren.
Geräte und Kanäle können über Doppelklick umbenannt werden.

Programme
---------
Programme können über einen Doppelklick auf die Tabellenzelle umbenannt und aktiviert/deaktiviert werden. Links in jeder Zeile befindet sich ein "Play-Button", hiermit können Programme gestartet werden.

Entwicklung
-----------
Beim Ausführen von JSON RPC muss der Parameter _session_id nicht angebeben werden, er wird automatisch mit der aktuellen Session-ID ergänzt.
Man sollte sich nicht auf die Speichern-Funktion des Script-Editors verlassen. Die Scripte werden im "LocalStorage" gespeichert, das ist nichts weiter als eine modernere Art Browser-Cookie und kann "verloren gehen".

Changelog
=========
Siehe https://github.com/hobbyquaker/hq-webui/blob/master/CHANGELOG.md


Roadmap/Todo/Ideen
==================

2.1
---
* http://homematic/ise/checkrega.cgi auswerten im Fehlerfall und entsprechende Meldung darstellen
* Anzeige Anzahl Servicemeldungen/Alarme (bei 2 oder mehr Meldungen)
* ERROR-Datenpunkte als Servicemeldungen anzeigen
* Service-Meldungen umbauen (AL-Datenpunkte!)
* Session Fehler abfangen
* Anzeige Protokolliert-Checkbox bei Geräten von Kanälen kummulieren
* neuer Tab "Kanäle"
* Programme umbenennen
* addInfo() soll einen bereits vorhandenen Eintrag überschreiben statt ihn neu hinzuzufügen
* Geräte: Kanäle Protokollierung aktivieren/deaktivieren
* Geräte: eigene Spalte für Icons
* Buttons bei Variablen und Programmen nach unten in den jqGrid Pager
* Systemprotokoll?!?
* Automatischer Ressourcenschonender Refresh aller sichtbaren Werte und Timestamps
* Hinzufügen/Entfernen von Kanälen Gewerken und Räumen
* Hinzufügen/Ändern/Entfernen von Gewerken und Räumen
* Anlegen, Löschen und Ändern von Variablen
* Kontextmenü in allen Tabellen


2.2
---
* Scriptkonsole: Anderen (besseren) Editor einbauen - vermutlich ACE
* Programme direkt aus dem Scripteditor heraus erzeugen
* Programme anzeigen, anlegen, editieren, löschen.
* TCL und Shellscripte aus Editor auf CCU Speichern
* Automatisches erstellen eines Programms zum Start eines TCL/Shellscripts aus dem Editor (wahlweise system.exec oder cuxd)
* CCU-Dateibrowser (Mit möglichkeit eine Datei auszuführen bzw anzusehen/downzuloaden/upzuloaden)

2.3
---
* Zuordnung von Variablen zu Kanälen setzen, löschen
* Hinzufügen/Entfernen/Umbenennen von Favoritenbereichen
* Hinzufügen/Entfernen von Kanälen, Variablen und Programmen zu Favoriten
* Sortieren von Favoriten per Drag & Drop
* Verlinkung Variablen und Programme die diese Variable nutzen

2.4
---
* Geräte konfigurieren
* Anlegen/Bearbeiten/Löschen von Direktverknüpfungen
* Geräte anlernen



irgendwann
----------
* Tab Favoriten: stringtable_de.txt konsequent überall verwenden, Möglichkeit schaffen via config.js einzelne Werte zu überschreiben
* Tab Geräte: Wahlweise Übersetzungen/Texte von Werten, Datenpunkten und Servicemeldungen anzeigen (Checkbox im Einstellungen-Dialog)
* Favoriten-Separatoren per config.js abschaltbar machen (dann kann man sie zum "Auffüllen" benutzen bei ungleichmäßiger Spaltenverteilung)
* generate_img.sh Skript erweitern - automatisches minifizieren und mergen der .js und .css Dateien, automatisches ändern der js includes in index.html, automatisches "reinigen" der conf Datei?
* Selbst-Update / Auto-Update des HQ WebUI
* Snippets für Editor
* Style, Nomenklatur, komplettes Refactoring
* Intern komplett vom xml auf json umstellen ("Überbleibsel" der xmlapi aus Version 1.x)
* Machbarkeit prüfen: Anlegen/Editieren/Löschen von Cronjobs?
* Dienste starten/stoppen (inetd (telnet), ftpd etc)
* Zusatzsoftware installieren (wenn möglich optional ohne Zwangsreboot) und deinstallieren
* Nicht quadratische Geräte-Icons
* Script-Editor buggt im Firefox. Fehler in edit_area/autocompletion.js - daher keine Autovervollständigung mit Firefox
* Befindet man sich in der letzten Zeile eines Scriptes buggt die Autovervollständigung (Anfangsbuchstabe erscheint doppelt)
* Editor-Ausgabe: Einbinden schöner (auf/zuklappbarer) Baumansichten für XML und JSON Ausgaben (Plugin auswählen! http://freebiesdesign.com/7-best-jquery-treeview-plugins/)
* Raumthermostat Modus setzen
* Autovervollständigungs und Syntaxhighlight Konfiguration für TCL und Shell Scripte vervollständigen
* Mehr Infos für die Info-Tabelle: z.B.: Inventarscript integrieren, CCU FW-Version, Uptime, ...
* Tastenkürzel für Buttons in Scriptkonsole
* rssilist: Einfärben der RX/TX Werte?
* Variablen vom Typ Zahl: beim Editieren gleich auf [0-9.]* und min/max prüfen.?
* Komfortableres bestätigen von Servicemeldungen (noch eine extra Liste von Service-Meldungen im Zentrale-Tab?)
* Backup erstellen
* Reboot und Safe-Mode Reboot
* Firewallkonfiguration
* Ausbau des Tabs Funk


tendenziell nein
----------------
* CUxD Administration
* Backup zurückspielen
* Firmwareupdate




in HQ WebUI verwendete Software
===============================
* jQuery http://jquery.com/
* jQuery UI http://jqueryui.com/
* jqGrid http://www.trirand.com/blog/
* jQuery JSON View https://github.com/quickredfox/jquery-jsonview
* editarea http://www.cdolivet.com/editarea/
* lostorage.js https://github.com/js-coder/loStorage.js
* jQuery UI Multiselect Widget https://github.com/ehynds/jquery-ui-multiselect-widget



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