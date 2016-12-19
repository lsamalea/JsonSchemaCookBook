# creating a switch with anyOf and if/then keywords:

this example:

    "switch": {
        {
            "if": {"$ref": "#/definitions/condition1"},
            "then": {"$ref": "#/definitions/schema1"}
        },
        {
            "if": {"$ref": "#/definitions/condition2"},
            "then": {"$ref": "#/definitions/schema2"} 
        },
        {
            "if": { "not": { "anyOf": [
                {"$ref": "#/definitions/condition1"},
                {"$ref": "#/definitions/condition2"}
            ] } },
            "then": { "ref": "#/definitions/defaultSchema" }            
        },
        {
            "then" : false
        }
    ]

is equivalent to




    "anyOf": [
        {
            "if": {"$ref": "#/definitions/condition1"},
            "then": {"$ref": "#/definitions/schema1"},
            "else": false
        },
        {
            "if": {"$ref": "#/definitions/condition2"},
            "then": {"$ref": "#/definitions/schema2"},
            "else": false
        },
        {
            "if": { "not": { "anyOf": [
                {"$ref": "#/definitions/condition1"},
                {"$ref": "#/definitions/condition2"}
            ] } },
            "then": { "ref": "#/definitions/defaultSchema" },
            "else": false
        }
    ]


# creating a dependencies keyword construction with allOf and if/then keywords:

    this example:

    {
        "dependencies": {
            "foo": ["a", "b", "c"],
            "bar": {"patternProperties": {"^[a-z]": {"type": "number"}}}
        }
    }

is equivalent to

    {
        "allOf": [
            {
                "if": {"required": ["foo"]},
                "then": {"required": ["a", "b", "c"]}
            },
            {
                "if": {"required": ["bar"]},
                "then": {"patternProperties": {"^[a-z]": {"type": "number"}}}
            }
        ]
    }



