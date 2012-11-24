var scriptRssi = "puts -nonewline {<rssiList>}\n" +
    "\n" +
    "load tclrpc.so\n" +
    "source /www/api/eq3/common.tcl\n" +
    "\n" +
    "set RSSI_BAD -120.0\n" +
    "set RSSI_MEDIUM -100.0\n" +
    "set RSSI_GOOD -20.0\n" +
    "\n" +
    "set url \"xmlrpc_bin://127.0.0.1:2001\"\n" +
    "\n" +
    "if { [ catch {\n" +
    "    #check if the interface supports rssi\n" +
    "    #failure of this call will throw us out of here\n" +
    "    xmlrpc $url system.methodHelp rssiInfo\n" +
    "    } ] } { continue }\n" +
    "\n" +
    "array_clear rssi_map\n" +
    "set rssi_list [xmlrpc $url rssiInfo ]\n" +
    "array set rssi_map $rssi_list\n" +
    "\n" +
    "foreach dev [lsort [array names rssi_map]] {\n" +
    "    puts -nonewline \"<rssi device='$dev' rx='[lindex [lindex $rssi_map($dev) 1] 0]' tx='[lindex [lindex $rssi_map($dev) 1] 1]'/>\"\n" +
    "    }\n" +
    "puts -nonewline {</rssiList>}\n";