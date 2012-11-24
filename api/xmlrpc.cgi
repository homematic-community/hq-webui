#!/bin/tclsh

#
#   xmlrpc.cgi Version 1.0
#   Proxy für Zugriff auf XMLRPC via Port 80
#   11'2012 https://github.com/hobbyquaker
#
#   Erfordert eine gültige Session (Login mit JSON RPC liefert notwendige Session-id zurück)
#
#   Erwartet den Zielport (2000,2001,2002) und die Session-id im Querystring
#       Beispielaufruf: xmlrpc.cgi?port=2001&session=Hza3fjs8
#
#   Ein Aufruf mit einer ungültigen Session wird mit folgender XML-Ausgabe quittiert:
#       <response><error message="session invalid"/></response>
#

load tclrega.so

set port "2000"
set session ""

catch {
  set input $env(QUERY_STRING)
  set pairs [split $input &]
  foreach pair $pairs {
    if {0 != [regexp "^(\[^=]*)=(.*)$" $pair dummy varname val]} {
      set $varname $val
    }
  }
}

set postdata [read stdin]

set res [lindex [rega_script "Write(system.GetSessionVarStr('$session'));"] 1]
if {$res != ""} {
        package require http
        set url "http://127.0.0.1:$port/"
        set token [::http::geturl $url -query $postdata]
        set response [::http::data $token]
        puts $response
    }
} else {
        puts {Content-Type: text/xml;Charset=ISO-8859-1

        <?xml version="1.0"?><response><error message="session invalid"/></response>}
}