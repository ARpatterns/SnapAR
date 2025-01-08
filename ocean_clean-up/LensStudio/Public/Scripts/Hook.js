/**
 * author: Martina Kessler
*/
//@input SceneObject hookColliderImage
//@input int type {"widget":"combobox","values":[{"value":"2","label":"Hook"}]}


/**
 * This script stores properties of the hook;
 * @param {int}  type  - type of the item (hook)
 */


var speed;
var isMovingDown; // boolean variable to indicate if the hook moves up or down
var hasItemOnHook; // boolean variable to indicate if the hook has an item attached
var hookedItem;
var positionIndex; // index (from 0 to numTrash - 1) of the position at which the hook is going down (0 = left most trash item, numTrash -1 = right most trash item)


script.api.type = script.type;
script.api.hookColliderImage = script.hookColliderImage;
script.api.speed = speed;
script.api.isMovingDown = isMovingDown;
script.api.hasItemOnHook = hasItemOnHook;
script.api.hookedItem = hookedItem;
script.api.positionIndex = positionIndex;