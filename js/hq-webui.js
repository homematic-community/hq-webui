/**
 *      HQ WebUI
 *
 *      Version 1.1
 *
 *      11'2012 hobbyquaker hobbyquaker@gmail.com
 *
 */

$("document").ready(function () {


    var ccuUrl = 'http://172.16.23.3';
    
    var protocolXML;
    var statesXML;
    var variablesXML;
    var programsXML;

    $("#tabs").tabs();
    $("button").button();

    /*
     *          Grids
     */



    $("#gridVariables").jqGrid({
        width: 1080, height: 460,
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
            'subtype',
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
            {name:'type', index:'type', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('type');
                }
            },
            {name:'subtype', index:'subtype', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('subtype');
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
            refreshPrograms();
            if (data.nodeType) {
                variablesXML = data;
            }
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
    }).filterToolbar({defaultSearch: 'cn'});
    $("#gridPrograms").jqGrid({
        width: 1080, height: 460,
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
        datatype:       'xml',
        mtype:          'GET',
        loadonce:       true,
        data: {
        },
        ignoreCase: true,
        loadComplete: function(data) {
            refreshStates();
            if (data.nodeType) {
                programsXML = data;
            }
        },
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


    }).filterToolbar({defaultSearch: 'cn'});
    $("#gridStates").jqGrid({
        width: 1080, height: 460,
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
        caption:        'Status',
        loadonce:       true,
        datatype:       'xml',
        mtype:          'GET',
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
        loadComplete: function(data) {
            if (data.nodeType) {
                statesXML = data;
            }
            refreshProtocol();
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
                    '',
                    '',
                    '',
                    ''
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
                    {name:"dummy1", index:"dummy1",   width:80},
                    {name:"dummy2", index:"dummy2",   width:80},
                    {name:"dummy3", index:"dummy3",   width:80},
                    {name:"dummy4", index:"dummy4",   width:80}
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
                subGridRowExpanded: function(grid_id, row_id) {
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
                            $("#datapointInput").html("<input type='text' id='datapointValue' value='" + value + "'>");
                            $("#dialogEditDatapoint").dialog("open");
                        }
                    });
                }
            });
        }
    }).filterToolbar({defaultSearch: 'cn'});
    $("#gridProtocol").jqGrid({
        width: 1080,
        height: 460,
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
        datatype:       'xml',
        mtype:          'GET',
        loadonce:       true,
        data: {
        },
        sortable: true,
        ignoreCase: true,
        xmlReader : {
            root: "systemProtocol",
            row: "row",
            repeatitems: false
        },
        loadComplete: function () {
            firstLoadFinished();
        }


    }).filterToolbar({defaultSearch: 'cn'});
/*  $("#gridDevices").jqGrid({
        width: 1080,
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
    *      Dialoge
    */
    $("#dialogRunProgram").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'AusfÃ¼hren': function () {
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
                        xmlapiGetState($("#datapointId").val());
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
     *      Click Handler
     */
    $("#buttonRefreshVariables").click(function () {
        refreshVariables();
    });
    $("#buttonRefreshPrograms").click(function () {
        refreshPrograms();
    })
    $("#buttonRefreshDevices").click(function () {
        refreshDevices();
    })
    $("#buttonRefreshStates").click(function () {
        refreshStates();
    })
    $("#buttonRefreshProtocol").click(function () {
        refreshProtocol();
    });
    $("#buttonClearProtocol").click(function () {
        $("#dialogClearProtocol").dialog("open");
    });

    /*
     *      XML-API Aufrufe
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
            error: function (xhr, ajaxOptions, thrownError) { ajaxerror(xhr, ajaxOptions, thrownError); }
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
            error: function (xhr, ajaxOptions, thrownError) { ajaxerror(xhr, ajaxOptions, thrownError); }
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
            error: function (xhr, ajaxOptions, thrownError) { ajaxerror(xhr, ajaxOptions, thrownError); }
        });
    }
    function xmlapiGetState(ise_id) {
        // Naja...
        setTimeout(function () { xmlApiGetStateAjax(ise_id); }, 1000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id); }, 1500);
        setTimeout(function () { xmlApiGetStateAjax(ise_id); }, 2000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id); }, 3000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id); }, 5000);
        setTimeout(function () { xmlApiGetStateAjax(ise_id); }, 30000);
    }
    function xmlApiGetStateAjax(ise_id) {
        $.ajax({
            url: ccuUrl + '/config/xmlapi/state.cgi',
            type: 'GET',
            async: false,
            data: {
                datapoint_id: ise_id,
            },
            success: function (data) {
                $("#gridStates").find("tr#" + ise_id + " td[aria-describedby$='value']").html($(data).text());
            },
            error: function (xhr, ajaxOptions, thrownError) { ajaxerror(xhr, ajaxOptions, thrownError); }
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
            error: function (xhr, ajaxOptions, thrownError) { ajaxerror(xhr, ajaxOptions, thrownError); }
        });
    }


    /*
     *  Grids laden und aktualisieren
     */
    function firstLoadFinished() {
        $("#gridVariables").setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    variablesXML = data;
                }
            }
        });
        $("#gridPrograms").setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    programsXML = data;
                }
            }
        });
        $("#gridStates").setGridParam({
            loadComplete: function (data) {
                if (data.nodeType) {
                    statesXML = data;
                }
            }
        });
        $("#gridProtocol").setGridParam({
            loadComplete: function () {
                return; // Nothing
            }
        });
    }
    function refreshVariables() {
        $("#gridVariables").setGridParam({
            url: ccuUrl + '/config/xmlapi/sysvarlist.cgi?text=true',
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshPrograms() {
        $("#gridPrograms").setGridParam({
            url: ccuUrl + '/config/xmlapi/programlist.cgi',
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshDevices() {
        $("#gridDevices").setGridParam({
            url:            ccuUrl + '/config/xmlapi/devicelist.cgi',
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshStates() {
        $("#gridStates").setGridParam({
            url: ccuUrl + '/config/xmlapi/statelist.cgi',
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshProtocol() {
        $("#gridProtocol").setGridParam({
            url: ccuUrl + '/config/xmlapi/protocol.cgi',
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }

    /*
     *      Misc
     */
    function selectOptions(value_list) {
        var output = "";
        var values = value_list.split(";");
        for (var i = 0; i < values.length; i++) {
            output = output + "<option value='" + i + "'>" + values[i] + "</option>";
        }
        return output;
    }
    function ajaxerror(xhr, ajaxOptions, thrownError) {
        $("#ajaxOptions").html(ajaxOptions);
        $("#thrownError").html(thrownError);
        $("dialogAjaxError").dialog("open");
    };
});