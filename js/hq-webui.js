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

$("document").ready(function () {

    // HQ WebUI Version
    var version =               "1.4.5";

    var statesXML,
        variablesXML,
        programsXML,
        functionsXML,
        roomsXML,
        devicesXML,
        favoritesXML,
        statesXMLObj,
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
    var dialogEditVariable =    $("#dialogEditVariable");
    var dialogEditDatapoint =   $("#dialogEditDatapoint");
    var dialogSelectTheme =     $("#dialogSelectTheme");

    var tabs = $('#tabs');

    getTheme();

    $("ul.tabsPanel li a img").hide();
    $("#service").hide();
    $("#alarm").hide();

    var tabChange = false;
    tabs.tabs({
        select: function(event, ui) {
            if (!tabChange) {
                history.pushState({}, "", $("a[id='ui-id-" + (parseInt(ui.index,10) + 1) + "']").attr("href"));
            } else {
                tabChange = false;
            }

        }
    });

    $(window).bind( 'hashchange', function(e) {
        console.log("change");
        tabChange = true;
        tabs.tabs('select', window.location.hash);
    });


    $("button").button();

    $("ul.tabsPanel").append("<button value='Theme wählen' class='smallButton' style='float:right' id='buttonSelectTheme'></button> ")
        .append("<button value='Geräte, Räume und Gewerke aktualisieren' class='smallButton' style='float:right' id='buttonClearCache'></button> ");

    $("#buttonSelectTheme").button({
        icons: { primary: "ui-icon-gear" },
        text: false
    }).click(function () {
       dialogSelectTheme.dialog("open");
    });
    $("#buttonClearCache").button({
        icons: { primary: "ui-icon-refresh" },
        text: false
    }).click(function () {
            storage.set("hqWebUiRooms", null);
            storage.set("hqWebUiFunctions", null);
            storage.set("hqWebUiDevices", null);
            roomsReady = false;
            functionsReady = false;
            devicesReady = false;
            xmlapiGetFunctions();
        });
    $(".smallButton span.ui-icon").css("margin-left", "-9px").css("margin-top", "-9px");
    $("button#hmRunScript").button({
        icons: { primary: "ui-icon-play" }
    });
    $("button#hmNewScript").button({
        icons: { primary: "ui-icon-document" }
    });
    xmlapiGetFavorites();


    /*
     *          jqGrid colNames and colModels
     *
     *          see http://www.trirand.com/jqgridwiki/doku.php?id=wiki:colmodel_options
     *
     */
    var colNamesVariables = [
        'ise_id',
        'Name',
        'Variable',
        'Wert',
        'Einheit',
        'Werteliste',
        'Wert (text)',
        'min',
        'max',
        'type',
        'Typ',
        'Sichtbar',
        'Protokolliert',
        'Zeitstempel'
    ];
    var colModelVariables = [
        {name:'ise_id', index:'ise_id', width: 60,
            xmlmap: function (obj) {
                return $(obj).attr('ise_id');
            }
        },
        {name:'name', index:'name', width: 150,
            xmlmap: function (obj) {
                return $(obj).attr('name');
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
                    case '29':
                        val = $(obj).attr('value_text');
                        break;
                }
                return val;
            }
        },
        {name:'unit', index:'unit', width: 30,
            xmlmap: function (obj) {
                return $(obj).attr('unit');
            }
        },
        {name:'value_list', index:'value_list', width: 120, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('value_list');
            }
        },
        {name:'value_text', index:'value_text', width: 50, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('value_text');
            }
        },
        {name:'min', index:'min', width: 30,
            xmlmap: function (obj) {
                return $(obj).attr('min');
            }
        },
        {name:'max', index:'max', width: 30,
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
        {name:'visible', index:'visible', width: 40,
            xmlmap: function (obj) {
                return $(obj).attr('visible');
            },
            formatter: formatBool
        },
        {name:'logged', index:'logged', width: 40,
            xmlmap: function (obj) {
                return $(obj).attr('logged');
            },
            formatter: formatBool
        },
        {name:'timestamp', index:'timestamp', width: 75,
            xmlmap: function (obj) {
                return formatTimestamp($(obj).attr('timestamp'));
            }
        }
    ];

    var colNamesPrograms = [
        'id',
        'Name',
        'Beschreibung',
        'Aktiv',
        'Zeitstempel'
    ];
    var colModelPrograms = [
        {name:'id', index:'id', width: 60,
            xmlmap: function (obj) {
                return $(obj).attr('id');
            }
        },
        {name:'name', index:'name', width: 200,
            xmlmap: function (obj) {
                return $(obj).attr('name');
            }
        },
        {name:'description', index:'description', width: 200,
            xmlmap: function (obj) {
                return $(obj).attr('description');
            }
        },
        {name:'active', index:'active', width: 40,
            xmlmap: function (obj) {
                return $(obj).attr('active');
            },
            formatter: formatBool
        },
        {name:'timestamp', index:'timestamp', width: 75,
            xmlmap: function (obj) {
                return formatTimestamp($(obj).attr('timestamp'));
            }
        }
    ];

    var colNamesStates = [
        'ise_id',
        'Name',
        'Adresse',
        'Schnittstelle',
        'Gerätetyp',
        'Räume',
        'Gewerke',
        'unreach',
        'sticky_unreach',
        'config_pending',
        'Servicemeldungen'
    ];
    var colModelStates = [
        {name:'ise_id', index:'ise_id', align: 'right', width: 80, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('ise_id');
            },
            classes: 'ise_id'
        },
        {name:'name', index:'name', width: 240, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('name');
            }
        },
        {name:'address', index:'address', width: 79, fixed: true,
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
        {name:'iface', index:'iface', width: 78, fixed: true,
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
        {name:'devicetype', index:'devicetype', width: 110, fixed: true,
            xmlmap: function (obj) {
                var ise_id = $(obj).attr('ise_id');
                var iface = devicesXMLObj.find("device[ise_id='" + $(obj).attr("ise_id") + "']").attr("device_type");
                switch(iface) {
                    case undefined:
                        return "";
                        break;
                    default:
                        return iface;
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
        {name:'service', index:'service', width: 120, fixed: true,
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
        ''
    ];
    var colModelChannel = [
        {name:"ise_id", align: 'right', index:"ise_id",   width:48, fixed: true,
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
        {name:"address",   index:"address",   width:79, fixed: true,
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
        {name:"direction",   index:"direction",   width:78, fixed: true,
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
        {name: "dummy1", index: "dummy1", width: 110, fixed:true },
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
        {name:"ise_id", index:"ise_id", align: 'right', width:46, fixed: true,
            xmlmap: function (obj) {
                return $(obj).attr('ise_id');
            },
            classes: 'ise_id'
        },
        {name:"name",   index:"name",   width:240, fixed: true, xmlmap: function (obj) {
            return $(obj).attr('name');
        }},
        {name:"type",   index:"type",   width:60, hidden: true, xmlmap: function (obj) {
            return $(obj).attr('type');
        }},
        {name:"value",   index:"value",   width:162, fixed: true,
            xmlmap: function (obj) {
                var val = $(obj).attr('value');
                if ($(obj).attr('valuetype') == 6) {
                    val = parseFloat(val);
                    val = val.toFixed(2);
                }
                return val;
            }
        },
        {name:"valuetype",   index:"valuetype",   width:80, hidden: true,
            xmlmap: function (obj) {
                return $(obj).attr('valuetype');
            }
        },
        {name:"timestamp",   index:"timestamp",   width:110, fixed: true,
            xmlmap: function (obj) {
                return formatTimestamp($(obj).attr('timestamp'));
            }
        }
    ];

    var colNamesRssi = [
        'ise_id',
        'Name',
        'Adresse',
        'Gerätetyp',
        'rssi_device',
        'rssi_peer',
        'RX',
        'TX',
        'AES Verfügbar',
        'Übertragungsmodus',
        'unreach',
        'sticky_unreach',
        'config_pending',
        'Servicemeldungen'
    ];
    var colModelRssi = [
        {name:'ise_id', index:'ise_id', align: 'right', width: 40,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var ise_id = devicesXMLObj.find("device[address='" + device + "']").attr("ise_id");
                return ise_id;
            },
            classes: 'ise_id'
        },
        {name:'name', index:'name', width: 200,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var name = devicesXMLObj.find("device[address='" + device + "']").attr("name");
                return name;
            }
        },
        {name:'address', index:'address', width: 80,
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
            formatter: formatRssi
        },
        {name:'TX', index:'TX', width: 60,
            xmlmap: function (obj) {
                return $(obj).attr('tx');
            },
            formatter: formatRssi
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

    xmlapiGetVersion();

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
            var value_list  = gridVariables.getCell(id, "value_list");
            var unit        = gridVariables.getCell(id, "unit");
            var type        = gridVariables.getCell(id, "type");
            var subtype     = gridVariables.getCell(id, "subtype");
            switch (subtype) {
                case 'Logikwert':
                    variableInput.html("<select id='variableValue'><option value='false'>False</option><option value='true'>True</option></select>");
                    $("#variableValue option[value='" + value + "']").attr("selected", true);
                    break;
                case 'Werteliste':
                    variableInput.html("<select id='variableValue'>" + selectOptions(value_list) + "</select>");
                    if (value == "true") { value = "1"; } else if (value == "false") { value = "0"; }
                    $("#variableValue option[value='" + value + "']").attr("selected", true);
                    break;
                default:
                    variableInput.html("<input type='text' id='variableValue' value='" + value + "'>" + unit);

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
        ondblClickRow: function (id) {
            programName.html(gridPrograms.getCell(id, "name"));
            programId.val(id);
            dialogRunProgram.dialog("open");
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
        width: hqConf["gridWidth"], height: hqConf["gridHeight"],
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
        }
    }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerStates", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerStates", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () { refreshStates(); },
            position: "first",
            title:"Neu laden",
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
        width: hqConf["gridWidth"],
        height: hqConf["gridHeight"],
        colNames:colNamesProtocol,
        colModel :colModelProtocol,
        pager: "#gridPagerProtocol",
        rowList: hqConf["gridRowList"], rowNum: hqConf["gridRowNum"], 
        viewrecords:    true,
        gridview:       true,
        caption:        'Systemprotokoll',
        datatype:       'xmlstring',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        data: {
        },
        sortable: true,
        ignoreCase: true,
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
        width: hqConf["gridWidth"],
        height: hqConf["gridHeight"],
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
        datatype: 'local'


    });

    gridScriptVariables.jqGrid({
        width: 343,
        height: 200,
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
    }).filterToolbar({defaultSearch: 'cn'});

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
            subGridRowExpanded: function (grid_id, row_id) { subGridDatapoint(grid_id, row_id); }
        });
    }

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


    /* Grid Data Handling */
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
                       $("#alarm").show();
                    } else {
                        $("#alarm").hide();
                    }

                }
                if (!programsReady) {
                    refreshPrograms();
                }
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshPrograms() {
        $("#loaderPrograms").show();
        programsReady = false;
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
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshStates() {
        $("#loaderStates").show();
        statesReady = false;
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
                        $("#service").show();
                    } else {
                        $("#serivce").hide();
                    }
                }
                if (!rssiReady) {
                    refreshRssi();
                }
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshProtocol() {
        $("#loaderProtocol").show();
        protocolReady = false;
        gridProtocol.setGridParam({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/protocol.cgi',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function () {
                protocolReady = true;
                $("#loaderProtocol").hide();
                if (!firstLoad) {
                    firstLoadFinished();
                }
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshRssi() {
        $("#loaderRssi").show();
        rssiReady = false;
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
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function buildFavorites() {
        favoritesXMLObj.find("favorite[name='" + hqConf["favoriteUsername"] + "'] channel").each(function () {
            var htmlContainer = "";
            var fav_id = $(this).attr("ise_id");
            var name = favoritesXMLObj.find("favorite[ise_id='" + fav_id + "']").attr("name")
            htmlContainer += "<h3>" + name + "</h3><div id='fav" + fav_id + "' class='favPane'></div>";
            $("div#accordionFavorites").prepend(htmlContainer);

            favoritesXMLObj.find("favorite[ise_id='" + fav_id + "'] channel").each(function () {
                var html = "";
                var channelName = $(this).attr("name");
                var channelId = $(this).attr("ise_id");

                html += "<div id='favItem" + channelId + "' class='favItem ui-helper-reset ui-widget ui-widget-content ui-corner-all'><div class='favName'>" + channelName + "</div></div>";
                $("div[id='fav" + fav_id + "']").append(html);
                html = "";
                switch ($(this).attr("type")) {
                    case 'SYSVAR':
                        $(this).find("systemVariable").each(function () {
                            var value = $(this).attr("value");
                            var var_id = $(this).attr("ise_id");
                            html += "<div class='favInput'>";


                            switch ($(this).attr("subtype")) {
                                case '2':
                                    html += "<select id='favInputSelect" + var_id + "'><option value='false'>False</option><option value='true'>True</option></select>";
                                    html += "</div>";

                                    $("div[id='favItem" + channelId + "']").append(html);
                                    $("#favInputSelect" + var_id + " option[value='" + value + "']").attr("selected", true);
                                    $("#favInputSelect" + var_id).change(function () {
                                        xmlapiSetState(var_id, $("#favInputSelect" + var_id + " option:selected").val());
                                    });

                                    break;
                                case '29':
                                    html += "<select id='favInputSelect" + var_id + "'>" + selectOptions($(this).attr("value_list")) + "</select>";
                                    if (value == "true") { value = "1"; } else if (value == "false") { value = "0"; }
                                    html += "</div>";
                                    $("div[id='favItem" + channelId + "']").append(html);
                                    $("#favInputSelect" + var_id + " option[value='" + value + "']").attr("selected", true);
                                    $("#favInputSelect" + var_id).change(function () {
                                        xmlapiSetState(var_id, $("#favInputSelect" + var_id + " option:selected").val());
                                    });
                                    break;
                                case '0':
                                    value = parseFloat(value);
                                    value = value.toFixed(2);
                                    html += "<input type='text' id='favInputText" + var_id + "' value='" + value + "'>";
                                    html += "</div>";
                                    $("div[id='favItem" + channelId + "']").append(html);
                                    $("#favInputText" + var_id).keyup(function(e) {
                                        if(e.keyCode == 13) {
                                            xmlapiSetState(var_id, $("#favInputText" + var_id).val());
                                        }
                                    });
                                    break;
                                default:
                                    html += "<input type='text' id='favInputText" + var_id + "' value='" + value + "'>";
                                    html += "</div>";
                                    $("div[id='favItem" + channelId + "']").append(html);
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
                        $("div[id='favItem" + channelId + "']").append(html);

                        $("button[id='favProgram"+ $(this).attr("ise_id") +"']").button({icons: { primary: "ui-icon-play" }}).click(function () {
                            xmlapiRunProgram($(this).attr("ise_id"));
                        });
                        break;
                    case 'CHANNEL':
                        var firstDP = true;

                        $("div[id='favItem" + channelId + "']").append("<div class='favInput'></div>");

                        $(this).find("datapoint").each(function () {

                            var name = $(this).attr("name").split(".");
                            var type = name[2];



                             var id = $(this).attr("ise_id");
                            html = "";
                            switch (type) {
                                case 'STATE':
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

                                    $("div[id='favItem" + channelId + "'] .favInput").append(html);

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
                                    break;
                                case 'LEVEL':
                                    var value = $(this).attr("value");
                                    html +=     "<div class='favInputSlider' id='favSlider" + id + "'>";
                                    html +=     "</div>";
                                    firstDP = false;

                                    $("div[id='favItem" + channelId + "'] .favInput").append(html);
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
                                case 'PRESS_SHORT':
                                case 'PRESS_LONG':
                                    html += "<button class='favKey' id='favPressKey"+ $(this).attr("ise_id") +"'><span style='font-size:0.7em;'>Taste " + (type == "PRESS_SHORT" ? "kurz": "lang") + "</span></button>";
                                    $("div[id='favItem" + channelId + "'] .favInput").append(html);
                                    $("button[id='favPressKey"+ $(this).attr("ise_id") +"']").button({icons: { primary: "ui-icon-arrow" + (type == "PRESS_LONG" ? "thick" : "") + "stop-1-s" }}).click(function () {
                                        xmlapiSetState($(this).attr("ise_id"), "true");
                                    });


                                    break;
                                case 'ERROR':
                                case 'OLD_LEVEL':
                                case 'RAMP_TIME':
                                    // TODO
                                    break;

                                default:
                                    var value = $(this).attr("value");
                                    if (!firstDP) { html += "<br>"; } else { firstDP = false; }
                                    if (type == "TEMPERATURE") {
                                        value = parseFloat(value);
                                        value = value.toFixed(1) + "°C";
                                    }
                                    if (type == "HUMIDITY") {
                                        value = parseFloat(value);
                                        value = value.toFixed(0) + "%";
                                    }
                                    html += "<span class='unknownType'>" + type + ": " + value + "</span>";
                                    $("div[id='favItem" + channelId + "'] .favInput").append(html);


                            }





                        });



                        break;
                    default:

                }

            });



        });
        $(".favInputRadio").buttonset();
        $(".favKey").button();
        $("div#accordionFavorites").accordion({ heightStyle: "content" });

    }




    /* Buttons, Dialoge */
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
            'Ok': function () {
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
    dialogSelectTheme.dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
                $(this).dialog('close');
                changeTheme($("#selectUiTheme").val());
            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }
    });

    $("#dialogDebugScript").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Schliessen': function () {

                $(this).dialog('close');
                $("#debugScript").html("");

            }
        }
    });


    $("#dialogDeleteScript").dialog({

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

    $("button#hmNewScript").click(function () {
         var new_file= {id: formatTimestamp(), text: "\n\n\n\n\n", syntax: 'hmscript'};
         editAreaLoader.openFile('hmScript', new_file);
    });

    $("button#hmRunScript").click(function () {
        gridScriptVariables.jqGrid('clearGridData');
        $("div#hmScriptStdout").html("");
        var script = editAreaLoader.getValue("hmScript");
        var debugScript = script + "\n" + "var hqDebugDummy=1;";

        var debugVar;
        /*
         var scriptLine = script.split("\n");
         for (var i = 1; i <= scriptLine.length; i++) {
         debugScript += scriptLine[i-1] + "\n";
         var counter = i.toString(10);
         for (var j = counter.length; j < 5; j++) {
         counter = "0" + counter;
         }
         debugVar = "hqDebugDummy" + counter;
         debugScript += "var " + debugVar + " = 1;\n";

         }*/
        hmRunScript(debugScript, function (data) {
            var scriptFailed = false;
            var dummyFound = false;
            var lineNumber = 0;
            $.each(data, function(key, value) {
                switch (key) {
                    case 'STDOUT':
                        $("div#hmScriptStdout").html(value);
                        break;
                    case 'httpUserAgent':
                    case 'sessionId':
                        break;
                    default:
                        if (!key.match("hqDebugDummy")) {
                            gridScriptVariables.jqGrid('addRowData', key, {'variable': key, 'value': value});
                        } else {
                            dummyFound = true;
                            if (value == "null") {
                                scriptFailed = true;

                            }
                        }
                }
            });
            if (!scriptFailed && dummyFound) {
                $("#debugScript").html("Scriptausführung erfolgreich.");
                $("#dialogDebugScript").dialog('open');
            } else {

                $.ajax({
                    url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + "/scripterrors.cgi",
                    type: 'GET',
                    success: function (data) {
                        var error = $(data).find("error:last");
                        $("#debugScript").html(error.attr("timestamp") + " " + error.attr("msg") + " in Zeile " + error.attr("row"));
                        $("#dialogDebugScript").dialog('open');


                    }
                })

            }
            $("#loaderScript").hide();
        });
    });

    /*   XML-API */
    function xmlapiClearProtocol() {
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + "/protocol.cgi",
            type: "GET",
            data: {
                clear: 1
            },
            success: function () {
                refreshProtocol();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiRunProgram(program_id) {
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/runprogram.cgi',
            type: 'GET',
            data: {
                program_id: program_id
            },
            success: function (data) {
                refreshPrograms();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiSetState(ise_id, new_value, successFunction) {
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/statechange.cgi',
            type: 'GET',
            data: {
                ise_id: ise_id,
                new_value: new_value
            },
            success: function (data) { if (successFunction !== undefined) { successFunction(data); } },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
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
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/state.cgi',
            type: 'GET',
            async: false,
            data: {
                datapoint_id: ise_id
            },
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
       $.ajax({
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
        });
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
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/devicelist.cgi',
            type: 'GET',
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
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/functionlist.cgi',
            type: 'GET',
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
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/roomlist.cgi',
            type: 'GET',
            dataType: 'xml',
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
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/favoritelist.cgi?show_datapoint=1',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                favoritesReady = true;
                favoritesXML = data;
                favoritesXMLObj = $(data);
                buildFavorites();
                $("#loaderFavorites").hide();
                refreshVariables();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#loaderFavorites").hide();
                ajaxError(xhr, ajaxOptions, thrownError);
            }
        });
    }

    function xmlapiGetVersion() {
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + '/version.cgi',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                xmlapiVersion = $(data).text();
                gridInfo.jqGrid('addRowData', "HQ WebUI Version", {'key': "HQ WebUI Version", 'value': version});
                gridInfo.jqGrid('addRowData', "XML-API Version", {'key': "XML-API Version", 'value': xmlapiVersion});
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function hmRunScript (script, successFunction) {
        $("#loaderScript").show();
        $.ajax({
            url: hqConf["ccuUrl"] + hqConf["xmlapiPath"] + "/exec.cgi",
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



    /* Misc */
    function addInfo(key, value) {
        gridInfo.jqGrid('addRowData', key, {'key': key, 'value': value});
    }

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
        if (timestamp == 0) {
            return "";
        }
        var dateObj = new Date();
        if (timestamp != undefined) {
            dateObj.setTime(timestamp + "000");
        }
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
        if (timestamp == undefined) {
            return dateObj.getFullYear() + "-" + month + "-" + day + "_" + hour + "-" + minute + "-" + second;
        } else {
            return dateObj.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        }
    }

    function changeTheme(theme) {
        storage.set('hqWebUiTheme', theme);
        $("#theme").attr("href", hqConf["themeUrl"] + theme + hqConf["themeSuffix"]);
        setTimeout("scriptEditorStyle",1500);
    }

    function getTheme() {
        var theme = storage.get("hqWebUiTheme");
        if (theme === null) { theme = hqConf["defaultTheme"]; }
         $("#theme").attr("href", hqConf["themeUrl"] + theme + hqConf["themeSuffix"]);
    }

    var editAreaInit = {
        id: "hmScript",
        start_highlight: true,
        is_multi_files: true,
        word_wrap: true,
        font_size: "10",
        allow_resize: "no",
        allow_toggle: false,
        display: "onload",
        language: "de",
        syntax: "hmscript",
        replace_tab_by_spaces: 4,
        min_height: 565,
        min_width: 640,
        toolbar: "search, go_to_line, fullscreen, |, undo, redo, |, select_font,|, reset_highlight ,|, autocompletion",
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




    $("a.ui-jqgrid-titlebar-close").hide();

});

function scriptFileClose(file) {
 // Todo - Prüfen warum closeFile() im Dialog dialogDeleteScript nicht funktioniert
 //   $("#scriptDeleteReally").html(file["id"]);
 //   $("#dialogDeleteScript").dialog("open");
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


var scriptSaveTimer;
function scriptChange() {
    clearTimeout(scriptSaveTimer);
    scriptSaveTimer = setTimeout(function () {
        $("button#hmSaveScript").trigger("click");
    }, 1000);
}

function scriptEditorReady() {
    scriptEditorStyle();

    // Gespeicherte Scripte laden
    var scripts = JSON.parse(storage.get('hqWebUiScripts'));
    for (var key in scripts) {
        var new_file= {id: key, text: scripts[key], syntax: 'hmscript'};
        editAreaLoader.openFile('hmScript', new_file);
    }

}

function scriptEditorStyle() {
    // Umstylen... Pfusch...
    $("#frame_hmScript").contents().find("#toolbar_1").css("background-color", $(".ui-jqgrid-titlebar").css("background-color"));
    $("#frame_hmScript").contents().find("#toolbar_1").css("background", $(".ui-jqgrid-titlebar").css("background"));
    $("#frame_hmScript").contents().find("#toolbar_1").css("color", $(".ui-jqgrid-titlebar").css("color"));
    $("#frame_hmScript").contents().find("#toolbar_2").css("background-color", $(".ui-jqgrid-titlebar").css("background-color"));
    $("#frame_hmScript").contents().find("#toolbar_2").css("background", $(".ui-jqgrid-titlebar").css("background"));
    $("#frame_hmScript").contents().find("#toolbar_2").css("color", $(".ui-jqgrid-titlebar").css("color"));
    $("#frame_hmScript").contents().find("#tab_browsing_area").css("background-color", $("#gridScriptVariables_variable").css("background-color"));
    $("#frame_hmScript").contents().find("#tab_browsing_area").css("background", $("#gridScriptVariables_variable").css("background"));
    $("#frame_hmScript").contents().find("#tab_browsing_area").css("color", $("#gridScriptVariables_variable").css("color"));

}

function scriptEditorSave() {
    alert("save");
}

function scriptEditorNew() {
    alert("new");
}
function scriptEditorLoad() {
    alert("load");
}
