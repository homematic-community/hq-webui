/**
 *      HQ WebUI
 *
 *      Version 1.3.0
 *
 *      https://github.com/hobbyquaker/hq-webui/
 *
 */

$("document").ready(function () {

    // Hier die URL der CCU eintragen (z.B.: 'http://172.16.23.3')
    var ccuUrl = '';
    // Wird das HQ WebUI auf der CCU installiert kann diese Variable leer bleiben ('')

    // Der User dessen Favoriten angezeigt werden
    var favoriteUsername = "_USER1004";

    // Hier können verschiedene Optionen für alle Grids vorgegeben werden
    var gridWidth =             1024;
    var gridHeight =            490;
    var gridRowList =           [20,50,100,500];    // Auswahl Anzahl angezeigter Einträge
    var gridRowNum =            100;                // Standardmäßige Anzahl angezeigter Einträge

    var version =               "1.3.0";

    var statesXML,
        variablesXML,
        programsXML,
        rssiXML,
        functionsXML,
        roomsXML,
        devicesXML,
        favoritesXML,
        statesXMLObj,
        variablesXMLObj,
        programsXMLObj,
        rssiXMLObj,
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



    $("ul.tabsPanel li a img").hide();
    $("#tabs").tabs();
    $("button").button();

    $("ul.tabsPanel").append("<button style='float:right' id='buttonSelectTheme'>Theme</button> ");
    $("#buttonSelectTheme").button().click(function () {
       dialogSelectTheme.dialog("open");
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
            }
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
        {name:"valuetype",   index:"valuetype",   width:80,// hidden: true,
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
            }
        },
        {name:'TX', index:'TX', width: 60,
            xmlmap: function (obj) {
                return $(obj).attr('tx');
            }
        },
        {name:'aes', index:'aes', width: 60,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var aes = devicesXMLObj.find("device[address='" + device + "'] channel:first").attr("aes_available");

                return aes;
            }
        },
        {name:'mode', index:'mode', width: 60,
            xmlmap: function (obj) {
                var device = $(obj).attr("device");
                var mode = devicesXMLObj.find("device[address='" + device + "'] channel:first").attr("transmission_mode");
                if (mode == "AES") {
                    mode = '<span style="display:inline-block; align:bottom" class="ui-icon ui-icon-locked"></span> <span style="position:relative; top: -3px;">' + mode + '</span>';
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
        width: gridWidth, height: gridHeight,
        colNames: colNamesVariables,
        colModel: colModelVariables,
        pager: "#gridPagerVariables",
        rowList: gridRowList, rowNum: gridRowNum, 
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
        width: gridWidth, height: gridHeight,
        colNames: colNamesPrograms,
        colModel: colModelPrograms,
        pager: "#gridPagerPrograms",
        rowList: gridRowList, rowNum: gridRowNum, 
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
        width: gridWidth, height: gridHeight,
        colNames:colNamesStates,
        colModel :colModelStates,
        pager: "#gridPagerStates",
        rowList: gridRowList, rowNum: gridRowNum, 
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
        width: gridWidth, height: gridHeight,
        colNames:colNamesRssi,
        colModel :colModelRssi,
        pager: "#gridPagerRssi",
        rowList: gridRowList, rowNum: gridRowNum, 
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
        width: gridWidth,
        height: gridHeight,
        colNames:colNamesProtocol,
        colModel :colModelProtocol,
        pager: "#gridPagerProtocol",
        rowList: gridRowList, rowNum: gridRowNum, 
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
        width: gridWidth,
        height: gridHeight,
        colNames: ['',''],
        colModel: [
            {name: 'key', index:'key', width:120, sortable: false},
            {name: 'value', index: 'value', width: 600, sortable: false}
        ],
        rowNum: 10000,
        viewrecords:    true,
        gridview:       true,
        caption:        'Info',
        ignoreCase: true,


    });

    gridScriptVariables.jqGrid({
        width: 343,
        height: 200,
        colNames:['Variable', 'Wert'],
        colModel:[
            {name:'variable', index:'variable', width: 80},
            {name: 'value', index: 'value', width: 200}
        ],
        rowNum:         10000,
        viewrecords:    true,
        gridview:       true,
        caption:        'Variablen',
        datatype:       'json',
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
            rowNum:10000,
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
        variablesReady = false;
        gridVariables.setGridParam({
            url: ccuUrl + '/config/xmlapi/sysvarlist.cgi?text=true',
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
            url: ccuUrl + '/config/xmlapi/programlist.cgi',
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
            url: ccuUrl + '/config/xmlapi/statelist.cgi',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function(data) {
                if (data.nodeType) {
                    statesReady = true;
                    statesXML = data;
                    statesXMLObj = $(data);
                    $("#loaderStates").hide();
                    addInfo("Anzahl Datenpunkte", statesXMLObj.find("datapoint").length);
                    addInfo("Anzahl Kanäle", statesXMLObj.find("channel").length);
                    addInfo("Anzahl Geräte", statesXMLObj.find("device").length);
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
            url: ccuUrl + '/config/xmlapi/protocol.cgi',
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
            url: ccuUrl + '/config/xmlapi/rssilist.cgi',
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
        favoritesXMLObj.find("favorite[name='" + favoriteUsername + "'] channel").each(function () {
            var htmlContainer = "";
            var fav_id = $(this).attr("ise_id");
            var name = favoritesXMLObj.find("favorite[ise_id='" + fav_id + "']").attr("name")
            htmlContainer += "<h3>" + name + "</h3><div id='fav" + fav_id + "'></div>";
            $("div#accordionFavorites").append(htmlContainer);

            favoritesXMLObj.find("favorite[ise_id='" + fav_id + "'] channel").each(function () {
                var html = "";
                var channelName = $(this).attr("name");
                var channelId = $(this).attr("ise_id");
                html += "<div id='favItem" + channelId + "' class='favItem ui-helper-reset ui-widget ui-widget-content ui-corner-all'><div class='favName'>" + channelName + "</div></div>";
                $("div[id='fav" + fav_id + "']").append(html);
                html = "";
                console.log($(this));
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
                                default:
                                    html += "<input type='text' id='favInputText" + var_id + "' value='" + value + "'>";
                                    html += "</div>";
                                    $("div[id='favItem" + channelId + "']").append(html);
                                    $("#favInputText" + var_id).eyup(function(e) {
                                        if(e.keyCode == 13) {
                                            xmlapiSetState(var_id, $("#favInputText" + var_id).val());
                                        }
                                    });


                            }


                        });



                        break;
                    case 'PROGRAM':
                        html += "<br>" + $(this).attr("ise_id") + "<br>";
                        $("div[id='favItem" + channelId + "']").append(html);
                        break;
                    case 'CHANNEL':
                        console.log("channel!");
                        var firstDP = true;
                        $(this).find("datapoint").each(function () {

                            var name = $(this).attr("name").split(".");
                            var type = name[2];


                            if (!firstDP) {
                                $("div[id='favItem" + channelId + "']").append("<div style='width: 100%; height: 1px; clear:both; height: 43px;'><br>");
                            } else {
                                firstDP = false;
                            }

                             var id = $(this).attr("ise_id");

                            switch (type) {
                                case 'STATE':
                                    var checkedOn = "";
                                    var checkedOff = "";
                                    if ($(this).attr("value") == "true") {
                                        checkedOn = " checked='checked'";
                                    } else {
                                        checkedOff = " checked='checked'";
                                    }
                                    html += "<div class='favInput'>";
                                    html +=     "<div class='favInputRadio' id='favRadio" + id + "'>";
                                    html +=         "<input id='favRadioOff" + id + "' type='radio' name='favRadio" + id + "'" + checkedOff + ">";
                                    html +=         "<label for='favRadioOff" + id + "'>Aus</label>";
                                    html +=         "<input id='favRadioOn" + id + "' type='radio' name='favRadio" + id + "'" + checkedOn + ">";
                                    html +=         "<label for='favRadioOn" + id + "'>An</label>";
                                    html +=     "</div>";
                                    html += "</div>";
                                    $("div[id='favItem" + channelId + "']").append(html);

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
                                    html += "<div class='favInput'>";
                                    html +=     "<div class='favInputSlider' id='favSlider" + id + "'>";
                                    html +=     "</div>";
                                    html += "</div>";
                                    $("div[id='favItem" + channelId + "']").append(html);
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
                                    // TODO
                                    break;
                                case 'PRESS_LONG':
                                    // TODO
                                    break;
                                default:

                            }





                        });



                        break;
                    default:

                }

            });



        });
        $(".favInputRadio").buttonset();

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

    $("button#hmRunScript").click(function () {
        gridScriptVariables.jqGrid('clearGridData');
        hmRunScript($("textarea#hmScript").val(), function (data) {
            $.each(data, function(key, value) {
                switch (key) {
                    case 'STDOUT':
                        $("textarea#hmScriptStdout").val(value);
                        break;
                    case 'httpUserAgent':
                    case 'sessionId':
                        break;
                    default:
                        gridScriptVariables.jqGrid('addRowData', key, {'variable': key, 'value': value});

                }
            });
            $("#loaderScript").hide();
        });
    });


    /*   XML-API */
    function xmlapiClearProtocol() {
        $.ajax({
            url: ccuUrl + "/config/xmlapi/protocol.cgi",
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
            url: ccuUrl + '/config/xmlapi/runprogram.cgi',
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
            url: ccuUrl + '/config/xmlapi/statechange.cgi',
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
            url: ccuUrl + '/config/xmlapi/state.cgi',
            type: 'GET',
            async: false,
            data: {
                datapoint_id: ise_id
            },
            success: function (data) {
               // $("#" + grid_id).find("tr#" + ise_id + " td[aria-describedby$='value']").html($(data).text());
                $("tr#" + ise_id + " td[aria-describedby$='value']").each(function () {
                    $(this).html($(data).text());
                });
                // Todo - neuen Wert in statesXML schreiben!
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetVariable(ise_id) {
       $.ajax({
            url: ccuUrl + '/config/xmlapi/sysvar.cgi',
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
        $.ajax({
            url: ccuUrl + '/config/xmlapi/devicelist.cgi',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                devicesReady = true;
                devicesXML = data;
                devicesXMLObj = $(data);
                refreshStates();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetFunctions() {
        $("#loaderStates").show();
        $.ajax({
            url: ccuUrl + '/config/xmlapi/functionlist.cgi',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                functionsReady = true;
                functionsXML = data;
                functionsXMLObj = $(data);
                xmlapiGetRooms();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetRooms() {
        $.ajax({
            url: ccuUrl + '/config/xmlapi/roomlist.cgi',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                roomsReady = true;
                roomsXML = data;
                roomsXMLObj = $(data);
                xmlapiGetDevices();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetFavorites() {
        $("#loaderFavorites").show();
        $.ajax({
            url: ccuUrl + '/config/xmlapi/favoritelist.cgi?show_datapoint=1',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                refreshVariables();
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
            url: ccuUrl + '/config/xmlapi/version.cgi',
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
            url: ccuUrl + "/config/xmlapi/exec.cgi",
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
        var dateObj = new Date();
        dateObj.setTime(timestamp + "000");
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
        return dateObj.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    function changeTheme(theme) {
        // Prüfen ob Theme in uiThemes enthalten ist!
        $("#theme").attr("href", "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/" + theme + "/jquery-ui.css");
    }

});