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