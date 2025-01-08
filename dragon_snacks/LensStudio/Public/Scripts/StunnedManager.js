/**
 * author: Martina Kessler
*/
//@input float duration = 10.0
//@input int handType {"widget":"combobox","values":[{"value":"0","label":"Left"},{"value":"1","label":"Right"}]}


/**
 * This script takes care of making the dragons stunned for duration seconds.
 * @param {float} duration - time it takes until the dragon is not stunned anymore
 * @param {int}   handType - hand type (left or right)
 */


var handString;
var time = 0;
var event;
var stunned;


function initialize(){
    if (!script.duration) {
        print("Missing input on " + script.getSceneObject().name);
    }    
    
    global.behaviorSystem.addCustomTriggerResponse("next_level_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("same_level_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("gesture_training_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("tutorial_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_1_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_2_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_3_start", onLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("level_4_start", onLevelStart);
    
    switch (script.handType) {
        case 0:
            handString = 'left';
            break;
        case 1:
            handString = 'right';
            break;
    }
    
    stunned = false;
}


initialize();


script.api.stunned = stunned;


/**
 * starts the stunned state
 * the function is called as a response to the trigger bomb_touched_left and bomb_touched_right
 */
script.api.startStunned = function(){
    time = 0;
    stunned = true;
    
    if (event == null){
        event = script.createEvent("UpdateEvent")
        event.bind(onUpdate);
    }
}


/**
 * checks if the stunned state is over
 */
function onUpdate(e){
    time += getDeltaTime();
    
    if (time >= script.duration){
        global.behaviorSystem.sendCustomTrigger("stunned_end_" + handString);
        script.removeEvent(event);
        event = null;
        stunned = false;
    }
}


/**
 * returns the stunned state
 */
script.api.getStunnedState = function(){
    return stunned;
}


/**
 * removes the stunned state when the level is started
 */
function onLevelStart(){
    stunned = false;
    global.behaviorSystem.sendCustomTrigger("stunned_end_" + handString);
}