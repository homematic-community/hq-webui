/**
 *  HQ WebUI - lightweight and fast Webfrontend for the Homematic CCU
 *  https://github.com/hobbyquaker/hq-webui/
 *
 *  Copyright (c) 2012 hobbyquaker https://github.com/hobbyquaker
 *
 *  This Software is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License
 *  Version 3 as published by the Free Software Foundation.
 *  http://www.gnu.org/licenses/gpl.html
 *  http://www.gnu.de/documents/gpl.de.html
 *
 *  This software comes without any warranty, use it at your own risk
 *
 */

jQuery.extend(
    jQuery.expr[ ":" ],
    { reallyvisible : function (a) { return !(jQuery(a).is(':hidden') || jQuery(a).parents(':hidden').length); }}
);

$("document").ready(function () {

    var version =               "2.0.0";

    var statesXML,
        rssiXML,
        variablesXML,
        programsXML,
        functionsXML,
        roomsXML,
        devicesXML,
        favoritesXML,
        statesXMLObj,
        rssiXMLObj,
        variablesXMLObj,
        programsXMLObj,
        functionsXMLObj,
        roomsXMLObj,
        devicesXMLObj,
        favoritesXMLObj;

    var statesReady =           false;
    var variablesReady =        false;
    var programsReady =         false;
    var protocolReady =         false;
    var functionsReady =        false;
    var roomsReady =            false;
    var rssiReady =             false;
    var devicesReady =          false;
    var favoritesReady =        false;
    var firstLoad =             false;
    var xmlapiVersion;

    var tabs =                  $("#tabs");

    var gridVariables =         $("#gridVariables");
    var gridPrograms =          $("#gridPrograms");
    var gridRooms =             $("#gridRooms");
    var gridFunctions =         $("#gridFunctions");
    var gridStates =            $("#gridStates");
    var gridProtocol =          $("#gridProtocol");
    var gridRssi =              $("#gridRssi");
    var gridScriptVariables =   $("#gridScriptVariables");
    var gridInfo =              $("#gridInfo");

    var variableInput =         $("#variableInput");
    var variableName =          $("#variableName");
    var variableId =            $("#variableId");
    var datapointInput =        $("#datapointInput");
    var programId =             $("#programId");
    var programName =           $("#programName");

    var dialogRunProgram =      $("#dialogRunProgram");
    var dialogClearProtocol =   $("#dialogClearProtocol");
    var dialogAjaxError =       $("#dialogAjaxError");
    var dialogJsonError =       $("#dialogJsonError");
    var dialogEditVariable =    $("#dialogEditVariable");
    var dialogEditDatapoint =   $("#dialogEditDatapoint");
    var dialogSettings =        $("#dialogSettings");
    var dialogRename =          $("#dialogRename");
    var dialogDocu =            $("#dialogDocu");
    var dialogAbout =           $("#dialogAbout");
    var dialogDebugScript =     $("#dialogDebugScript");
    var dialogDelScript =       $("#dialogDelScript");

    var buttonRefreshFavs =     $("#buttonRefreshFavs");
    
    var divStderr =             $("#divStderr");
    var divStdout =             $("#divStdout");
    var divScriptVariables =    $("#divScriptVariables");

    var accordionFavorites =    $("div#accordionFavorites");
    var serviceIndicator =      $("#service");
    var alarmIndicator =        $("#alarm");
    var ajaxIndicator;

    var timerRefresh;
    var timerSession =          setTimeout(hmSessionRenew, 240000);

    var hmSession;

    var xmlmenu;


    // Elemente verstecken
    $("#login").hide();
    $("#logout").hide();
    $("#hmNewScriptMenu").menu().hide();
    $("#hmRunScriptMenu").menu().hide();
    //$("#hmCcuMenu").menu().hide();
    $("#hmCcuMenu").hide();
    $("#buttonsFavorites").hide();
    $("ul.tabsPanel li a img").hide();
    serviceIndicator.hide();
    alarmIndicator.hide();
    divStderr.hide();
    divScriptVariables.hide();


    // Theme laden
    getTheme();



    // Tabs Init und Navigation
    var tabChange = false;
    tabs.tabs({
        select: function(event, ui) {
            if (!tabChange) {
                history.pushState({}, "", $("a[id='ui-id-" + (parseInt(ui.index,10) + 1) + "']").attr("href"));
            } else {
                tabChange = false;
            }

            if (ui.index == 0) {
                setTimeout(resizeFavHeight, 40);
            }
        }
    });
    $(window).bind( 'hashchange', function(e) {
        //console.log("change");
        tabChange = true;
        tabs.tabs('select', window.location.hash);
    });
    $("#subTabCcu").tabs();

    // Resize
    $(window).resize(function() {
        resizeAll();
    });
    setTimeout(resizeAll, 200);
    function resizeAll() {
        var x = $(window).width();
        var y = $(window).height();
        //console.log("x=" + x + " y=" + y);
        // $("#subTabCcu").css('height', y - 84);
        var gridWidth = x - 56;
        if (gridWidth < hqConf.gridWidth) {
            gridWidth = hqConf.gridWidth;
        }
        var gridHeight = y - 175;
        /* if (gridHeight < hqConf.gridHeight) {
         gridHeight = hqConf.gridHeight;
         } */
        gridStates.setGridHeight(gridHeight);
        $(".gridFull").setGridHeight(gridHeight).setGridWidth(gridWidth);
        $(".gridSub").setGridHeight(gridHeight - 65).setGridWidth(gridWidth - 46);
        divStdout.css('width', x - 775);
        gridScriptVariables.setGridWidth(x - 775);
        $("#tabFavorites").css("height", $("#tabVariables").height());
        //$("#tabDev").css("height", $("#tabVariables").height());
        resizeFavHeight();
    }

    function resizeFavHeight() {
        if (favoritesReady) {
            $("#buttonsFavorites").show();
            $("#accordionFavorites").css("height", $(window).height() - 111).accordion("refresh");
        }
    }


    function resizeFavItems() {

        /*
        $(".favInput").each(function () {
            //console.log($(this).parent().attr("id") + " " + $(this).height());
            var newHeight = $(this).height();
            if (newHeight < 36) {
                newHeight = 28;
            } else {
                newHeight = ((Math.ceil(newHeight / 36)) * 37);
            }
            $(this).parent().css('height', newHeight);
        });*/
    }



    // Buttons ins Tabs-Panel einfügen
    $("#mainNav").
        append("<button title='Abmelden' class='smallButton' style='float:right;' id='buttonLogout'></button>").
        append("<button title='Theme wählen' value='Theme wählen' class='smallButton' style='float:right' id='buttonSelectTheme'></button> ").
        append("<button title='Hilfe' class='smallButton' style='float:right;' id='buttonAbout'></button>").
        append("<span style='width:15px; height:15px; padding-top:5px; margin-right:10px; float:right;'><span title='CCU Kommunikation' id='ajaxIndicator' style='width:15px; height: 15px;' class='ui-icon ui-icon-transfer-e-w'></span></span>");

    ajaxIndicator = $("#ajaxIndicator");
    ajaxIndicator.hide().ajaxStart(function () { $(this).show(); }).ajaxStop(function () { $(this).hide(); });


        divStdout.resizable().on("resize", function(event, ui) {
        $("#hmScriptStdout").height(divStdout.height()-29);
        divStderr.width(divStdout.width());
    });



    divStderr.resizable().on("resize", function(event, ui) {
        $("#hmScriptStderr").height(divStderr.height()-29);
    });

    // Los gehts!
    sessionStart();


    /*
     *          jqGrid colNames and colModels
     *
     *          siehe http://www.trirand.com/jqgridwiki/doku.php?id=wiki:colmodel_options
     *
     */
    var colNamesVariables = [
        '',
        'id',
        'Name',
        'Beschreibung',
        'Variable',
        'Wert',
        'Einheit',
        'Werteliste',
        'Wert (text)',
        'true (text)',
        'false (text)',
        'min',
        'max',
        'type',
        'Typ',
        'Sichtbar',
        'Protokolliert',
        'Zeitstempel'
    ];
    var colModelVariables = [
        {name: 'tools', index:'tools', width: 62, fixed: true, sortable: false, search: false,
            xmlmap: function (obj) {
                //return "<button class='gridButton runProgram' id='runProgram"+$(obj).attr('id')+"'></button>";
            }
        },
        {name:'id', index:'id',  width: 43, fixed: true, sorttype: 'int', align: 'right',
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');
                return ise_id;
            },
            classes: 'ise_id'
        },
        {name:'name', index:'name', width: 240, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('name');
            }
        },
        {name:'desc', index:'desc', width: 150,
            xmlmap: function (obj) {
                return $(obj).attr('desc');
            }
        },
        {name:'variable', index:'variable', width: 40, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('variable');
            }
        },
        {name:'value', index:'value', width: 150,
            xmlmap: function (obj) {
                var val = $(obj).attr('value');
                switch ($(obj).attr('subtype')) {
                    case '0':
                        val = parseFloat(val);
                        val = val.toFixed(2);
                        break;
                    case '2':
                    case '6':
                        //console.log("debug " +val);
                        if (val == "true") {
                            val = $(obj).attr('text_true');
                        } else {
                            val = $(obj).attr('text_false');
                        }
                        break;
                    case '29':
                        val = $(obj).attr('value_text');
                        break;
                    default:
                        if (typeof val == "string" && val.match(/<img/)) {
                            //console.log(val + " " + typeof val);
                            val = $('<div/>').text(val).html();
                        }

                }
                return val;
            },
            classes:'update uVAR'

        },
        {name:'unit', index:'unit', width: 30,
            xmlmap: function (obj) {
                return $(obj).attr('unit');
            }
        },
        {name:'value_list', index:'value_list', width: 120,
            xmlmap: function (obj) {
                if ($(obj).attr('subtype') == 2 || $(obj).attr('subtype') == 6) {
                    return $(obj).attr('text_false') + ";" + $(obj).attr('text_true');
                } else {
                    return $(obj).attr('value_list');
                }

            }
        },
        {name:'value_text', index:'value_text', width: 50, hidden: true,
            xmlmap: function (obj) {
                var val = $(obj).attr('value_text');
                return val;
            }
        },
        {name:'text_false', index:'value_text', width: 50, hidden: true,
            xmlmap: function (obj) {
                var val = $(obj).attr('text_true');
                return val;
            }
        },
        {name:'text_true', index:'value_text', width: 50, hidden: true,
            xmlmap: function (obj) {
                var val = $(obj).attr('text_false');
                return val;
            }
        },
        {name:'min', index:'min', width: 30, sorttype: 'int',
            xmlmap: function (obj) {
                return $(obj).attr('min');
            }
        },
        {name:'max', index:'max', width: 30, sorttype: 'int',
            xmlmap: function (obj) {
                return $(obj).attr('max');
            }
        },
        {name:'type', index:'type', width: 60, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('type');
            }
        },
        {name:'subtype', index:'subtype', width: 40,
            xmlmap: function (obj) {
                return $(obj).attr('subtype');
            },
            formatter: function (val) {
                return formatVarType(val);
            }
        },
        {name:'visible', index:'visible', width: 40, edittype: 'checkbox', hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('visible');
            },
            formatter: 'checkbox'
        },
        {name:'logged', index:'logged', width: 40, edittype: 'checkbox',
            xmlmap: function (obj) {
                return $(obj).attr('logged');
            },
            formatter: 'checkbox'
        },
        {name:'timestamp', index:'timestamp', width: 75,
            xmlmap: function (obj) {
                return formatTimestamp($(obj).attr('timestamp'));
            },
            classes:'update uVAR'
        }
    ];

    var colNamesPrograms = [
        '',
        'id',
        'Name',
        'Beschreibung',
        'Aktiv',
        'Zeitstempel'
    ];
    var colModelPrograms = [
        {name: 'tools', index:'tools', width: 62, fixed: true, sortable: false, search: false,
            xmlmap: function (obj) {
                return "<button class='gridButton runProgram' id='runProgram"+$(obj).attr('id')+"'></button>";
            }
        },
        {name:'id', index:'id',  width: 43, fixed: true, sorttype: 'int', align: 'right',
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('id');
                return ise_id;
            },
            classes: 'ise_id update uPRG'
        },
        {name:'name', index:'name', width: 240, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('name');
            }
        },
        {name:'description', index:'description', width: 200, editable: true,
            xmlmap: function (obj) {
                return $(obj).attr('description');
            }
        },
        {name:'active', index:'active', width: 40, editable: true, edittype: 'checkbox',

            xmlmap: function (obj) {
                return $(obj).attr('active');
            },
            formatter: 'checkbox'
        },
        {name:'timestamp', index:'timestamp', width: 75,
            xmlmap: function (obj) {
                return formatTimestamp($(obj).attr('timestamp'));
            },
            classes:'update uPRG'
        }
    ];

    var colNamesStates = [
        'id',
        'Name',
        'Adresse',
        'Schnittstelle',
        'Gerätetyp',
        'Räume',
        'Gewerke',
        'Protokolliert',
        'unreach',
        'sticky_unreach',
        'config_pending',
        'Servicemeldungen'
    ];
    var colModelStates = [
        {name:'ise_id', index:'ise_id', width: 80, fixed: true, sorttype: 'int',
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');

                var iface = devicesXMLObj.find("device[ise_id='" + $(obj).attr("ise_id") + "']").attr("device_type");
                if (iface && hqConf.deviceImgEnable) {
                        if (hqConf.deviceImg[iface]) {
                            return '<span style="float:left; background-color: #fff; width: 24px; height: 22px; text-align: center; padding-top: 1px;"><img style="" src="' + hqConf.ccuUrl + hqConf.deviceImgPath + hqConf.deviceImg[iface] + '" height="21"/></span>' + '<span style="float:right; padding-top:5px;">' + ise_id + '</span>';
                        }
                }
                return '<span style="float:right">' + ise_id + '</span>';

            },
            classes: 'ise_id'
        },
        {name:'name', index:'name', width: 240, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('name');
            }
        },
        {name:'address', index:'address', width: 90, fixed: true,
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');
                var deviceName = $(obj).attr('name');
                switch (deviceName) {
                    case 'CCURF':
                        return "BidCos-RF";
                        break;
                    case 'CCUWIR':
                        return "BidCos-Wir";
                        break;
                    default:
                        return devicesXMLObj.find("device[ise_id='" + $(obj).attr("ise_id") + "']").attr("address");
                }

            }
        },
        {name:'iface', index:'iface', width: 120, fixed: true,
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');
                var iface = devicesXMLObj.find("device[ise_id='" + $(obj).attr("ise_id") + "']").attr("interface");
                switch(iface) {
                    case undefined:
                        return "";
                        break;
                    default:
                        return iface;
                }
            }
        },
        {name:'devicetype', index:'devicetype', width: 130, fixed: true,
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');
                var iface = devicesXMLObj.find("device[ise_id='" + $(obj).attr("ise_id") + "']").attr("device_type");
                if (iface) {
                        return iface;
                } else {

                }
            }
        },
        {name:'rooms', index:'rooms', width: 120, fixed: true,
            xmlmap: function (obj) {
                var rooms = "";
                $(obj).find("channel").each(function () {
                    var ise_id = $(this).attr("ise_id");
                    var room = roomsXMLObj.find("channel[ise_id='" + ise_id + "']").parent().attr("name");
                    if (room != undefined && rooms.indexOf(room) == -1) {
                        if (rooms != "") { rooms += ", "; }
                        rooms += room;
                    }

                });
                return rooms;
            }
        },
        {name:'functions', index:'functions', width: 120, fixed: true,
            xmlmap: function (obj) {
                var functions = "";
                $(obj).find("channel").each(function () {
                    var ise_id = $(this).attr("ise_id");
                    var func = functionsXMLObj.find("channel[ise_id='" + ise_id + "']").parent().attr("name");
                    if (func != undefined && functions.indexOf(func) == -1) {
                        if (functions != "") { functions += ", "; }
                        functions += func;
                    }

                });
                return functions;
            }
        },
        {name:'logged', index:'logged', width: 40, edittype: 'checkbox', fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('logged');
            },
            formatter: 'checkbox'
        },
        {name:'unreach', index:'unreach', width: 80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('unreach');
            }
        },
        {name:'sticky_unreach', index:'sticky_unreach', width: 80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('sticky_unreach');
            }
        },
        {name:'config_pending', index:'config_pending', width: 80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('config_pending');
            }
        },
        {name:'service', index:'service', width: 120,
            xmlmap: function (obj) {
                var output = "";
                $(obj).find("channel:first datapoint").each(function () {
                    var ise_id  = $(this).attr("ise_id");
                    var value   = $(this).attr("value");
                    var type    = $(this).attr("type");
                    switch (type) {
                        case 'U_SOURCE_FAIL':
                        case 'U_USBD_OK':
                        case 'UNREACH':
                        case 'STICKY_UNREACH':
                        case 'LOWBAT':
                        case 'CONFIG_PENDING':
                        case 'DUTYCYCLE':
                        case 'BAT_LEVEL':
                        case 'INSTALL_MODE':
                            if (value == "true") {
                                if (output != "") { output += ", "; }
                                output += type;
                            }
                            break;
                        case 'RSSI_DEVICE':
                        case 'RSSI_PEER':
                            break;
                        default:
                            if (output != "") { output += ", "; }
                            output += type + "=" + value;
                    }
                });
                return output;
            }
        }
    ];

    var colNamesChannel = [
        '',
        'Kanal Name',
        '',
        'Richtung',
        '',
        '',
        '',
        ''
    ];
    var colModelChannel = [
        {name:"ise_id", align: 'right', index:"ise_id",   width:48, fixed: true, sorttype: 'int',
            xmlmap: function (obj) {
                return $(obj).attr('ise_id');
            },
            classes: 'ise_id'
        },
        {name:"name",   index:"name",   width:240, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('name');
            }
        },
        {name:"address",   index:"address",   width:90, fixed: true,
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');
                var address = statesXMLObj.find("channel[ise_id='" + ise_id + "']").attr('address');
                if (statesXMLObj.find("channel[ise_id='" + ise_id + "']").attr('name') == "CCUWIR:0") {
                    address = "BidCos-Wir:0";
                }
                if (address == undefined) {
                    var dp_name = statesXMLObj.find("channel[ise_id='" + ise_id + "'] datapoint").attr('name');
                    if (dp_name == undefined) {
                        // Kommt das nur bei HM-TC-CC vor?
                        address = "";
                    } else {
                        var dp_names = dp_name.split(".");
                        address = dp_names[1];
                    }

                }
                return address;
            }
        },
        {name:"direction",   index:"direction",   width:120, fixed: true,
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');
                var direction = devicesXMLObj.find("channel[ise_id='" + ise_id + "']").attr('direction');
                if (direction != undefined) {
                    return direction;
                } else {
                    return "";
                }
            }
        },
        {name: "dummy1", index: "dummy1", width: 130, fixed:true },
        {name:"rooms", index:"rooms",   width:120, fixed: true,
            xmlmap: function (obj) {
                var output = "";
                roomsXMLObj.find("channel[ise_id='" + $(obj).attr('ise_id') + "']").each(function () {
                    if (output == "") {
                        output = $(this).parent().attr("name");
                    } else {
                        output += ", " + $(this).parent().attr("name");
                    }
                });
                return output;

            }
        },
        {name:"functions", index:"functions",   width:120, fixed: true,
            xmlmap: function (obj) {
                return $(functionsXML).find("channel[ise_id='" + $(obj).attr('ise_id') + "']").parent().attr("name");
            }
        },
        {name:'logged', index:'logged', width: 40, edittype: 'checkbox', fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('logged');
            },
            formatter: 'checkbox'
        }
    ];

    var colNamesDatapoint = [
        '',
        'Datenpunkt Name',
        'Typ',
        'Wert',
        'Wertetyp',
        'Zeitstempel'
    ];
    var colModelDatapoint = [
        {name:"ise_id", index:"ise_id", align: 'right', width:46, fixed: true, sorttype: 'int',
            xmlmap: function (obj) {
                return $(obj).attr('ise_id');
            },
            classes: 'ise_id update uDP'
        },
        {name:"name",   index:"name",   width:240, fixed: true, xmlmap: function (obj) {
            return $(obj).attr('name');
        }},
        {name:"type",   index:"type",   width:60, hidden: true, xmlmap: function (obj) {
            return $(obj).attr('type');
        }},
        {name:"value",   index:"value",   width:215, fixed: true,
            xmlmap: function (obj) {
                var val = $(obj).attr('value');
                if ($(obj).attr('valuetype') == 6) {
                    val = parseFloat(val);
                    val = val.toFixed(2);
                }
                return val;
            },
            classes:'update uDP'
        },
        {name:"valuetype",   index:"valuetype",   width:80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('valuetype');
            }
        },
        {name:"timestamp",   index:"timestamp",   width:130, fixed: true,
            xmlmap: function (obj) {
                return formatTimestamp($(obj).attr('timestamp'));
            },
            classes:'update uDP'
        }
    ];

    var colNamesRssi = [
        '',
        'id',
        'Name',
        'Adresse',
        'Gerätetyp',
        'rssi_device',
        'rssi_peer',
        'RX dBm',
        'TX dBm',
        'AES Verfügbar',
        'Übertragungsmodus',
        'unreach',
        'sticky_unreach',
        'config_pending',
        'Servicemeldungen'
    ];
    var colModelRssi = [
        {name: 'tools', index:'tools', width: 62, fixed: true, sortable: false, search: false,
            xmlmap: function (obj) {
                //return "<button class='gridButton runProgram' id='runProgram"+$(obj).attr('id')+"'></button>";
            }
        },
        {name:'ise_id', index:'ise_id', width: 43, fixed: true, sorttype: 'int', align: 'right',
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var ise_id = devicesXMLObj.find("device[address='" + device + "']").attr("ise_id");
                return ise_id;
            },
            classes: 'ise_id'
        },
        {name:'name', index:'name', width: 240, fixed: true,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var name = devicesXMLObj.find("device[address='" + device + "']").attr("name");
                return name;
            }
        },
        {name:'address', index:'address',  width: 90, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr("device");
            }
        },
        {name:'device_type', index:'device_type', width: 80,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var ise_id = devicesXMLObj.find("device[address='" + device + "']").attr("device_type");
                return ise_id;
            }
        },
        {name:'rssi_device', index:'rssi_device', width: 60,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var rssi_device = statesXMLObj.find("datapoint[name='BidCos-RF." + device + ":0.RSSI_DEVICE']").attr("value");
                return rssi_device;
            }
        },
        {name:'rssi_peer', index:'rssi_peer', width: 60,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var rssi_peer = statesXMLObj.find("datapoint[name='BidCos-RF." + device + ":0.RSSI_PEER']").attr("value");
                return rssi_peer;
            }
        },
        {name:'RX', index:'RX', width: 60,
            xmlmap: function (obj) {
                return $(obj).attr('rx');
            },
            formatter: formatRssi,
            sorttype: 'float'
        },
        {name:'TX', index:'TX', width: 60,
            xmlmap: function (obj) {
                return $(obj).attr('tx');
            },
            formatter: formatRssi,
            sorttype: 'float'
        },
        {name:'aes', index:'aes', width: 60,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var aes = devicesXMLObj.find("device[address='" + device + "'] channel:first").attr("aes_available");

                return aes;
            },
            formatter: formatBool
        },
        {name:'mode', index:'mode', width: 60,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var mode = devicesXMLObj.find("device[address='" + device + "'] channel:first").attr("transmission_mode");
                if (mode == "AES") {
                    mode = '<span style="display:inline-block; align:bottom" class="ui-icon ui-icon-key"></span> <span style="position:relative; top: -3px;">' + mode + '</span>';
                }
                return mode;
            }
        },

        {name:'unreach', index:'unreach', width: 80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('unreach');
            }
        },
        {name:'sticky_unreach', index:'sticky_unreach', width: 80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('sticky_unreach');
            }
        },
        {name:'config_pending', index:'config_pending', width: 80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('config_pending');
            }
        },
        {name:'service', index:'service', width: 120, hidden: true,
            xmlmap: function (obj) {

            }
        }
    ];

    var colNamesProtocol = [
        'Datum Uhrzeit',
        'Sender',
        'Nachricht'
    ];
    var colModelProtocol = [
        {name:'datetime', index:'datetime', width: 110,
            xmlmap: function (obj) {
                return $(obj).attr('datetime');
            }
        },
        {name:'sender', index:'sender', width: 250,
            xmlmap: function (obj) {
                return $(obj).attr('names');
            }
        },
        {name:'msg', index:'msg', width: 600,
            xmlmap: function (obj) {
                return $(obj).attr('values');
            }
        }
    ];


    gridVariables.jqGrid({
        width: hqConf["gridWidth"], height: hqConf["gridHeight"],
        colNames: colNamesVariables,
        colModel: colModelVariables,
        pager: "#gridPagerVariables",
        rowList: hqConf["gridRowList"], rowNum: hqConf["gridRowNum"], 
        viewrecords:    true,
        gridview:       true,
        caption:        'Variablen',
        datatype:       'xmlstring',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        ignoreCase: true,
        sortable: true,
        xmlReader : {
            root: "systemVariables",
            row: "systemVariable",
            id: "[ise_id]",
            repeatitems: false
        },
        ondblClickRow: function (id) {
            var value       = gridVariables.getCell(id, "value");
            var value_text  = gridVariables.getCell(id, "value_text");
            var text_false  = gridVariables.getCell(id, "text_false");
            var text_true   = gridVariables.getCell(id, "text_true");
            var value_list  = gridVariables.getCell(id, "value_list");
            var unit        = gridVariables.getCell(id, "unit");
            var type        = gridVariables.getCell(id, "type");
            var subtype     = gridVariables.getCell(id, "subtype");
            switch (subtype) {
                case 'Logikwert':
                case 'Alarm':
                    variableInput.html("<select id='variableValue'><option value='false'>"+text_true+"</option><option value='true'>"+text_false+"</option></select>");
                    $("#variableValue option:contains('"+value+"')").attr("selected", true);
                    break;
                case 'Werteliste':
                    variableInput.html("<select id='variableValue'>" + selectOptions(value_list) + "</select>");
                    if (value == "true") { value = "1"; } else if (value == "false") { value = "0"; }
                    $("#variableValue option[value='" + value + "']").attr("selected", true);
                    break;
                default:
                    variableInput.html("<input size='' name='' type='text' id='variableValue' value='" + value + "'>" + unit);

            }

            variableName.html(gridVariables.getCell(id, "name"));
            variableId.val(id);

            dialogEditVariable.dialog("open");
        }
    }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerVariables", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerVariables", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () { refreshVariables(); },
            position: "first",
            title:"Neu laden",
            cursor: "pointer"
        });

    gridPrograms.jqGrid({
        width: hqConf["gridWidth"], height: hqConf["gridHeight"],
        colNames: colNamesPrograms,
        colModel: colModelPrograms,
        pager: "#gridPagerPrograms",
        rowList: hqConf["gridRowList"], rowNum: hqConf["gridRowNum"], 
        viewrecords:    true,
        gridview:       true,
        caption:        'Programme',
        datatype:       'xmlstring',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        data: {
        },
        ignoreCase: true,
        sortable: true,
        xmlReader : {
            root: "programList",
            row: "program",
            id: "[id]",
            repeatitems: false
        },
        ondblClickRow: function (rowid) {
            gridPrograms.editRow(rowid, true, undefined, undefined, 'clientArray', undefined, saveProgram);
        },
        gridComplete: function () {
            $(".gridButton.runProgram").css("height", "18px").css("margin-top", "2px").button({text: false, icons: { primary: "ui-icon-play" }});
            $(".gridButton.runProgram").each(function () {
                var id = $(this).attr("id").slice(10);
                //console.log(id);
               $(this).click(function() {
                   programName.html(gridPrograms.getCell(id, "name"));
                   programId.val(id);
                   dialogRunProgram.dialog("open");
               });

            });
        }



    }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerPrograms", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerPrograms", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () { refreshPrograms(); },
            position: "first",
            title:"Neu laden",
            cursor: "pointer"
        });

    gridStates.jqGrid({
        width: 1050, height: hqConf["gridHeight"],
        colNames:colNamesStates,
        colModel :colModelStates,
        pager: "#gridPagerStates",
        rowList: hqConf["gridRowList"], rowNum: hqConf["gridRowNum"], 
        viewrecords:    true,
        gridview:       true,
        caption:        'Geräte',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        datatype:       'xmlstring',
        data: {
        },
        ignoreCase: true,
        xmlReader : {
            root: "stateList",
            row: "device",
            id: "[ise_id]",
            repeatitems: false
        },
        sortable: true,
        subGrid: true,
        subGridRowExpanded: function(grid_id, row_id) {
            subGridChannel(grid_id, row_id);
        },
        ondblClickRow: function(row_id) {
            if ($("tr[id='" + row_id + "'] td[aria-describedby='gridStates_name']").html() != null) {
                $("#rename").val($("tr[id='" + row_id + "'] td[aria-describedby='gridStates_name']").html());
                $("#renameId").val(row_id);
                $("#renameType").val("DEVICE");
                dialogRename.dialog('open');

            }
        }
    }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerStates", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerStates", {
            caption:"",
            buttonicon:"ui-icon-arrowrefresh-1-s",
            onClickButton: function () {
                storage.set("hqWebUiRooms", null);
                storage.set("hqWebUiFunctions", null);
                storage.set("hqWebUiDevices", null);
                roomsReady = false;
                functionsReady = false;
                devicesReady = false;
                xmlapiGetFunctions();
            },
            position: "first",
            title:"Geräte, Gewerke und Räume neu laden",
            cursor: "pointer"
        }).jqGrid(
        'navButtonAdd',
        "#gridPagerStates", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () {
                refreshStates();
            },
            position: "first",
            title:"Datenpunkte neu laden",
            cursor: "pointer"
        });

    gridRssi.jqGrid({
        width: hqConf["gridWidth"], height: hqConf["gridHeight"],
        colNames:colNamesRssi,
        colModel :colModelRssi,
        pager: "#gridPagerRssi",
        rowList: hqConf["gridRowList"], rowNum: hqConf["gridRowNum"], 
        viewrecords:    true,
        gridview:       true,
        caption:        'RSSI',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        datatype:       'xmlstring',
        data: {
        },
        ignoreCase: true,
        xmlReader : {
            root: "rssiList",
            row: "rssi",
            id: "[device]",
            repeatitems: false
        },
        sortable: true

    }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerRssi", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerRssi", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () { refreshRssi(); },
            position: "first",
            title:"Neu laden",
            cursor: "pointer"
        });

    gridProtocol.jqGrid({
        width: hqConf["gridWidth"] - 40,
        height: hqConf["gridHeight"] - 56,
        colNames:colNamesProtocol,
        colModel :colModelProtocol,
        pager: "#gridPagerProtocol",
        rowList: hqConf["gridRowList"], rowNum: hqConf["gridRowNum"], 
        viewrecords:    true,
        gridview:       true,
        caption:        'Systemprotokoll',
        datatype:       'clientSide',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        data: {
        },
        sortable: true,
        ignoreCase: true,
        sortname: "datetime",
        sortorder: "desc",
        xmlReader : {
            root: "systemProtocol",
            row: "row",
            repeatitems: false
        }


    }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerProtocol", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerProtocol", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () { refreshProtocol(); },
            position: "first",
            title:"Neu laden",
            cursor: "pointer"
        }).jqGrid(
        'navButtonAdd',
        "#gridPagerProtocol", {
            caption:"",
            buttonicon:"ui-icon-trash",
            onClickButton: function () { dialogClearProtocol.dialog("open"); },
            position: "last",
            title:"gesamtes Protokoll löschen",
            cursor: "pointer"
        });

    gridInfo.jqGrid({
        width: hqConf["gridWidth"] - 40,
        height: hqConf["gridHeight"] - 10,
        colNames: ['',''],
        colModel: [
            {name: 'key', index:'key', width:120, sortable: false},
            {name: 'value', index: 'value', width: 600, sortable: false}
        ],
        rowNum: 9998,
        viewrecords:    true,
        gridview:       true,
        caption:        'Info',
        ignoreCase: true,
        datatype: 'local',
        pager: '#gridPagerInfo'



    }).filterToolbar({defaultSearch: 'cn'});

    gridScriptVariables.jqGrid({
        width: 343,
        height: 130,
        colNames:['Variable', 'Wert'],
        colModel:[
            {name:'variable', index:'variable', width: 80},
            {name: 'value', index: 'value', width: 200}
        ],
        rowNum:         9997,
        viewrecords:    true,
        gridview:       true,
        caption:        'Variablen',
        datatype:       'local',
        loadComplete: function() {
            gridScriptVariables.trigger("reloadGrid"); // Call to fix client-side sorting
        },
        loadonce:       true,
        data: {
        },
        sortable: true,
        ignoreCase: true
    }).filterToolbar({defaultSearch: 'cn'}).jqGrid('gridResize');

    // Zuklapp-Button verstecken
    $("a.ui-jqgrid-titlebar-close").hide();

    // Subgrid von gridDevices
    function subGridChannel(grid_id, row_id) {
        var subgrid_table_id = grid_id + "_t";
        $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");

        $("#" + subgrid_table_id).jqGrid( {
            colNames: colNamesChannel,
            datatype:'xmlstring',
            datastr: statesXML,
            colModel: colModelChannel,
            xmlReader: {
                root:"stateList>device[ise_id='" + row_id + "']",
                row:"channel",
                id:"[ise_id]",
                repeatitems: false
            },
            gridview:true,
            height: "100%",
            rowNum:1000,
            subGrid: true,
            subGridRowExpanded: function (grid_id, row_id) { subGridDatapoint(grid_id, row_id); },
            ondblClickRow: function(row_id, iRow, iCol, e) {
                if (!$("tr[id='" + row_id + "'] td:first").attr('aria-describedby').match(/_t_[0-9]+_t_/)) {
                    var channel = $("tr[id='" + row_id + "'] td[aria-describedby$='t_address']").html().split(":");
                    if (channel[channel.length - 1] != 0) {
                        $("#rename").val($("tr[id='" + row_id + "'] td[aria-describedby$='t_name']").html());
                        $("#renameId").val(row_id);
                        $("#renameType").val("CHANNEL");
                        dialogRename.dialog('open');
                    }
                }
            }
        });
    }

    // Subgrid von subGridChannel
    function subGridDatapoint(grid_id, row_id) {
        var subgrid_table_id = grid_id + "_t";
        $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");
        $("#" + subgrid_table_id).jqGrid( {
            colNames: colNamesDatapoint,
            datatype:'xmlstring',
            datastr: statesXML,
            colModel: colModelDatapoint,
            xmlReader: {
                root:"stateList>device>channel[ise_id='" + row_id + "']",
                row:"datapoint",
                id:"[ise_id]",
                repeatitems: false
            },
            gridview:true,
            height: "100%",
            rowNum:9999,
            ondblClickRow: function (id) {

                var value = $("#" + subgrid_table_id).getCell(id, "value").replace(/(\r\n|\n|\r)/gm,"");
                $("#datapointName").html($("#" + subgrid_table_id).getCell(id, "name"));
                $("#datapointId").val(id);
                $("#datapointGridId").val(subgrid_table_id);
                switch ($("#" + subgrid_table_id).getCell(id, "valuetype")) {
                    case '2':
                        datapointInput.html("<select id='datapointValue'><option value='false'>False</option><option value='true'>True</option></select>");
                        $("#datapointValue option[value='" + value + "']").attr("selected", true);
                        break;
                    case '6':
                        datapointInput.html("<div id='sliderDatapoint'></div><br>" +
                            "<div id='radioDatapoint'>" +
                            "<input type='radio' name='radioDatapoint' id='radioDatapointOff'><label for='radioDatapointOff'>Aus</label>" +
                            "<input type='radio' name='radioDatapoint' id='radioDatapointOn'><label for='radioDatapointOn'>An</label>" +
                            "</div><br>" +
                            "<input type='text' id='datapointValue' value='" + value + "'>");

                        $("#radioDatapoint").buttonset();
                        $("#sliderDatapoint").slider({
                            min: 0.00,
                            max: 1.00,
                            step: 0.01,
                            value: value,
                            stop: function (e, ui) {
                                value = ui.value;
                                $("input#datapointValue").val(ui.value);
                            }
                        });$("#radioDatapointOff").click(function () {
                            $("#datapointValue").val("0.00");
                            $("#sliderDatapoint").slider('value', 0.00);
                        });
                        $("#radioDatapointOn").click(function () {
                            $("#datapointValue").val("1.00");
                            $("#sliderDatapoint").slider('value', 1.00);
                        });
                        $("#datapointValue").change(function () {
                            $("#sliderDatapoint").slider('value', $("#datapointValue").val());
                        });
                        break;
                    default:

                        datapointInput.html("<input type='text' id='datapointValue' value='" + value + "'>");

                }
                dialogEditDatapoint.dialog("open");
            }
        });
    }

    // Grid Formatter
    function formatBool(val) {
        if (val == "true") {
            return "<span class='ui-icon ui-icon-check'></span>"
        } else {
            return "";
        }
    }

    function formatRssi(val) {
        if (val == 65536) {
            return "";
        } else {
            return val;
        }
    }

    function formatVarType(subtype) {
        switch (subtype) {
            case "6":
                return "Alarm";
                break;
            case "29":
                return "Werteliste";
                break;
            case "2":
                return "Logikwert";
                break;
            case "11":
                return "Zeichenkette";
                break;
            case "0":
                return "Zahl";
                break;
            default:
                return "";
        }
    }

    function formatTimestamp(timestamp) {
        if (timestamp < 1) {
            return "";
        }
        var dateObj = new Date();
        if (timestamp != undefined) {
            dateObj.setTime(timestamp + "000");
        }
        var year = dateObj.getFullYear();
        //year = year.toString(10).substr(2);
        var month = (dateObj.getMonth() + 1).toString(10);
        month = (month.length == 1 ? "0" + month : month);
        var day = dateObj.getDate().toString(10);
        day = (day.length == 1 ? "0" + day : day);
        var hour = dateObj.getHours().toString(10);
        hour = (hour.length == 1 ? "0" + hour : hour);
        var minute = dateObj.getMinutes().toString(10);
        minute = (minute.length == 1 ? "0" + minute : minute);
        var second = dateObj.getSeconds().toString(10);
        second = (second.length == 1 ? "0" + second : second);
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    // Grid Data Handling
    function firstLoadFinished() {
        firstLoad = true;
        gridVariables.setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    variablesXML = data;
                    variablesXMLObj = $(data);
                    variablesReady = true;
                }
            }
        });
        gridPrograms.setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    programsXML = data;
                    programsXMLObj = $(data);
                    programsReady = true;
                }
            }
        });
        gridStates.setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    statesXML = data;
                    statesXMLObj = $(data);
                    statesReady = true;
                }
            }
        });
        gridProtocol.setGridParam({
            loadComplete: function () {
                protocolReady = true;
            }
        });
        gridRssi.setGridParam({
            loadComplete: function () {
                rssiReady = true;
            }
        });
    }

    function refreshVariables() {
        $("#loaderVariables").show();
        variablesReady = false;

        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            data: scriptVariables,
            success: function (data) {
                    variablesReady = true;
                    variablesXML = data;
                    variablesXMLObj = $(data);
                    $("#loaderVariables").hide();
                    gridVariables.setGridParam({
                        loadonce: false,
                        datatype: "xmlstring",
                        datastr: data
                    }).trigger("reloadGrid").setGridParam({loadonce:true});
                    addInfo("Anzahl Variablen", variablesXMLObj.find("systemVariable").length);
                    if (variablesXMLObj.find("systemVariable[subtype='6'][value='true']").length > 0) {
                        alarmIndicator.show();
                    } else {
                        alarmIndicator.hide();
                    }

                 if (!programsReady) {
                    refreshPrograms();
                }
            }
        });
        /*
        gridVariables.setGridParam({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/sysvarlist.cgi?text=true',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function(data) {
                if (data.nodeType) {
                    variablesReady = true;
                    variablesXML = data;
                    variablesXMLObj = $(data);
                    $("#loaderVariables").hide();
                    addInfo("Anzahl Variablen", variablesXMLObj.find("systemVariable").length);
                    if (variablesXMLObj.find("systemVariable[subtype='6'][value='true']").length > 0) {
                       alarmIndicator.show();
                    } else {
                        alarmIndicator.hide();
                    }

                }
                if (!programsReady) {
                    refreshPrograms();
                }
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
        */
    }

    function refreshPrograms() {
        $("#loaderPrograms").show();
        programsReady = false;
        


        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            datatype: 'text',
            data: scriptPrograms,
            success: function (data) {
                programsReady = true;
                programsXML = data;
                programsXMLObj = $(data);
                $("#loaderPrograms").hide();
                addInfo("Anzahl Programme", programsXMLObj.find("program").length);
                gridPrograms.setGridParam({
                    loadonce: false,
                    datatype: "xmlstring",
                    datastr: data
                }).trigger("reloadGrid").setGridParam({loadonce:true});

                if (!functionsReady) {
                    xmlapiGetFunctions();
                }
            },
            error: function (a,b,c) { alert(a + " " + b + " " + c); }
        });
/*
        gridPrograms.setGridParam({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/programlist.cgi',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function(data) {
                if (data.nodeType) {
                    programsReady = true;
                    programsXML = data;
                    programsXMLObj = $(data);
                    $("#loaderPrograms").hide();
                    addInfo("Anzahl Programme", programsXMLObj.find("program").length);
                }
                if (!functionsReady) {
                    xmlapiGetFunctions();
                }
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true}); */
    }

    function refreshStates() {
        $("#loaderStates").show();
        



        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            datatype: 'text',
            data: scriptStates,
            success: function (data) {
                statesReady = true;
                statesXML = data;
                statesXMLObj = $(data);
                gridStates.setGridParam({
                    loadonce: false,
                    datatype: "xmlstring",
                    datastr: data
                }).trigger("reloadGrid").setGridParam({loadonce:true});
                $("#loaderStates").hide();
                var ccuBat = 100 * parseFloat(statesXMLObj.find("datapoint[name$='BAT_LEVEL']").attr("value"));
                ccuBat = ccuBat.toFixed(2);
                addInfo("Anzahl Datenpunkte", statesXMLObj.find("datapoint").length);
                addInfo("Anzahl Kanäle", statesXMLObj.find("channel").length);
                addInfo("Anzahl Geräte", statesXMLObj.find("device").length);
                addInfo("CCU Batteriestatus", ccuBat + "%");
                if (statesXMLObj.find("channel[name$=':0'] datapoint[valuetype='2'][value='true']").length > 0) {
                    serviceIndicator.show();
                } else {
                    $("#serivce").hide();
                }
                if (!rssiReady) {
                    refreshRssi();
                }
            }
        });




        statesReady = false;
        /*
        gridStates.setGridParam({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/statelist.cgi',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function(data) {
                if (data.nodeType) {
                    statesReady = true;
                    statesXML = data;
                    statesXMLObj = $(data);
                    $("#loaderStates").hide();
                    var ccuBat = 100 * parseFloat(statesXMLObj.find("datapoint[name$='BAT_LEVEL']").attr("value"));
                    ccuBat = ccuBat.toFixed(2);
                    addInfo("Anzahl Datenpunkte", statesXMLObj.find("datapoint").length);
                    addInfo("Anzahl Kanäle", statesXMLObj.find("channel").length);
                    addInfo("Anzahl Geräte", statesXMLObj.find("device").length);
                    addInfo("CCU Batteriestatus", ccuBat + "%");
                    if (statesXMLObj.find("channel[name$=':0'] datapoint[valuetype='2'][value='true']").length > 0) {
                        serviceIndicator.show();
                    } else {
                        $("#serivce").hide();
                    }
                }
                if (!rssiReady) {
                    refreshRssi();
                }
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true}); */
    }

    function refreshProtocol() {
        $("#loaderProtocol").show();
        protocolReady = false;

        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            data: scriptProtocol,
            success: function (data) {
                gridProtocol.setGridParam({
                     loadonce: false,
                    datatype: "xmlstring",
                    datastr: data,
                    sortname: 'datetime',
                    sortorder: 'desc'
                }).trigger("reloadGrid").setGridParam({loadonce:true});
                $("#loaderProtocol").hide();
            },
            error: ajaxError
        });


    }

    function refreshRssi() {
        $("#loaderRssi").show();
        
        

        
        
        rssiReady = false;

        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/tclscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            data: scriptRssi,
            success: function (data) {
                rssiReady = true;
                rssiXML = data;
                rssiXMLObj = $(data);
                gridRssi.setGridParam({
                    loadonce: false,
                    datatype: "xmlstring",
                    datastr: data
                }).trigger("reloadGrid").setGridParam({loadonce:true});
                $("#loaderRssi").hide();
                rssiReady = true;
                if (!protocolReady) {
                    refreshProtocol();
                }
            }
        });
                /*
              gridRssi.setGridParam({
                  url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/rssilist.cgi',
                  loadonce: false,
                  datatype: 'xml',
                  mtype: 'GET',
                  loadComplete: function () {
                      $("#loaderRssi").hide();
                      rssiReady = true;
                      if (!protocolReady) {
                          refreshProtocol();
                      }
                  }
              }).trigger("reloadGrid").setGridParam({loadonce: true}); */
    }

    // Favoritenansicht aufbauen
    function buildFavorites() {
        if (favoritesReady) {
            accordionFavorites.accordion("destroy");
        }
        accordionFavorites.html("");
        //console.log(favoritesXML);
        var favoriteUserid = "_USER" + favoritesXMLObj.find("user").attr("id");
        //console.log("Favorites: " + favoriteUserid);
        favoritesXMLObj.find("favorite[name='" + favoriteUserid + "'] channel").each(function () {
            var fav_id = $(this).attr("ise_id");
            var name = favoritesXMLObj.find("favorite[ise_id='" + fav_id + "']").attr("name");

            var cols = parseInt($(this).attr("column_count"), 10);
            var orientation = parseInt($(this).attr("name_position"), 10);
            var align = parseInt($(this).attr("col_align"), 10);

            // Spaltenanzahl automatisch
            if (cols < 1 || cols > 4) { cols = Math.floor($(window).width() / 460); }
            if (cols == 0) { cols = 1; }
            if (cols > 4) { cols = 4; }


            if (orientation == 0) {
                align = "right";
            } else {
                if (align == 1) {
                    align = "center";
                } else {
                    align = "left";
                }
            }

            var htmlTable = "<table border='0' width='99.9%' cellspacing='6' cellpadding='0'><tr id='favGroup"+fav_id+"' style='height:100%'>";
            var percent = 100 / cols;
            percent = percent.toString() + "%";
            for (var i=1; i <= cols; i++) {
                htmlTable += "<td style='vertical-align: top;' class='favCol favCol"+i+"' width='" + percent + "' height='100%'></td>";
            }
            htmlTable += "</tr></table>";

            htmlContainer = "";
            htmlContainer += "<div id='favContainer" + fav_id + "'><h3>" + name + "</h3><div id='fav" + fav_id + "' class='favPane'>" + htmlTable + "</div></div>";
            accordionFavorites.prepend(htmlContainer);
            var col = 0;


            favoritesXMLObj.find("favorite[ise_id='" + fav_id + "'] channel").each(function () {
                col += 1;
                if (col > cols) { col = 1; }
                var html = "";
                var channelName = $(this).attr("name");
                var channelId = $(this).attr("ise_id");

                html += "<div id='favItem" + channelId + "' class='favItem ui-helper-reset ui-widget ui-widget-content ui-corner-all'>";
                html += "<table style='width:100%; border-spacing:0px;' class='favItemTable'>";
                if (orientation == 1) {
                    html += "<tr><td style='width:100%'><div style='border:none;' class='favItemHeader ui-widget-header ui-corner-top favName'>" + channelName + "</div>";
                } else {
                    html += "<tr><td style='width:50%'><div class='favName'>" + channelName + "</div>";
                }
                html += "</td>";

                if (orientation == 1) {
                    html += "</tr><tr><td style='text-align: "+align+"; min-height: 32px; width:100%' id='favInputCell" + channelId + "' class='favInputCell'></td>";
                } else {
                    html += "<td style='text-align: "+align+"; width:50%' id='favInputCell" + channelId + "' class='favInputCell'></td>";
                }
                html += "</tr></table></div>";
                $("tr[id='favGroup" + fav_id + "'] td.favCol" + col).append(html);
                var favInputCell = $("td[id='favInputCell" + channelId + "']");
                //favInputCell.css("border", "1px dashed red");
                html = "";
                switch ($(this).attr("type")) {
                    case 'SYSVAR':
                        $(this).find("systemVariable").each(function () {
                            var value = $(this).attr("value");
                            var var_unit = $(this).attr("unit");
                            var var_id = $(this).attr("ise_id");
                            html += "<div class='favInput'>";


                            switch ($(this).attr("subtype")) {
                                case '2':

                                    html += "<select id='favInputSelect" + var_id + "'><option value='false'>"+$(this).attr("text_false")+"</option><option value='true'>"+$(this).attr("text_true")+"</option></select>";
                                    html += "</div>";
                                    favInputCell.append(html);
                                    $("#favInputSelect" + var_id + " option[value='" + value + "']").attr("selected", true);
                                    $("#favInputSelect" + var_id).change(function () {
                                        xmlapiSetState(var_id, $("#favInputSelect" + var_id + " option:selected").val());
                                    });

                                    break;
                                case '29':
                                    html += "<select id='favInputSelect" + var_id + "'>" + selectOptions($(this).attr("value_list")) + "</select>";
                                    if (value == "true") { value = "1"; } else if (value == "false") { value = "0"; }
                                    html += "</div>";
                                    favInputCell.append(html);
                                    $("#favInputSelect" + var_id + " option[value='" + value + "']").attr("selected", true);
                                    $("#favInputSelect" + var_id).change(function () {
                                        xmlapiSetState(var_id, $("#favInputSelect" + var_id + " option:selected").val());
                                    });
                                    break;
                                case '0':
                                    value = parseFloat(value);
                                    value = value.toFixed(2);
                                    html += "<input style='text-align:right;' type='text' size='8' name='favInputText" + var_id + "' id='favInputText" + var_id + "' value='" + value + "'>";
                                    html += "<span class='favInputUnit'>" + var_unit + "</span></div>";
                                    favInputCell.append(html);
                                    $("#favInputText" + var_id).keyup(function(e) {
                                        if(e.keyCode == 13) {
                                            xmlapiSetState(var_id, $("#favInputText" + var_id).val());
                                        }
                                    });
                                    break;
                                default:
                                    if (value.match(/<img/)) {
                                        html += value;
                                    } else {
                                        html += "<input style='text-align: "+(align=="right"?"left":align)+";' size='20' type='text' id='favInputText" + var_id + "' value='" + value + "'>";
                                    }
                                    html += "</div>";
                                    favInputCell.append(html);
                                    $("#favInputText" + var_id).keyup(function(e) {
                                        if(e.keyCode == 13) {
                                            xmlapiSetState(var_id, $("#favInputText" + var_id).val());
                                        }
                                    });


                            }


                        });



                        break;
                    case 'PROGRAM':
                        html += "<div class='favStartProgram'><button id='favProgram"+ $(this).attr("ise_id") +"'>Ausführen</button></div>";
                        favInputCell.append(html);

                        $("button[id='favProgram"+ $(this).attr("ise_id") +"']").button({icons: { primary: "ui-icon-play" }}).click(function () {
                            xmlapiRunProgram($(this).attr("ise_id"));
                        });
                        break;
                    case 'CHANNEL':
                        var firstDP = true;
                        var firstUnknown = true;
                        var ctype = $(this).attr("ctype");


                        favInputCell.append("<div class='favInput'></div>");
                        //console.log("FAV CHANNEL " + $(this).attr("name"));
                        //console.log("CTYPE " + ctype);
                        $(this).find("datapoint").each(function () {
                            var name = $(this).attr("name").split(".");
                            var type = name[2];



                            var id = $(this).attr("ise_id");
                            html = "";
                            switch (type) {
                                case 'STATE':
                                    //console.log("FAV STATE " + $(this).attr("name") + " " + $(this).attr("valuetype"));
                                    var dpValue = $(this).attr("value");
                                    //console.log("FAV DP VALUE " + dpValue);
                                    switch(ctype) {
                                        case '37':
                                            html += "<span class='favIconText'>";
                                            switch (dpValue) {
                                                case 'false':
                                                    html += "Geschlossen</span><img class='favIcon' src='/ise/img/door/closed.png' height='28'/>";
                                                    break;
                                                case 'true':
                                                    html += "Offen</span><img class='favIcon' src='/ise/img/door/open.png' height='28'/>";
                                                    break;
                                            }
                                            firstDP = false;

                                            $("td[id='favInputCell" + channelId + "'] .favInput").append(html);
                                            break;
                                        case '38':
                                            html += "<span class='favIconText'>";
                                            switch (dpValue) {
                                                case '0':
                                                    html += "Verriegelt</span><img class='favIcon' src='/ise/img/window/closed.png' height='28'/>";
                                                    break;
                                                case '1':
                                                    html += "Kippstellung</span><img class='favIcon' src='/ise/img/window/open_v.png' height='28'/>";
                                                    break;
                                                case '2':
                                                    html += "Offen</span><img class='favIcon' src='/ise/img/window/open_h.png' height='28'/>";
                                                    break;

                                            }
                                            firstDP = false;

                                            $("td[id='favInputCell" + channelId + "'] .favInput").append(html);
                                            break;
                                        default:
                                            var checkedOn = "";
                                            var checkedOff = "";
                                            if ($(this).attr("value") == "true") {
                                                checkedOn = " checked='checked'";
                                            } else {
                                                checkedOff = " checked='checked'";
                                            }
                                            html += "<div class='favInputRadio' id='favRadio" + id + "'>";
                                            html += "<input id='favRadioOff" + id + "' type='radio' name='favRadio" + id + "'" + checkedOff + ">";
                                            html += "<label for='favRadioOff" + id + "'>Aus</label>";
                                            html += "<input id='favRadioOn" + id + "' type='radio' name='favRadio" + id + "'" + checkedOn + ">";
                                            html += "<label for='favRadioOn" + id + "'>An</label>";
                                            html += "</div>";
                                            if (!firstDP) { }
                                            firstDP = false;

                                            $("td[id='favInputCell" + channelId + "'] .favInput").append(html);

                                            $("input#favRadioOn" + id).change(function (eventdata, handler) {
                                                if ($(this).is(":checked")) {
                                                    xmlapiSetState(id, 1);
                                                }
                                            });
                                            $("input#favRadioOff" + id).change(function (eventdata, handler) {
                                                if ($(this).is(":checked")) {
                                                    xmlapiSetState(id, 0);
                                                }
                                            });
                                    }


                                    break;
                                case 'LEVEL':
                                    var value = $(this).attr("value");
                                    html +=     "<div class='favSliderContainer'><div class='favInputSlider' id='favSlider" + id + "'></div></div>";
                                    firstDP = false;

                                    $("td[id='favInputCell" + channelId + "'] .favInput").append(html);
                                    $("#favSlider" + id).slider({
                                        min: 0.00,
                                        max: 1.00,
                                        step: 0.01,
                                        value: value,
                                        stop: function (e, ui) {
                                            xmlapiSetState(ui.handle.parentElement.id.replace('favSlider', ''), ui.value);
                                        }

                                    });

                                    break;
                                case 'SETPOINT':
                                    var value = $(this).attr("value");
                                    value = parseFloat(value);
                                    value = value.toFixed(1);

                                    html += "<input style='text-align: right;' size='8' type='text' id='favInputText" + id + "' value='" + value + "'><span class='favInputUnit'>°C</span>";


                                    $("td[id='favInputCell" + channelId + "'] .favInput").append(html);
                                    $("#favInputText" + id).keyup(function(e) {
                                        if(e.keyCode == 13) {
                                            xmlapiSetState(var_id, $("#favInputText" + id).val());
                                        }
                                    });
                                    break;
                                case 'PRESS_SHORT':
                                case 'PRESS_LONG':
                                    html += "<button class='favKey' id='favPressKey"+ $(this).attr("ise_id") +"'><span style='font-size:0.7em;'>" + (type == "PRESS_SHORT" ? "Kurz": "Lang") + "</span></button>";
                                    $("td[id='favInputCell" + channelId + "'] .favInput").append(html);
                                    $("button[id='favPressKey"+ $(this).attr("ise_id") +"']").button({icons: { primary: "ui-icon-arrow" + (type == "PRESS_LONG" ? "thick" : "") + "stop-1-s" }}).click(function () {
                                        xmlapiSetState($(this).attr("ise_id"), "true");
                                    });


                                    break;
                                case 'ERROR':
                                case 'OLD_LEVEL':
                                case 'RAMP_TIME':
                                case 'RAMP_STOP':
                                case 'STOP':
                                case 'ADJUSTING_COMMAND':
                                case 'ADJUSTING_DATA':
                                    // TODO
                                    break;

                                default:
                                    var value =         $(this).attr("value");
                                    var value_text =    $(this).attr("value_text");
                                    var value_type =    $(this).attr("valuetype");

                                    var unit = $(this).attr("unit");
                                    if (unit == undefined) { unit = ""; }

                                    if (firstUnknown) {
                                        firstUnknown = false;
                                        $("td[id='favInputCell" + channelId + "'] .favInput").append("<table class='favDpTable'><tbody></tbody></table>");
                                    }
                                    if (!firstDP) {
                                        html += "<br>";
                                    } else {
                                        firstDP = false;
                                    }
                                    var dpDesc = "";
                                    if (type) {
                                         if (hqConf.dpDetails[type]) {
                                            if (hqConf.dpDetails[type].decimals != -1) {
                                                if (hqConf.dpDetails[type].factor) {
                                                    value = value * hqConf.dpDetails[type].factor;
                                                }
                                                value = parseFloat(value);
                                                value = value.toFixed(hqConf.dpDetails[type].decimals);
                                            }
                                            unit = hqConf.dpDetails[type].unit;
                                            dpDesc = hqConf.dpDetails[type].desc;

                                        } else {

                                             dpDesc = type;
                                        }
                                    } else {
                                        if (value_type == 4) {
                                            value = parseFloat(value);
                                            value = value.toFixed(2);

                                        } else if (value_type == 2) {
                                            if (value == 'false') {
                                                value = $(this).attr("text_false");
                                            } else {
                                                value = $(this).attr("text_true");
                                            }
                                        }
                                        dpDesc = name;
                                    }
                                    if (value_text) { value = value_text; }
                                    if (hqConf.dpValueMap[value]) {
                                        value = hqConf.dpValueMap[value];
                                    }
                                    html = "<tr><td class='favDpLeft'>" + dpDesc + "</td><td class='favDpRight'>" + value + unit + "</span></td></tr>";
                                    $("td[id='favInputCell" + channelId + "'] .favInput table tbody").append(html);


                            }




                        });



                        break;
                    default:

                }

            });
            /*

            Todo - FavItems Höhe auf eine Linie bringen

            $(".favInput").each(function () {
                //console.log($(this).parent().attr("id") + " " + $(this).height());
                var newHeight = $(this).height();
                if (newHeight > 38) {
                    newHeight = (Math.ceil((newHeight - 38) / 50) * 50) + 38;
                    $(this).parent().css('height', newHeight);
                }

            });*/

        });


        var favSavedOrder = storage.get("hqWebUiFavOrder");
        if (favSavedOrder) {
            favSavedOrder = favSavedOrder.split(",");
            //var sortedHtml = "";
            for (var i in favSavedOrder) {
                //console.log("FAVORDER " + favSavedOrder[i]);
                $("#" + favSavedOrder[i]).appendTo(accordionFavorites);
                //sortedHtml += "<div id='" + favSavedOrder[i] + "'>" + $("#" + favSavedOrder[i]).html() + "</div>";
            }
            //accordionFavorites.html(sortedHtml);
        }
        $("#buttonsFavorites").show();

        accordionFavorites.accordion({
            heightStyle: "fill",
            header: "> div > h3"
        }).sortable({
                axis: "y",
                //handle: "h3",
                stop: function( event, ui ) {
                    ui.item.children( "h3" ).triggerHandler( "focusout" );
                },
                update: function (event, ui) {
                    var favOrder = [];
                    var i = 0;
                    $("div[id^='favContainer']").each(function () {
                       favOrder[i++] = $(this).attr("id");
                    });
                    storage.set("hqWebUiFavOrder", favOrder.join(","));
                }
            });

        resizeFavHeight();

        $(".favKey").button();

        function favButtonset() {
            $(".favInputRadio").buttonset();
            $("#tabFavorites").find('input:text, input:password')
                .button()
                .css({
                    'font' : 'inherit',
                    'color' : 'inherit',
                    'outline' : 'none',
                    'cursor' : 'text',
                    'padding' : '.4em .2em .4em .4em'
                });
            $("#tabFavorites").find("select").multiselect({
                multiple: false,
                header: false,
                minWidth: '100px',
                height: '100%',
                //header: "Select an option",
                //noneSelectedText: "Select an Option",
                selectedList: 1
            });
        }
        favButtonset();
        setTimeout(favButtonset, 1000);

    }


    /* Buttons, Dialoge */
    buttonRefreshFavs.button({
        text: false,
        icons: { primary: "ui-icon-refresh" }
    }).click(function () {
        xmlapiGetFavorites();
    });


    dialogDelScript.dialog({
        autoOpen: false
    });

    dialogRename.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
                $(this).dialog('close');
                var request = {
                    "method": '',
                    "params": {
                        "id": $("#renameId").val(),
                        "name": $("#rename").val(),
                        "_session_id_": hmSession
                    }
                };
                switch ($("#renameType").val()) {
                    case "DEVICE":
                        request.method = "Device.setName";
                        break;
                    case "CHANNEL":
                        request.method = "Channel.setName";
                        break;


                }
                jsonPost(request, function () {
                    switch ($("#renameType").val()) {
                        case "DEVICE":
                            $("tr[id='" + $("#renameId").val() + "'] td[aria-describedby='gridStates_name']").html($("#rename").val());
                            devicesXMLObj.find("device[ise_id='"+row_id+"']").attr("name", $("#rename").val());
                            statesXMLObj.find("device[ise_id='"+row_id+"']").attr("name", $("#rename").val());
                            storage.set('hqWebUiDevices', (new XMLSerializer()).serializeToString(devicesXMLObj));
                            break;
                        case "CHANNEL":
                            $("tr[id='" + $("#renameId").val() + "'] td[aria-describedby$='t_name']").html($("#rename").val());
                            channelXMLObj.find("channel[ise_id='"+row_id+"']").attr("name", $("#rename").val());
                            statesXMLObj.find("channel[ise_id='"+row_id+"']").attr("name", $("#rename").val());
                            favoritesXMLObj.find("channel[ise_id='"+row_id+"']").attr("name", $("#rename").val());
                            break;
                    }



                });

            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }

    });

    dialogRunProgram.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ausführen': function () {
                $(this).dialog('close');
                xmlapiRunProgram(programId.val());
            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }
    });

    dialogAjaxError.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Schließen': function () {
                $(this).dialog('close');
            }
        }
    });
    dialogJsonError.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Schließen': function () {
                $(this).dialog('close');
            }
        }
    });

    dialogEditVariable.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
                var value;
                if (variableInput.find("select").attr("id")) {
                    value = $("#variableValue option:selected").val();
                } else {
                    value = $("#variableValue").val();
                }
                xmlapiSetState(variableId.val(), value,
                    function () {
                        xmlapiGetVariable(variableId.val());
                    }
                );
                $(this).dialog('close');
            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }
    });

    dialogEditDatapoint.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
                xmlapiSetState($("#datapointId").val(), $("#datapointInput #datapointValue").val(),
                    function () {
                        xmlapiGetState($("#datapointId").val(), $("#datapointGridId").val());
                    }
                );
                $(this).dialog('close');
            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }

        }
    });

    dialogClearProtocol.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Löschen': function () {
                $(this).dialog('close');
                xmlapiClearProtocol();

            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }
    });

    dialogSettings.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Schließen': function () {
                $(this).dialog('close');
            }
        }
    });

   dialogDocu.dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        buttons: {
            'Schließen': function () {
                $(this).dialog('close');
            }
        }
    });
    dialogAbout.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Schließen': function () {
                $(this).dialog('close');
            }
        }
    });
    $("#hqWebUiVersion").html(version);
    $("#selectUiTheme").change(function () {
        changeTheme($("#selectUiTheme option:selected").val());
    });
    $("#buttonDelCred").button({

    }).click(function () {
        storage.set("hqWebUiUsername", null);
        storage.set("hqWebUiPassword", null);
        $("#buttonDelCred").attr("disabled", true);
    });

    dialogDebugScript.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Schliessen': function () {

                $(this).dialog('close');
                $("#debugScript").html("");

            }
        }
    });

    dialogDelScript.dialog({

        autoOpen: false,
        modal: true,
        buttons: {
            'Löschen': function () {
                alert($("#scriptDeleteReally").html());
                editAreaLoader.closeFile("hmScript", $("#scriptDeleteReally").html());
                $(this).dialog('close');
            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }
    });

    $("button#hmSaveScript").click(function () {
        var files = editAreaLoader.getAllFiles("hmScript");
        var store = {};
        for (var key in files) {
            var file = files[key];
            // if (file['edited'] == true) {
                editAreaLoader.setFileEditedMode("hmScript", key, false);
                store[key] = file['text'];
            // }
        }
        storage.set("hqWebUiScripts", null);
        storage.set("hqWebUiScripts", JSON.stringify(store));
    }).hide();

    $("#editorHelp").click(function () {
      dialogDocu.dialog('open');
    });


    $("button#hmRunScript").click(function () {


        var fileName = editAreaLoader.getCurrentFile("hmScript").title;
        var fileNameSplit = fileName.split(".");
        var fileType = fileNameSplit[fileNameSplit.length-1];
        var fileContent = editAreaLoader.getValue("hmScript");

        gridScriptVariables.jqGrid('clearGridData');
        $("div#hmScriptStdout").html("");


        switch (fileType) {
        case "hm":
            gridScriptVariables.jqGrid('clearGridData');
            $("div#hmScriptStdout").html("");
            var debugScript = "";
            var debugVar;

            if (hqConf.scriptDebugMethod == "dummy") {
                // in jede zweite Zeile eine Dummy-Variable einfügen.
                var scriptLine = fileContent.split("\n");
                for (var i = 1; i <= scriptLine.length; i++) {
                    debugScript += scriptLine[i-1] + "\n";
                    var counter = i.toString(10);
                    for (var j = counter.length; j < 5; j++) {
                        counter = "0" + counter;
                    }
                    debugVar = "hqDebugDummy" + counter;
                    debugScript += "var " + debugVar + " = 1;\n";
                }
                var debugLinesTotal = (i == undefined ? 0 : (i - 1));
            } else {
                debugScript = fileContent;
            }

            debugScript = debugScript + "\n" + "var hqDebugDummyFinal=1;";

            hmRunScript(debugScript, function (data) {
                var scriptFailed = false;
                var dummyFound = false;
                var lineNumber = 0;
                var tmp;
                $.each(data, function(key, value) {
                    divScriptVariables.show();
                    divStderr.hide();
                    switch (key) {
                        case 'STDOUT':
                            $("div#hmScriptStdout").html($("<div/>").text(value).html());
                            break;
                        case 'httpUserAgent':
                            break;
                        case 'sessionId':
                            break;
                        default:
                            if (!key.match("hqDebugDummy")) {
                                gridScriptVariables.jqGrid('addRowData', key, {'variable': key, 'value': value});
                            } else {
                                dummyFound = true;
                                if (value != 1 && key == "hqDebugDummyFinal") {
                                    scriptFailed = true;
                                } else {
                                    tmp = parseInt(key.substr(-5), 10);
                                    if (tmp > lineNumber) {
                                        lineNumber = tmp;
                                    }
                                }
                            }
                    }
                });

                if (hqConf.scriptDebugMethod == "log") {
                    if (!scriptFailed && dummyFound) {
                        $("#debugScript").html("Scriptausführung erfolgreich.");
                        dialogDebugScript.dialog('open');
                    } else {
                        $.ajax({
                            url: hqConf.ccuUrl + hqConf.hqapiPath + "/tclscript.cgi?content=xml&session=" + hmSession,
                            type: 'POST',
                            data: scriptErrors,
                            success: function (data) {
                                var error = $(data).find("error:last");
                                $("#debugScript").html(error.attr("timestamp") + " " + error.attr("msg") + " in Zeile " + error.attr("row"));
                                dialogDebugScript.dialog('open');
                            }
                        });
                    }
                } else if (hqConf.scriptDebugMethod == "dummy") {
                    if (lineNumber != debugLinesTotal) {
                        $("#debugScript").html("Skriptausführung gescheitert in Zeile " + (lineNumber + 1));
                        dialogDebugScript.dialog('open');
                    } else {
                        $("#debugScript").html("Scriptausführung erfolgreich.");
                        dialogDebugScript.dialog('open');
                    }
                }



                $("#loaderScript").hide();
            });
            break;
        case "tcl":
            tclRunScript(fileContent, function (data) {
                $("#debugScript").html("TCL Script ausgeführt.");
                dialogDebugScript.dialog('open');
                divScriptVariables.hide();
                divStderr.hide();
                $("div#hmScriptStdout").html(data);
            });
            break;
        case "sh":
            shRunScript(fileContent, function (data) {
                $("#debugScript").html("Shell Script ausgeführt.");
                dialogDebugScript.dialog('open');
                divScriptVariables.hide();
                divStderr.show();

                $("div#hmScriptStderr").html(data.STDERR);
                $("div#hmScriptStdout").html(data.STDOUT);
            });
            break;
        case "json":
            try {
                script = JSON.parse(fileContent);
            }
            catch (err) {
                jsonError('', {code: err.name, message:err.message});
                break;
            }
            script.params['_session_id_'] = hmSession;
            jsonPost(script,
                function (data) {
                    $("#debugScript").html("JSON RPC erfolgreich.");
                    divScriptVariables.hide();
                    divStderr.hide();

                    $("div#hmScriptStdout").jsonView(data.result); //.html('<pre>' + JSON.stringify(data.result, null, 2) + '</pre>');
                    dialogDebugScript.dialog('open');
                }
            )
            break;
        case "xml":
            console.log("xmlrpc");
            xmlmenu = $("#hmRunScriptMenu").show().position({
                my: "left top",
                at: "left bottom",
                of: "#hmRunScript"
            });
            $( document ).one( "click", function() {
                xmlmenu.hide();
            });
            return false;


            break;

        default:
            alert("Todo...");
        }



    });

    $("#buttonSelectTheme").button({
        icons: { primary: "ui-icon-gear" },
        text: false
    }).click(function () {
            dialogSettings.dialog("open");
        });
    $("#buttonLogout").button({
        icons: { primary: "ui-icon-closethick" },
        text: false
    }).click(function () {
            jsonLogout();
        });
    $("#buttonAbout").button({
        icons: { primary: "ui-icon-help" },
        text: false
    }).click(function () {
        dialogAbout.dialog("open");
    });

    $(".smallButton span.ui-icon").css("margin-left", "-9px").css("margin-top", "-9px");
    $("button#hmRunScript").button({
        icons: { primary: "ui-icon-play" }
    });
    $("button#editorCcu").button({
        icons: { primary: "ui-icon-folder-collapsed" }
    }).hide();
    $("button#editorHelp").button({
        icons: { primary: "ui-icon-help" }
    });
    $("button#editorNewFile").button({
        icons: { primary: "ui-icon-document", secondary: "ui-icon-triangle-1-s" }
    }).click(function() {

            var menu = $("#hmNewScriptMenu").show().position({
                my: "left top",
                at: "left bottom",
                of: this
            });
            $( document ).one( "click", function() {
                menu.hide();
            });
            return false;
        });
    $("#editorNewHmScript").click(function (e) {
        var new_file= {id: formatTimestamp() + ".hm", text: "\n\n\n\n\n", syntax: 'hmscript'};
        editAreaLoader.openFile('hmScript', new_file);
        e.preventDefault();
        $("#hmNewScriptMenu").hide();
        return false;
    });
    $("#editorNewTclScript").click(function (e) {
        var new_file= {id: formatTimestamp() + ".tcl", text: "\n\n\n\n\n", syntax: 'tcl'};
        editAreaLoader.openFile('hmScript', new_file);
        e.preventDefault();
        $("#hmNewScriptMenu").hide();
        return false;
    });
    $("#editorNewShScript").click(function (e) {
        var new_file= {id: formatTimestamp() + ".sh", text: "#!/bin/sh\n\n\n\nexit\n", syntax: 'tcl'};
        editAreaLoader.openFile('hmScript', new_file);
        e.preventDefault();
        $("#hmNewScriptMenu").hide();
        return false;
    });

    $("#editorNewJson").click(function (e) {
        var new_file= {id: formatTimestamp() + ".json", text: "\n\n\n\n\n", syntax: 'json'};
        editAreaLoader.openFile('hmScript', new_file);
        e.preventDefault();
        $("#hmNewScriptMenu").hide();
        return false;
    });


    $("#editorNewXml").click(function (e) {
        var new_file= {id: formatTimestamp() + ".xml", text: "\n\n\n\n\n", syntax: 'xml'};
        editAreaLoader.openFile('hmScript', new_file);
        e.preventDefault();
        $("#hmNewScriptMenu").hide();
        return false;
    });
    $("#editorRunXml0").click(function (e) {
        xmlRunScript(2000);
        e.preventDefault();
        $("#hmRunScriptMenu").hide();
        return false;
    });
    $("#editorRunXml1").click(function (e) {
        xmlRunScript(2001);
        e.preventDefault();
        $("#hmRunScriptMenu").hide();
        return false;
    });
    $("#editorRunXml2").click(function (e) {
        xmlRunScript(2002);
        e.preventDefault();
        $("#hmRunScriptMenu").hide();
        return false;
    });
    $("#buttonLogin").button({

    });
    $("#formLogin").submit(function (e) {
        jsonLogin($("input#username").val(), $("input#password").val());
        e.preventDefault();
    });

    // XML-API Funktionen
    function xmlapiClearProtocol() {
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=plain&session=" + hmSession,
            type: "POST",
            data: "var clearHistory = dom.ClearHistoryData(); Write(clearHistory);",
            success: function () {
                refreshProtocol();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiRunProgram(program_id) {
        var scriptRunProgram = "object obj = dom.GetObject(" + program_id + "); if (obj) { obj.ProgramExecute(); Write(obj); }";
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf.hqapiPath + "/hmscript.cgi?content=plain&session=" + hmSession,
            type: 'POST',
            data: scriptRunProgram,
            success: function (data) {
                refreshPrograms();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiSetState(ise_id, new_value, successFunction) {
        var script = "Write(dom.GetObject(" + ise_id + ").State('" + new_value + "'));";
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf.hqapiPath + "/hmscript.cgi?content=plain&session=" + hmSession,
            type: "post",
            data: script,
            success: function (data) { if (successFunction !== undefined) { successFunction(data); } },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });



       /* $.ajax({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/statechange.cgi',
            type: 'GET',
            scriptCharset: "ISO-8859-1",
            contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
            data: {
                ise_id: ise_id,
                new_value: new_value
            },
            success: function (data) { if (successFunction !== undefined) { successFunction(data); } },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });*/
    }

    function xmlapiGetState(ise_id, grid_id) {
        // Naja...
        setTimeout(function () { xmlApiGetStateAjax(ise_id, grid_id); }, 1000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id, grid_id); }, 1500);
        setTimeout(function () { xmlApiGetStateAjax(ise_id, grid_id); }, 2000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id, grid_id); }, 3000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id, grid_id); }, 5000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id, grid_id); }, 30000);
    }

    function xmlApiGetStateAjax(ise_id, grid_id) {
        var scriptState = "string sDevId = \"\";\n" +
"string sChannelId = \"\";\n" +
"string sDatapointId = \"" + ise_id + "\";\n" +
"string sChnId;\n" +
"string sDPId;\n" +
"Write(\"<state>\");\n" +
"if (sDatapointId.Length() > 0 ) {\n" +
"    object oDatapoint = dom.GetObject(sDatapointId);\n" +
"    if (oDatapoint.IsTypeOf(OT_DP)){\n" +
"        WriteLine(oDatapoint.Value());\n" +
"    }\n" +
"\n" +
"} else {\n" +
"\n" +
"    if (sChannelId.Length() > 0 ) {\n" +
"        object oChannel2 = dom.GetObject(sChannelId);\n" +
"        sDevId = oChannel2.Device();\n" +
"    }\n" +
"\n" +
"    object oDevice = dom.GetObject(sDevId);\n" +
"\n" +
"    if(oDevice.ReadyConfig() && (oDevice.Name() != \"Zentrale\") && (oDevice.Name() != \"HMW-RCV-50 BidCoS-Wir\") && oDevice.IsTypeOf(OT_DEVICE)) {\n" +
"        Write(\"<device\");\n" +
"        Write(\" name='\" # oDevice.Name() # \"'\");\n" +
"        Write(\" ise_id='\" # sDevId # \"'\");\n" +
"\n" +
"        string interfaceid = oDevice.Interface();\n" +
"        string servicechan = \"\" # dom.GetObject(interfaceid).Name() #\".\"#oDevice.Address()#\":0\";\n" +
"        object schan = dom.GetObject(servicechan#\".UNREACH\");\n" +
"        if(schan) { Write(\" unreach='\" # schan.Value() #\"'\"); }\n" +
"        object schan = dom.GetObject(servicechan#\".STICKY_UNREACH\");\n" +
"        if(schan) { Write(\" sticky_unreach='\" # schan.Value() #\"'\"); }\n" +
"        object schan = dom.GetObject(servicechan#\".CONFIG_PENDING\");\n" +
"        if(schan) { Write(\" config_pending='\" # schan.Value() #\"'\"); }\n" +
"\n" +
"        Write(\" >\");  ! device tag schliessen\n" +
"\n" +
"        foreach(sChnId, oDevice.Channels())	{\n" +
"            object oChannel = dom.GetObject(sChnId);\n" +
"            if ((!oChannel.Internal()) || oChannel.Internal()) {\n" +
"\n" +
"                Write(\"<channel name='\");\n" +
"                WriteXML( oChannel.Name() );\n" +
"                Write(\"' ise_id='\" # sChnId # \"'>\");\n" +
"\n" +
"                foreach(sDPId, oChannel.DPs().EnumUsedIDs()) {\n" +
"                    object oDP = dom.GetObject(sDPId);\n" +
"                    if(oDP) {\n" +
"                        string dp = oDP.Name().StrValueByIndex(\".\", 2);\n" +
"\n" +
"                        if( (dp != \"ON_TIME\") && (dp != \"INHIBIT\") ) {\n" +
"                            Write(\"<datapoint\");\n" +
"                            Write(\" name='\"); WriteXML(oDP.Name());\n" +
"                            Write(\"' type='\"); WriteXML(oDP.Name().StrValueByIndex(\".\", 2))\n" +
"                            Write(\"' ise_id='\" # sDPId );\n" +
"                            ! state fragt den aktuellen status des sensors/aktors ab, dauert lange\n" +
"                            !Write(\"' state='\"); WriteXML(oDP.State());\n" +
"                            ! value nimmt den von der ccu gecachten wert, moeglicherweise nicht korrekt. Ggf. bei einigen geraeten immer abfragen\n" +
"                            Write(\"' value='\"); WriteXML(oDP.Value());\n" +
"                            Write(\"' valuetype='\" # oDP.ValueType());\n" +
"                            Write(\"' timestamp='\" # oDP.Timestamp().ToInteger());\n" +
"                            Write(\"' />\");\n" +
"                        }\n" +
"                    }\n" +
"                }\n" +
"                Write(\"</channel>\");\n" +
"            }\n" +
"        }\n" +
"        Write(\"</device>\");\n" +
"    }\n" +
"}\n" +
"Write(\"</state>\");\n";
        
        
        $.ajax({

            url: hqConf["ccuUrl"] + hqConf.hqapiPath + "/hmscript.cgi?content=plain&session=" + hmSession,
            type: "post",
            data: scriptState,
            async: false,

            success: function (data) {
               $("tr#" + ise_id + " td[aria-describedby$='value']").each(function () {
                    var value = $(data).text()
                    $(this).html(value);
               });
                // Todo - neuen Wert in statesXML schreiben!
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetVariable(ise_id) {
        var scriptSysvar = "object oSysVar;\n" +
"string sSysVarId;\n" +
"string sShowText=\"true\";\n" +
"string sSysVarId=" + ise_id + ";\n" +
"oSysVar = dom.GetObject(sSysVarId);\n" +
"Write(\"<systemVariables>\")\n" +
"Write(\"<systemVariable\");\n" +
"Write(\" name='\"); WriteXML( oSysVar.Name() );\n" +
"Write(\"' variable='\"); WriteXML( oSysVar.Variable());\n" +
"Write(\"' value='\"); WriteXML( oSysVar.Value());\n" +
"if (sShowText == \"true\") {\n" +
"    Write(\"' value_list='\"); WriteXML( oSysVar.ValueList());\n" +
"    Write(\"' value_text='\"); WriteXML( oSysVar.ValueList().StrValueByIndex(';', oSysVar.Value()));\n" +
"}\n" +
"Write(\"' ise_id='\" # oSysVar.ID() );\n" +
"Write(\"' min='\"); WriteXML( oSysVar.ValueMin());\n" +
"Write(\"' max='\"); WriteXML( oSysVar.ValueMax());\n" +
"Write(\"' unit='\"); WriteXML( oSysVar.ValueUnit());\n" +
"Write(\"' type='\" # oSysVar.ValueType() # \"' subtype='\" # oSysVar.ValueSubType());\n" +
"Write(\"' timestamp='\" # oSysVar.Timestamp().ToInteger());\n" +
"Write(\"'/>\");\n" +
"Write(\"</systemVariables>\")\n";


            $.ajax({
            url: hqConf["ccuUrl"] + hqConf.hqapiPath + "/hmscript.cgi?content=plain&session=" + hmSession,
            type: "post",
            data: scriptSysvar,
            success: function (data) {
                var variable = $(data).find("systemVariable");
                gridVariables.find("tr#" + ise_id + " td[aria-describedby$='value']").html(variable.attr('value'));
                gridVariables.find("tr#" + ise_id + " td[aria-describedby$='value_text']").html(variable.attr('value_text'));
                gridVariables.find("tr#" + ise_id + " td[aria-describedby$='variable']").html(variable.attr('variable'));
                gridVariables.find("tr#" + ise_id + " td[aria-describedby$='timestamp']").html(formatTimestamp(variable.attr('timestamp')));
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
            /* $.ajax({
               url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/sysvar.cgi',
               type: 'GET',
               async: false,
               data: {
                   ise_id: ise_id
               },
               success: function (data) {
                   var variable = $(data).find("systemVariable");
                   gridVariables.find("tr#" + ise_id + " td[aria-describedby$='value']").html(variable.attr('value'));
                   gridVariables.find("tr#" + ise_id + " td[aria-describedby$='value_text']").html(variable.attr('value_text'));
                   gridVariables.find("tr#" + ise_id + " td[aria-describedby$='variable']").html(variable.attr('variable'));
                   gridVariables.find("tr#" + ise_id + " td[aria-describedby$='timestamp']").html(formatTimestamp(variable.attr('timestamp')));
               },
               error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
           }); */
    }

    function xmlapiGetDevices() {
        var cache = storage.get("hqWebUiDevices");
        if (cache !== null) {
            devicesReady = true;
            devicesXML = $.parseXML(cache);
            devicesXMLObj = $(devicesXML);
            refreshStates();
            return false;
        }



        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            data: scriptDevices,
            dataType: 'xml',
            success: function (data) {
                devicesReady = true;
                devicesXML = data;
                devicesXMLObj = $(data);
                storage.set('hqWebUiDevices', (new XMLSerializer()).serializeToString(data));
                refreshStates();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetFunctions() {
        $("#loaderStates").show();
        var cache = storage.get("hqWebUiFunctions");
        if (cache !== null) {
            functionsReady = true;
            functionsXML = $.parseXML(cache);
            functionsXMLObj = $(functionsXML);
            xmlapiGetRooms();
            return false;
        }
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            data: scriptFunctions,
            dataType: 'xml',
            success: function (data) {
                functionsReady = true;
                functionsXML = data;
                functionsXMLObj = $(data);
                storage.set('hqWebUiFunctions', (new XMLSerializer()).serializeToString(data));
                xmlapiGetRooms();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetRooms() {
        var cache = storage.get("hqWebUiRooms");
        if (cache !== null) {
            roomsReady = true;
            roomsXML = $.parseXML(cache);
            roomsXMLObj = $(roomsXML);
            xmlapiGetDevices();
            return false;
        }
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            type: 'POST',
            data: scriptRooms,
            success: function (data) {
                roomsReady = true;
                roomsXML = data;
                roomsXMLObj = $(data);
                storage.set('hqWebUiRooms', (new XMLSerializer()).serializeToString(data));
                xmlapiGetDevices();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetFavorites() {
        $("#loaderFavorites").show();


        $.ajax({
            url: hqConf["ccuUrl"] + hqConf.hqapiPath + "/hmscript.cgi?content=xml&session=" + hmSession,
            dataType: 'xml',
            type: 'POST',
            data: scriptFavorites,
            contentType: "text/xml;charset=ISO-8859-1",
            success: function (data) {

                favoritesXML = data;
                favoritesXMLObj = $(data);
                buildFavorites();
                $("#loaderFavorites").hide();
                favoritesReady = true;

                if (!variablesReady) {
                    refreshVariables();
                }


            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loaderFavorites").hide();
                ajaxError(xhr, ajaxOptions, thrownError);
            }
        });

    }

    function xmlapiGetVersion() {
        gridInfo.jqGrid('addRowData', "HQ WebUI Version", {'key': "HQ WebUI Version", 'value': version});
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/version.txt",
            type: 'GET',
            dataType: 'text',
            success: function (data) {
                gridInfo.jqGrid('addRowData', "HQ API Version", {'key': "HQ API Version", 'value': data});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                gridInfo.jqGrid('addRowData', "HQ API Version", {'key': "HQ API Version", 'value': 'not available'});
            }
        });
        $.ajax({
            url: hqConf.ccuUrl + hqConf.xmlapiPath + '/version.cgi',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                xmlapiVersion = $(data).text();
                gridInfo.jqGrid('addRowData', "XML-API Version", {'key': "XML-API Version", 'value': xmlapiVersion});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                gridInfo.jqGrid('addRowData', "XML-API Version", {'key': "XML-API Version", 'value': 'not available'});
            }
        });

    }



   // jsonLogin();

    function sessionStart() {
        //console.log("sessionStart()");
        var username = storage.get("hqWebUiUsername");
        var password = storage.get("hqWebUiPassword");
        if (hqConf.sessionPersistent) {
            var tmp = storage.get("hqWebUiSession");
            if (tmp != null) {
                if (username == null) {
                    $("#buttonDelCred").attr("disabled", true);
                }
                hmSession = tmp;
                hmSessionRenew(true);
                return true;
            }
        }
        if (username != null) {
            jsonLogin(username, password);
        } else {
            $("#buttonDelCred").attr("disabled", true);
            $("#login").show();
            $("#password").focus();
        }
    }

    function jsonError(options, errObj) {
        $("#jsonOptions").html(options);
        $("#jsonError").html(errObj.code + " " + errObj.message);
        dialogJsonError.dialog("open");
    };

    function jsonLogin(username, password) {
        //console.log("jsonLogin()");

        jsonPost({
            "method": "Session.login",
            "params":  {
                "username" : username,
                "password" : password
            }
        }, function (data) {
            //console.log("jsonLogin() jsonPost success");

            hmSession = data.result;

            webuiStart();
            if (hqConf.sessionPersistent) {
                storage.set("hqWebUiSession", hmSession);
            }
            if ($("#keepcred").is(":checked")) {
                storage.set("hqWebUiUsername", username);
                storage.set("hqWebUiPassword", password);
                $("#buttonDelCred").removeAttr("disabled");
            }
            $("#password").val("");
            $("div#login").hide(hqConf.sessionLoginFade);
            if (hqConf.sessionLogoutWarning) {
                $(window).bind('beforeunload', function() {
                    return "Bitte benutzen Sie den Abmelde-Button bevor Sie die Seite verlassen oder den Browser schließen!";
                });
            }
        }, function (data) {
            var msg;
            switch(data.error.code) {
            case 501:
                msg = "Zuviele gleichzeitige Verbidnungen";
                break;
            case 502:
                msg = "Benutzername oder Passwort falsch";
                break;
            default:
                msg = data.error.message;
            }
            $("#loginError").show().html(msg);
            setTimeout(function () {
                $("#loginError").hide();
            }, 4000);
            $("#login").show();
            $("#widgetLogin").effect("shake", { times:3, distance: 12 }, 470);
            $("#password").val("").focus();

        });
    }

    function jsonLogout() {
        clearTimeout(timerRefresh);
        clearTimeout(timerSession);
        if (hmSession) {
            $("#logout").show("fade", hqConf.sessionLogoutFade);
            jsonPost({
                "method":   "Session.logout",
                "params":   {
                    "_session_id_": hmSession
                }
            }, function () {
                    hmSession = undefined;
                    storage.set("hqWebUiSession", null);
                    if (hqConf.sessionLogoutWarning) {
                        $(window).unbind("beforeunload");
                    }


                }
            );
        }
    }

    function hmSessionRenew(firstLoad) {
        //console.log("hmSessionRenew()");
        clearTimeout(timerSession);
        if (hmSession) {
            jsonPost({
                    "method":   "Session.renew",
                    "params":   {
                        "_session_id_": hmSession
                    }
            }, function (data) {
                //console.log("hmSessionRenew() jsonPost success");

                if (data.result) {
                    $("#login").hide();
                    if (firstLoad) {
                        webuiStart();
                        timerSession =          setTimeout(hmSessionRenew, 240000);
                    }
                } else {
                    hmSession = undefined;
                    $("#login").show();
                }
            }, function (data) {
                //console.log("hmSessionRenew() jsonPost error");

                hmSession = undefined;
                $("#login").show();
            });
        }
    }

    function jsonPost(request, successFunction, errorFunction) {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(request),
            url: hqConf.ccuUrl + "/api/homematic.cgi",
            dataType: 'json',
            success: function (data) {
                if (data.error == null) {
                    if (successFunction) {
                        successFunction(data);
                    }
                } else {
                    if (errorFunction) {
                        errorFunction(data);
                    } else {
                        jsonError(request.method, data.error);
                    }

                }
              //  //console.log(data);

            },
            error: function () {
                jsonError(request.method, {code: '', message: 'AJAX error!'});
            }
        });
    }

    function jsonGetCcuVersion () {

    }

    function hmRunScript (script, successFunction) {
        $("#loaderScript").show();
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?session=" + hmSession + "&debug=true&content=json",
            type: 'POST',
            data: script,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
            success: function (data) {
                $("#loaderScript").hide();
                successFunction(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                ajaxError(xhr, ajaxOptions, thrownError);
        
            }
        });
    }


    function tclRunScript (script, successFunction) {
        $("#loaderScript").show();
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/tclscript.cgi?session=" + hmSession,
            type: 'POST',
            data: script,
            dataType: 'text',
            success: function (data) {
                $("#loaderScript").hide();
                successFunction(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                ajaxError(xhr, ajaxOptions, thrownError);

            }
        });

    }

    function shRunScript (script, successFunction) {
        $("#loaderScript").show();
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/process.cgi?content=json&debug=true&session=" + hmSession,
            type: 'POST',
            data: script,
            dataType: 'json',
            success: function (data) {
                $("#loaderScript").hide();
                successFunction(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                ajaxError(xhr, ajaxOptions, thrownError);

            }
        });

    }


    function xmlRunScript(port) {
        var fileContent = editAreaLoader.getValue("hmScript");

        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/xmlrpc.cgi?port=" + port + "&session=" + hmSession,
            type: "POST",
            dataType: "text",
            data: fileContent,
            success: function (data) {
                divScriptVariables.hide();
                divStderr.hide();

                $("div#hmScriptStdout").html($("<div/>").text(data).html());
            },
            error: function () {
                alert("xmlrpc ajax error");
            }
        });
    }


    function saveProgram(id) {
        var name = $("tr[id='" + id + "'] td[aria-describedby='gridPrograms_name']").html();
        var description = $("tr[id='" + id + "'] td[aria-describedby='gridPrograms_description']").html();
        description = (description == "&nbsp;" ? "" : description);
        var active = $("tr[id='" + id + "'] td[aria-describedby='gridPrograms_active'] input").is(":checked");
        var script = "object o = dom.GetObject(" + id + ");\n" +
            "o.Name('" + name + "');\n" +
            "o.PrgInfo('" + description + "');\n" +
            "o.Active(" + active + ");\n";
        $.ajax({
            url: hqConf.ccuUrl + hqConf.hqapiPath + "/hmscript.cgi?content=plain&session=" + hmSession,
            data: script,
            type: 'POST',
            success: function () {
                //console.log("saveProgram(" + id + ")");
            }
        });
    }

    function webuiStart() {
        // Favoritenansicht aufbauen. Das Laden des nächsten Tabs wird aus xmlapiGetFavorites heraus angestoßen
        //console.log("webuistart");
        xmlapiGetFavorites();
        xmlapiGetVersion();
    };

    // Refresh Funktionen

    var updateFirst = true;
    // Diese Funktion wird alle x Sekunden aufgerufen
    function update() {
        clearTimeout(timerRefresh);
        if (ajaxIndicator.is(":visible")) {
            timerRefresh = setTimeout(update, 500);
            return false;
        }
        console.log("Refresh");
        updateFirst = true;
        updateScript = "";
        $("td.uDP[aria-describedby$='_id']:reallyvisible").each(function() {
            if ($(this).css("display") != "none") {
                var id = $(this).attr("title");
                id = parseInt(id, 10);
                if (!updateFirst) {
                    updateScript += 'Write(",");\n';
                } else {
                    updateFirst = false;
                }
                updateScript += 'o = dom.GetObject('+id+');\n';
                updateScript += 'Write("{\\"id\\":\\"'+id+'\\",");\n';
                updateScript += 'Write("\\"state\\":\\"" # o.State() # "\\",");\n';
                updateScript += 'Write("\\"time\\":\\"" # o.Timestamp() # "\\"}");\n';
            }

        });
        $("div[id^='favItem']:reallyvisible").each(function() {
            if ($(this).css("display") != "none") {
                var id = $(this).attr("id");
                //id = parseInt(id, 10);
                //updateQueue.push(id);
            }

        });
        if (updateScript != "") {
            updateScript = 'object o;\nWrite("{");\n' + updateScript + 'Write("}");';
            //console.log(updateScript);
            timerRefresh = setTimeout(update, hqConf.refreshPause);
        } else {
            timerRefresh = setTimeout(update, hqConf.refreshPause);
        }

    }
    if (hqConf.refreshEnable) {
        update();
    }

    function updateState() {

    }
    function updateVariable() {

    }
    function updateProgram() {

    }
    function updateGetVisibleStates() {

    }
    function updateGetVisibleVariables() {

    }
    function updateGetVisiblePrograms() {

    }
    // Misc
    // Eine Zeile zur Info-Tabelle hinzufügen
    function addInfo(key, value) {
        gridInfo.jqGrid('addRowData', key, {'key': key, 'value': value});
    }

    // <select><option> aus Werteliste aufbauen
    function selectOptions(value_list) {
        var output = "";
        var values = value_list.split(";");
        for (var i = 0; i < values.length; i++) {
            output = output + "<option value='" + i + "'>" + values[i] + "</option>";
        }
        return output;
    }

    function ajaxError(xhr, ajaxOptions, thrownError) {
        $("#ajaxOptions").html(ajaxOptions);
        $("#thrownError").html(thrownError);
        dialogAjaxError.dialog("open");
    };




    function changeTheme(theme) {
        storage.set('hqWebUiTheme', theme);
        $("#theme").attr("href", hqConf.themeUrl + theme + hqConf.themeSuffix);
        $("#selectUiTheme option[value='" + theme + "']").attr("selected", true);
        setTimeout(scriptEditorStyle,2000);
    }

    function getTheme() {
        var theme = storage.get("hqWebUiTheme");
        if (theme === null) { theme = hqConf.themeDefault; }
        $("#theme").attr("href", hqConf.themeUrl + theme + hqConf.themeSuffix);
        $("#selectUiTheme option[value='" + theme + "']").attr("selected", true);
        setTimeout(scriptEditorStyle,2000);
    }


    // Script-Editor
    var editAreaInit = {
        id: "hmScript",
        start_highlight: true,
        is_multi_files: true,
        word_wrap: true,
        font_size: "10",
        allow_resize: "y",
        allow_toggle: false,
        display: "onload",
        language: "de",
        syntax: "hmscript",
        replace_tab_by_spaces: 4,
        min_height: 585,
        min_width: 695,
        toolbar: "search, go_to_line, fullscreen, autocompletion, select_font",
        EA_load_callback: "scriptEditorReady",
        load_callback: "scriptEditorLoad",
        save_callback: "scriptEditorSave",
        new_document_callback: "scriptEditorNew",
        EA_file_close_callback: "scriptFileClose",
        change_callback: "scriptChange"
    }

    // Autocompletion im Mozilla erstmal deaktiviert. Fehler in autocompletion.js muss erst behoben werden.
    if (!$.browser.mozilla) {
        editAreaInit['plugins'] = 'autocompletion';
        editAreaInit['autocompletion'] = true;
    }

    editAreaLoader.init(editAreaInit);

});

// Funktionen für den Script-Editor(editArea steckt in iFrame und arbeitet im globalen Namensraum)
function scriptFileClose(file) {
 // Todo - Prüfen warum closeFile() im Dialog dialogDelScript nicht funktioniert
 //   $("#scriptDeleteReally").html(file["id"]);
 //   dialogDebugScript.dialog("open");
 //   return false;
 // Bis dahin: Workaround via confirm()
    if (confirm("Wirklich das Script " + file["id"] + " löschen?")) {
        setTimeout(function () {
            $("button#hmSaveScript").trigger("click");
        }, 200);
        return true;
    } else {
        return false;
    }
}

// Automatisches Speichern
var scriptSaveTimer;
function scriptChange() {
    clearTimeout(scriptSaveTimer);
    scriptSaveTimer = setTimeout(function () {
        $("button#hmSaveScript").trigger("click");
    }, 1000);
}

function scriptEditorReady() {
    $("#frame_hmScript").contents().find("#toolbar_1 a").button();

    scriptEditorStyle();

    // Gespeicherte Scripte laden
    var scripts = JSON.parse(storage.get('hqWebUiScripts'));
    for (var key in scripts) {
        var new_file= {id: key, text: scripts[key], syntax: 'hmscript'};
        editAreaLoader.openFile('hmScript', new_file);
    }

}

function scriptEditorStyle() {
    // Umstylen anhand jQuery UI Theme... Pfusch...
    $("#frame_hmScript").contents().find("#toolbar_1").css("background-color", $(".ui-jqgrid-titlebar").css("background-color"));
    $("#frame_hmScript").contents().find("#toolbar_1").css("background", $(".ui-jqgrid-titlebar").css("background"));
    $("#frame_hmScript").contents().find("#toolbar_1").css("color", $(".ui-jqgrid-titlebar").css("color"));

    // Todo abfangen falls noch keine Buttons initialisiert sind!
    $("#frame_hmScript").contents().find("#toolbar_1 a").button("destroy");
    $("#frame_hmScript").contents().find("#toolbar_1 a").button();
    $("#frame_hmScript").contents().find("#toolbar_1 a span").css({
        'padding': '1px',
        'padding-left': '6px',
        'padding-right': '6px',
        'margin': '0px'


    });

    /*$("#frame_hmScript").contents().find("#toolbar_1 a span").
            css("color", $("#hmRunScript").css("color")).
            css("background-color", $("#hmRunScript").css("background-color")).
            css("border", $("#hmRunScript").css("border"));
    */
    $("#frame_hmScript").contents().find("#toolbar_1 a img").css('border', '');
    $("#frame_hmScript").contents().find("#toolbar_2").css("background-color", $(".ui-jqgrid-titlebar").css("background-color"));
    $("#frame_hmScript").contents().find("#toolbar_2").css("background", $(".ui-jqgrid-titlebar").css("background"));
    $("#frame_hmScript").contents().find("#toolbar_2").css("color", $(".ui-jqgrid-titlebar").css("color"));
    $("#frame_hmScript").contents().find("#tab_browsing_area").css("background-color", $("#gridScriptVariables_variable").css("background-color"));
    $("#frame_hmScript").contents().find("#tab_browsing_area").css("background", $("#gridScriptVariables_variable").css("background"));
    $("#frame_hmScript").contents().find("#tab_browsing_area").css("color", $("#gridScriptVariables_variable").css("color"));

}




