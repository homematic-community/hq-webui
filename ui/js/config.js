/**
 *      Konfigurations-Datei für das HQ WebUI
 *
 *      https://github.com/hobbyquaker
 */

var hqConf = {

    // Hier die URL der CCU eintragen
    // Wird das HQ WebUI auf der CCU installiert kann diese Variable leer bleiben ('')
    // Achtung: nicht das abschließende Komma vergessen. Die Zeile muss z.B. so aussehen:
    //      ccurl: 'http://172.16.23.3',
    ccuUrl:                 '',

    // Pfad zur xmlapi
    xmlapiPath:             "/config/xmlapi",

    // Pfad zur HQ API
    hqapiPath:              "/addons/hq/api",


    sessionPersistent:      true,
    sessionLogoutWarning:   false,
    sessionLogoutFade:      500,
    sessionLoginFade:       undefined,

    // Automatischer Refresh
    refreshEnable:          false,
    refreshPause:           5000,

    // Script Debugging
    // Fehlermeldungen via xmlapi scripterror.cgi aus /var/log/messages lesen
    // oder per dummyVariable Fehlerhafte Zeile finden
    // mögliche Werte: 'log', 'dummy'
    scriptDebugMethod:      'log',

    // Geräte, Räume und Gewerke zwischenspeichern
    cacheDeviceEnable:      true,

    // Hier können Optionen für alle Grids vorgegeben werden
    gridWidth:              1050,
    gridHeight:             490,
    gridRowList:            [20,50,100,500],    // Auswahl Anzahl angezeigter Einträge
    gridRowNum:             100,                // Standardmäßige Anzahl angezeigter Einträge

    // jQuery UI Theme
    themeDefault:           "redmond",
    themeUrl:               "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/",
    themeSuffix:            "/jquery-ui.css",

    // Geräte-Bildchen anzeigen
    deviceImgEnable:        true,
    deviceImgPath:          '/config/img/devices/50/',

    // Zuordnung Geräte -> Bilder
    deviceImg:              {
        'HM-Sen-MDIR-SM':       '53_hm-sen-mdir-sm_thumb.png',
        'HM-LC-Sw4-PCB':        '46_hm-lc-sw4-pcb_thumb.png',
        'HM-CCU-1':             '24_hm-cen-3-1_thumb.png',
        'HMW-LC-Dim1L-DR':      '28_hmw-lc-dim1l-dr_thumb.png',
        'HM-LC-Dim1TPBU-FM':    'PushButton-2ch-wm_thumb.png',
        'HM-LC-Dim1L-Pl':       'OM55_DimmerSwitch_thumb.png',
        'HM-LC-Dim1L-CV':       '2_hm-lc-dim1l-cv_thumb.png',
        'HM-RC-12-B':           '19_hm-rc-12_thumb.png',
        'HM-PBI-4-FM':          '38_hm-pbi-4-fm_thumb.png',
        'HM-Sec-SC':            '16_hm-sec-sc_thumb.png',
        'HM-CC-VD':             '43_hm-cc-vd_thumb.png',
        'HM-CC-TC':             '42_hm-cc-tc_thumb.png',
        'HM-RC-4-B':            '18_hm-rc-4_thumb.png',
        'HM-Sec-RHS':           '17_hm-sec-rhs_thumb.png',
        'HM-LC-Bl1-FM':         '7_hm-lc-bl1-fm_thumb.png',
        'HMW-IO-12-Sw7-DR':     '30_hmw-io-12-sw7-dr_thumb.png',
        'HM-LC-Sw1-FM':         '4_hm-lc-sw1-fm_thumb.png',
        'HM-WDS40-TH-I':        '13_hm-ws550sth-i_thumb.png'
    }
};
