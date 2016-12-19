var _ = require('lodash')
var Ajv = require('ajv');
var ajv = Ajv({v5: true, allErrors: true});

var myRe = /#\/(\S+)\/(\S+)/g;
var schema = getSchema();
var validate = ajv.compile(schema);
var data = getData();

try{
  test(data);
}catch(e){ 
  console.log(e)
}


/// definitions 
function test(data) {
    if(validate(data)){
      console.log('valid data: ' + JSON.stringify(data));
    }
    else{
      var errorsNormalized = setErrorMessageFromSchema(validate.errors, schema);
      console.log('errors:\n', errorsNormalized);
      
    }
}

function setErrorMessageFromSchema(errors, schema){
  return _.map(errors,_.partial(mapError, schema));
}

 /**
   * @param {Error} error this is param.
   * @return {number} this is return.
   */
function mapError(schema, error){
  
  var {path, keyword} = separateSchemaPath(error.schemaPath);
  var property = _.get(schema, path);

  if(property.error && property.error.hasOwnProperty(keyword)){
    error.message = property.error[keyword];
  }

  return error;  
}


function separateSchemaPath(schemaPath){
 // initialize regular expression
 myRe.lastIndex = -1;
 var array = myRe.exec(schemaPath);
 return {
  path: array[1].replace(/\//g,"."),
  keyword: array[2]
 }
}


function getData(){
return {
  "foo": 2345,
  "moreThanFoo": 12346,
  "bar": "",
  "sameAsBar": "2/bar",
  "secondbar": "",
  "baz": {
    "foo": 2345
    ,"foobaz": ""
  },
   "smaller": 12,
   "larger": 2
};
}

function getSchema(){
return {
  "description": "Any validation failures are shown in the right-hand Messages pane.",
  "type": "object",
  "properties": {
    "smaller": {"type": "number"},
    "larger": {
        "type": "number",
        "minimum": {"$data": "1/smaller"},
        "exclusiveMinimum": true
    },
    "foo": {
      "type": "number"
    },
    "moreThanFoo": {
      "type": "number"
    },
    "bar": {
      "type": "string",
      "pattern": "\\S+",
      "error": {
        "pattern": "it shouldn't be empty",
      },      
    },
    "sameAsBar": {
      "constant": {
        "$data": "1/bar"
      }
    },
    "secondbar": {
      "type": "string",
      "pattern": "\\S+",
      "error": {
        "pattern": "it shouldn't be empty",
      },      
    },
    "baz": {
      "type": "object",
      "switch": [
        {
          "if": {
            "properties": {
              "foo": {
                "constant": {
                  "$data": "2/foo"
                }
              }
            },
            "required": [
              "foo"
            ]
          },
          "then": {
            "properties": {
              "foobaz": {
               "type": "string",
               "pattern": "\\S+",
               "error":{
                 "keyword": "keyword",
                  "dataPath": "dataPath",
                  "schemaPath": "schemaPath",
                  "params": "params",
                  "message": "message",
                  "schema": "schema",
                  "parentSchema": "parentSchema",
                  "data": "data"
               }
            }
            },
            "required": [
              "foobaz"
            ]
          }
        },
        {
          "if": {
            "properties": {
              "bar": {
                "constant": {
                  "$data": "2/bar"
                }
              }
            },
            "required": [
              "bar"
            ]
          },
          "then": {
            "properties": {
              "barbaz": {
                "type": "number"
              }
            },
            "required": [
              "barbaz"
            ]
          }
        },
        {
          "then": false
        }
      ]
    }
  }
}
}
