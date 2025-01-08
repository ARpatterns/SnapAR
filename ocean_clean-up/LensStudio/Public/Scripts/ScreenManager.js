/**
 * author: Martina Kessler
*/
//@input SceneObject startScreen
//@input SceneObject handChoiceScreen
//@input SceneObject gameScreen
//@input SceneObject scoreScreen
//@input SceneObject gestureTrainingScreen
//@input SceneObject levelCompletedScreen
//@input SceneObject gameOverScreen
//@input SceneObject gameCompletedScreen

/**
 * This script takes care of the different game states and screens.
 * @param {SceneObject} startScreen           - screen containing the start menu
 * @param {SceneObject} handChoiceScreen      - screen containing the hand choice buttons
 * @param {SceneObject} gameScreen            - screen containing the scene
 * @param {SceneObject} scoreScreen           - screen containing the score
 * @param {SceneObject} gestureTrainingScreen - screen containing the content for the gesture training
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
var handChoiceIndex = 6;


function initialize(){
    if (!script.startScreen || !script.handChoiceScreen || !script.gameScreen || !script.scoreScreen || !script.levelCompletedScreen || !script.gameOverScreen || !script.gameCompletedScreen) {
        print("Missing input on " + script.getSceneObject().name);
    }  
    
    setScreen(handChoiceIndex);
    
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_completed", onFishGameLevelCompleted);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_game_completed", onFishGameGameCompleted);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_game_over", onFishGameGameOver);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_gesture_training_start", onFishGameGestureTrainingStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_tutorial_start", onFishGameLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_1_start", onFishGameLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_2_start", onFishGameLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_3_start", onFishGameLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_level_4_start", onFishGameLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_next_level_start", onFishGameLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_same_level_start", onFishGameLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("fish_game_menu_start", onFishGameMenuStart);
    global.behaviorSystem.addCustomTriggerResponse("left_hand_chosen", onFishGameMenuStart);
    global.behaviorSystem.addCustomTriggerResponse("right_hand_chosen", onFishGameMenuStart);
}


initialize();


/**
 * activates the corresponding screen and deactivates the other screens
 */
function setScreen(gameScreen){
    switch(gameScreen){
        case 0:
            script.handChoiceScreen.enabled = false;
            script.startScreen.enabled = true;
            script.gameScreen.enabled = false;
            script.scoreScreen.enabled = false;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 1:
            script.handChoiceScreen.enabled = false;
            script.startScreen.enabled = false;
            script.gameScreen.enabled = true;
            script.scoreScreen.enabled = false;
            script.gestureTrainingScreen.enabled = true;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 2:
            script.handChoiceScreen.enabled = false;
            script.startScreen.enabled = false;
            script.gameScreen.enabled = true;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 3:
            script.handChoiceScreen.enabled = false;
            script.startScreen.enabled = false;
            script.gameScreen.enabled = false;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = true;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
        case 4:
            script.handChoiceScreen.enabled = false;
            script.startScreen.enabled = false;
            script.gameScreen.enabled = false;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = true;
            script.gameCompletedScreen.enabled = false;
        break;
        case 5: 
            script.handChoiceScreen.enabled = false;
            script.startScreen.enabled = false;
            script.gameScreen.enabled = false;
            script.scoreScreen.enabled = true;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = true;
        break;
        case 6:
            script.handChoiceScreen.enabled = true;
            script.startScreen.enabled = false;
            script.gameScreen.enabled = false;
            script.scoreScreen.enabled = false;
            script.gestureTrainingScreen.enabled = false;
            script.levelCompletedScreen.enabled = false;
            script.gameOverScreen.enabled = false;
            script.gameCompletedScreen.enabled = false;
        break;
    }
}



/**
 * sets the menuScreen
 */
function onFishGameMenuStart(){
    setScreen(startIndex);
}


/**
 * sets the gameScreen
 */
function onFishGameGestureTrainingStart(){
    setScreen(gestureTrainingIndex);
}


/**
 * sets the gameScreen & scoreScreen
 */
function onFishGameLevelStart(){
    setScreen(gameIndex);
}


/**
 * sets the levelCompletedScreen
 */
function onFishGameLevelCompleted(){
    setScreen(levelCompletedIndex);
}


/**
 * sets the gameOverScreen
 */
function onFishGameGameOver(){
    setScreen(gameOverIndex);
}


/**
 * sets the gameCompletedScreen
 */
function onFishGameGameCompleted(){
    setScreen(gameCompletedIndex);
}