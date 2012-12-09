#!/bin/tclsh

#
#   upload.cgi Version 1.0
#   11'2012 https://github.com/hobbyquaker
#
#   Erfordert eine gültige Session (Login mit JSON RPC liefert notwendige Session-id zurück)
#
#   Erwartet die Session-id im Querystring
#
source /www/config/cgi.tcl
load tclrega.so

cgi_eval {
    set blubb "..."
    cgi_input

    cgi_content_type "text/plain"
    cgi_http_head



    #set res [lindex [rega_script "Write(system.GetSessionVarStr('$session'));"] 1]
    #if {$res != ""} {
        # Gültige Session



        #cgi_import "blubb"
        puts [cgi_import "bla"]
        puts $bla




    #} else {
    #    puts {error: session invalid}
    #}

}