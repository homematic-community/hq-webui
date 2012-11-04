/**
 *      HQ WebUI
 *
 *      Version 1.2.2
 *
 *      11'2012 hobbyquaker hobbyquaker@gmail.com
 *
 */

$("document").ready(function () {

    // Hier die URL der CCU eintragen (z.B.: 'http://172.16.23.3')
    var ccuUrl = 'http://172.16.23.3';
    // Wird das HQ WebUI auf der CCU installiert kann diese Variable leer bleiben ('')

    // Hier können verschiedene Optionen für alle Grids vorgegeben werden
    var gridWidth =             1024;
    var gridHeight =            490;
    var gridRowList =           [20,50,100,500];


    var statesXML;
    var variablesXML;
    var programsXML;
    var rssiXML;
    var functionsXML;
    var roomsXML;

    var statesReady =           false;
    var variablesReady =        false;
    var programsReady =         false;
    var protocolReady =         false;
    var functionsReady =        false;
    var roomsReady =            false;
    var rssiReady =             false;
    var firstLoad =             false;
    var xmlapiVersion;

    var gridVariables =         $("#gridVariables");
    var gridPrograms =          $("#gridPrograms");
    var gridRooms =             $("#gridRooms");
    var gridFunctions =         $("#gridFunctions");
    var gridStates =            $("#gridStates");
    var gridProtocol =          $("#gridProtocol");

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

    $("#tabs").tabs();

    /*
     *          Grids
     */
    gridVariables.jqGrid({
        width: gridWidth, height: gridHeight,
        colNames:[
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
        ],
        colModel :[
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
        ],
        pager: "#gridPagerVariables",
        rowList: gridRowList,
        viewrecords:    true,
        gridview:       true,
        caption:        'Variablen',
        url: ccuUrl + '/config/xmlapi/sysvarlist.cgi?text=true',
        datatype:       'xml',
        mtype:          'GET',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        data: {
        },
        ignoreCase: true,
        sortable: true,
        xmlReader : {
            root: "systemVariables",
            row: "systemVariable",
            id: "[ise_id]",
            repeatitems: false
        },
        loadComplete: function(data) {
            if (data.nodeType) {
                variablesReady = true;
                variablesXML = data;
            }
            refreshPrograms();
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
        colNames:[
            'id',
            'Name',
            'Beschreibung',
            'Aktiv',
            'Zeitstempel'
        ],
        colModel :[
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
        ],
        pager: "#gridPagerPrograms",
        rowList: gridRowList,
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

    gridRooms.jqGrid({
        width: gridWidth, height: gridHeight,
        colNames:[
            'name',
            'ise_id'
        ],
        colModel :[
            {name:'name', index:'name', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('name');
                }
            },
            {name:'ise_id', index:'ise_id', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('ise_id');
                }
            }
        ],
        pager: "#gridPagerRooms",
        rowList: gridRowList,
        viewrecords:    true,
        gridview:       true,
        caption:        'Räume',
        datatype:       'xmlstring',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        data: {
        },
        ignoreCase: true,
        sortable: true,
        xmlReader : {
            root: "roomList",
            row: "room",
            id: "[ise_id]",
            repeatitems: false
        },
        ondblClickRow: function (id) {

        },
        subGrid: true,
        subGridRowExpanded: function(grid_id, row_id) {
            var subgrid_table_id = grid_id + "_t";
            $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");
            $("#" + subgrid_table_id).jqGrid( {
                width: 1000,
                colNames: [
                    'Channel Name',
                    'ise_id',
                    'address',
                    '',
                    '',
                    ''
                ],
                datatype:'xmlstring',
                datastr: roomsXML,
                colModel: [
                    {name:"name",   index:"name",   width:190,
                        xmlmap: function (obj) {
                            return $(statesXML).find("channel[ise_id='" + $(obj).attr('ise_id') + "']").attr('name');
                        }
                    },
                    {name:"ise_id",   index:"ise_id",   width:86,
                        xmlmap: function (obj) {
                            return $(obj).attr('ise_id');
                        }
                    },
                    {name:"address",   index:"address",   width:86,
                        xmlmap: function (obj) {
                            return $(obj).attr('address');
                        }
                    },
                    {name:"dummy2", index:"dummy2",   width:80},
                    {name:"dummy3", index:"dummy3",   width:80},
                    {name:"dummy4", index:"dummy4",   width:80}
                ],
                xmlReader: {
                    root:"roomList>room[ise_id='" + row_id + "']",
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
    }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerRooms", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerRooms", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () { refreshRooms(); },
            position: "first",
            title:"Neu laden",
            cursor: "pointer"
        });

    gridFunctions.jqGrid({
        width: gridWidth, height: gridHeight,
        colNames:[
            'name',
            'ise_id'
        ],
        colModel :[
            {name:'name', index:'name', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('name');
                }
            },
            {name:'ise_id', index:'ise_id', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('ise_id');
                }
            }
        ],
        pager: "#gridPagerFunctions",
        rowList: gridRowList,
        viewrecords:    true,
        gridview:       true,
        caption:        'Gewerke',
        datatype:       'xmlstring',
        loadonce:       true,
        loadError:      function (xhr, status, error) { ajaxError(xhr, status, error) },
        data: {
        },
        ignoreCase: true,
        sortable: true,
        xmlReader : {
            root: "functionList",
            row: "function",
            id: "[ise_id]",
            repeatitems: false
        },
        ondblClickRow: function (id) {

        },
        subGrid: true,
        subGridRowExpanded: function(grid_id, row_id) {
            var subgrid_table_id = grid_id + "_t";
            $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");
            $("#" + subgrid_table_id).jqGrid( {
                width: 1000,
                colNames: [
                    'Channel Name',
                    'ise_id',
                    'address',
                    '',
                    '',
                    ''
                ],
                datatype:'xmlstring',
                datastr: functionsXML,
                colModel: [
                    {name:"name",   index:"name",   width:190,
                        xmlmap: function (obj) {
                            return $(statesXML).find("channel[ise_id='" + $(obj).attr('ise_id') + "']").attr('name');
                        }
                    },
                    {name:"ise_id",   index:"ise_id",   width:86,
                        xmlmap: function (obj) {
                            return $(obj).attr('ise_id');
                        }
                    },
                    {name:"address",   index:"address",   width:86,
                        xmlmap: function (obj) {
                            return $(obj).attr('address');
                        }
                    },
                    {name:"dummy2", index:"dummy2",   width:80},
                    {name:"dummy3", index:"dummy3",   width:80},
                    {name:"dummy4", index:"dummy4",   width:80}
                ],
                xmlReader: {
                    root:"functionList>function[ise_id='" + row_id + "']",
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


            }).filterToolbar({defaultSearch: 'cn'}).jqGrid(
        'navGrid',
        "#gridPagerFunctions", { edit: false, add: false, del: false, search: false, refresh: false }).jqGrid(
        'navButtonAdd',
        "#gridPagerFunctions", {
            caption:"",
            buttonicon:"ui-icon-refresh",
            onClickButton: function () { refreshFunctions(); },
            position: "first",
            title:"Neu laden",
            cursor: "pointer"
        });

    gridStates.jqGrid({
        width: gridWidth, height: gridHeight,
        colNames:[
            'ise_id',
            'Name',
            'Adresse',
            'Räume',
            'Gewerke',
            'unreach',
            'sticky_unreach',
            'config_pending',
            'Servicemeldungen'
        ],
        colModel :[
            {name:'ise_id', index:'ise_id', align: 'right', width: 90, fixed: true,
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
            {name:'address', index:'address', width: 157, fixed: true,
                xmlmap: function (obj) {
                    return $(obj).attr('address');
                }
            },
            {name:'rooms', index:'rooms', width: 157, fixed: true,
                xmlmap: function (obj) {
                    return "";
                }
            },
            {name:'functions', index:'functions', width: 158, fixed: true,
                xmlmap: function (obj) {
                    return ""
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
            {name:'service', index:'service', width: 158, fixed: true,
                xmlmap: function (obj) {
                    return "";
                }
            }
        ],
        pager: "#gridPagerStates",
        rowList: gridRowList,
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
            var subgrid_table_id = grid_id + "_t";
            $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");
            $("#" + subgrid_table_id).jqGrid( {
                colNames: [
                    '',
                    'Kanal Name',
                    '',
                    '',
                    ''
                ],
                datatype:'xmlstring',
                datastr: statesXML,
                colModel: [
                    {name:"ise_id", align: 'right', index:"ise_id",   width:58, fixed: true,
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
                    {name:"address",   index:"address",   width:157, fixed: true,
                        xmlmap: function (obj) {
                            return $(obj).attr('address');
                        }
                    },
                    {name:"rooms", index:"rooms",   width:157, fixed: true,
                        xmlmap: function (obj) {
                            var output = "";
                            $(roomsXML).find("channel[ise_id='" + $(obj).attr('ise_id') + "']").each(function () {
                                if (output == "") {
                                    output = $(this).parent().attr("name");
                                } else {
                                    output += ", " + $(this).parent().attr("name");
                                }
                            });
                            return output;

                        }
                    },
                    {name:"functions", index:"functions",   width:158, fixed: true,
                        xmlmap: function (obj) {
                            return $(functionsXML).find("channel[ise_id='" + $(obj).attr('ise_id') + "']").parent().attr("name");
                        }
                    }
                ],
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

    gridProtocol.jqGrid({
        width: gridWidth,
        height: gridHeight,
        colNames:[
            'Datum Uhrzeit',
            'Sender',
            'Nachricht'
        ],
        colModel :[
            {name:'datetime', index:'datetime', width: 200,
                xmlmap: function (obj) {
                    return $(obj).attr('datetime');
                }
            },
            {name:'sender', index:'sender', width: 300,
                xmlmap: function (obj) {
                    return $(obj).attr('names');
                }
            },
            {name:'msg', index:'msg', width: 400,
                xmlmap: function (obj) {
                    return $(obj).attr('values');
                }
            }
        ],
        pager: "#gridPagerProtocol",
        rowList: gridRowList,
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



/*  $("#gridDevices").jqGrid({
        width: gridWidth,
        height: 480,
        colNames:[
            'Name',
            'Adresse',
            'ise_id',
            'interface',
            'device_type',
            'ready_config'
        ],
        colModel :[
            {name:'name', index:'name', width: 200,
                xmlmap: function (obj) {
                    return $(obj).attr('name');
                }
            },
            {name:'address', index:'address', width: 80,
                xmlmap: function (obj) {
                    return $(obj).attr('address');
                }
            },
            {name:'ise_id', index:'ise_id', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('ise_id');
                }
            },
            {name:'interface', index:'interface', width: 100,
                xmlmap: function (obj) {
                    return $(obj).attr('interface');
                }
            },
            {name:'device_type', index:'device_type', width: 100,
                xmlmap: function (obj) {
                    return $(obj).attr('device_type');
                }
            },
            {name:'ready_config', index:'ready_config', width: 60,
                xmlmap: function (obj) {
                    return $(obj).attr('ready_config');
                }
            }
        ],
        pager: "#gridPagerDevices",
        viewrecords:    true,
        gridview:       true,
        caption:        'Geräte',
        loadonce:       true,
        datatype:       'xml',
        mtype:          'GET',
        data: {
        },
        xmlReader : {
            root: "deviceList",
            row: "device",
            id: "[ise_id]",
            repeatitems: false
        },
        loadComplete: function(data) {
            if (data.nodeType) {
                devicesXML = data;
            }
        },
        subGrid: true,
        subGridRowExpanded: function(grid_id, row_id) {
            var subgrid_table_id = grid_id + "_t";
            $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");
            $("#" + subgrid_table_id).jqGrid( {
                colNames: [
                    'Channel Name',
                    'ise_id',
                    'address',
                    'ise_id',
                    'direction',
                    'parent_device',
                    'index',
                    'group_partner',
                    'aes_available',
                    'transmission_mode',
                    'visible',
                    'ready_config'
                ],
                datatype:'xmlstring',
                //datastr: "<deviceList><device ise_id='1819'><channel name='name1'></channel><channel name='name2'></channel></device></deviceList>",
                datastr: devicesXML,
                colModel: [
                    {name:"name",   index:"name",   width:200, xmlmap: function (obj) {
                        return $(obj).attr('name');
                    }},
                    {name:"type",   index:"type",   width:40, xmlmap: function (obj) {
                        return $(obj).attr('type');
                    }},
                    {name:"address",   index:"address",   width:80, xmlmap: function (obj) {
                        return $(obj).attr('address');
                    }},
                    {name:"ise_id",   index:"ise_id",   width:40, xmlmap: function (obj) {
                        return $(obj).attr('ise_id');
                    }},
                    {name:"direction",   index:"direction",   width:80, xmlmap: function (obj) {
                        return $(obj).attr('direction');
                    }},
                    {name:"parent_device",   index:"parent_device",   width:80, xmlmap: function (obj) {
                        return $(obj).attr('parent_device');
                    }},
                    {name:"index",   index:"index",   width:40, xmlmap: function (obj) {
                        return $(obj).attr('index');
                    }},
                    {name:"group_partner",   index:"group_partner",   width:80, xmlmap: function (obj) {
                        return $(obj).attr('group_partner');
                    }},
                    {name:"aes_available",   index:"aes_available",   width:80, xmlmap: function (obj) {
                        return $(obj).attr('aes_available');
                    }},
                    {name:"transmission_mode",   index:"transmission_mode",   width:80, xmlmap: function (obj) {
                        return $(obj).attr('transmission_mode');
                    }},
                    {name:"visible",   index:"visible",   width:50, xmlmap: function (obj) {
                        return $(obj).attr('visible');
                    }},
                    {name:"ready_config",   index:"ready_config",   width:50, xmlmap: function (obj) {
                        return $(obj).attr('ready_config');
                    }},

                ],
                xmlReader: {
                    root:"deviceList>device[ise_id='" + row_id + "']",
                    row:"channel",
                    repeatitems: false
                },
                gridview:true,
                height: "100%",
                rowNum:1000
            });
        }
    });
    */


    /*
    *           Dialoge
    */
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


    /*
     *          XML-API
     */
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
            success: function (data) { successFunction(data); },
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
                datapoint_id: ise_id,
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

    function xmlapiGetVersion() {
        $.ajax({
            url: ccuUrl + '/config/xmlapi/version.cgi',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                xmlapiVersion = $(data).text();
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }

    function xmlapiGetFunctions() {
        $.ajax({
            url: ccuUrl + '/config/xmlapi/functionlist.cgi',
            type: 'GET',
            dataType: 'xml',
            success: function (data) {
                functionsXML = $(data);
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
                roomsXML = $(data);
                roomsXML.find("room").each(function () {
                    console.log("room " + $(this).attr("name"));
                });

            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxError(xhr, ajaxOptions, thrownError); }
        });
    }


    /*
     *          Grid Data Handling
     */
    function subGridDatapoint(grid_id, row_id) {
        var subgrid_table_id = grid_id + "_t";
        $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");
        $("#" + subgrid_table_id).jqGrid( {
            colNames: [
                '',
                'Datenpunkt Name',
                'Typ',
                'Wert',
                'Wertetyp',
                'Zeitstempel'
            ],
            datatype:'xmlstring',
            datastr: statesXML,
            colModel: [
                {name:"ise_id", index:"ise_id", align: 'right', width:56, fixed: true,
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
                {name:"value",   index:"value",   width:157, fixed: true,
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
                {name:"timestamp",   index:"timestamp",   width:157, fixed: true,
                    xmlmap: function (obj) {
                        return formatTimestamp($(obj).attr('timestamp'));
                    }
                }
            ],
            xmlReader: {
                root:"stateList>device>channel[ise_id='" + row_id + "']",
                row:"datapoint",
                id:"[ise_id]",
                repeatitems: false
            },
            gridview:true,
            height: "100%",
            rowNum:1000,
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
                    default:
                        datapointInput.html("<input type='text' id='datapointValue' value='" + value + "'>");

                }
                dialogEditDatapoint.dialog("open");
            }
        });
    }

    function firstLoadFinished() {
        firstLoad = true;
        gridVariables.setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    variablesXML = data;
                    variablesReady = true;
                }
            }
        });
        gridPrograms.setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    programsXML = data;
                    programsReady = true;
                }
            }
        });
        gridRooms.setGridParam({
            loadComplete: function (data) {
                roomsXML = data;
                roomsReady = true;
            }
        });
        gridFunctions.setGridParam({
            loadComplete: function (data) {
                functionsXML = data;
                functionsReady = true;
            }
        });
        gridStates.setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    statesXML = data;
                    statesReady = true;
                }
            }
        });
        gridProtocol.setGridParam({
            loadComplete: function () {
                protocolReady = true;
            }
        });

    }

    function refreshVariables() {
        variablesReady = false;
        gridVariables.setGridParam({
            url: ccuUrl + '/config/xmlapi/sysvarlist.cgi?text=true',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshPrograms() {
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
                }
                refreshFunctions();

            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

  /*  function refreshDevices() {

        $("#gridDevices").setGridParam({
            url:            ccuUrl + '/config/xmlapi/devicelist.cgi',
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    } */

    function refreshRooms () {
        roomsReady = false;
        gridRooms.setGridParam({
            url: ccuUrl + '/config/xmlapi/roomlist.cgi',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function(data) {
                if (data.nodeType) {
                    roomsReady = true;
                    roomsXML = data;
                }
                refreshStates();
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshFunctions () {
        roomsReady = false;
        gridFunctions.setGridParam({
            url: ccuUrl + '/config/xmlapi/functionlist.cgi',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function(data) {
                if (data.nodeType) {
                    functionsReady = true;
                    functionsXML = data;
                }
                refreshRooms();
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshStates() {
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
            }
            refreshProtocol();
        }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    function refreshProtocol() {
        protocolReady = false;
        gridProtocol.setGridParam({
            url: ccuUrl + '/config/xmlapi/protocol.cgi',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET',
            loadComplete: function () {
                protocolReady = true;
                if (!firstLoad) {
                    firstLoadFinished();
                }
            }
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }


    /*
     *          Misc Functions
     */
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

});