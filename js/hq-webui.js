/**
 *      HQ WebUI
 *
 *      Version 1.1.3
 *
 *      11'2012 hobbyquaker hobbyquaker@gmail.com
 *
 */

$("document").ready(function () {

    // Hier die URL der CCU eintragen (z.B.: 'http://192.168.1.20')
    var ccuUrl = '';
    // Wird das HQ WebUI auf der CCU installiert kann diese Variable leer bleiben ('')

    var statesXML;
    var variablesXML;
    var programsXML;
    var rssiXML;
    var functionsXML;
    var roomsXML;

    //          Flag Daten vollst�ndig geladen
    var statesReady = false;
    var variablesReady = false;
    var programsReady = false;
    var protocolReady = false;
    var functionsReady = false;
    var roomsReady = false;
    var rssiReady = false;
    var firstLoad = false;
    var xmlapiVersion;

    $("#tabs").tabs();

    /*
     *          Grids
     */
    $("#gridVariables").jqGrid({
        width: 1024, height: 490,
        colNames:[
            'Name',
            'Variable',
            'Wert',
            'unit',
            'Werteliste',
            'Wert (text)',
            'ise_id',
            'min',
            'max',
            'type',
            'Typ',
            'timestamp'
        ],
        colModel :[
            {name:'name', index:'name', width: 160,
                xmlmap: function (obj) {
                    return $(obj).attr('name');
                }
            },
            {name:'variable', index:'variable', width: 40, hidden: true,
                xmlmap: function (obj) {
                    return $(obj).attr('variable');
                }
            },
            {name:'value', index:'value', width: 100,
                xmlmap: function (obj) {
                    return $(obj).attr('value');
                }
            },
            {name:'unit', index:'unit', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('unit');
                }
            },
            {name:'value_list', index:'value_list', width: 200,
                xmlmap: function (obj) {
                    return $(obj).attr('value_list');
                }
            },
            {name:'value_text', index:'value_text', width: 60,
                xmlmap: function (obj) {
                    return $(obj).attr('value_text');
                }
            },
            {name:'ise_id', index:'ise_id', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('ise_id');
                }
            },
            {name:'min', index:'min', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('min');
                }
            },
            {name:'max', index:'max', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('max');
                }
            },
            {name:'type', index:'type', width: 40, hidden: true,
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
            {name:'timestamp', index:'timestamp', width: 60,
                xmlmap: function (obj) {
                    return $(obj).attr('timestamp');
                }
            }
        ],
        pager: "#gridPagerVariables",
        rowList: [20,50,100,500],
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
            var grid = $("#gridVariables");
            var value       = grid.getCell(id, "value");
            var value_text  = grid.getCell(id, "value_text");
            var value_list  = grid.getCell(id, "value_list");
            var type        = grid.getCell(id, "type");
            var subtype     = grid.getCell(id, "subtype");
            switch (subtype) {
                case '2':
                    $("#variableInput").html("<select id='variableValue'><option value='false'>False</option><option value='true'>True</option></select>");
                    $("#variableValue option[value='" + value + "']").attr("selected", true);
                    break;
                case '29':
                    $("#variableInput").html("<select id='variableValue'>" + selectOptions(value_list) + "</select>");
                    if (value == "true") { value = "1"; } else if (value == "false") { value = "0"; }
                    $("#variableValue option[value='" + value + "']").attr("selected", true);
                    break;
                default:
                    $("#variableInput").html("<input type='text' id='variableValue' value='" + value + "'>");

            }

            $("#variableName").html($("#gridVariables").getCell(id, "name"));
            $("#variableId").val(id);

            $("#dialogEditVariable").dialog("open");
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
    $("#gridPrograms").jqGrid({
        width: 1024, height: 490,
        colNames:[
            'id',
            'Aktiv',
            'Timestamp',
            'Name',
            'Beschreibung'
        ],
        colModel :[
            {name:'id', index:'id', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('id');
                }
            },
            {name:'active', index:'active', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('active');
                }
            },
            {name:'timestamp', index:'timestamp', width: 80,
                xmlmap: function (obj) {
                    return $(obj).attr('timestamp');
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
            }
        ],
        pager: "#gridPagerPrograms",
        rowList: [20,50,100,500],
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
            $("#programName").html($("#gridPrograms").getCell(id, "name"));
            $("#programId").val(id);
            $("#dialogRunProgram").dialog("open");
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

    $("#gridRooms").jqGrid({
        width: 1024, height: 490,
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
        rowList: [20,50,100,500],
        viewrecords:    true,
        gridview:       true,
        caption:        'R�ume',
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

    $("#gridFunctions").jqGrid({
        width: 1024, height: 490,
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
        rowList: [20,50,100,500],
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


    $("#gridStates").jqGrid({
        width: 1024, height: 490,
        colNames:[
            'Name',
            'ise_id',
            'unreach',
            'sticky_unreach',
            'config_pending',
            ''
        ],
        colModel :[
            {name:'name', index:'name', width: 200,
                xmlmap: function (obj) {
                    return $(obj).attr('name');
                }
            },
            {name:'ise_id', index:'ise_id', width: 80,
                xmlmap: function (obj) {
                    return $(obj).attr('ise_id');
                }
            },
            {name:'unreach', index:'unreach', width: 80,
                xmlmap: function (obj) {
                    return $(obj).attr('unreach');
                }
            },
            {name:'sticky_unreach', index:'sticky_unreach', width: 80,
                xmlmap: function (obj) {
                    return $(obj).attr('sticky_unreach');
                }
            },
            {name:'config_pending', index:'config_pending', width: 80,
                xmlmap: function (obj) {
                    return $(obj).attr('config_pending');
                }
            },
            {name:'dummy1', index:'dummy1', width: 80}
        ],
        pager: "#gridPagerStates",
        rowList: [20,50,100,500],
        viewrecords:    true,
        gridview:       true,
        caption:        'Ger�te',
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
                width: 1000,
                colNames: [
                    'Channel Name',
                    'ise_id',
                    'R�ume',
                    'Gewerke'
                ],
                datatype:'xmlstring',
                datastr: statesXML,
                colModel: [
                    {name:"name",   index:"name",   width:190,
                        xmlmap: function (obj) {
                            return $(obj).attr('name');
                        }
                    },
                    {name:"ise_id",   index:"ise_id",   width:86,
                        xmlmap: function (obj) {
                            return $(obj).attr('ise_id');
                        }
                    },
                    {name:"rooms", index:"rooms",   width:80,
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
                    {name:"functions", index:"functions",   width:80,
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
    $("#gridProtocol").jqGrid({
        width: 1024,
        height: 490,
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
        rowList: [20,50,100,500],
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
            onClickButton: function () { $("#dialogClearProtocol").dialog("open"); },
            position: "last",
            title:"gesamtes Protokoll l�schen",
            cursor: "pointer"
        });



/*  $("#gridDevices").jqGrid({
        width: 1024,
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
        caption:        'Ger�te',
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

    function subGridDatapoint(grid_id, row_id) {
        var subgrid_table_id = grid_id + "_t";
        $("#" + grid_id).html("<table id='" + subgrid_table_id + "''></table>");
        $("#" + subgrid_table_id).jqGrid( {
            width: 920,
            colNames: [
                'Datapoint Name',
                'ise_id',
                'Type',
                'Value',
                'Valuetype',
                'Timestamp'
            ],
            datatype:'xmlstring',
            datastr: statesXML,
            colModel: [
                {name:"name",   index:"name",   width:200, xmlmap: function (obj) {
                    return $(obj).attr('name');
                }},
                {name:"ise_id",   index:"ise_id",   width:80, xmlmap: function (obj) {
                    return $(obj).attr('ise_id');
                }},
                {name:"type",   index:"type",   width:80, xmlmap: function (obj) {
                    return $(obj).attr('type');
                }},
                {name:"value",   index:"value",   width:80, xmlmap: function (obj) {
                    return $(obj).attr('value');
                }},
                {name:"valuetype",   index:"valuetype",   width:80, xmlmap: function (obj) {
                    return $(obj).attr('valuetype');
                }},
                {name:"timestamp",   index:"timestamp",   width:80,
                    xmlmap: function (obj) {
                        return $(obj).attr('timestamp');
                    },
                    formatter: function (val) {
                        return val;
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
                var value = $("#" + subgrid_table_id).getCell(id, "value");
                $("#datapointName").html($("#" + subgrid_table_id).getCell(id, "name"));
                $("#datapointId").val(id);
                $("#datapointGridId").val(subgrid_table_id);
                $("#datapointInput").html("<input type='text' id='datapointValue' value='" + value + "'>");
                $("#dialogEditDatapoint").dialog("open");
            }
        });
    }


    /*
    *           Dialoge
    */
    $("#dialogRunProgram").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ausführen': function () {
                $(this).dialog('close');
                xmlapiRunProgram($("#dialogRunProgram input#programId").val());
            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }
    });
    $("#dialogAjaxError").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
                $(this).dialog('close');
            }
        }
    });
    $("#dialogEditVariable").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
                var value;
                if ($("#variableInput").find("select").attr("id")) {
                    value = $("#variableValue option:selected").val();
                } else {
                    value = $("#variableValue").val();
                }
                xmlapiSetState($("#variableId").val(), value,
                    function () {
                        xmlapiGetVariable($("#variableId").val());
                    }
                );
                $(this).dialog('close');
            },
            'Abbrechen': function () {
                $(this).dialog('close');
            }
        }
    });
    $("#dialogEditDatapoint").dialog({
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
    $("#dialogClearProtocol").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'L�schen': function () {
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
                $("#gridVariables").find("tr#" + ise_id + " td[aria-describedby$='value']").html(variable.attr('value'));
                $("#gridVariables").find("tr#" + ise_id + " td[aria-describedby$='value_text']").html(variable.attr('value_text'));
                $("#gridVariables").find("tr#" + ise_id + " td[aria-describedby$='variable']").html(variable.attr('variable'));
                $("#gridVariables").find("tr#" + ise_id + " td[aria-describedby$='timestamp']").html(variable.attr('timestamp'));
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
    function firstLoadFinished() {
        firstLoad = true;
        $("#gridVariables").setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    variablesXML = data;
                    variablesReady = true;
                }
            }
        });
        $("#gridPrograms").setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    programsXML = data;
                    programsReady = true;
                }
            }
        });
        $("#gridRooms").setGridParam({
            loadComplete: function (data) {
                roomsXML = data;
                roomsReady = true;
            }
        });
        $("#gridFunctions").setGridParam({
            loadComplete: function (data) {
                functionsXML = data;
                functionsReady = true;
            }
        });
        $("#gridStates").setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    statesXML = data;
                    statesReady = true;
                }
            }
        });
        $("#gridProtocol").setGridParam({
            loadComplete: function () {
                protocolReady = true;
            }
        });

    }
    function refreshVariables() {
        variablesReady = false;
        $("#gridVariables").setGridParam({
            url: ccuUrl + '/config/xmlapi/sysvarlist.cgi?text=true',
            loadonce: false,
            datatype: 'xml',
            mtype: 'GET'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshPrograms() {
        programsReady = false;
        $("#gridPrograms").setGridParam({
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
        $("#gridRooms").setGridParam({
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
        $("#gridFunctions").setGridParam({
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
        $("#gridStates").setGridParam({
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
        $("#gridProtocol").setGridParam({
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
        $("dialogAjaxError").dialog("open");
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
        return "jjjj-mm-tt hh:mm:ss";
    }


});