/**
 *      Konfigurations-Datei für das HQ WebUI
 *
 *      https://github.com/hobbyquaker
 */

var hqConf = {

    // Hier die URL der CCU eintragen
    // Wird das HQ WebUI auf der CCU installiert kann diese Variable leer bleiben ('')
    ccuUrl:                 '',

    // Pfad zur HQ API
    hqapiPath:              "/addons/hq/api",

    sessionPersistent:      true,
    sessionLogoutWarning:   false,
    sessionLogoutFade:      500,
    sessionLoginFade:       undefined,

    // Automatischer Refresh
    refreshEnable:          true,
    refreshPause:           5000,
    // Wie lange warten wenn es nichts zu refreshen gab?
    refreshRetry:           500,

    // Dynamische Refreshzeit
    // Wartezeit bis zum nächsten Refresh = refreshFactor * Ausführungszeit letzter Refresh
    refreshDynamic:         true,
    // CCU schonen mit höheren Werten, niedrige Werte bedeuten mehr "Stress" für die CCU
    // Faktor 9 entspricht circa 10% Durchschnittslast auf der Logikschicht
    refreshFactor:          9,

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
        'HM-LC-Dim1TPBU-FM': 'PushButton-2ch-wm_thumb.png',
        'HM-LC-Sw1PBU-FM':   'PushButton-2ch-wm_thumb.png',
        'HM-LC-Bl1PBU-FM':   'PushButton-2ch-wm_thumb.png',
        'HM-LC-Sw1-PB-FM':   'PushButton-2ch-wm_thumb.png',
        'HM-PB-2-WM':        'PushButton-2ch-wm_thumb.png',
        'HM-LC-Sw2-PB-FM':   'PushButton-4ch-wm_thumb.png',
        'HM-PB-4-WM':        'PushButton-4ch-wm_thumb.png',
        'HM-LC-Dim1L-Pl':    'OM55_DimmerSwitch_thumb.png',
        'HM-LC-Dim1T-Pl':    'OM55_DimmerSwitch_thumb.png',
        'HM-LC-Sw1-Pl':      'OM55_DimmerSwitch_thumb.png',
        'HM-LC-Dim1L-Pl-2':  'OM55_DimmerSwitch_thumb.png',
        'HM-LC-Sw1-Pl-OM54': 'OM55_DimmerSwitch_thumb.png',
        'HM-Sys-sRP-Pl':     'OM55_DimmerSwitch_thumb.png',
        'HM-LC-Dim1T-Pl-2':  'OM55_DimmerSwitch_thumb.png',
        'HM-LC-Sw1-Pl-2':    'OM55_DimmerSwitch_thumb.png',
        'HM-Sen-WA-OD':      '82_hm-sen-wa-od_thumb.png',
        'HM-Dis-TD-T':       '81_hm-dis-td-t_thumb.png',
        'HM-Sen-MDIR-O':     '80_hm-sen-mdir-o_thumb.png',
        'HM-OU-LED16':       '78_hm-ou-led16_thumb.png',
        'HM-LC-Sw1-Ba-PCB':  '77_hm-lc-sw1-ba-pcb_thumb.png',
        'HM-LC-Sw4-WM':      '76_hm-lc-sw4-wm_thumb.png',
        'HM-PB-2-WM55':      '75_hm-pb-2-wm55_thumb.png',
        'atent':             '73_hm-atent_thumb.png',
        'HM-RC-BRC-H':       '72_hm-rc-brc-h_thumb.png',
        'HMW-IO-12-Sw14-DR': '71_hmw-io-12-sw14-dr_thumb.png',
        'HM-PB-4Dis-WM':     '70_hm-pb-4dis-wm_thumb.png',
        'HM-LC-Sw2-DR':      '69_hm-lc-sw2-dr_thumb.png',
        'HM-LC-Sw4-DR':      '68_hm-lc-sw4-dr_thumb.png',
        'HM-SCI-3-FM':       '67_hm-sci-3-fm_thumb.png',
        'HM-LC-Dim1T-CV':    '66_hm-lc-dim1t-cv_thumb.png',
        'HM-LC-Dim1T-FM':    '65_hm-lc-dim1t-fm_thumb.png',
        'HM-LC-Dim2T-SM':    '64_hm-lc-dim2T-sm_thumb.png',
        'HM-LC-Bl1-pb-FM':   '61_hm-lc-bl1-pb-fm_thumb.png',
        'HM-LC-Bi1-pb-FM':   '61_hm-lc-bi1-pb-fm_thumb.png',
        'HM-OU-CF-Pl':       '60_hm-ou-cf-pl_thumb.png',
        'HM-OU-CFM-Pl':      '60_hm-ou-cf-pl_thumb.png',
        'HMW-IO-12-FM':      '59_hmw-io-12-fm_thumb.png',
        'HMW-Sen-SC-12-FM':  '58_hmw-sen-sc-12-fm_thumb.png',
        'HM-CC-SCD':         '57_hm-cc-scd_thumb.png',
        'HMW-Sen-SC-12-DR':  '56_hmw-sen-sc-12-dr_thumb.png',
        'HM-Sec-SFA-SM':     '55_hm-sec-sfa-sm_thumb.png',
        'HM-LC-ddc1':        '54a_lc-ddc1_thumb.png',
        'HM-LC-ddc1-PCB':    '54_hm-lc-ddc1-pcb_thumb.png',
        'HM-Sen-MDIR-SM':    '53_hm-sen-mdir-sm_thumb.png',
        'HM-Sec-SD-Team':    '52_hm-sec-sd-team_thumb.png',
        'HM-Sec-SD':         '51_hm-sec-sd_thumb.png',
        'HM-Sec-MDIR':       '50_hm-sec-mdir_thumb.png',
        'HM-Sec-WDS':        '49_hm-sec-wds_thumb.png',
        'HM-Sen-EP':         '48_hm-sen-ep_thumb.png',
        'HM-Sec-TiS':        '47_hm-sec-tis_thumb.png',
        'HM-LC-Sw4-PCB':     '46_hm-lc-sw4-pcb_thumb.png',
        'HM-LC-Dim2L-SM':    '45_hm-lc-dim2l-sm_thumb.png',
        'HM-EM-CCM':         '44_hm-em-ccm_thumb.png',
        'HM-CC-VD':          '43_hm-cc-vd_thumb.png',
        'HM-CC-TC':          '42_hm-cc-tc_thumb.png',
        'HM-Swi-3-FM':       '39_hm-swi-3-fm_thumb.png',
        'HM-PBI-4-FM':       '38_hm-pbi-4-fm_thumb.png',
        'HMW-Sys-PS7-DR':    '36_hmw-sys-ps7-dr_thumb.png',
        'HMW-Sys-TM-DR':     '35_hmw-sys-tm-dr_thumb.png',
        'HMW-Sys-TM':        '34_hmw-sys-tm_thumb.png',
        'HMW-Sec-TR-FM':     '33_hmw-sec-tr-fm_thumb.png',
        'HMW-WSTH-SM':       '32_hmw-wsth-sm_thumb.png',
        'HMW-WSE-SM':        '31_hmw-wse-sm_thumb.png',
        'HMW-IO-12-Sw7-DR':  '30_hmw-io-12-sw7-dr_thumb.png',
        'HMW-IO-4-FM':       '29_hmw-io-4-fm_thumb.png',
        'HMW-LC-Dim1L-DR':   '28_hmw-lc-dim1l-dr_thumb.png',
        'HMW-LC-Bl1-DR':     '27_hmw-lc-bl1-dr_thumb.png',
        'HMW-LC-Sw2-DR':     '26_hmw-lc-sw2-dr_thumb.png',
        'HM-EM-CMM':         '25_hm-em-cmm_thumb.png',
        'HM-CCU-1':          '24_hm-cen-3-1_thumb.png',
        'HM-RCV-50':         '24_hm-cen-3-1_thumb.png',
        'HMW-RCV-50':        '24_hm-cen-3-1_thumb.png',
        'HM-RC-Key3':        '23_hm-rc-key3-b_thumb.png',
        'HM-RC-Key3-B':      '23_hm-rc-key3-b_thumb.png',
        'HM-RC-Sec3':        '22_hm-rc-sec3-b_thumb.png',
        'HM-RC-Sec3-B':      '22_hm-rc-sec3-b_thumb.png',
        'HM-RC-P1':          '21_hm-rc-p1_thumb.png',
        'HM-RC-19':          '20_hm-rc-19_thumb.png',
        'HM-RC-19-B':        '20_hm-rc-19_thumb.png',
        'HM-RC-12':          '19_hm-rc-12_thumb.png',
        'HM-RC-12-B':        '19_hm-rc-12_thumb.png',
        'HM-RC-4':           '18_hm-rc-4_thumb.png',
        'HM-RC-4-B':         '18_hm-rc-4_thumb.png',
        'HM-Sec-RHS':        '17_hm-sec-rhs_thumb.png',
        'HM-Sec-SC':         '16_hm-sec-sc_thumb.png',
        'HM-Sec-Win':        '15_hm-sec-win_thumb.png',
        'HM-Sec-Key':        '14_hm-sec-key_thumb.png',
        'HM-Sec-Key-S':      '14_hm-sec-key_thumb.png',
        'HM-WS550STH-I':     '13_hm-ws550sth-i_thumb.png',
        'HM-WDS40-TH-I':     '13_hm-ws550sth-i_thumb.png',
        'HM-WS550-US':       '9_hm-ws550-us_thumb.png',
        'WS550':             '9_hm-ws550-us_thumb.png',
        'HM-WDC7000':        '9_hm-ws550-us_thumb.png',
        'HM-LC-Sw1-SM':      '8_hm-lc-sw1-sm_thumb.png',
        'HM-LC-Bl1-FM':      '7_hm-lc-bl1-fm_thumb.png',
        'HM-LC-Bl1-SM':      '6_hm-lc-bl1-sm_thumb.png',
        'HM-LC-Sw2-FM':      '5_hm-lc-sw2-fm_thumb.png',
        'HM-LC-Sw1-FM':      '4_hm-lc-sw1-fm_thumb.png',
        'HM-LC-Sw4-SM':      '3_hm-lc-sw4-sm_thumb.png',
        'HM-LC-Dim1L-CV':    '2_hm-lc-dim1l-cv_thumb.png',
        'HM-LC-Dim1PWM-CV':  '2_hm-lc-dim1l-cv_thumb.png',
        'HM-WS550ST-IO':     'IP65_G201_thumb.png',
        'HM-WDS30-T-O':      'IP65_G201_thumb.png',
        'HM-WDS100-C6-O':    'WeatherCombiSensor_thumb.png',
        'HM-WDS10-TH-O':     'TH_CS_thumb.png',
        'HM-WS550STH-O':     'TH_CS_thumb.png'
    },

    // Zuordnung Datenpunkte -> Einheit, Anzahl Dezimalstellen, Faktor
    dpDetails: {
        'BAT_LEVEL':            {
            unit: '%',
            decimals: 1,
            formatfunction: function(val) { return val * 100; }
        },
        'U_USBD_OK':            { unit: '' },
        'U_SOURCE_FAIL':        { unit: '' },
        'LOWBAT':               { unit: '' },
        'TEMPERATURE':          { unit: '°C',       decimals: 2 },
        'HUMIDITY':             { unit: '%',        decimals: 0 },
        'MOTION':               { unit: '' },
        'BRIGHTNESS':           { unit: '' },
        'RAINING':              { unit: '' },
        'RAIN_COUNTER':         { unit: 'mm',       decimals: 2 },
        'WIND_SPEED':           { unit: 'km/h',     decimals: 2 },
        'WIND_DIRECTION':       {
            unit: '°',
            decimals: -1 /*,
             // TODO Windrichtung fixen
             formatfunction: function(val) {
                if ( (val >= 346) || (val <= 15) ) {
                    val = "N " + val;
                } else if  ( (val >= 16) && (val <= 75) ) {
                    val = "NO " + val;
                } else if  ( (val >= 76) && (val <= 105) ) {
                    val = "O " + val;
                } else if ( (val >= 106) && (val <= 165) ) {
                    val = "SO " + val;
                } else if ( (val >= 166) && (val <= 195) ) {
                    val = "S " + val;
                } else if ( (val >= 196) && (val <= 255) ) {
                    val = "SW " + val;
                } else if ( (val >= 256) && (val <= 285) ) {
                    val = "W " + val;
                } else if ( (val >= 286) && (val <= 345) ) {
                    val = "NW " + val;
                }
                return val;
            } */

        },
        'WIND_WIND_DIRECTION':  { unit: '°',        decimals: -1 },
        'WIND_DIRECTION_RANGE': { unit: '°',        decimals: -1 },
        'SUNSHINEDURATION':     { unit: 'min',      decimals: -1 },

        // CUxD EM 1000
        'MAX_24H':              { decimals: 3 },
        'MAX_1H':               { decimals: 3 },
        'MAX5MINUTES':          { decimals: 3 },
        'MEAN5MINUTES':         { decimals: 3 },
        'SUM_24H':              { decimals: 3 },
        'SUM_1H':               { decimals: 3 },
        'SUM':                  { decimals: 3 },
        'METER':                { decimals: 3 }

    }
};
