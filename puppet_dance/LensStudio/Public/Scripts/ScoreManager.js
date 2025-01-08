/**
 * author: Martina Kessler
*/
//@input string poseCorrectTrigger = "pose_correct"
//@input string poseWrongTrigger = "pose_wrong"
//@input Component.Text[] scoreTexts

/**
 * This script evaluates if the puppet controlled by hand gestures is in the same pose as the puppet falling down.
 * It creates a trigger for the specific situation (pose correct/wrong)
 * The poses are represented as strings. The following poses are possible:
 * left poses:  up_down_left,  down_up_left,  up_up_left,  down_down_left
 * right poses: up_down_right, down_up_right, up_up_right, down_down_right
 * This script also holds the current score and displays it on the screen.
 * @param {string} poseCorrectTrigger - name of the trigger when the pose is correct
 * @param {string} poseWrongTrigger   - name of the trigger when the pose is wrong
 * @param {Component.Text[]} scoreTexts - texts where the score is displayed
 */



var controlledLeftPose; // pose of the left part of the controlled puppet
var controlledRightPose; // pose of the right part of the controlled puppet
var fallingLeftPose; // pose of the left part of the falling puppet
var fallingRightPose; // pose of the right part of the falling puppet
var score = 0;


function initialize(){
    if (script.scoreTexts.length == 0) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    global.behaviorSystem.addCustomTriggerResponse("tutorial_start", resetScore);
    global.behaviorSystem.addCustomTriggerResponse("dance_1_start", resetScore);  
    global.behaviorSystem.addCustomTriggerResponse("dance_2_start", resetScore);
    
    updateScore();
    
    controlledLeftPose = "up_down_left";
    controlledRightPose = "up_down_right";
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


/**
 * changes the value of the left body part of the controlled puppet
 * The function is called by the child objects of Trigger Game State.
 * @param {string} newLeftPose - string representing the pose of the left body part
 */
script.api.leftPoseControlledPuppetChanged = function(newLeftPose){
    controlledLeftPose = newLeftPose;
}


/**
 * changes the value of the right body part of the controlled puppet
 * The function is called by the child objects of Trigger Game State.
 * @param {string} newRightPose - string representing the pose of the right body part
 */
script.api.rightPoseControlledPuppetChanged = function(newRightPose){
    controlledRightPose = newRightPose;
}


/**
 * changes the value of the left body part of the falling puppet
 * The function is called in the PoseGenerator
 * @param {string} newLeftPose - string representing the pose of the left body part
 */
script.api.leftPoseFallingPuppetChanged = function(newLeftPose){
    fallingLeftPose = newLeftPose;
}


/**
 * changes the value of the right body part of the falling puppet
 * The function is called in the PoseGenerator
 * @param {string} newRightPose - string representing the pose of the right body part
 */
script.api.rightPoseFallingPuppetChanged = function(newRightPose){
    fallingRightPose = newRightPose;
}


/**
 * prints the poses
 */
script.api.printPoses = function(){
    print("controlledLeftPose: " + controlledLeftPose);
    print("fallingLeftPose: " + fallingLeftPose);
    
    print("controlledRightPose: " + controlledRightPose);
    print("fallingRightPose: " + fallingRightPose);
}


/**
 * checks if the pose of the falling puppet and the controlled puppet is the same
 * The function is called in the PoseGenerator.
 */ 
script.api.checkPoses = function(){
    if ((controlledLeftPose == fallingLeftPose) && (controlledRightPose == fallingRightPose)){
        global.behaviorSystem.sendCustomTrigger(script.poseCorrectTrigger);
        script.api.incrementScore(1);
        return true;
    }
    else{
        global.behaviorSystem.sendCustomTrigger(script.poseWrongTrigger);
        return false;
    }
}