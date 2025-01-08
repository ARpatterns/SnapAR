// SequencedGestureTrigger.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: Send triggers if a sequenced hand gesture set is detected (start gesture and end gesture)

/*
this script would detect two gestures in sequence to each other defined in getGesture()
NOTE: If first gesture is lost before second gesture is detected, second gesture will not be triggered
Only if the 2 gestures are performed one after another will all the gesture triggers get called

Check out SingleGestureTrigger.js to send out triggers when a single gesture is detected

*/

//@input int handType = 0 {"widget":"combobox","values":[{"value":"0","label":"Any"},{"value":"1","label":"Left"},{"value":"2","label":"Right"}]}
//@input bool logMessage

// ---------------------------------------------------------------------------
// [author: Martina Kessler]: changed gesture strings to work with dragon game
var handTypeString;

var gestureInitiated;
//gestureInitiated will trigger when first gesture is detected

var gesturePassed;
//gesturePassed will trigger when first gesture is lost and immediately switched to second gesture

var gestureFinished;
//gestureFinished will trigger when second gesture is lost
// ---------------------------------------------------------------------------

var gestureStatus = {
    NULL: 0,
    FIRST: 1,
    SECOND: 2
};

const HAND_TYPE = {
    ANY: 0,
    LEFT: 1,
    RIGHT: 2
};

var checkLength;
//use the following to get average position of joints (see later in script)
//var getJointsAveragePosition;  
var getDistance;
var isHandTracking;

var currentGesture = "";
var previousGesture = "";
var toleranceTimer = 0;
// ----------------------------------------------------------------------------------------
// [author: Martina Kessler]: changed this value to make gesture recognition respond faster
var toleranceTimeMax = 0.05;
// ----------------------------------------------------------------------------------------

var handString;

var passed = false;

function initialize() {
    setUpTracking();
    script.createEvent("UpdateEvent").bind(onUpdate); 
}

initialize();

function onUpdate() {
    getTracking();
    
    if (!isHandTracking) {
        if (currentGesture != gestureStatus.NULL) {
            sendBehaviorTriggers(gestureFinished);
            currentGesture = gestureStatus.NULL;
            previousGesture = currentGesture;
        }
        return;
    }

    currentGesture = getGesture();
    
    if (previousGesture != currentGesture) {

        if (toleranceTimer < toleranceTimeMax) {
            toleranceTimer += getDeltaTime();
        } else {
            if (currentGesture == gestureStatus.FIRST) {
                sendBehaviorTriggers(gestureInitiated);
            } else if (currentGesture == gestureStatus.SECOND && previousGesture == gestureStatus.FIRST) {
                sendBehaviorTriggers(gesturePassed);
                passed = true;
            } else if (passed) {
                sendBehaviorTriggers(gestureFinished);
                passed = false;
            }

            toleranceTimer = 0;
            previousGesture = currentGesture;
        }
    }
}

function getGesture() {
	// ---------------------------------------------------------------
	// [author: Martina Kessler]: put the values of the eating gesture    
    if (checkLength([getDistance("thumb-3","index-3"), getDistance("thumb-3","mid-3"), getDistance("thumb-3","ring-3")], 5, 100)) {
        return gestureStatus.FIRST;
    }
    if (checkLength([getDistance("thumb-3","index-3"), getDistance("thumb-3","mid-3"), getDistance("thumb-3","ring-3")], 0, 5)) {
        return gestureStatus.SECOND;
    }
    // ---------------------------------------------------------------

    return gestureStatus.NULL;
}

function setUpTracking() {
    var hand = null;

	// ---------------------------------------------------------------------------
	// [author: Martina Kessler]: changed gesture strings to work with dragon game
    switch (script.handType) {
        case HAND_TYPE.ANY:
            checkLength = global.checkLength;
            getDistance = global.getJointsDistance;
            handTypeString = "any";
            break;
        case HAND_TYPE.LEFT:
            hand = global.leftHand();
            handTypeString = "left";
            break;
        case HAND_TYPE.RIGHT:
            hand = global.rightHand();
            handTypeString = "right";
            break;
    }
    if (hand) {
        checkLength = hand.api.checkLength;
        getDistance = hand.api.getJointsDistance;
    }
    
    gestureInitiated = "mouth_open_" + handTypeString + "_start";
    gesturePassed = "mouth_closed_" + handTypeString + "_start";
    gestureFinished = "mouth_open_closed_" + handTypeString + "_end";
    // ---------------------------------------------------------------------------
}

function getTracking() {
    switch (script.handType) {
        case HAND_TYPE.ANY:
            isHandTracking = (global.getActiveHandController() == null) ? false : true ;
            handString = global.getHand() + ": ";
            break;
        case HAND_TYPE.LEFT:
            if (global.leftHand() && global.leftHand().api.isTracking) {
                isHandTracking = global.leftHand().api.isTracking();
                handString = "L: ";
            }
            break;
        case HAND_TYPE.RIGHT:
            if (global.rightHand() && global.rightHand().api.isTracking) {
                isHandTracking = global.rightHand().api.isTracking();
                handString = "R: ";
            }
            break;
    }
}

function sendBehaviorTriggers(triggerString) {
    logMessage(triggerString);
    global.behaviorSystem.sendCustomTrigger(triggerString);
}

function logMessage(message) {
    if (script.logMessage) {
        print(message);
    }
}
