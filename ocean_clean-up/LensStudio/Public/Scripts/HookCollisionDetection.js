/**
 * author: Martina Kessler
*/
//@input Component.ScriptComponent itemStorage
//@input Component.ScriptComponent scoreManager


/**
 * This script provides function for checking if hook collides with items.
 * @param {Component.ScriptComponent} itemStorage  - ItemStorage script
 * @param {Component.ScriptComponent} scoreManager - scoreManager script
 */


var fishType = 0;
var trashType = 1;


function initialize() {
    if (!script.itemStorage || !script.scoreManager) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    script.createEvent("UpdateEvent").bind(onUpdate);
}


initialize();


/**
 * detects the hook collides with an item
 */
function onUpdate(e){
    detectHookCollision();
}


/**
 * detects if the hook collides with a fish or with a trash item
 * if the hook collides with both a fish and a trash item, then the fish item is attached to the hook
 */
function detectHookCollision(){
    var currentHook = script.itemStorage.api.hook;
    if (currentHook != 0){
        var hookScript = currentHook.getComponent("Component.ScriptComponent");
        if (!hookScript.script.hasItemOnHook){
            // if there is no item on the hook, first check fish collision
            checkItemCollision(currentHook, script.itemStorage.api.fish);
            
            // if there is no fish on hook after checking fish collision, then check trash collision
            if (!hookScript.script.hasItemOnHook){
                checkItemCollision(currentHook, script.itemStorage.api.trash);
            }
        }   
        else{
            // if there is a trash item on the hook, then check if there is a fish collision
            var item = hookScript.script.hookedItem;
            var itemScript = item.getComponent("Component.ScriptComponent");
            if (itemScript.script.type == trashType){
                checkItemCollision(currentHook, script.itemStorage.api.fish);
            }
        }
    }
}


/**
 * checks if the currentHook collides with an item, if the hook collides with several items, then it takes the closest item
 * @param {SceneObject}   currentHook - current hook
 * @param {SceneObject[]} items       - items
 */
function checkItemCollision(currentHook, items){
    var minDistance = 1;
    var collisionDetected = false;
    var newHookedItem;
    var newHookedItemIndex;
    
    var hookScript = currentHook.getComponent("Component.ScriptComponent");
    var objScreenTransformHook = currentHook.getComponent("Component.ScreenTransform");
    var hookPositionBottom = objScreenTransformHook.anchors.bottom;
    var hookPositionLeft = objScreenTransformHook.anchors.left;
    var hookPositionRight = objScreenTransformHook.anchors.right;
    var hookCenterX = 0.5 * (hookPositionLeft + hookPositionRight);
    var hookColliderImage = hookScript.script.hookColliderImage;
    var hookColliderRectangle = hookColliderImage.getComponent("Component.ScreenTransform").anchors;
    
    for (var i = 0; i < items.length; ++i){
        var currentItem = items[i];
        if (currentItem !== undefined){
            var objScreenTransformItem = currentItem.getComponent("Component.ScreenTransform");
            
            var itemPositionLeft = objScreenTransformItem.anchors.left;
            var itemPositionRight = objScreenTransformItem.anchors.right;            
            var itemPositionTop = objScreenTransformItem.anchors.top;
            var itemPositionBottom = objScreenTransformItem.anchors.bottom;
            var itemCenterY = 0.5 * (itemPositionTop + itemPositionBottom);
            var itemRectangle = objScreenTransformItem.anchors;
            
            if (hookCenterX > itemPositionLeft && hookCenterX < itemPositionRight){
                var distance = Math.abs(hookPositionBottom - itemCenterY);
                //print(currentItem.name + ": " + distance);
                if (distance < 0.02){
                    collisionDetected = true;
                    // find the item with the smallest distance
                    if (distance < minDistance){
                        minDistance = distance;
                        newHookedItem = currentItem;
                        newHookedItemIndex = i;
                    }
                    
                    if (hookScript.script.hasItemOnHook){
                        // the hooked item must be a trash item, let it fall down
                        var item = hookScript.script.hookedItem;
                        var itemScript = item.getComponent("Component.ScriptComponent");
                        itemScript.script.isFalling = true;
                        script.itemStorage.api.trash.push(item);
                    }               
                }
            }
        }
        /*
        if (checkRectangleRectangleCollision(itemRectangle, hookColliderRectangle)){
            collisionDetected = true;
            //minDistance = distance;
            newHookedItem = currentItem;
            newHookedItemIndex = i;
            
            if (hookScript.script.hasItemOnHook){
                // the hooked item must be a trash item, let it fall down
                var item = hookScript.script.hookedItem;
                var itemScript = item.getComponent("Component.ScriptComponent");
                itemScript.script.isFalling = true;
                script.itemStorage.api.trash.push(item);
            }
        }*/
    }
    
    if (collisionDetected){
        var itemScript = newHookedItem.getComponent("Component.ScriptComponent");
        
        if(itemScript.script.freezed){
            itemScript.script.colorfulFish.destroy();
        }
        
        if (itemScript.script.type == fishType){
            script.scoreManager.api.incrementScore(-1);
            global.behaviorSystem.sendCustomTrigger("fish_hooked_up");
        }
        else if (itemScript.script.type == trashType){
            global.behaviorSystem.sendCustomTrigger("trash_hooked_up");
        }
        
        hookScript.script.hasItemOnHook = true;
        hookScript.script.hookedItem = newHookedItem;
        items.splice(newHookedItemIndex, 1);
        
        var hookScript = currentHook.getComponent("Component.ScriptComponent");
        hookScript.script.isMovingDown = false;
    }
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