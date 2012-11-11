/**
 *      Konfigurations-Datei für das HQ WebUI
 *
 *      https://github.com/hobbyquaker
 */

var hqConf = {

    // Hier die URL der CCU eintragen
    // Wird das HQ WebUI auf der CCU installiert kann diese Variable leer bleiben ('')
    // Achtung: nicht abschließende Komma vergessen. Die Zeile muss z.B. so aussehen:
    //      ccurl: 'http://172.16.23.3',
    ccuUrl:                 '',

    // Pfad zur xmlapi
    xmlapiPath:             "/config/xmlapi",

    // Der User dessen Favoriten angezeigt werden
    // http://ccu/config/xmlapi/favoritelist.cgi aufrufen um nachzusehen welche User verfügbar sind
    favoriteUsername:       "_USER1004",

    // Hier können verschiedene Optionen für alle Grids vorgegeben werden
    gridWidth:              1024,
    gridHeight:             490,
    gridRowList:            [20,50,100,500],    // Auswahl Anzahl angezeigter Einträge
    gridRowNum:             100,                // Standardmäßige Anzahl angezeigter Einträge

    // jQuery UI Theme
    defaultTheme:           "overcast",
    themeUrl:               "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/",
    themeSuffix:            "/jquery-ui.css"

};
