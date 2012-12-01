/**
 *      Konfigurations-Datei für das HQ WebUI
 *
 *      https://github.com/hobbyquaker
 */

var hqConf = {

    // Hier die URL der CCU eintragen
    // Wird das HQ WebUI auf der CCU installiert kann diese Variable leer bleiben ('')
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
    },

    // Zuordnung Datenpunkte -> Bezeichnung, Einheit, Anzahl Dezimalstellen
    dpDetails: {
        'BAT_LEVEL':            { unit: '%',        desc: 'Batteriekapazität',      decimals: 1,    factor: 100 },
        'U_USBD_OK':            { unit: '',         desc: 'USB',                    decimals: -1 },
        'U_SOURCE_FAIL':        { unit: '',         desc: 'Netzausfall',            decimals: -1 },
        'LOWBAT':               { unit: '',         desc: 'Batterie erschöpft',     decimals: -1 },
        'TEMPERATURE':          { unit: '°C',       desc: 'Temperatur',             decimals: 1 },
        'HUMIDITY':             { unit: '%',        desc: 'Luftfeuchte',            decimals: 0 },
        'MOTION':               { unit: '',         desc: 'Bewegung',               decimals: -1 },
        'BRIGHTNESS':           { unit: '',         desc: 'Helligkeit',             decimals: -1 },
        'RAINING':              { unit: '',         desc: 'Regen aktuell',          decimals: -1 },
        'RAIN_COUNTER':         { unit: 'mm',       desc: 'Regen heute',            decimals: 0 },
        'WIND_SPEED':           { unit: 'km/h',     desc: 'Windgeschwindigkeit',    decimals: -1 },
        'WIND_DIRECTION':       { unit: '°',        desc: 'Windrichtung',           decimals: -1 },
        'WIND_WIND_DIRECTION':  { unit: '°',        desc: 'Windr. Schwankungsbr.',  decimals: -1 },
        'SUNSHINEDURATION':     { unit: '',         desc: 'Sonnenscheindauer',      decimals: -1 }
    },

    dpValueMap: {
        'false':    'Falsch',
        'true':     'Wahr'
    },

    // Todo Formatierung des STATE Datenpunkts in Abhängigkeit vom
    dpDetailsState: {
        'T37':               {
            formatter: function (val) {

            },
            icon: function (val) {

            }

        },
        'T38':               {
            formatter: function (val) {

            },
            icon: function (val) {

            }
        },
        'DEFAULT':              {
            formatter: function (val) {
                switch (val) {
                case 'true':
                    return "Wahr";
                    break;
                case 'false':
                    return "Falsch";
                    break;
                default:
                    return val;
                }
            }
        }
    }

};
