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

var scriptErrors = "puts -nonewline {<scriptErrors>}\n" +
"load tclrega.so\n" +
"set Datei [open \"|/usr/bin/tail -n 10 /var/log/messages\" r]\n" +
"while {[gets $Datei Zeile] >= 0} {\n" +
"    if [regexp Error.*near $Zeile] {\n" +
"    regexp {([a-zA-Z]+ [0-9\\: ]+) \\(none\\) local0.err ReGaHss: Error: IseESP\\:\\:([a-zA-Z]+)\= Error ([0-9]+) at row ([0-9]+) col ([0-9]+)} $Zeile line time msg code row col\n" +
"puts -nonewline \"<error \"\n" +
"    puts -nonewline \"timestamp='$time' \"\n" +
"    puts -nonewline \"row='$row' \"\n" +
"    puts -nonewline \"col='$col' \"\n" +
"    puts -nonewline \"code='$code' \"\n" +
"    puts -nonewline \"msg='$msg' \"\n" +
"    puts \"/>\"\n" +
"}\n" +
"}\n" +
"puts {</scriptErrors>}";