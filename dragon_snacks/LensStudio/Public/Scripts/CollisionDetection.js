/**
 * author: Martina Kessler
*/
//@input Component.Camera camera
//@input Component.ScriptComponent handTracking
//@input Component.ScriptComponent scoreManager
//@input Component.ScriptComponent itemStorage
//@input float foodCollisionRadius
//@input float bombCollisionRadius
//@input int handType {"widget":"combobox","values":[{"value":"0","label":"Left"},{"value":"1","label":"Right"}]}

/**
 * This script provides function for checking if the hand collides with items and it takes care of moving the food items in the mouth.
 * @param {Component.Camera}          camera              - perspective camera used for screen - world coordinate transforms
 * @param {Component.ScriptComponent} handTracking        - HandTracking script
 * @param {Component.ScriptComponent} scoreManager        - ScoreManager script
 * @param {Component.ScriptComponent} itemStorage         - ItemStorage script
 * @param {float}                     foodCollisionRadius - radius used for food collision detection
 * @param {float}                     bombCollisionRadius - radius used for bomb collision detection
 * @param {int}                       handType            - hand type (left or right)
 */


var handString;
var foodCollisionEnabled = false;
var score = 0;

function initialize() {
    if (!script.camera || !script.handTracking || !script.scoreManager || !script.itemStorage || !script.foodCollisionRadius || !script.bombCollisionRadius) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    switch (script.handType) {
        case 0:
            handString = 'left';
            break;
        case 1:
            handString = 'right';
            break;
    }
}


initialize();


function getFoodInMouth(){
    switch (script.handType) {
        case 0:
            return script.itemStorage.api.foodInMouthLeft;
            break;
        case 1:
           return script.itemStorage.api.foodInMouthRight;
            break;
    }
}


function resetFoodInMouth(){
    switch (script.handType) {
        case 0:
            script.itemStorage.api.foodInMouthLeft = [];
            break;
        case 1:
            script.itemStorage.api.foodInMouthRight = [];
            break;
    }
}


/**
 * starts the food collision detection
 * the function is called as a response to the trigger mouth_open_left_start and mouth_open_right_start
 */
script.api.startDetectingFoodCollision = function(){
    foodCollisionEnabled = true;
}


/**
 * stops the food collision detection
 * the function is called as a response to the trigger mouth_closed_left_start, mouth_closed_right_start, bomb_touched_left and bomb_touched_right
 */
script.api.stopDetectingFoodCollision = function(){
    foodCollisionEnabled = false;
    
    if (getFoodInMouth().length > 0){
        script.scoreManager.api.incrementScore(score);
        score = 0;
        destroyFood();
        global.behaviorSystem.sendCustomTrigger("food_eaten_" + handString);
    }
}


/**
 * detects if the hand collides with food items
 * sends a custom trigger if there is a collision
 */
function onUpdate(e){
    updatefoodInMouth();
    detectFoodCollision();
}


/**
 * lets the food items in the mouth follow the mouth position
 * if the hand is not tracked, then the food items are disabled
 */
function updatefoodInMouth(){
    var foodInMouth = getFoodInMouth();
    
    if (script.handTracking.api.isTracking()){
        var mouthPosition = script.handTracking.api.getJointsAveragePosition(["index-3", "thumb-3"]);
        var perspectiveCamerasScreenPositionMouth = script.camera.worldSpaceToScreenSpace(mouthPosition);
        var orthographicCamerasScreenPositionMouth = perspectiveToOrthographic(perspectiveCamerasScreenPositionMouth);
        
        for (var i = 0; i < foodInMouth.length; ++i){
            foodInMouth[i].enabled = true;
            var objScreenTransform = foodInMouth[i].getComponent("Component.ScreenTransform");
            objScreenTransform.anchors.setCenter(orthographicCamerasScreenPositionMouth);
        }
    }
    else{
        for (var i = 0; i < foodInMouth.length; ++i){
            foodInMouth[i].enabled = false;
        }
    }
}


/**
 * detects if the hand collides with food items
 * sends a custom trigger if there is a collision and makes the food items follow the mouth
 */
function detectFoodCollision(){
    var foodInMouth = getFoodInMouth();
    
    if (foodCollisionEnabled){
        var collisionDetectedCorrectFood = false;
        var collisionDetectedWrongFood = false;
        
        if (script.handTracking.api.isTracking()){
            var foodItems = script.itemStorage.api.items;
            
            for (var i = 0; i < foodItems.length; ++i){
                var itemScript = foodItems[i].getComponent("Component.ScriptComponent");  
                
                if (itemScript.script.itemType == 0){
                    if(detectItemCollision(foodItems[i], script.foodCollisionRadius)){
                                          
                        
                        if (itemScript.script.handType == script.handType){
                            collisionDetectedCorrectFood = true;
                            score++;
                        }
                        else{
                            collisionDetectedWrongFood = true;
                            score--;
                        }
                        
                        foodInMouth.push(foodItems[i]);
                        foodItems.splice(i, 1);
                    }
                }
            }
            
            if (collisionDetectedCorrectFood){
                global.behaviorSystem.sendCustomTrigger("food_in_mouth_" + handString + "_correct");
            }
            
            if (collisionDetectedWrongFood){
                global.behaviorSystem.sendCustomTrigger("food_in_mouth_" + handString + "_wrong");
            }
        }
    }
}


/**
 * destroys all the food items currently in the mouth
 */
function destroyFood(){
    var foodInMouth = getFoodInMouth();
    for (var i = 0; i < foodInMouth.length; ++i){
        foodInMouth[i].destroy();
    }
    
    resetFoodInMouth();
}


/**
 * destroys all the food items currently in the mouth and does not increment the score
 * the function is called as a response to the bomb_touched_left and bomb_touched_right trigger
 */
script.api.removeFood = function(){
    destroyFood();
    score = 0;
}


/**
 * detects if the hand collides with bomb items
 * sends a custom trigger if there is a collision
 */
script.api.detectBombCollision = function(){
    var collisionDetected = false;
    
    if (script.handTracking.api.isTracking()){
        var bombItems = script.itemStorage.api.items;
        
        for (var i = 0; i < bombItems.length; ++i){
            var itemScript = bombItems[i].getComponent("Component.ScriptComponent");   
                
            if (itemScript.script.itemType == 1){
                if(detectItemCollision(bombItems[i], script.bombCollisionRadius)){
                    collisionDetected = true;
                    bombItems[i].destroy();
                    bombItems.splice(i, 1);
                }
            }
        }
        
        if (collisionDetected){
            switch (script.handType) {
                case 0:
                    global.behaviorSystem.sendCustomTrigger("bomb_touched_left");
                    break;
                case 1:
                    global.behaviorSystem.sendCustomTrigger("bomb_touched_right");
                    break;
            }
        }
    }
}


/**
 * detects collision of item and hand, if there is a collision, then the item is destroyed, returns true if there is a collision, false otherwise
 * @param {Item}   items  - items that are checked against the hand
 * @param {Number} radius - radius for collision detection
 */
function detectItemCollision(item, radius){
    var collisionDetected = false;
    var currentItem = item;
    
    // detects if the distance between the item and the average joint position of the index finger tip
    // and the thumb tip (this is approximately the position of the mouth) is smaller than foodCollisionRadius
    var screenPositionItem = currentItem.getComponent("Component.ScreenTransform").anchors.getCenter();
    var mouthPosition = script.handTracking.api.getJointsAveragePosition(["index-3", "thumb-3"]);
    var perspectiveCamerasScreenPositionMouth = script.camera.worldSpaceToScreenSpace(mouthPosition);
    var orthographicCamerasScreenPositionMouth = perspectiveToOrthographic(perspectiveCamerasScreenPositionMouth);
    var distanceMouthItem = screenPositionItem.distance(orthographicCamerasScreenPositionMouth);
    
    if (distanceMouthItem < radius){
        collisionDetected = true;
    }
    
    return collisionDetected;
}