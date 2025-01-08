/**
 * author: Martina Kessler
*/
//@input SceneObject startScreen
//@input SceneObject dragonScreen
//@input SceneObject scoreScreen
//@input SceneObject gestureTrainingScreen
//@input SceneObject levelCompletedScreen
//@input SceneObject gameOverScreen
//@input SceneObject gameCompletedScreen

/**
 * This script takes care of the different game states and screens.
 * @param {SceneObject} startScreen           - screen containing the start menu
 * @param {SceneObject} gestureTrainingScreen - screen containing the content for the gesture training
 * @param {SceneObject} dragonScreen          - screen containing the dragons
 * @param {SceneObject} scoreScreen           - screen containing the score
 * @param {SceneObject} levelCompletedScreen  - screen containing the content for the level completed
 * @param {SceneObject} gameOverScreen        - screen containing the content for the game over completed
 * @param {SceneObject} gameCompletedScreen   - screen containing the content for the game completed
 */


var startIndex = 0;
var gestureTrainingIndex = 1;
var gameIndex = 2;
var levelCompletedIndex = 3;
var gameOverIndex = 4;
var gameCompletedIndex = 5;


function initialize(){
    if (!script.startScreen || !script.dragonScreen || !script.scoreScreen || !script.levelCompletedScreen || !script.gameOverScreen || !script.gameCompletedScreen) {
        print("Missing input on " + script.getSceneObject().name);
    }    
    
    setScreen(0);
    
    global.behaviorSystem.addCustomTriggerResponse("level_completed", onLevelCompleted);
    global.behaviorSystem.addCustomTriggerResponse("game_completed", onGameCompleted);
    global.behaviorSystem.addCustomTriggerResponse("game_over", onGameOver);
    global.behaviorSystem.addCustomTriggerResponse("gesture_training_start", onGestureTrainingStart);
    global.behaviorSystem.addCustomTriggerResponse("tutorial_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_1_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_2_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_3_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_4_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("next_level_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("same_level_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("menu_start", onMenuStart);
}


initialize();


/**
 * activates the corresponding screen and deactivates the other screens
 */
function setScreen(dragonScreen){
    switch(dragonScreen){
        case 0:
            script.startScreen.enabled = true;
            script.dragonScreen.enabled = false;
            script.scoreScreen.enabled = false;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 1:
            script.startScreen.enabled = false;
            script.dragonScreen.enabled = true;
            script.scoreScreen.enabled = false;
            script.gestureTrainingScreen.enabled = true;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 2:
            script.startScreen.enabled = false;
            script.dragonScreen.enabled = true;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 3:
            script.startScreen.enabled = false;
            script.dragonScreen.enabled = false;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = true;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 4:
            script.startScreen.enabled = false;
            script.dragonScreen.enabled = false;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = true;
            script.gameCompletedScreen.enabled = false;
        break;
        case 5:
            script.startScreen.enabled = false;
            script.dragonScreen.enabled = false;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = true;
        break;
    }
}


/**
 * sets the menuScreen
 */
function onMenuStart(){
    setScreen(startIndex);
}


/**
 * sets the dragonScreen
 */
function onGestureTrainingStart(){
    setScreen(gestureTrainingIndex);
}


/**
 * sets the dragonScreen & scoreScreen
 */
function onLevelStart(){
    setScreen(gameIndex);
}


/**
 * sets the levelCompletedScreen
 */
function onLevelCompleted(){
    setScreen(levelCompletedIndex);
}


/**
 * sets the gameOverScreen
 */
function onGameOver(){
    setScreen(gameOverIndex);
}


/**
 * sets the gameCompletedScreen
 */
function onGameCompleted(){
    setScreen(gameCompletedIndex);
}