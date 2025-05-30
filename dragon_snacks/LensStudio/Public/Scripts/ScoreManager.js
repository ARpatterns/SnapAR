/**
 * author: Martina Kessler
*/
//@input Component.Text[] scoreTexts

/**
 * This script holds the current score and displays it on the screen.
 * @param {Component.Text[]} scoreTexts - texts where the score is displayed
 */

var score = 0;


function initialize() {
    if (script.scoreTexts.length == 0) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    global.behaviorSystem.addCustomTriggerResponse("next_level_start", resetScore);
    global.behaviorSystem.addCustomTriggerResponse("same_level_start", resetScore);  
    global.behaviorSystem.addCustomTriggerResponse("gesture_training_start", resetScore);
    global.behaviorSystem.addCustomTriggerResponse("tutorial_start", resetScore);
    global.behaviorSystem.addCustomTriggerResponse("level_1_start", resetScore);
    global.behaviorSystem.addCustomTriggerResponse("level_2_start", resetScore);
    global.behaviorSystem.addCustomTriggerResponse("level_3_start", resetScore);
    global.behaviorSystem.addCustomTriggerResponse("level_4_start", resetScore);
    
    updateScore();
}


initialize();


/**
 * increments the score by value
 * @param {Number} value - value that is added to the score
 */
script.api.incrementScore = function(value){
    score += value;
    updateScore();
}


/**
 * updates the score on the screen
 */
function updateScore(){
    for (var i = 0; i < script.scoreTexts.length; ++i){
        script.scoreTexts[i].text = "Score: " + score.toString();
    }
}


/**
 * resets the score to zero
 */
function resetScore(){
    score = 0;
    updateScore();
}