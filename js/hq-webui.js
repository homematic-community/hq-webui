$("document").ready(function () {

    var ccuIP = '172.16.23.3';
    var devicesXML;
    var variablesXML;

    $("#tabs").tabs();
    $("button").button();

/*
 *          Grids
 */

    $("#gridVariables").jqGrid({
        width: 1080,
        height: 480,
        colNames:[
            'Name',
            'Variable',
            'Wert',
            'Werteliste',
            'Wert (text)',
            'ise_id',
            'min',
            'max',
            'unit',
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
            {name:'variable', index:'variable', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('variable');
                }
            },
            {name:'value', index:'value', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('value');
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
            {name:'unit', index:'unit', width: 40,
                xmlmap: function (obj) {
                    return $(obj).attr('unit');
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
        viewrecords:    true,
        gridview:       true,
        caption:        'Variablen',
        url:            'http://' + ccuIP + '/config/xmlapi/sysvarlist.cgi?text=true',
        datatype:       'xml',
        mtype:          'GET',
        loadonce:       true,
        data: {
        },
        xmlReader : {
            root: "systemVariables",
            row: "systemVariable",
            id: "[ise_id]",
            repeatitems: false
        },
        loadComplete: function(data) {
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
    });
    $("#gridPrograms").jqGrid({
        width: 1080,
        height: 480,
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
        viewrecords:    true,
        gridview:       true,
        caption:        'Programme',
        url:            'http://' + ccuIP + '/config/xmlapi/programlist.cgi',
        datatype:       'xml',
        mtype:          'GET',
        loadonce:       true,
        data: {
        },
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


    });
    $("#gridProtocol").jqGrid({
        width: 1080,
        height: 480,
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
        pager: "#gridPagerSystemprotocol",
        viewrecords:    true,
        gridview:       true,
        caption:        'Systemprotokoll',
        url:            'http://' + ccuIP + '/config/xmlapi/protocol.cgi',
        datatype:       'xml',
        mtype:          'GET',
        loadonce:       true,
        data: {
        },
        xmlReader : {
            root: "systemProtocol",
            row: "row",
            repeatitems: false
        }


    });
    $("#gridDevices").jqGrid({
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
        url:            'http://' + ccuIP + '/config/xmlapi/devicelist.cgi',
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
                    'name',
                    'type',
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


/*
 *      Dialoge
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
                $(this).dialog('close');
            }
        }
    });
    $("#dialogEditChannel").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
                $(this).dialog('close');
            }
        }
    });
    $("#dialogEditStatus").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            'Ok': function () {
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
    $("#buttonRefreshStatus").click(function () {
        refreshStatus();
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
            url: "http://' + ccuIP + '/config/xmlapi/protocol.cgi",
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
            url: 'http://' + ccuIP + '/config/xmlapi/runprogram.cgi',
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
            url: 'http://' + ccuIP + '/config/xmlapi/statechange.cgi',
            type: 'GET',
            data: {
                ise_id: ise_id,
                new_value: new_value
            },
            success: function (data) { successFunction(data); },
            error: function (xhr, ajaxOptions, thrownError) { ajaxerror(xhr, ajaxOptions, thrownError); }
        });
    }



/*
 *  Grids aktualisieren
 */

    function refreshVariables() {
        $("#gridVariables").setGridParam({
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshPrograms() {
        $("#gridPrograms").setGridParam({
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshDevices() {
        $("#gridDevices").setGridParam({
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshStatus() {
        $("#gridStatus").setGridParam({
            loadonce: false,
            datatype: 'xml'
        }).trigger("reloadGrid").setGridParam({loadonce: true});
    }
    function refreshProtocol() {
        $("#gridProtocol").setGridParam({
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