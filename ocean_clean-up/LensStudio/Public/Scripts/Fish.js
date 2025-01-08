/**
 * author: Martina Kessler
*/
//@input int type {"widget":"combobox","values":[{"value":"0","label":"Fish"}]}
//@input int state {"widget":"combobox","values":[{"value":"0","label":"Wounded"},{"value":"1","label":"Happy"},{"value":"2","label":"Colorful"}]}
//@input Asset.ObjectPrefab woundedPrefab
//@input Asset.ObjectPrefab happyPrefab
//@input Asset.ObjectPrefab colorfulPrefab


/**
 * This script stores properties of fish.
 * @param {int}                type           - type of the item (fish)
 * @param {int}                state          - state of the fish (wounded/happy/colorful)
 * @param {Asset.ObjectPrefab} woundedPrefab  - wounded fish prefab
 * @param {Asset.ObjectPrefab} happyPrefab    - happy fish prefab
 * @param {Asset.ObjectPrefab} colorfulPrefab - colorful fish prefab
 */


var arrayIndex;
var speed;
var isMovingTowardsRight; // boolean variable to indicate if the fish moves towards the right
var freezed = false; // boolean variable to indicate if the fish is freezed
var totalFreezeTime; // total time the fish is freezed
var remainingFreezeTime; // time that remains until the fish moves again
var colorfulFish;
var blood;


script.api.type = script.type;
script.api.state = script.state;
script.api.woundedPrefab = script.woundedPrefab;
script.api.happyPrefab = script.happyPrefab;
script.api.colorfulPrefab = script.colorfulPrefab;
script.api.arrayIndex = arrayIndex;
script.api.speed = speed;
script.api.isMovingTowardsRight = isMovingTowardsRight;
script.api.freezed = freezed;
script.api.totalFreezeTime = totalFreezeTime;
script.api.remainingFreezeTime = remainingFreezeTime;
script.api.colorfulFish = colorfulFish;
script.api.blood = blood;