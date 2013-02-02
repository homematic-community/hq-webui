#!/bin/tclsh

#
#   process.cgi Version 1.2
#   Ausführen eines Prozesses
#   11'2012 https://github.com/hobbyquaker
#
#   Erfordert eine gültige Session (Login mit JSON RPC liefert notwendige Session-id zurück)
#
#   Erwartet die Session-id, den Prozess und das Ausgabeformat im Querystring sowie STDIN als POST Daten
#   Mögliche Ausgabeformate: xml, json, html, plain
#       Diese Angabe dient lediglich dazu einen passenden Header und passende Fehlermeldungen zu erzeugen,
#       die Ausgabe selbst muss im TCL Script eigenständig erzeugt werden.
#   Beispielaufruf: process.cgi?session=Uha73hsP&content=plain&process=/bin/sh
#
#   Debug-Modus: ein Aufruf mit process.cgi?debug=true erzeugt eine Ausgabe die auch STDERR enthält
#
#   Ein Aufruf mit einer ungültigen Session wird je nach Ausgabeformat quittert:
#       json    {error:{source:"session",message:"session invalid"}}
#       xml     <response><error source="session" message="session invalid"/></response>
#       html    <html><h3>error: session invalid</h3></html>
#       plain   error: session invalid
#

load tclrega.so

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

proc init {} {
    variable map
    variable alphanumeric a-zA-Z0-9
    for {set i 0} {$i <= 256} {incr i} {
        set c [format %c $i]
        if {![string match \[$alphanumeric\] $c]} {
            set map($c) %[format %.2x $i]
        }
    }
    # These are handled specially
    array set map { " " + \n %0d%0a }
}
init

proc url-decode str {
    set str [string map [list + { } "\\" "\\\\"] $str]
    regsub -all -- {%([A-Fa-f0-9][A-Fa-f0-9])} $str {\\u00\1} str
    return [subst -novar -nocommand $str]
}

set debug "false"
set content "plain"
set session ""
set process "/bin/sh"

catch {
  set input $env(QUERY_STRING)
  set pairs [split $input &]
  foreach pair $pairs {
    if {0 != [regexp "^(\[^=]*)=(.*)$" $pair dummy varname val]} {
      set $varname [url-decode $val]
    }
  }
}

set script [read stdin]
set ausgabe ""
set fehler ""

puts "Content-Type: text/$content;Charset=ISO-8859-1"
puts ""

set res [lindex [rega_script "Write(system.GetSessionVarStr('$session'));"] 1]
if {$res != ""} {
    # Gültige Session
        append script "\nexit"
        set pipe [open "|$process" r+]
        puts $pipe $script
        catch {flush $pipe}
        while {[gets $pipe this] >= 0} {
            append ausgabe $this
            append ausgabe "\n"
        }
        if {[catch {close $pipe} stderr] != 0} {
            append fehler $stderr
        }

    if {$debug == "false"} {
        puts $ausgabe
    } else {
        switch $content {
            json {
                puts -nonewline "{\"STDOUT\":\"[escape $ausgabe]\",\"STDERR\":\"[escape $fehler]\"}"
            }
            xml {
                puts -nonewline "<?xml version=\"1.0\"?><response><STDOUT>[escape $ausgabe]</STDOUT><STDERR>[escape $fehler]</STDERR></response>"
            }
            html {
                puts "<html><h3>STDOUT</h3><p>[escape $ausgabe]</p><h3>STDERR</h3><p>[escape $fehler]</p></html>"
            }
            plain {
                puts "STDOUT:"
                puts $ausgabe
                puts ""
                puts "STDERR:"
                puts $fehler
            }
        }
    }

} else {
    # Keine gültige Session
    switch $content {
        json {
            puts "{\"error\":{\"source\":\"session\",\"message\":\"session invalid\"}}"
               }
        xml {
            puts -nonewline {<?xml version="1.0"?><response><error source="session" message="session invalid"/></response>}
        }
        html {
            puts {<html><h3>error: session invalid</h3></html>}
        }
        plain {
            puts {error: session invalid}
        }
    }
}
