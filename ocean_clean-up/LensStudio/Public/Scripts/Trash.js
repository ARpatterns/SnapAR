/**
 * author: Martina Kessler
*/
//@input int type {"widget":"combobox","values":[{"value":"1","label":"Trash"}]}


/**
 * This script stores properties of trash.
 * @param {int}  type  - type of the item (trash)
 */


var isFalling; // boolean variable to indicate if the trash is falling (after it was dropped from a hook)
var positionIndex; // boolean variable to indicate if the trash was removed (the hook moved it up to the top of the screen)


function initialize(){
    type = 1;
}


initialize();


script.api.type = script.type;
script.api.isFalling = script.isFalling;
script.api.positionIndex = script.positionIndex;