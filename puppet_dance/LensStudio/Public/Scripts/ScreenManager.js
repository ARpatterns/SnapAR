/**
 * author: Martina Kessler
*/
//@input SceneObject startScreen
//@input SceneObject stageScreen
//@input SceneObject puppetScreen
//@input SceneObject gestureTrainingScreen
//@input SceneObject danceCompletedScreen

/**
 * This script takes care of activating and deactivating the different screens.
 * @param {SceneObject} startScreen           - screen containing the start menu
 * @param {SceneObject} stageScreen           - screen containing the stage
 * @param {SceneObject} puppetScreen          - screen containing the puppet
 * @param {SceneObject} gestureTrainingScreen - screen containing the content for the gesture training
 * @param {SceneObject} danceCompletedScreen  - screen containing the content for the dance completed
 */


var startIndex = 0;
var gameIndex = 1;
var levelCompletedIndex = 2;
var gameOverIndex = 3;
var gameCompletedIndex = 4;


function initialize(){
    if (!script.startScreen || !script.stageScreen || !script.puppetScreen || !script.gestureTrainingScreen || !script.danceCompletedScreen) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    setScreen(0);
    
    global.behaviorSystem.addCustomTriggerResponse("gesture_training_start", onGestureTrainingStart);
    global.behaviorSystem.addCustomTriggerResponse("gesture_training_end", onGestureTrainingEnd);
    global.behaviorSystem.addCustomTriggerResponse("tutorial_start", onDanceStart);
    global.behaviorSystem.addCustomTriggerResponse("dance_1_start", onDanceStart);
    global.behaviorSystem.addCustomTriggerResponse("dance_2_start", onDanceStart);
    global.behaviorSystem.addCustomTriggerResponse("dance_completed_start", onDanceCompletedStart);
    global.behaviorSystem.addCustomTriggerResponse("dance_completed_end", onDanceCompletedEnd);
}


initialize();


/**
 * activates the corresponding screen and deactivates the other screens
 */
function setScreen(stageScreen){
    switch(stageScreen){
        case 0:
            script.startScreen.enabled = true;
            script.stageScreen.enabled = false;
            script.puppetScreen.enabled = false;
            script.gestureTrainingScreen.enabled = false;
            script.danceCompletedScreen.enabled = false;
        break;
        case 1:
            script.startScreen.enabled = false;
            script.stageScreen.enabled = true;
            script.puppetScreen.enabled = true;
            script.gestureTrainingScreen.enabled = true;
            script.danceCompletedScreen.enabled = false;
        break;
        
        case 2:
            script.startScreen.enabled = false;
            script.stageScreen.enabled = true;
            script.puppetScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.danceCompletedScreen.enabled = false;
        break;
        
        case 3:
            script.startScreen.enabled = false;
            script.stageScreen.enabled = false;
            script.puppetScreen.enabled = false;
            script.gestureTrainingScreen.enabled = false;
            script.danceCompletedScreen.enabled = true;
        break;
    }
}


function onGestureTrainingStart(){
    setScreen(1);
}


function onGestureTrainingEnd(){
    setScreen(0);
}


function onDanceStart(){
    setScreen(2);
}


function onDanceCompletedStart(){
    setScreen(3);
}


function onDanceCompletedEnd(){
    setScreen(0);
}
