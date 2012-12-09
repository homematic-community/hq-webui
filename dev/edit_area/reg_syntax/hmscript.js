editAreaLoader.load_syntax["hmscript"] = {
	'DISPLAY_NAME' : 'Homematic Script'
	,'COMMENT_SINGLE' : {1 : '! '}
	//,'COMMENT_MULTI' : {'/*' : '*/'}
	,'QUOTEMARKS' : {1: "'", 2: '"'}
	,'KEYWORD_CASE_SENSITIVE' : true
	,'KEYWORDS' : {
		'statements' : [
            'foreach', 'else', 'if', 'while', 'dom', 'system'
		]
 		,'keywords' : [
            'object', 'var', 'integer', 'string', 'boolean', 'time', 'real', '$this$', '$src$'
		]
    	,'functions' : [

			'VarType', 'ToFloat', 'ToInteger', 'ToString', 'ToTime', 'Year', 'Month', 'Day', 'Hour', 'Minute', 'Second',
            'Week', 'Weekday', 'Yesterday', 'IsLocaltime', 'IsDST', 'Format', 'Length', 'Substr', 'Find', 'Split',
            'StrValueByIndex', 'ID', 'GetObject', 'CreateObject', 'Date', 'IsVar', 'GetVar', 'Name', 'Type', 'TypeName',
            'IsTypeOf', 'State', 'Channels', 'Interface', 'Address', 'HssType', 'Device', 'DPs', 'Interface', 'Address',
            'ChnGroupPartnerId', 'ChnDirection', 'ChnAESActive', 'ChnArchive', 'ChnRoom', 'ChnFunction', 'DPByHssDP',
            'ValueType', 'Channel', 'Value', 'LastValue', 'Operations', 'Timestamp', 'Variable','Count', 'EnumUsedIDs',
            'EnumUsedNames', 'Get', 'GetAt', 'Active', 'Add', 'ChnArchive', 'ChnLabel', 'DestSingleCount',
            'DestSingleDestination', 'DestinationDP', 'DestinationChannel', 'DestinationParam', 'DestinationValue',
            'DestinationValueType', 'DestinationValueParam', 'DestinationValueParamType', 'DPArchive', 'DPInfo',
            'PrgInfo', 'Rule', 'RuleDestination', 'RuleConditions'


        ]
	}
	,'OPERATORS' :[
		'+', '-', '/', '*', '=', '<', '>', '%', '!', '#', '|', '&'
	]
	,'DELIMITERS' :[
		'(', ')', '{', '}'
	]
	,'STYLES' : {
		'COMMENTS': 'color: #AAAAAA;'
		,'QUOTESMARKS': 'color: #000000;'
		,'KEYWORDS' : {
			'statements' : 'color: #60CA00;'
			,'keywords' : 'color: #48BDDF;'
			,'functions' : 'color: #2B60FF;'
		}
		,'OPERATORS' : 'color: #FF00FF;'
		,'DELIMITERS' : 'color: #0038E1;'
				
	}
	,'AUTO_COMPLETION' :  {
		"default": {	// the name of this definition group. It's posisble to have different rules inside the same definition file
			"REGEXP": { "before_word": "[^a-zA-Z0-9_]|^|;|\\."	// \\s|\\.|
						,"possible_words_letters": "[a-zA-Z0-9_]+"
						,"letter_after_word_must_match": "[^a-zA-Z0-9_]|$"
						,"prefix_separator": "DummyPrefix" // "\\."
					}
			,"CASE_SENSITIVE": true
			,"MAX_TEXT_LENGTH": 100		// the maximum length of the text being analyzed before the cursor position
			,"KEYWORDS": {
				'': [	// the prefix of thoses items
						/**
						 * 0 : the keyword the user is typing
						 * 1 : (optionnal) the string inserted in code ("{@}" being the new position of the cursor, "§" beeing the equivalent to the value the typed string indicated if the previous )
						 * 		If empty the keyword will be displayed
						 * 2 : (optionnal) the text that appear in the suggestion box (if empty, the string to insert will be displayed)
						 */
                    ['foreach', 'foreach ({@})', ''],
                    ['while', 'while ({@})', ''],
                    ['if', 'if ({@})', ''],
                    ['else'],
                    ['Write', 'Write({@})', ''],
                    ['WriteLine', 'WriteLine({@})', ''],
                    ['system'],
                    ['integer'],
                    ['string'],
                    ['boolean'],
                    ['$this$'],
                    ['$src$'],
                    ['VarType()'], ['ToFloat()'], ['ToInteger()'], ['ToString()'], ['ToTime()'], ['Year()'], ['Month()'], ['Day()'], ['Hour()'], ['Minute()'], ['Second()'], ['Week()'], ['Weekday()'],
                    ['Yesterday()'], ['IsLocaltime()'], ['IsDST()'], ['Format()'], ['Length()'], ['Substr()'], ['Find()'], ['Split()'], ['StrValueByIndex()'], ['ID()'], ['GetObject', 'GetObject({@})', ''],
                    ['Date()'], ['IsVar()'], ['GetVar()'], ['Name()'], ['Type()'], ['TypeName()'], ['IsTypeOf()'], ['State()'],
                    ['Channels()'], ['Interface()'], ['Address()'], ['HssType()'],
                    ['Device()'], ['DPs()'], ['Interface()'], ['Address()'], ['ChnGroupPartnerId()'], ['ChnDirection()'], ['ChnAESActive()'], ['ChnArchive()'], ['ChnRoom()'], ['ChnFunction()'], ['DPByHssDP'],
                    ['ValueType()'], ['Channel()'], ['Value()'], ['LastValue()'], ['Operations()'], ['Timestamp()'], ['Variable()'],
                    ['Count()'], ['EnumUsedIDs()'], ['EnumUsedNames()'], ['Get()'], ['GetAt()']
                ],
		    	'system' : [
			    		 ['Date()', 'Date(string format)']
			    		,['GetVar()', 'GetVar(string name)']
			    		,['IsVar()', 'IsVar(string name)']
					]
			}
		}
	}
};
