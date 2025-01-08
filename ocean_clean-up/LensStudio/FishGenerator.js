/**
 * author: Martina Kessler
*/
//@input Component.ScriptComponent itemStorage
//@input Asset.ObjectPrefab[] woundedPrefabs
//@input Asset.ObjectPrefab[] aggressivePrefabs
//@input Asset.ObjectPrefab[] happyPrefabs
//@input Asset.ObjectPrefab[] colorfulPrefabs
//@input Asset.ObjectPrefab hookPrefab
//@input Asset.ObjectPrefab pictureFramePrefab
//@input float waitTime = 5.0
//@input float simulationSpeed = 1.0



/**
 * This script generates a random fish, shows it for waitTime seconds on the screen, then generates the next random fish.
 * It also takes care of the game logic: It shows the happy fish if the correct gesture was made and takes a picture.
 * @param {Component.ScriptComponent} itemStorage        - itemStorage script
 * @param {Asset.ObjectPrefab[]}      woundedPrefabs     - prefabs for the wounded fish
 * @param {Asset.ObjectPrefab[]}      aggressivePrefabs  - prefabs for the aggressive fish
 * @param {Asset.ObjectPrefab[]}      happyPrefabs       - prefabs for the happy fish
 * @param {Asset.ObjectPrefab[]}      colorfulPrefabs    - prefabs for the colorful fish
 * @param {Asset.ObjectPrefab[]}      hookPrefab         - prefab for the hook
 * @param {Asset.ObjectPrefab[]}      pictureFramePrefab - prefab for the picture frame
 * @param {float}                     waitTime           - time to wait until the next with is generated
 * @param {float}                     simulationSpeed    - speed of the whole simulation, can be used for debugging to make it faster or slower
 */


var passedTime = 0;
var currentFish;
var currentHook;
var fishState;
var fishIndex;
var woundedState = 0;
var aggressiveState = 1;
var happyState = 2;
var colorfulState = 3;
var fishBeforePicture = [script.woundedPrefabs, script.aggressivePrefabs, script.happyPrefabs];
var minPicturePosition = -0.6;
var maxPicturePosition = 0.6;
var nextPicturePosition = minPicturePosition;
var picturePositionIncrease = 0.05;
var currentFishPicture;
var speed = 0.4;
var fishScale = new vec2(1, 1);
var hookScale = new vec2(2, 2);


function initialize() {
    if (!script.itemStorage || script.woundedPrefabs.length == 0 || script.aggressivePrefabs.length == 0 || script.happyPrefabs.length == 0 || script.colorfulPrefabs.length == 0 || !script.hookPrefab || !script.pictureFramePrefab) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    fishState = getRandomInteger(0, fishBeforePicture.length - 1);
    fishIndex =  getRandomInteger(0, fishBeforePicture[fishState].length - 1);
    var yPosition = getRandomFloat(0.5, -0.5);
    currentFish = createObjectFromPrefab(fishBeforePicture[fishState][fishIndex], new vec2(-1.5, yPosition), fishScale);
    
    var xPosition = getRandomFloat(0.8, -0.8);
    currentHook = createObjectFromPrefab(script.hookPrefab, new vec2(0.5, 2), hookScale);
}


initialize();


/**
 * creates a new fish if waitTime seconds have passed since the last fish was generated
 */
function onUpdate(e){
    var deltaTime = getDeltaTime() * script.simulationSpeed;
    passedTime += deltaTime;
    
    moveFish(deltaTime, 1.5);
    moveHook(deltaTime, 0);
}


/**
 * moves the fish
 * @param {Asset.ObjectPrefab} fish        - fish to move
 * @param {Number}             deltaTimete - delta time
 * @param {Number}             maxPosition - position where the item will be destroyed and a new item will be generated
 */
function moveFish(deltaTime, maxPosition){ 
    for (var i = 0; i < script.itemStorage.api.items.length; ++i){
        var currentItem = script.itemStorage.api.items[i];
        var itemScript = currentItem.getComponent("Component.ScriptComponent");  
        if (itemScript.script.itemType == 0){
            var objScreenTransform = currentItem.getComponent("Component.ScreenTransform");
            var currentPosition = objScreenTransform.anchors.getCenter();
            var updatedPosition = currentPosition.add(new vec2(speed * deltaTime, 0));
            objScreenTransform.anchors.setCenter(updatedPosition);
        
            if (updatedPosition.x > maxPosition){
                script.itemStorage.api.items[i].destroy();
                script.itemStorage.api.items.splice(i, 1);
                print(script.itemStorage.api.items.length);
                fishState = getRandomInteger(0, fishBeforePicture.length - 1);
                fishIndex =  getRandomInteger(0, fishBeforePicture[fishState].length - 1);
                var yPosition = getRandomFloat(0.5, -0.5);
        
                currentFish = createObjectFromPrefab(fishBeforePicture[fishState][fishIndex], new vec2(-1.5, yPosition), fishScale);
            }
        }
    }
}


/**
 * moves the hook
 * @param {Asset.ObjectPrefab} hook        - hook to move
 * @param {Number}             deltaTimete - delta time
 * @param {Number}             maxPosition - position where the item will be destroyed and a new item will be generated
 */
function moveHook(deltaTime, maxPosition){    
    for (var i = 0; i < script.itemStorage.api.items.length; ++i){
        var currentItem = script.itemStorage.api.items[i];
        var itemScript = currentItem.getComponent("Component.ScriptComponent");  
        if (itemScript.script.itemType == 1){
            var objScreenTransform = currentItem.getComponent("Component.ScreenTransform");
            var currentPosition = objScreenTransform.anchors.getCenter();
            var updatedPosition = currentPosition.add(new vec2(0, -speed * deltaTime));
            objScreenTransform.anchors.setCenter(updatedPosition);
        
            if (updatedPosition.y < maxPosition){
                script.itemStorage.api.items[i].destroy();
                script.itemStorage.api.items.splice(i, 1);
                var xPosition = getRandomFloat(0.8, -0.8);
        
                currentHook = createObjectFromPrefab(script.hookPrefab, new vec2(xPosition, 2), hookScale);
            }
        }
    }
}



/**
 * creates an object from the prefab
 * @param {Asset.ObjectPrefab} prefab   - prefab to create
 * @param {vec2}               position - position of the prefab in screen coordinates
 * @param {vec2}               scale    - scale of the prefab
 */
function createObjectFromPrefab(prefab, position, scale){  
    var object = prefab.instantiate(script.getSceneObject().getParent());
    print(object.name);
    var objScreenTransform = object.getComponent("Component.ScreenTransform");
    objScreenTransform.anchors.setCenter(position);
    objScreenTransform.anchors.setSize(scale);
    
    script.itemStorage.api.items.push(object);
    return object;
}


/**
 * heals the fish = shows the happy fish
 * The function is called by the heart_start object as a response to the heart_start trigger
 */
script.api.healFish = function(){
    if (fishState == woundedState){
        var position = currentFish.getComponent("Component.ScreenTransform").anchors.getCenter();
        currentFish.destroy();
        fishState = happyState;
        currentFish = createObjectFromPrefab(script.happyPrefabs[fishIndex], position, fishScale);
    }
}


/**
 * calms down the fish = shows the happy fish
 * The function is called by the peace_start object as a response to the peace_start trigger
 */
script.api.calmDownFish = function(){
    if (fishState == aggressiveState){
        var position = currentFish.getComponent("Component.ScreenTransform").anchors.getCenter();
        currentFish.destroy();
        fishState = happyState;
        currentFish = createObjectFromPrefab(script.happyPrefabs[fishIndex], position, fishScale);
    }
}


/**
 * takes a picture of the fish = shows the colorful fish
 * The function is called by the photo_start object as a response to the photo_start trigger
 */
script.api.takePicture = function(){
    if (fishState == happyState){
        var position = currentFish.getComponent("Component.ScreenTransform").anchors.getCenter();
        currentFish.destroy();
        fishState = colorfulState;
        currentFish = createObjectFromPrefab(script.colorfulPrefabs[fishIndex], position, fishScale);
        showPicture();
    }
}


/**
 * cuts through the rope
 * The function is called by the scissors_closed_start object as a response to the scissors_closed_start trigger
 */
script.api.cutRope = function(){
    for (var i = 0; i < script.itemStorage.api.items.length; ++i){
        var currentItem = script.itemStorage.api.items[i];
        var itemScript = currentItem.getComponent("Component.ScriptComponent");  
        if (itemScript.script.itemType == 1){
            script.itemStorage.api.items[i].destroy();
            script.itemStorage.api.items.splice(i, 1);
            var xPosition = getRandomFloat(0.8, -0.8);
    
            currentHook = createObjectFromPrefab(script.hookPrefab, new vec2(xPosition, 2), hookScale);
        }
    }
}


/**
 * shows the picture of the fish on the bottom of the screen
 */
function showPicture(){
    if (currentFishPicture){
        currentFishPicture.destroy();
    }
    createObjectFromPrefab(script.pictureFramePrefab, new vec2(nextPicturePosition, -0.8), new vec2(0.6, 0.6));
    currentFishPicture = createObjectFromPrefab(script.colorfulPrefabs[fishIndex], new vec2(nextPicturePosition, -0.8), new vec2(0.4, 0.4)); 
    nextPicturePosition += picturePositionIncrease;
}
