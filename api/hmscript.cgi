#!/bin/tclsh

#
#   hmscript.cgi Version 1.0
#   Ausführen eines Homematic Scripts
#   11'2012 https://github.com/hobbyquaker
#
#   Erfordert eine gültige Session (Login mit JSON RPC liefert notwendige Session-id zurück)
#
#   Erwartet die Session-id und das Ausgabeformat im Querystring sowie ein Homematic Script als POST Daten
#   Mögliche Ausgabeformate: xml, json, html, plain
#       Diese Angabe dient lediglich dazu einen passenden Header und passende Fehlermeldungen zu erzeugen,
#       die Ausgabe selbst muss im TCL Script eigenständig erzeugt werden.
#   Beispielaufruf: hmscript.cgi?session=Uha73hsP&content=json
#
#   Debug-Modus: ein Aufruf mit hmscript.cgi?debug=true erzeugt eine Ausgabe die alle Variablen beinhaltet
#
#   Ein Aufruf mit einer ungültigen Session wird je nach Ausgabeformat quittert:
#       json    {error:{source:"session",message:"session invalid"}}
#       xml     <response><error source="session" message="session invalid"/></response>
#       html    <html><h3>error: session invalid</h3></html>
#       plain   error: session invalid
#


load tclrega.so

set debug "false"
set content "plain"



proc escape { str } {
  set map {
    "\"" "\\\""
    "\\" "\\\\"
    "\b"  "\\b"
    "\f"  "\\f"
    "\n"  "\\n"
    "\r"  "\\r"
    "\t"  "\\t"
  }
  return "[string map $map $str]"
}

catch {
  set input $env(QUERY_STRING)
  set pairs [split $input &]
  foreach pair $pairs {
    if {0 != [regexp "^(\[^=]*)=(.*)$" $pair dummy varname val]} {
      set $varname $val
    }
  }
}

puts "Content-Type: text/$content;Charset=ISO-8859-1"
puts ""

# Session prüfen
set res [lindex [rega_script "Write(system.GetSessionVarStr('$session'));"] 1]

if {$res != ""} {
    # gültige Session
    set postdata [read stdin]
    array set script_result [rega_script $postdata]




    if {$debug == "true"} {
        set first 1

        switch $content {
            json {
                set result "\{"
                foreach name [array names script_result] {
                    if {1 != $first} {append result ","} {set first 0}
                    set value $script_result($name)
                    append result "\"[escape $name]\":\"[escape $value]\""
                }
                append result "\}"
            }
            xml {
                set result "<xml><exec>hmscript.cgi</exec>"
                foreach name [array names script_result] {
                    set value $script_result($name)
                    append result "<$name>[escape $value]</$name>"
                }
                append result "</xml>"

            }
            plain {
                foreach name [array names script_result] {
                    if {1 != $first} {append result "\n"} {set first 0}
                    set value $script_result($name)
                    append result "$name = \"[escape $value]\""
                }
            }
            html {
                foreach name [array names script_result] {
                    if {1 != $first} {append result "<br>"} {set first 0}
                    set value $script_result($name)
                    append result "$name = \"$value\""
                }
            }
        }



        puts $result
    } else {
        puts $script_result(STDOUT)
    }

} else {
    # keine gültige Session
    switch $content {
        json {
            puts "{error:{source:\"session\",message:\"session invalid\"}}"
        }
        xml {
            puts {<?xml version="1.0"?><response><error source="session" message="session invalid"/></response>}
        }
        html {
            puts {<html><h3>error: session invalid</h3></html>}
        }
        plain {
            puts {error: session invalid}
        }
    }
}