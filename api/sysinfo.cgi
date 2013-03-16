#!/bin/tclsh

load tclrega.so

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

puts "Content-Type: text/json;Charset=ISO-8859-1"
puts ""

set res [lindex [rega_script "Write(system.GetSessionVarStr('$session'));"] 1]
if {$res != ""} {
    # Gültige Session

    set uptime [exec uptime]
    set memory [exec cat /proc/meminfo]
    set regadom [exec ls -lh /etc/config/homematic.regadom]
    set disk [exec df -h]
    array set ccubat [rega_script {Write(dom.GetObject("System.System:1.BAT_LEVEL").Value() * 100);}]

    regsub -all {[^/]*([a-z0-9\/]+)[ ]+([a-zA-Z0-9.]+)[ ]+([a-zA-Z0-9.]+)[ ]+([a-zA-Z0-9.]+)[ ]+([a-zA-Z0-9.%]+)[ ]+([A-Za-z\/]+)} $disk {"CCU Filesystem \6":"Size:\2 Used:\3 Free:\4 Used:\5",} disk
    regsub {[-a-z]+[ ]+[0-9] [a-z ]+([0-9.]+[A-Za-z]) ([A-Za-z0-9: ]+)[a-zA-Z./]+} $regadom {"CCU homematic.regadom size":"\1"} regadom
    regsub { ([0-9:]+) up ([0-9a-zA-Z ,:]+), load average: ([0-9., ]+)} $uptime {"CCU Zeit":"\1","CCU Uptime":"\2","CCU Load Average":"\3",} uptime
    regsub -all {([a-zA-Z_]+):[ ]+([0-9]+) ([a-zA-Z]+)} $memory {"CCU Speicher \1":"\2\3",} memory

    puts -nonewline "{"

    puts $memory
    puts $uptime
    puts $disk
    puts -nonewline $regadom
    puts {,}
    puts -nonewline {"CCU Batterie":"}
    puts -nonewline $ccubat(STDOUT)
    puts -nonewline {"}

    puts -nonewline "}"

} else {
    # Keine gültige Session
    puts "{\"error\":{\"source\":\"session\",\"message\":\"session invalid\"}}"
}
