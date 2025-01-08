/**
 * author: Martina Kessler
*/
//@input Component.ScriptComponent itemStorage
//@input Component.ScriptComponent scoreManager
//@input Asset.ObjectPrefab[] woundedPrefabs
//@input Asset.ObjectPrefab[] happyPrefabs
//@input Asset.ObjectPrefab[] colorfulPrefabs
//@input Asset.ObjectPrefab bloodPrefab
//@input Asset.ObjectPrefab[] trashPrefabs
//@input Asset.ObjectPrefab hookPrefab
//@input float simulationSpeed = 1.0


/**
 * This script generates a random fish, trash and hooks and moves them. 
 * It also takes care of the game logic: it heals the fish, takes pictures and cuts ropes if the correct gestures were performed. 
 * @param {Component.ScriptComponent} itemStorage        - itemStorage script
 * @param {Component.ScriptComponent} scoreManager       - scoreManager script
 * @param {Asset.ObjectPrefab[]}      woundedPrefabs     - prefabs for the wounded fish
 * @param {Asset.ObjectPrefab[]}      happyPrefabs       - prefabs for the happy fish
 * @param {Asset.ObjectPrefab[]}      colorfulPrefabs    - prefabs for the colorful fish
 * @param {Asset.ObjectPrefab}        blookPrefab        - prefab for the blood
 * @param {Asset.ObjectPrefab[]}      trashPrefabs       - prefabs for the trash
 * @param {Asset.ObjectPrefab}        hookPrefab         - prefab for the hook
 * @param {float}                     simulationSpeed    - speed of the whole simulation, can be used for debugging to make it faster or slower
 */


var passedTime = 0;
var useLeftHand; // boolean variable to indicate if the game should be optimized for the left hand or the right hand
// fish parameters
var fishPrefabs; // prefabs used for the current level
var minYPositionFish = -0.3;
var maxYPositionFish = 0.5;
var minFishSpeed = 0.2;
var maxFishSpeed = 0.4;
var minWaitTimeFishCreation = 0.5;
var maxWaitTimeFishCreation = 2;
var timesNextFishCreation = [];
// hook parameters
var minWaitTimeHookCreation = 0.1;
var maxWaitTimeHookCreation = 0.5;
var timeNextHookCreation;
var minYPositionHook = -0.55;
var minHookSpeed = 0.2;
var maxHookSpeed = 0.4;
// trash parameters
var trashSpeed = 0.3;
var seaFloorPosition = -0.47;
var fishType = 0;
var trashType = 1;
var numTrash = 1;
var trashOffset = 0.4;
var distanceBetweenTrash;
var trashPositions = [];
var woundedState = 0;
var happyState = 1;
var currentLevelIndex;
var totalNumberOfLevels = 4;
// these numbers need to correspond to the indices of the fish configured as the prefabs in the LevelManager
var nemoFishIndex = 0;
var normalFishIndex = 1;
var longFishIndex = 2;
var roundFishIndex = 3;
var fishIndexLimit = 3;
var hookIndex = 4;
// variables for the csv creation of items
var items = {
    NemoFish: nemoFishIndex,
    NormalFish: normalFishIndex,
    LongFish: longFishIndex,
    RoundFish: roundFishIndex,
    Hook: hookIndex
};
var randomItemCreation = false; // boolean variable to indiacte if the items should be randomly created or based on a csv
var tutorialLeftCSV = 'Hook,1,0,0.25,1\nNormalFish,-0.2,12,0.25,1\nHook,1,13,0.25,1\nHook,0,23,0.25,1\nNormalFish,0.5,25,0.25,1\nNormalFish,-0.3,33.5,0.25,1\nHook ,0,35,0.25,1\nNormalFish,-0.3,46,0.25,1\nHook,2,46,0.25,1\nNormalFish,0,52,0.25,1\nNormalFish,-0.3,53,0.25,1\nNormalFish,0.5,54,0.25,1\nNormalFish,0.2,55,0.25,1\nNormalFish,-0.1,56,0.25,1\nHook,0,70,0.25,1\nNormalFish,0,71.5,0.25,1\nNormalFish,0,81.5,0.25,1\nHook,0,84,0.25,1\nHook,0,96,0.25,1\nNormalFish,-0.1,97,0.25,1\nNormalFish,-0.3,99,0.25,1\nHook,2,109,0.25,1\nNormalFish,0,115,0.25,1\nHook,0,122,0.25,1\nNormalFish,-0.2,129,0.25,1\nHook,2,135,0.25,1';
var tutorialRightCSV = 'Hook,1,0,0.25,1\nNormalFish,-0.2,12,0.25,1\nHook,1,13,0.25,1\nHook,2,23,0.25,1\nNormalFish,0.5,25,0.25,1\nNormalFish,-0.3,33.5,0.25,1\nHook ,2,35,0.25,1\nNormalFish,-0.3,46,0.25,1\nHook,0,46,0.25,1\nNormalFish,0,52,0.25,1\nNormalFish,-0.3,53,0.25,1\nNormalFish,0.5,54,0.25,1\nNormalFish,0.2,55,0.25,1\nNormalFish,-0.1,56,0.25,1\nHook,2,70,0.25,1\nNormalFish,0,71.5,0.25,1\nNormalFish,0,81.5,0.25,1\nHook,2,84,0.25,1\nHook,2,96,0.25,1\nNormalFish,-0.1,97,0.25,1\nNormalFish,-0.3,99,0.25,1\nHook,0,109,0.25,1\nNormalFish,0,115,0.25,1\nHook,2,122,0.25,1\nNormalFish,-0.2,129,0.25,1\nHook,0,135,0.25,1';
var levelData;
var currentIndex = 0;
// indices for the csv data
var itemNameIndex = 0;
var itemPositionIndex = 1;
var itemTimeIndex = 2;
var itemSpeedIndex = 3;
var itemDirectionIndex = 4;


function initialize() {
    if (!script.itemStorage || !script.scoreManager || script.woundedPrefabs.length == 0 || script.happyPrefabs.length == 0 || script.colorfulPrefabs.length == 0 || !script.bloodPrefab || !script.hookPrefab) {
        print("Missing input on " + script.getSceneObject().name);
    }

    global.behaviorSystem.addCustomTriggerResponse("left_hand_chosen", onLeftHandChosen);
    global.behaviorSystem.addCustomTriggerResponse("right_hand_chosen", onRightHandChosen);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_tutorial_start", onFishGameTutorialStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_1_start", onFishGameLevel1Start);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_2_start", onFishGameLevel2Start);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_3_start", onFishGameLevel3Start);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_4_start", onFishGameLevel4Start);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_next_level_start", onFishGameNextLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_same_level_start", onFishGameSameLevelStart);
}


initialize();


/**
 * resets the level
 */
function resetLevel(){
    script.itemStorage.api.hook = 0;    
    passedTime = 0;
    timesNextFishCreation = [];
    trashPositions = [];
    currentIndex = 0;

    for (var i = 0; i < script.itemStorage.api.fish.length; ++i){
        var fishScript =  script.itemStorage.api.fish[i].getComponent("Component.ScriptComponent");
        if (fishScript.script.freezed){
            fishScript.script.colorfulFish.destroy();
        }
        script.itemStorage.api.fish[i].destroy();
    }
    
    for (var i = 0; i < script.itemStorage.api.trash.length; ++i){
        script.itemStorage.api.trash[i].destroy();
    }
    
    if (script.itemStorage.api.hook != 0 && script.itemStorage.api.hook != undefined){
        script.itemStorage.api.hook.destroy();
    }
        
    script.itemStorage.api.hook = 0;
    
    script.itemStorage.api.fish = [];
    script.itemStorage.api.trash = [];
}


/**
 * starts the level
 */
function startLevel(){
    updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(onUpdate);
}


/**
 * takes care of the level initialization (number of fish and trash)
 * @param {Number} levelNumber - number of the level
 */
function prepareLevel(levelNumber){  
    switch(levelNumber){
        case 0:
            randomItemCreation = false;
            numTrash = 3;
            fishPrefabs = [script.happyPrefabs[0], script.happyPrefabs[1], script.happyPrefabs[3], script.happyPrefabs[2]];
            if (useLeftHand){
                levelData = readCSV(tutorialLeftCSV);
            }
            else{
                levelData = readCSV(tutorialRightCSV);
            }
            distanceBetweenTrash = (2 - (2 * trashOffset)) / (numTrash + 1);
            createEquallySpacedRandomTrash(numTrash);
            //passedTime = 70;
        break;
        case 1:
            randomItemCreation = true;
            minFishSpeed = 0.2;
            maxFishSpeed = 0.3;
            minWaitTimeFishCreation = 0.5;
            maxWaitTimeFishCreation = 2;
            numTrash = 5;
            fishPrefabs = [script.happyPrefabs[0], script.happyPrefabs[1]];
            createRandomFish();
            createRandomFishAfterRandomTime();
            distanceBetweenTrash = (2 - (2 * trashOffset)) / (numTrash + 1);
            createEquallySpacedRandomTrash(numTrash);
            createRandomHook();
        break;
        case 2:
            // more fish variety (added round fish), fish come faster
            randomItemCreation = true;
            minFishSpeed = 0.2;
            maxFishSpeed = 0.3;
            minWaitTimeFishCreation = 0.5;
            maxWaitTimeFishCreation = 1;
            numTrash = 5;
            fishPrefabs = [script.happyPrefabs[0], script.happyPrefabs[1], script.happyPrefabs[3]];
            createRandomFish()
            createRandomFishAfterRandomTime();
            distanceBetweenTrash = (2 - (2 * trashOffset)) / (numTrash + 1);
            createEquallySpacedRandomTrash(numTrash);
            createRandomHook();
        break;
        case 3:
            // more fish variety (added long fish), faster fish
            randomItemCreation = true;
            minFishSpeed = 0.2;
            maxFishSpeed = 0.4;
            minWaitTimeFishCreation = 0.5;
            maxWaitTimeFishCreation = 1;
            numTrash = 5;
            fishPrefabs = [script.happyPrefabs[0], script.happyPrefabs[1], script.happyPrefabs[3], script.happyPrefabs[2]];
            createRandomFish();
            createRandomFishAfterRandomTime();
            distanceBetweenTrash = (2 - (2 * trashOffset)) / (numTrash + 1);
            createEquallySpacedRandomTrash(numTrash);
            createRandomHook();
        break;
        case 4:
            // more fish on screen
            randomItemCreation = true;
            minFishSpeed = 0.2;
            maxFishSpeed = 0.4;
            minWaitTimeFishCreation = 0.5;
            maxWaitTimeFishCreation = 1;
            numTrash = 5;
            fishPrefabs = [script.happyPrefabs[0], script.happyPrefabs[1], script.happyPrefabs[3], script.happyPrefabs[2]];
            createRandomFish();
            createRandomFishAfterRandomTime();
            createRandomFishAfterRandomTime();
            distanceBetweenTrash = (2 - (2 * trashOffset)) / (numTrash + 1);
            createEquallySpacedRandomTrash(numTrash);
            createRandomHook();
        break;
    }      
}


/**
 * prepares the game for the left hand
 * the function is called as a response to the trigger left_hand_chosen
 */
function onLeftHandChosen(){
    useLeftHand = true;
}


/**
 * prepares the game for the right hand
 * the function is called as a response to the trigger left_hand_chosen
 */
function onRightHandChosen(){
    useLeftHand = false;
}


/**
 * starts the tutorial
 * the function is called as a response to the trigger fish_game_tutorial_start
 */
function onFishGameTutorialStart(){
    currentLevelIndex = 0;
    resetLevel();
    prepareLevel(currentLevelIndex);
    startLevel();
}


/**
 * starts level 1
 * the function is called as a response to the trigger fish_game_level_1_start
 */
function onFishGameLevel1Start(){
    currentLevelIndex = 1;
    resetLevel();
    prepareLevel(currentLevelIndex);
    startLevel();
}


/**
 * starts level 2
 * the function is called as a response to the trigger fish_game_level_2_start
 */
function onFishGameLevel2Start(){
    currentLevelIndex = 2;
    resetLevel();
    prepareLevel(currentLevelIndex);
    startLevel();
}


/**
 * starts level 3
 * the function is called as a response to the trigger fish_game_level_3_start
 */
function onFishGameLevel3Start(){
    currentLevelIndex = 3;
    resetLevel();
    prepareLevel(currentLevelIndex);
    startLevel();
}


/**
 * starts level 4
 * the function is called as a response to the trigger fish_game_level_4_start
 */
function onFishGameLevel4Start(){
    currentLevelIndex = 4;
    resetLevel();
    prepareLevel(currentLevelIndex);
    startLevel();
}


/**
 * starts the next level
 * the function is called as a response to the trigger fish_game_next_level_start
 */
function onFishGameNextLevelStart(){
    currentLevelIndex += 1;
    resetLevel();
    prepareLevel(currentLevelIndex);
    startLevel();
}


/**
 * restarts the same level
 * the function is called as a response to the trigger fish_game_same_level_start
 */
function onFishGameSameLevelStart(){
    resetLevel();
    prepareLevel(currentLevelIndex);
    startLevel();
}


/**
 * moves the items on the screen
 */
function onUpdate(e){
    var deltaTime = getDeltaTime() * script.simulationSpeed;
    passedTime += deltaTime;
    //print(passedTime);
    
    createItems(passedTime);
    moveFish(deltaTime);
    moveHook(deltaTime);
    moveTrash(deltaTime);
    checkLevelCompleted();
    var trash = script.itemStorage.api.trash;
}


/**
 * creates fish and hooks according to levelData
 * @param {Number} passedTime - total passed time since the start of the level
 */
function createItems(passedTime){
    if (!randomItemCreation){
        for (var i = currentIndex; i < levelData.length; ++i){
            if (levelData[i][itemTimeIndex] <= passedTime){
                var itemIndex = items[levelData[i][itemNameIndex]];
                if (itemIndex <= fishIndexLimit){
                    var isMovingTowardsRight = !useLeftHand;
                    var xPosition = isMovingTowardsRight ? -1.5 : 1.5;
                    script.api.createFish(fishPrefabs[itemIndex], itemIndex, new vec2(xPosition, Number(levelData[i][itemPositionIndex])), Number(levelData[i][itemSpeedIndex]), isMovingTowardsRight, true);
                }
                else{
                    createHook(script.hookPrefab, Number(levelData[i][itemPositionIndex]), Number(levelData[i][itemSpeedIndex]));
                }
                currentIndex += 1;
            }
            if (levelData[i][itemTimeIndex] > passedTime){
                break;
            }
        }
    }
}


/**
 * moves the fish
 * @param {Number} deltaTime - delta time
 */
function moveFish(deltaTime){ 
    if (randomItemCreation){
        for (var i = timesNextFishCreation.length - 1; i >= 0; --i){
            timesNextFishCreation[i] -= deltaTime;
            if (timesNextFishCreation[i] <= 0){
                createRandomFish();
                timesNextFishCreation.splice(i, 1);
            }
        }          
    }
    
    if (script.itemStorage.api.fish.length > 0){
        for(var i = script.itemStorage.api.fish.length - 1; i >= 0; --i){
            var currentFish = script.itemStorage.api.fish[i];
            var fishScript = currentFish.getComponent("Component.ScriptComponent");
            var objScreenTransform = currentFish.getComponent("Component.ScreenTransform");
            var position = objScreenTransform.anchors.getCenter();
            var speed = fishScript.script.speed;
            var isMovingTowardsRight = fishScript.script.isMovingTowardsRight;
            
            if (fishScript.script.freezed){
                // change color of the freezed fish
                fishScript.script.remainingFreezeTime -= deltaTime;
                var colorfulFishImage = fishScript.script.colorfulFish.getComponent("Component.Image");
                var clonedMaterial = colorfulFishImage.getMaterial(0).clone();
                var colorfulFishColor = clonedMaterial.getPass(0).baseColor;
                //var colorfulFishColor = colorfulFishImage.getMaterial(0).getPass(0).baseColor;
                
                /*
                if (colorfulFishColor) {
                    // goes from orange to black
                    var grayscaleColor = fishScript.script.remainingFreezeTime / fishScript.script.totalFreezeTime;
                    colorfulFishColor.r = grayscaleColor;
                    colorfulFishColor.g = grayscaleColor;
                    colorfulFishColor.b = grayscaleColor;
                    colorfulFishImage.getMaterial(0).getPass(0).baseColor = colorfulFishColor;
                }*/
                                
                if (colorfulFishColor && colorfulFishColor.a != undefined) {
                    colorfulFishColor.a = Math.min(fishScript.script.remainingFreezeTime / fishScript.script.totalFreezeTime + 0.4, 1);
                    colorfulFishImage.getMaterial(0).getPass(0).baseColor = colorfulFishColor;
                }
                
                var happyFishImage = currentFish.getComponent("Component.Image");
                //var happyFishColor = happyFishImage.getMaterial(0).getPass(0).baseColor;
                var happyFishColor = clonedMaterial.getPass(0).baseColor;
                
                if (happyFishColor && happyFishColor.a != undefined) {
                    happyFishColor.a = 1 - fishScript.script.remainingFreezeTime / fishScript.script.totalFreezeTime;
                    //happyFishImage.getMaterial(0).getPass(0).baseColor = happyFishColor;
                    clonedMaterial.getPass(0).baseColor = happyFishColor;
                }
                
                if (fishScript.script.remainingFreezeTime <= 0){
                    fishScript.script.freezed = false;
                    //print(fishScript.script.woundedPrefab);
                    fishScript.script.colorfulFish.destroy();
                    //createFish(fishScript.script.happyPrefab, position, fishScale, speed, isMovingTowardsRight, true);
                    //script.itemStorage.api.fish[i].destroy();
                    //script.itemStorage.api.fish.splice(i, 1);
                }
            }
            else{
                // move the fish
                var factor = isMovingTowardsRight ? 1 : -1;               
                var updatedPosition = position.add(new vec2(factor * speed * deltaTime, 0));
                objScreenTransform.anchors.setCenter(updatedPosition);
                
                if (fishScript.script.blood !== undefined){
                    var objScreenTransformBlood = fishScript.script.blood.getComponent("Component.ScreenTransform");
                    var bloodPosition = objScreenTransformBlood.anchors.getCenter();
                    var updatedBloodPosition = bloodPosition.add(new vec2(factor * speed * deltaTime, 0));
                    objScreenTransformBlood.anchors.setCenter(updatedBloodPosition);                    
                }
            
                if ((isMovingTowardsRight && updatedPosition.x > 1.5) || (!isMovingTowardsRight && updatedPosition.x < -1.5)){
                    if (fishScript.script.blood !== undefined){                    
                        fishScript.script.blood.destroy();
                    }
                    script.itemStorage.api.fish[i].destroy();
                    script.itemStorage.api.fish.splice(i, 1);
                    if (randomItemCreation){
                        createRandomFishAfterRandomTime(); 
                    } 
                }                    
            }           
        }
    }
}


/**
 * moves the falling trash
 * @param {Number} deltaTime - delta time
 */
function moveTrash(deltaTime){
    for(var i = script.itemStorage.api.trash.length - 1; i >= 0; --i){
        var currentTrash = script.itemStorage.api.trash[i];
        var trashScript = currentTrash.getComponent("Component.ScriptComponent");

        if (trashScript.script.isFalling){
            var objScreenTransform = currentTrash.getComponent("Component.ScreenTransform");
            var currentPosition = objScreenTransform.anchors.getCenter();
            var updatedPosition = currentPosition.add(new vec2(0, -trashSpeed * deltaTime));
            objScreenTransform.anchors.setCenter(updatedPosition);
        
            if (updatedPosition.y < seaFloorPosition){
                trashScript.script.isFalling = false;
            }
        }
    }
}


/**
 * moves the hook
 * if there is a fish attached to the hook, then it also moves this fish
 * @param {Number} deltaTime - delta time
 */
function moveHook(deltaTime){
    var currentHook = script.itemStorage.api.hook;
    var reset = false;
    
    if (currentHook != 0){
        var hookScript = currentHook.getComponent("Component.ScriptComponent");
        var speed = hookScript.script.speed;
        
        var objScreenTransform = currentHook.getComponent("Component.ScreenTransform");
        var currentPosition = objScreenTransform.anchors.getCenter();
        var factor = hookScript.script.isMovingDown ? -1 : 1;
        var updatedPosition = currentPosition.add(new vec2(0, factor * speed * deltaTime));
        objScreenTransform.anchors.setCenter(updatedPosition);
        
        var objScreenTransformHookCollider = hookScript.script.hookColliderImage.getComponent("Component.ScreenTransform");
        objScreenTransformHookCollider.anchors.setCenter(updatedPosition);
        objScreenTransformHookCollider.anchors.bottom = objScreenTransform.anchors.bottom + 0.075;
        objScreenTransformHookCollider.anchors.top = objScreenTransform.anchors.bottom + 0.1;

        if (hookScript.script.hasItemOnHook){
            var currentItem = hookScript.script.hookedItem;
            var itemScript = currentItem.getComponent("Component.ScriptComponent");
            var objScreenTransformItem = currentItem.getComponent("Component.ScreenTransform");
            var currentPositionItem = objScreenTransformItem.anchors.getCenter();
            
            if (itemScript.script.type == fishType && itemScript.script.state != woundedState){
                // fish is not wounded, show the wounded prefab
                hookScript.script.hookedItem.destroy();
                var fish = script.api.createFish(itemScript.script.woundedPrefab, itemScript.script.arrayIndex, currentPositionItem, speed, itemScript.script.isMovingTowardsRight, false);
                hookScript.script.hookedItem = fish;             
                var fishScript = hookScript.script.hookedItem.getComponent("Component.ScriptComponent");
                var blood = createObjectFromPrefab(script.bloodPrefab, currentPositionItem);
                fishScript.script.blood = blood;
            }
            
            // move the hooked item
            var updatedPositionItem = currentPositionItem.add(new vec2(0, speed * deltaTime));
            objScreenTransformItem.anchors.setCenter(updatedPositionItem);
            
            var currentItem = hookScript.script.hookedItem;
            var itemScript = currentItem.getComponent("Component.ScriptComponent");
            
            if (itemScript.script.type == fishType){
                // move the blood drops
                var blood = itemScript.script.blood;
                var objScreenTransformBlood = blood.getComponent("Component.ScreenTransform");
                var currentPositionBlood = objScreenTransformBlood.anchors.getCenter();
                var updatedPositionBlood = currentPositionBlood.add(new vec2(0, speed * deltaTime));
                objScreenTransformBlood.anchors.setCenter(updatedPositionBlood);
            }
        }
    
        if (hookScript.script.isMovingDown && objScreenTransform.anchors.bottom < minYPositionHook){
            // hook reached the bottom
            hookScript.script.isMovingDown = false;
            
            var objScreenTransformHook = currentHook.getComponent("Component.ScreenTransform");
            var hookPositionLeft = objScreenTransformHook.anchors.left;
            var hookPositionRight = objScreenTransformHook.anchors.right; 
            var hookCenterX = 0.5 * (hookPositionLeft + hookPositionRight);
            
            // check if there is trash to pick up
            var trash = script.itemStorage.api.trash;
            var positionIndex = hookScript.script.positionIndex;
            var currentTrash = trash[positionIndex];
            print(positionIndex);
            if (currentTrash !== undefined){
                var trashScript = currentTrash.getComponent("Component.ScriptComponent");
                if (!hookScript.script.hasItemOnHook){
                    script.itemStorage.api.hasTrashOnHook = true;
                    script.itemStorage.api.hookedTrash = currentTrash;
                }
            }
            /*
            for(var i = trash.length - 1; i >= 0; --i){
                var currentTrash = trash[i];
                var objScreenTransformTrash = currentTrash.getComponent("Component.ScreenTransform");
                var trashPositionLeft = objScreenTransformTrash.anchors.left;
                var trashPositionRight = objScreenTransformTrash.anchors.right;
                if (hookCenterX > trashPositionLeft && hookCenterX < trashPositionRight){
                    if (!hookScript.script.hasItemOnHook){
                        script.itemStorage.api.hasTrashOnHook = true;
                        script.itemStorage.api.hookedTrash = currentTrash;
                        script.itemStorage.api.trash.splice(i, 1);
                    }
                }
            }*/
        }
        else if(!hookScript.script.isMovingDown && objScreenTransform.anchors.bottom > 1){
            // hook reached the top of the screen
            if (hookScript.script.hasItemOnHook){
                var item = hookScript.script.hookedItem;
                var itemScript = item.getComponent("Component.ScriptComponent");
                if (itemScript.script.type == trashType){
                    script.scoreManager.api.incrementScore(5);
                    global.behaviorSystem.sendCustomTrigger("trash_left_screen");
                }
                else if (itemScript.script.type == fishType){
                    //reset = true;
                    //global.behaviorSystem.sendCustomTrigger("game_over");
                    
                    script.scoreManager.api.incrementScore(-5);
                    global.behaviorSystem.sendCustomTrigger("fish_left_screen");
                    if (randomItemCreation){
                        createRandomFishAfterRandomTime();
                    }
                }
            }
            script.itemStorage.api.hook.destroy();
            script.itemStorage.api.hook = 0;
            if (randomItemCreation){
                script.api.createRandomHookAfterRandomTime();
            }
            
             if (hookScript.script.hasItemOnHook){
                if (itemScript.script.type == fishType){
                    itemScript.script.blood.destroy();
                }
                hookScript.script.hookedItem.destroy();
                hookScript.script.hasItemOnHook = false;
            }
        }        
    }
    else{
        if (randomItemCreation){
            timeNextHookCreation -= deltaTime;
            if (timeNextHookCreation <= 0){
                createRandomHook();
            } 
        }
    }
    
    if (reset){
        resetLevel();
        script.removeEvent(updateEvent);
    }
}


/**
 * checks if the level is completed
 */
function checkLevelCompleted(){
    var currentHook = script.itemStorage.api.hook;
    var itemOnHookCondition = true;
    if (currentHook != 0){
        var hookScript = currentHook.getComponent("Component.ScriptComponent");
        itemOnHookCondition = !hookScript.script.hasItemOnHook;
    }
        
    if (script.itemStorage.api.trash.length == 0 && itemOnHookCondition){
        if (currentLevelIndex < totalNumberOfLevels){
            global.behaviorSystem.sendCustomTrigger("fish_game_level_completed");
        }
        else{
            global.behaviorSystem.sendCustomTrigger("fish_game_game_completed");
            currentLevelIndex = 0;
        }
        
        resetLevel();
        script.removeEvent(updateEvent);
    }
}


/**
 * creates a fish after a random time
 */
function createRandomFishAfterRandomTime(){
    var randomTime = getRandomFloat(minWaitTimeFishCreation, maxWaitTimeFishCreation);
    timesNextFishCreation.push(randomTime);
}


/**
 * creates a random happy fish and lets it swim from the left side towards the right side with random speed, starting at a random y-Position
 */
function createRandomFish(){
    var arrayIndex = getRandomInteger(0, fishPrefabs.length - 1);
    //var arrayIndex = 2;
    var yPosition = getRandomFloat(maxYPositionFish, minYPositionFish);
    var speed = getRandomFloat(minFishSpeed, maxFishSpeed);
    var isMovingTowardsRight = !useLeftHand;
    
    var xPosition = isMovingTowardsRight ? -1.5 : 1.5;
    //var xPosition = 0;
    
    var newFish = script.api.createFish(fishPrefabs[arrayIndex], arrayIndex, new vec2(xPosition, yPosition), speed, isMovingTowardsRight, true);
    
    if (!isMovingTowardsRight){
        newFish.getComponent("Component.Image").flipX = true;
    }

    return newFish;
}


/**
 * creates a fish from the prefab
 * @param {Asset.ObjectPrefab}  prefab               - prefab to create
 * @param {Asset.ObjectPrefab}  arrayIndex           - index in the fishPrefabs array
 * @param {vec2}                position             - position of the prefab in screen coordinates
 * @param {Number}              speed                - speed of the prefab
 * @param {Number}              isMovingTowardsRight - boolean variable to indicate if the fish moves towards the right
 * @param {saveInItemStorage}   saveInItemStorage    - save the created fish in the itemStorage
 */
script.api.createFish = function(prefab, arrayIndex, position, speed, isMovingTowardsRight, saveInItemStorage){
    var fish = createObjectFromPrefab(prefab, position);
    
    var fishScript = fish.getComponent("Component.ScriptComponent");
    fishScript.script.arrayIndex = arrayIndex;
    fishScript.script.speed = speed;
    fishScript.script.isMovingTowardsRight = isMovingTowardsRight;
    
    if (!isMovingTowardsRight){
        fish.getComponent("Component.Image").flipX = true;
    }
    
    if (saveInItemStorage){
       script.itemStorage.api.fish.push(fish); 
    }
    
    return fish;
}


/**
 * creates n random trash items and puts the equally spaced on the sea floor 
 * @param {Number} n - number of trash items to create
 */
function createEquallySpacedRandomTrash(n){
    randomizeOrder(script.trashPrefabs);
    //if (n < script.trashPrefabs.length)
    for (var i = 0; i < n; ++i){
        var trashType;
        if (i < script.trashPrefabs.length){
            trashType = i;
        }
        else{
            trashType = getRandomInteger(0, script.trashPrefabs.length - 1);
        }
        
        createTrash(script.trashPrefabs[trashType], i);
    }
}


/**
 * randomizes the order of the trash items
 * @param {Asset.ObjectPrefab[]} trashItems - array with all the trash items
 */
function randomizeOrder(trashItems) {
    for (var i = trashItems.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = trashItems[i];
        trashItems[i] = trashItems[j];
        trashItems[j] = temp;
    }
}


/**
 * creates a trash item from the prefab
 * @param {Asset.ObjectPrefab} prefab        - prefab to create
 * @param {Number}             positionIndex - index (from 0 to numTrash - 1) of the trash (0 = left most trash item, numTrash -1 = right most trash item)
 */
function createTrash(prefab, positionIndex){
    var xPosition = (positionIndex + 1) * distanceBetweenTrash - (1 - trashOffset);
    var position = new vec2(xPosition, seaFloorPosition)
    var trash = createObjectFromPrefab(prefab, position);
    
    var trashScript = trash.getComponent("Component.ScriptComponent");
    trashScript.script.isFalling = false;
    trashScript.script.positionIndex = positionIndex;
    
    script.itemStorage.api.trash.push(trash);
    return trash;
}


/**
 * creates a hook after a random time
 */
script.api.createRandomHookAfterRandomTime = function(){
    if (randomItemCreation){
        var randomTime = getRandomFloat(minWaitTimeHookCreation, maxWaitTimeHookCreation);
        timeNextHookCreation = randomTime;
    }
}


/**
 * creates a random hook and lets it go down with random speed, starting at a random x-Position which is over a trash item that is still on the sea floor
 */
function createRandomHook(){
    var randTrash = getRandomInteger(0, script.itemStorage.api.trash.length - 1);
    var currentTrash = script.itemStorage.api.trash[randTrash];
    var trashScript = currentTrash.getComponent("Component.ScriptComponent");
    var randPositionIndex = trashScript.script.positionIndex;
    
    var speed = getRandomFloat(minHookSpeed, maxHookSpeed);
    
    var hook = createHook(script.hookPrefab, randPositionIndex, speed);
    return hook;
}


/**
 * creates a hook from the prefab
 * @param {Asset.ObjectPrefab} prefab        - prefab to create
 * @param {Number}             positionIndex - index (from 0 to numTrash - 1) of the position at which the hook is going down (0 = left most trash item, numTrash -1 = right most trash item)
 * @param {Numbter}            speed         - speed of the prefab
 */
function createHook(prefab, positionIndex, speed){
    var xPosition = -1 + trashOffset + (positionIndex + 1) * distanceBetweenTrash;
    var position = new vec2(xPosition, 2);
    var hook = createObjectFromPrefab(prefab, position);
    
    var hookScript = hook.getComponent("Component.ScriptComponent");
    hookScript.script.speed = speed;
    hookScript.script.isMovingDown = true;
    hookScript.script.positionIndex = positionIndex;
    
    script.itemStorage.api.hook = hook;
    return hook;
}


/**
 * creates an object from the prefab
 * @param {Asset.ObjectPrefab} prefab   - prefab to create
 * @param {vec2}               position - position of the prefab in screen coordinates
 */
function createObjectFromPrefab(prefab, position){  
    var object = prefab.instantiate(script.getSceneObject().getParent());
    var objScreenTransform = object.getComponent("Component.ScreenTransform");
    objScreenTransform.anchors.setCenter(position);

    return object;
}
