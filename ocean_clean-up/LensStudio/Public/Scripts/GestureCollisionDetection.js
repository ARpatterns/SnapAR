/**
 * author: Martina Kessler
*/
//@input Component.Camera camera
//@input SceneObject cameraScreen
//@input SceneObject scissorsCollider
//@input Component.ScriptComponent levelManager
//@input Component.ScriptComponent itemStorage
//@input Component.ScriptComponent scoreManager


/**
 * This script provides function for checking if the camera and scissors collide with items.
 * @param {Component.Camera}          camera           - perspective camera used for screen - world coordinate transforms
 * @param {SceneObject}               cameraScreen     - screen image of the camera screen (is invisible and only used for collision detection)
 * @param {SceneObject}               scissorsCollider - screen image of the scissors collider (is invisible and only used for collision detection)
 * @param {Component.ScriptComponent} levelManager     - LevelManager script
 * @param {Component.ScriptComponent} itemStorage      - ItemStorage script
 * @param {Component.ScriptComponent} scoreManager     - scoreManager script
 */


var fishType = 0;
var trashType = 1;


function initialize() {
    if (!script.camera || !script.cameraScreen || !script.scissorsCollider || !script.levelManager || !script.itemStorage || !script.scoreManager) {
        print("Missing input on " + script.getSceneObject().name);
    }
}


initialize();


/**
 * takes a picture of the fish that are visible in the camera screen
 * taking a picture means that the fish poses/is freezed for 2 seconds
 * The function is called by the photo_start object as a response to the photo_start trigger
 */
// fish only pose for one picture
script.api.takePicture = function(){
    // loop over the fish from the back because if we loop over the fish from the front, fish are removed
    // and we don't loop over all fish
    for(var i = script.itemStorage.api.fish.length - 1; i >= 0; --i){
        var currentFish = script.itemStorage.api.fish[i];
        var fishScript = currentFish.getComponent("Component.ScriptComponent");
        
        if (fishScript.script.state == 1){
            // fish is in the happy state
            
            if (!fishScript.script.freezed){ // comment this out if fish should pose for several pictures in a row
                if (checkCameraFishCollision(script.cameraScreen, currentFish)){      
                    // remove comments if fish should pose for several pictures in a row
                    //if (fishScript.script.freezed){
                        //fishScript.script.colorfulFish.destroy();
                    //}
                    
                    var position = currentFish.getComponent("Component.ScreenTransform").anchors.getCenter();
                    var arrayIndex = fishScript.script.arrayIndex;
                    var speed = fishScript.script.speed;
                    var isMovingTowardsRight = fishScript.script.isMovingTowardsRight;
                    
                    if (typeof(fishScript.script.colorfulFish) !== Object){   
                        var colorfulFish = script.levelManager.api.createFish(fishScript.script.colorfulPrefab, arrayIndex, position, speed, isMovingTowardsRight, false);
                    }
                    
                    fishScript.script.freezed = true;
                    fishScript.script.totalFreezeTime = 2;
                    fishScript.script.remainingFreezeTime = 2;
                    fishScript.script.colorfulFish = colorfulFish;  
                    
                    script.scoreManager.api.incrementScore(1);
                }
            }
        }
    }
}


// fish only pose for one picture
/*
script.api.takePicture = function(){
    // loop over the fish from the back because if we loop over the fish from the front, fish are removed
    // and we don't loop over all fish
    for(var i = script.itemStorage.api.fish.length - 1; i >= 0; --i){
        var currentFish = script.itemStorage.api.fish[i];
        var fishScript = currentFish.getComponent("Component.ScriptComponent");
        
        if (fishScript.script.state == 1){
            // fish is in the happy state
            if (!fishScript.script.freezed){
                
                var position = currentFish.getComponent("Component.ScreenTransform").anchors.getCenter();
                var arrayIndex = fishScript.script.arrayIndex;
                var speed = fishScript.script.speed;
                var isMovingTowardsRight = fishScript.script.isMovingTowardsRight;
                
                if (typeof(fishScript.script.colorfulFish) !== Object){   
                    var colorfulFish = createFish(fishScript.script.colorfulPrefab, arrayIndex, position, speed, isMovingTowardsRight, false);
                }
                
                fishScript.script.freezed = true;
                fishScript.script.totalFreezeTime = 2;
                fishScript.script.remainingFreezeTime = 2;
                fishScript.script.colorfulFish = colorfulFish;   
            }
        }
    }
}*/


/**
 * cuts through the rope
 * The function is called by the scissors_closed_start object as a response to the scissors_closed_start trigger
 */
script.api.cutRope = function(){
    var currentHook = script.itemStorage.api.hook;
    if (currentHook != 0){
        
        if (checkScissorsRopeCollision(script.scissorsCollider, currentHook)){
            var hookScript = currentHook.getComponent("Component.ScriptComponent");
        
            if (hookScript.script.hasItemOnHook){
                var item = hookScript.script.hookedItem;
                var itemScript = item.getComponent("Component.ScriptComponent");
                
                if (itemScript.script.type == fishType){
                    script.itemStorage.api.fish.push(item);
                }
                else if (itemScript.script.type == trashType){
                    itemScript.script.isFalling = true;
                    script.itemStorage.api.trash.push(item);
                }
            }    
            
            hookScript.script.hasItemOnHook = false; 
            script.itemStorage.api.hook.destroy();
            script.itemStorage.api.hook = 0;
            script.levelManager.api.createRandomHookAfterRandomTime();
        }       
    }
}


/**
 * heals the fish = shows the happy fish
 * The function is called by the heart_start object as a response to the heart_start trigger
 */
/*
script.api.healFish = function(){
    // loop over the fish from the back because if we loop over the fish from the front, fish are removed
    // and we don't loop over all fish
    for(var i = script.itemStorage.api.fish.length - 1; i >= 0; --i){
        var currentFish = script.itemStorage.api.fish[i];
        var fishScript = currentFish.getComponent("Component.ScriptComponent");  
        var isMovingTowardsRight = fishScript.script.isMovingTowardsRight;
        
        if (fishScript.script.state == woundedState){
            var position = currentFish.getComponent("Component.ScreenTransform").anchors.getCenter();
            var arrayIndex = fishScript.script.arrayIndex;
            var speed = fishScript.script.speed;
            script.itemStorage.api.fish[i].destroy();
            script.itemStorage.api.fish.splice(i, 1);
            script.levelManager.api.createFish(fishScript.script.happyPrefab, arrayIndex, position, speed, isMovingTowardsRight, true);
        }
    }
}*/


/**
 * checks if the cameraScreen contains part of the fish
 * @param {SceneObject} cameraScreen - camera Screen
 * @param {SceneObject} fish         - fish
 */
function checkCameraFishCollision(cameraScreen, fish){
    var cameraScreenRectangle = cameraScreen.getComponent("Component.ScreenTransform").anchors;
    var fishRectangle = fish.getComponent("Component.ScreenTransform").anchors;
    
    return checkRectangleRectangleCollision(cameraScreenRectangle, fishRectangle);
}


/**
 * checks if the cameraScreen contains part of the fish
 * @param {SceneObject} cameraScreen - camera Screen
 * @param {SceneObject} fish         - fish
 */
function checkScissorsRopeCollision(scissorsCollider, rope){
    var scissorsColliderRectangle = scissorsCollider.getComponent("Component.ScreenTransform").anchors;
    var ropeRectangle = rope.getComponent("Component.ScreenTransform").anchors;
    
    return checkRectangleRectangleCollision(scissorsColliderRectangle, ropeRectangle);
}


/**
 * checks if the two rectangles overlap
 * @param {Rectangle} rectangle1 - rectangle 1
 * @param {Rectangle} rectangle2 - rectangle 2
 */
function checkRectangleRectangleCollision(rectangle1, rectangle2){
    var left1 = rectangle1.left;
    var right1 = rectangle1.right;
    var top1 = rectangle1.top;
    var bottom1 = rectangle1.bottom;
    
    var left2 = rectangle2.left;
    var right2 = rectangle2.right;
    var top2 = rectangle2.top;
    var bottom2 = rectangle2.bottom;
    
    if (left1 < right2 && left2 < right1 && bottom1 < top2 && bottom2 < top1){
        
        return true;
    }
    else{
        return false;
    }
}