var scriptStates = "string sDevId;\n" +
    "string sChnId;\n" +
    "string sDPId;\n" +
    "var show_internal = 0;\n" +
    "Write(\"<stateList>\");\n" +
    "foreach (sDevId, root.Devices().EnumUsedIDs()) {\n" +
    "    object oDevice   = dom.GetObject(sDevId);\n" +
        "    if( oDevice.ReadyConfig() && (oDevice.Name() != \"Zentrale\") && (oDevice.Name() != \"HMW-RCV-50 BidCoS-Wir\") )\n" +
    "    {\n" +
    "        Write(\"<device\");\n" +
    "        Write(\" name='\" # oDevice.Name() # \"'\");\n" +
    "        Write(\" ise_id='\" # sDevId # \"'\");\n" +
        "        Write(\" >\");  ! device tag schliessen\n" +
        "        foreach(sChnId, oDevice.Channels())\n" +
    "        {\n" +
    "            object oChannel = dom.GetObject(sChnId);\n" +
    "            if ( (! oChannel.Internal()) ||  oChannel.Internal()  )\n" +
    "            {\n" +
        "                Write(\"<channel name='\");\n" +
    "                WriteXML( oChannel.Name() );\n" +
    "                Write(\"' logged='\" # oChannel.ChnArchive() );\n" +
    "                Write(\"' ise_id='\" # sChnId # \"'>\");\n" +
        "                foreach(sDPId, oChannel.DPs().EnumUsedIDs())\n" +
    "                {\n" +
    "                    object oDP = dom.GetObject(sDPId);\n" +
    "                    if(oDP)\n" +
    "                    {\n" +
    "                        string dp = oDP.Name().StrValueByIndex(\".\", 2);\n" +
        "                        if( (dp != \"ON_TIME\") && (dp != \"INHIBIT\") )\n" +
    "                        {\n" +
    "                            Write(\"<datapoint\");\n" +
    "                            Write(\" name='\"); WriteXML(oDP.Name());\n" +
    "                            Write(\"' type='\"); WriteXML(oDP.Name().StrValueByIndex(\".\", 2))\n" +
    "                            Write(\"' ise_id='\" # sDPId );\n" +
    "                            ! state fragt den aktuellen status des sensors/aktors ab, dauert lange\n" +
    "                            if (show_internal == 1) {\n" +
    "                                Write(\"' state='\"); WriteXML(oDP.State());\n" +
    "                            }\n" +
    "                            ! value nimmt den von der ccu gecachten wert, moeglicherweise nicht korrekt. Ggf. bei einigen geraeten immer abfragen\n" +
    "                            Write(\"' value='\"); WriteXML(oDP.Value());\n" +
    "                            Write(\"' valuetype='\" # oDP.ValueType());\n" +
    "                            Write(\"' timestamp='\" # oDP.Timestamp().ToInteger());\n" +
    "                            Write(\"' />\");\n" +
    "                        }\n" +
    "                    }\n" +
    "                }\n" +
    "                Write(\"</channel>\");\n" +
    "            }\n" +
    "        }\n" +
    "        Write(\"</device>\");\n" +
    "    }\n" +
    "}\n" +
    "Write(\"</stateList>\");\n" +
    "\n";

var scriptPrograms = "string sProgramId;\n" +
    "object oProgram;\n" +
    "Write(\"<programList>\");\n" +
    "foreach (sProgramId, dom.GetObject(ID_PROGRAMS).EnumUsedIDs()) {\n" +
    "    oProgram = dom.GetObject(sProgramId);\n" +
    "    if(oProgram != null)\n" +
    "    {\n" +
    "        Write(\"<program id='\" # sProgramId #\"' active='\" # oProgram.Active() # \"'\")\n" +
    "        Write(\" timestamp='\" # oProgram.ProgramLastExecuteTime().ToInteger() #\"' name='\");\n" +
    "        WriteXML( oProgram.Name() );\n" +
    "        Write(\"' description='\");\n" +
    "        WriteXML(oProgram.PrgInfo());\n" +
    "        Write(\"'/>\");\n" +
    "    }\n" +
    "}\n" +
    "Write(\"</programList>\");\n";

var scriptVariables = "object oSysVar;\n" +
    "string sSysVarId;\n" +
    "string sShowText='true';\n" +
    "Write(\"<systemVariables>\");\n" +
    "foreach (sSysVarId, dom.GetObject(ID_SYSTEM_VARIABLES).EnumUsedIDs()) {\n" +
    "    oSysVar     = dom.GetObject(sSysVarId);\n" +
    "    Write(\"<systemVariable\");\n" +
    "    Write(\" name='\"); WriteXML( oSysVar.Name() );\n" +
    "    Write(\"' variable='\"); WriteXML( oSysVar.Variable());\n" +
    "    Write(\"' value='\"); WriteXML( oSysVar.Value());\n" +
    "    Write(\"' value_list='\"); WriteXML( oSysVar.ValueList());\n" +
    "    Write(\"' ise_id='\" # oSysVar.ID() );\n" +
    "    if (sShowText == \"true\") {\n" +
    "        Write(\"' value_text='\"); WriteXML( oSysVar.ValueList().StrValueByIndex(';', oSysVar.Value()));\n" +
    "    }\n" +
    "    Write(\"' min='\"); WriteXML( oSysVar.ValueMin());\n" +
    "    Write(\"' max='\"); WriteXML( oSysVar.ValueMax());\n" +
    "    Write(\"' unit='\"); WriteXML( oSysVar.ValueUnit());\n" +
    "    Write(\"' type='\" # oSysVar.ValueType() # \"' subtype='\" # oSysVar.ValueSubType());\n" +
    "    Write(\"' logged='\"); WriteXML( oSysVar.DPArchive());\n" +
    "    Write(\"' visible='\"); WriteXML( oSysVar.Visible());\n" +
    "    Write(\"' timestamp='\" # oSysVar.Timestamp().ToInteger());\n" +
    "    Write(\"'/>\");\n" +
    "}\n" +
    "Write(\"</systemVariables>\");\n";

var scriptProtocol = "Write(\"<systemProtocol>\");\n" +
"string drop = \"\";\n" +
"integer iLastGroupIndex = 1;\n" +
"string sCollectedNames = \"\";\n" +
"string sCollectedValues = \"\";\n" +
"string sCollectedDateTimes = \"\";\n" +
"string s;\n" +
"integer iStart = 0;\n" +
"integer iCount = 0;\n" +
"integer eCount = dom.GetHistoryDataCount();\n" +
"integer clear = 0;\n" +
"integer rCount;\n" +
"if (iCount == \"0\") {\n" +
"iCount = eCount;\n" +
"}\n" +
"Write(\"<records start=\\\"\" # iStart # \"\\\" show=\\\"\" # iCount # \"\\\" count=\\\"\" # eCount # \"\\\"/>\");\n" +
"foreach( s, dom.GetHistoryData( iStart, iCount, &rCount ) ) {\n" +
"    integer iGroupIndex = s.StrValueByIndex(\";\",0).ToInteger();\n" +
"    string sDatapointId = s.StrValueByIndex(\";\",1);\n" +
"    string sRecordedValue = s.StrValueByIndex(\";\",2);\n" +
"    string sDateTime = s.StrValueByIndex(\";\",3);\n" +
"    \n" +
"    string sDatapointName = \"\";\n" +
"    object oHistDP = dom.GetObject( sDatapointId );\n" +
"    if( oHistDP ) {\n" +
"        object oDP = dom.GetObject( oHistDP.ArchiveDP() );\n" +
"        if( oDP ) {\n" +
"            sDatapointName = oDP.Name();\n" +
"            boolean bSysVar = (oDP.IsTypeOf(OT_VARDP) || oDP.IsTypeOf(OT_ALARMDP));\n" +
"            if( !bSysVar ) {\n" +
"                object oCH = dom.GetObject( oDP.Channel() );\n" +
"                if( oCH ) {\n" +
"                    sDatapointName = oCH.Name();\n" +
"                }\n" +
"            }\n" +
"    \n" +
"            if( iLastGroupIndex != iGroupIndex ) {\n" +
"                drop = \"<row datetime=\\\"\" # sCollectedDateTimes # \"\\\" names=\\\"\" # sCollectedNames # \"\\\" values=\\\"\" # sCollectedValues # \"\\\" />\n\" # drop;\n" +
"                sCollectedNames = \"\";\n" +
"                sCollectedValues = \"\";\n" +
"                iLastGroupIndex = iGroupIndex;\n" +
"            }\n" +
"    \n" +
"            string id = oDP.ID();\n" +
"            string sRet = \"\";\n" +
"            string sValue = sRecordedValue;\n" +
"            Call(\"/esp/functions.fn::WriteDPText()\");\n" +
"            sRecordedValue = system.GetVar(\"sRet\");\n" +
"    \n" +
"            sCollectedNames = sDatapointName;\n" +
"            sCollectedDateTimes = sDateTime;\n" +
"    \n" +
"            if (!sCollectedValues.Length()) {\n" +
"                sCollectedValues = sRecordedValue;\n" +
"            } else {\n" +
"                sCollectedValues = sCollectedValues#\", \"#sRecordedValue;\n" +
"            }\n" +
"    \n" +
"        }\n" +
"    }\n" +
"    \n" +
"    if( sCollectedValues.Length() ) {\n" +
"        drop = drop # \"<row datetime=\\\"\" # sCollectedDateTimes # \"\\\" names=\\\"\" # sCollectedNames # \"\\\" values=\\\"\" # sCollectedValues # \"\\\" />\";\n" +
"    }\n" +
"    \n" +
"}\n" +
"    Write(drop);\n" +
"Write(\"</systemProtocol>\");\n" +
"\n";


var scriptDevices = "integer DIR_SENDER      = 1;\n" +
"integer DIR_RECEIVER    = 2;\n" +
"!    string  TYPE_VIRTUAL    = \"29\";\n" +
"string  PARTNER_INVALID = \"65535\";\n" +
"string sDevId;\n" +
"string sChnId;\n" +
"string sDPId;\n" +
"Write(\"<deviceList>\");\n" +
"foreach (sDevId, root.Devices().EnumUsedIDs())\n" +
"{\n" +
"    object  oDevice   = dom.GetObject(sDevId);\n" +
"    boolean bDevReady = oDevice.ReadyConfig();\n" +
"    if( (true == bDevReady) && (\"HMW-RCV-50\" != oDevice.HssType()) && (\"HM-RCV-50\" != oDevice.HssType()) )\n" +
"    {\n" +
"        string sDevInterfaceId = oDevice.Interface();\n" +
"        string sDevInterface   = dom.GetObject(sDevInterfaceId).Name();\n" +
"        string sDevType        = oDevice.HssType();\n" +
"        Write(\"<device\");\n" +
"        Write(\" name='\");WriteXML( oDevice.Name() );Write(\"'\");\n" +
"        Write(\" address='\");WriteXML( oDevice.Address() );Write(\"'\");\n" +
"        Write(\" ise_id='\" # sDevId # \"'\");\n" +
"        Write(\" interface='\" # sDevInterface # \"'\");\n" +
"        Write(\" device_type='\");WriteXML(sDevType);Write(\"'\");\n" +
"        Write(\" ready_config='\" # bDevReady # \"'\");\n" +
"        Write(\">\");\n" +
"        foreach(sChnId, oDevice.Channels())\n" +
"        {\n" +
"            object oChannel = dom.GetObject(sChnId);\n" +
"            if (false == oChannel.Internal())\n" +
"            {\n" +
"                integer iChnDir     = oChannel.ChnDirection();\n" +
"                string  sChnDir     = \"UNKNOWN\";\n" +
"                if (DIR_SENDER   == iChnDir) { sChnDir = \"SENDER\";   }\n" +
"                if (DIR_RECEIVER == iChnDir) { sChnDir = \"RECEIVER\"; }\n" +
"                string  sChnPartnerId = oChannel.ChnGroupPartnerId();\n" +
"                if (PARTNER_INVALID == sChnPartnerId) { sChnPartnerId = \"\"; }\n" +
"                boolean bChnAESAvailable = false;\n" +
"                if (0 != oChannel.ChnAESOperation()) { bChnAESAvailable = true; }\n" +
"                string sChnMode = \"DEFAULT\";\n" +
"                if (true == oChannel.ChnAESActive()) { sChnMode = \"AES\"; }\n" +
"                !            boolean bChnReady        = oChannel.ReadyConfig();\n" +
"                !            integer iChnLinkCount    = oChannel.ChnLinkCount();\n" +
"                !            integer iChnProgramCount = oChannel.DPUsageCount();\n" +
"                !            if (ID_ERROR == iChnProgramCount) { iChnProgramCount = 0; }\n" +
"                !            boolean bChnVirtual = false;\n" +
"                !            if (TYPE_VIRTUAL == sChnType) { bChnVirtual = true; }\n" +
"                !            boolean bChnReadable  = false;\n" +
"                !            boolean bChnWritable  = false;\n" +
"                !            boolean bChnEventable = false;\n" +
"                !            foreach (sDPId, oChannel.DPs())\n" +
"                !            {\n" +
"                !              object  oDP          = dom.GetObject(sDPId);\n" +
"                !              if (false == oDP.Internal())\n" +
"                !              {\n" +
"                !                integer iDPOperations = oDP.Operations();\n" +
"                !                if (OPERATION_READ  & iDPOperations) { bChnReadable  = true; }\n" +
"                !                if (OPERATION_WRITE & iDPOperations) { bChnWritable  = true; }\n" +
"                !                if (OPERATION_EVENT & iDPOperations) { bChnEventable = true; }\n" +
"                !              }\n" +
"            !            }\n" +
"        !\n\n" +
"        Write(\"<channel name='\");WriteXML( oChannel.Name() );Write(\"'\");\n" +
"        Write(\" type='\");WriteXML( oChannel.ChannelType() );Write(\"'\");\n" +
"        Write(\" address='\");WriteXML( oChannel.Address() );Write(\"'\");\n" +
"        Write(\" ise_id='\" # sChnId # \"'\");\n" +
"        Write(\" direction='\" # sChnDir # \"'\");\n" +
"        Write(\" parent_device='\" # oChannel.Device() # \"'\");\n" +
"        Write(\" index='\" # oChannel.ChnNumber() # \"'\");\n" +
"        Write(\" group_partner='\" # sChnPartnerId # \"'\");\n" +
"        Write(\" aes_available='\" # bChnAESAvailable # \"'\");\n" +
"        Write(\" transmission_mode='\" # sChnMode # \"'\");\n" +
"        !            Write(\" archive='\" # oChannel.ChnArchive() # \"'\");\n" +
"        Write(\" visible='\" # oChannel.Visible() # \"'\");\n" +
"        Write(\" ready_config='\" # oChannel.ReadyConfig() # \"'\");\n" +
"        !            Write(\" link_count='\" # iChnLinkCount # \"'\");\n" +
"        !            Write(\" program_count='\" # iChnProgramCount # \"'\");\n" +
"        !            Write(\" virtual='\" # bChnVirtual # \"'\");\n" +
"        !            Write(\" readable='\" # bChnReadable # \"'\");\n" +
"        !            Write(\" writable='\" # bChnWritable # \"'\");\n" +
"        !            Write(\" eventable='\" # bChnEventable # \"'\");\n" +
"        Write(\" />\")\n" +
"    }\n" +
"}\n" +
"Write(\"</device>\");\n" +
"}\n" +
"}\n" +
"Write(\"</deviceList>\");\n";


var scriptRooms = "object oRoom;\n" +
"string sRoomId;\n" +
"string sRoomName;\n" +
"string sChannelId;\n" +
"Write(\"<roomList>\");\n" +
"foreach (sRoomId, dom.GetObject(ID_ROOMS).EnumUsedIDs())\n" +
"{\n" +
"    oRoom     = dom.GetObject(sRoomId);\n" +
"    Write(\"<room name='\"); WriteXML( oRoom.Name() );\n" +
"    Write(\"' ise_id='\" # sRoomId # \"'>\");\n" +
"    foreach(sChannelId, oRoom.EnumUsedIDs()) {\n" +
"        Write(\"<channel ise_id='\" # sChannelId # \"'/>\");\n" +
"    }\n" +
"    Write(\"</room>\");\n" +
"}\n" +
"Write(\"</roomList>\");\n";

var scriptFunctions = "object oFunction;\n" +
"string sFunctionId;\n" +
"string sChannelId;\n" +
"Write(\"<functionList>\");\n" +
"foreach (sFunctionId, dom.GetObject(ID_FUNCTIONS).EnumUsedIDs())\n" +
"{\n" +
"    oFunction     = dom.GetObject(sFunctionId);\n" +
"    Write(\"<function name='\");WriteXML( oFunction.Name() );\n" +
"    Write(\"' description='\");WriteXML( oFunction.EnumInfo() );\n" +
"    Write(\"' ise_id='\" # sFunctionId # \"'>\");\n" +
"    foreach(sChannelId, oFunction.EnumUsedIDs())\n" +
"    {\n" +
"        Write(\"<channel address='\"); WriteXML( dom.GetObject(sChannelId).Address() );\n" +
"        Write(\"' ise_id='\" # sChannelId # \"'/>\");\n" +
"    }\n" +
"    Write(\"</function>\");\n" +
"}\n" +
"Write(\"</functionList>\");\n";


var scriptFavorites = "var show_datapoint=1;\n" +
"var show_internal=0;\n" +
"object oFavorite;\n" +
"string sFavoriteId;\n" +
"string sFavoriteName;\n" +
"string sChannelId;\n" +
"Write(\"<favoriteList>\");\n" +
"foreach (sFavoriteId, dom.GetObject(ID_FAVORITES).EnumUsedIDs()) {\n" +
"    oFavorite     = dom.GetObject(sFavoriteId);\n" +
"    Write(\"<favorite name='\"); WriteXML( oFavorite.Name() );\n" +
"    Write(\"' ise_id='\" # sFavoriteId # \"'>\");\n" +
"    foreach(sChannelId, oFavorite.EnumIDs()) {\n" +
"        object fav = dom.GetObject(sChannelId);\n" +
    "        if (fav) { \n" +

    "        Write(\"<channel ise_id='\" # sChannelId # \"' name='\");  \n" +
    "        var favType = \"UNKNOWN\";\n" +
    "        if (fav.IsTypeOf(OT_PROGRAM)) { favType = \"PROGRAM\"; }\n" +
    "        if (fav.IsTypeOf(OT_DP))      { favType = \"SYSVAR\";  }\n" +
    "        if (fav.IsTypeOf(OT_CHANNEL)) { favType = \"CHANNEL\"; }\n" +
    "        if (fav.IsTypeOf(OT_ALARMDP)) { favType = \"SYSVAR\"; }\n" +
    "        if (fav.IsTypeOf(OT_FAVORITE)) { favType = \"FAVORITE\"; }\n" +
    "        if (favType != \"UNKNOWN\" ) { \n" +
    "        WriteXML(fav.Name()); Write( \"' column_count='\"); WriteXML(fav.FavColumnCount());\n" +
    "        Write( \"' name_position='\"); WriteXML(fav.FavNamePosition());\n" +
    "        Write( \"' type='\" # favType);\n" +
    "        Write( \"' ctype='\" # fav.ChannelType());\n" +
    "        string canUse = \"false\";\n" +
    "        string id;\n" +
    "        foreach (id, oFavorite.FavControlIDs().EnumIDs()) {\n" +
    "            if (id == sChannelId) { canUse = \"true\"; }\n" +
    "        }\n" +
    "        Write( \"' not_can_use='\" # canUse);\n" +
    "        if (show_datapoint == 1) {\n" +
    "            Write (\"'>\");\n" +
    "            if (favType == \"CHANNEL\") {\n" +
    "                string sDPId;\n" +
    "                foreach (sDPId, fav.DPs().EnumUsedIDs()) {\n" +
    "                    object oDP = dom.GetObject(sDPId);\n" +
    "                    if (oDP) {\n" +
    "                        string dp = oDP.Name().StrValueByIndex(\".\", 2);\n" +
    "                        if ((dp != \"ON_TIME\") && (dp != \"INHIBIT\")) {\n" +
    "                            Write(\"<datapoint\");\n" +
    "                            Write(\" name='\"); WriteXML(oDP.Name());\n" +
    "                            Write(\"' ise_id='\" # sDPId );\n" +
    "                            ! state fragt den aktuellen status des sensors/aktors ab, dauert lange\n" +
    "                            if (show_internal == 1) {\n" +
    "                                Write(\"' state='\"); WriteXML(oDP.State());\n" +
    "                            }\n" +
    "                            ! value nimmt den von der ccu gecachten wert, moeglicherweise nicht korrekt. Ggf. bei einigen geraeten immer abfragen\n" +
    "                            Write(\"' value='\"); WriteXML(oDP.Value());\n" +
    "                            Write(\"' valuetype='\" # oDP.ValueType());\n" +
    "                            Write(\"' timestamp='\" # oDP.Timestamp().ToInteger());\n" +
    "                            Write(\"' />\");\n" +
    "                        }\n" +
    "                    }\n" +
    "                }\n" +
    "            }\n" +
    "            if (favType == \"SYSVAR\") {\n" +
    "                Write(\"<systemVariable\");\n" +
    "                Write(\" name='\"); WriteXML( fav.Name() );\n" +
    "                Write(\"' variable='\"); WriteXML( fav.Variable());\n" +
    "                Write(\"' value='\"); WriteXML( fav.Value());\n" +
    "                Write(\"' value_list='\"); WriteXML( fav.ValueList());\n" +
    "                Write(\"' value_text='\"); WriteXML( fav.ValueList().StrValueByIndex(';', fav.Value()));\n" +
    "                Write(\"' ise_id='\" # fav.ID() );\n" +
    "                Write(\"' min='\"); WriteXML( fav.ValueMin());\n" +
    "                Write(\"' max='\"); WriteXML( fav.ValueMax());\n" +
    "                Write(\"' unit='\"); WriteXML( fav.ValueUnit());\n" +
    "                Write(\"' type='\" # fav.ValueType() # \"' subtype='\" # fav.ValueSubType());\n" +
    "                Write(\"' timestamp='\" # fav.Timestamp().ToInteger());\n" +
    "                Write(\"'/>\");\n" +
    "            }\n" +

"            Write(\"</channel>\");\n" +
"        } else {\n" +
"            Write (\"'/>\");\n" +
"        }\n" +
    "            } else { Write( \"' />\"); }\n" +
    "            } else { Write( \"' />\"); }\n" +
"    }\n" +
"    Write(\"</favorite>\");\n" +
"   Write(\"<user id='\" # USER_ID # \"'/>\");\n" +
"}\n" +
"Write(\"</favoriteList>\");";



