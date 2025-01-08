/**
 * author: Martina Kessler
*/
//@input int type {"widget":"combobox","values":[{"value":"2","label":"Blood"}]}


/**
 * This script stores properties of blood.
 * @param {int}  type  - type of the item (trash)
 */


function initialize(){
    type = 2;
}


initialize();


script.api.type = script.type;