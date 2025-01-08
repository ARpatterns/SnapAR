/**
 * author: Martina Kessler
*/

/**
 * This script provides utility functions that are needed across different scripts.
 */

/**
 * prints the variable name and value
 * @param {Object} variable - variable to print
 */
global.printVariable = function(variable){
    var variableObject = {variable};
    var variableName = Object.keys(variableObject)[0];
    print(variableName + ': ' + variable);
}


/**
 * returns a random integer between min (inclusive) and max (inclusive)
 * @param {Number} min - minimum
 * @param {Number} max - maximum
 */
global.getRandomInteger = function(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * returns a random float between min (inclusive) and max (exclusive)
 * @param {Number} min - minimum
 * @param {Number} max - maximum
 */
global.getRandomFloat = function(min, max){
    return Math.random() * (max - min) + min;
}


/**
 * reads a csv and returns it
 * @param {String} csv  - csv string, comma separated values with \n as the new line character
 */
global.readCSV = function(csv, data){
    var lines = csv.split('\n');
    //var columnNamesLine = lines[0];
    //var columnNames = parse(columnNamesLine);
    //var dataLines = lines.slice(1);
    return lines.map(parse);
}


/**
 * parses one row of the csv
 * @param {String} row - csv string, comma separated values of one line
 */
function parse(row){
    var entries = [];                                                 
    var entry = [];
    row.split('').forEach(function (character) {                         
        if(character == ",") {                           
            entries.push(entry.join(''));                                  
            entry = [];                                                    
        }
        else {
            entry.push(character);                                         
        }                                                                                                                                
    });
    entries.push(entry.join(''));                                        
    return entries;                                                      
}


/**
 * converts screen coordinates of a perspective camera to coordinates of an orthographic camera
 * perspective camera:     orthographic camera:
 * (0,0) -- (1,0)          (-1,1)  -- (1,1)
 *   |        |               |         |
 * (0,1) -- (1,1)          (-1,-1) -- (1,-1)
 * @param {vec2} perspectiveCameraCoordinates - scrreen coordinates of the perspective camera
 */
global.perspectiveToOrthographic = function(perspectiveCameraCoordinates){
    x = 2 * perspectiveCameraCoordinates.x - 1;
    y = -2 * perspectiveCameraCoordinates.y + 1;
    return new vec2(x, y);
}