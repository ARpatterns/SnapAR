// GetJointDistanceHelper.js
// Version: 0.0.1
// Event: Lens Initialized
// Description: To be used with HandTrackingController.js and GetJointDistanceHelperManager.js
// This script gets distance between joints or joints and objects and sends out triggers if it is within a certain range

//@input int handType = 0 {"widget":"combobox","values":[{"value":"0","label":"Any"},{"value":"1","label":"Left"},{"value":"2","label":"Right"}]}
//@input int checkType = 0 {"widget":"combobox","values":[{"value":"0","label":"Joints & Joints"},{"value":"1","label":"Joints & Object"},{"value":"2","label":"Joints & Joints Different Hands"}]}
//@input string[] jointGroupA
//@input string[] jointGroupB
//@input SceneObject targetObject {"showIf":"checkType","showIfValue":"1"}

//@input bool visualizeDistance
//@ui {"widget":"separator"}
//@input bool checkDistance
//@input float minDistance {"showIf":"checkDistance","label":"Range Min"}
//@input float maxDistance = 100 {"showIf":"checkDistance","label":"Range Max"}

//@ui {"widget":"separator"}
//@input bool sendTriggers
//@input string enterRangeTrigger {"showIf":"sendTriggers","label":"Enter Range"}
//@input string exitRangeTrigger {"showIf":"sendTriggers","label":"Exit Range"}


var rawDistance = 0;
var getDistance, getPosition;
// ---------------------------------------------------------------------------------------------------------------------
// [author: Martina Kessler]: added this variable to make the gesture recognition work for gestures made with both hands
var getPositionOtherHand;
// ---------------------------------------------------------------------------------------------------------------------

var distanceLoggerObject;

var passTriggerSent;

var outofRangeColor, inRangeColor;

function initialize() {
    
    switch (script.handType) {
        case 1:
            getDistance = global.leftHand().api.getJointsDistance;
            getPosition = global.leftHand().api.getJointsAveragePosition;
            // ---------------------------------------------------------------------------------------------------------------------
            // [author: Martina Kessler]: added this variable to make the gesture recognition work for gestures made with both hands
            getPositionOtherHand = global.rightHand().api.getJointsAveragePosition;
            // ---------------------------------------------------------------------------------------------------------------------
            break;
        case 2:
            getDistance = global.rightHand().api.getJointsDistance;
            getPosition = global.rightHand().api.getJointsAveragePosition;
            // ---------------------------------------------------------------------------------------------------------------------
            // [author: Martina Kessler]: added this variable to make the gesture recognition work for gestures made with both hands
            getPositionOtherHand = global.leftHand().api.getJointsAveragePosition;
            // ---------------------------------------------------------------------------------------------------------------------
            break;
    }
    
    if (script.visualizeDistance) {
        initializeDistanceLoggerVisual();
    }

    script.createEvent("UpdateEvent").bind(onUpdate);
}

function onUpdate() {    
    
    if (!global.getActiveHandController()) {
        if (passTriggerSent && script.sendTriggers) {
            global.behaviorSystem.sendCustomTrigger(script.exitRangeTrigger);
            passTriggerSent = false;
        }
        return;
    }
    
    if ((!getDistance || !getPosition) && script.handType == 0) {
        getDistance = global.getJointsDistance;
        getPosition = global.getJointsAveragePosition;
    }
    
    if (script.checkType == 0) {
        rawDistance = getDistance(script.jointGroupA, script.jointGroupB);
    // ---------------------------------------------------------------------------------------------------------------------
    // [author: Martina Kessler]: added this variable to make the gesture recognition work for gestures made with both hands
    } else if (script.checkType == 2) {
        var leftJointsPosition;
        var rightJointsPosition;
        switch(script.handType){
            case 1: 
                leftJointsPosition = getPosition(script.jointGroupA);
                rightJointsPosition = getPositionOtherHand(script.jointGroupB);
                break;
            case 2:
                rightJointsPosition = getPosition(script.jointGroupA);
                leftJointsPosition = getPositionOtherHand(script.jointGroupB);
        }
        rawDistance = leftJointsPosition.distance(rightJointsPosition);
        // print the distance to debug because the distance logger doesn't work for distances between different hands
        //print(rawDistance); 
    // ---------------------------------------------------------------------------------------------------------------------
    } else if (script.checkType == 1) {
        rawDistance = getPosition(script.jointGroupA).distance(script.targetObject.getTransform().getWorldPosition());
    }
    
    if (script.checkDistance) {
        if (global.checkWithinRange(rawDistance, script.minDistance, script.maxDistance)) {
            if (!passTriggerSent) {
                if (script.sendTriggers) {
                    print("enter range trgger sent" + script.enterRangeTrigger);
                    global.behaviorSystem.sendCustomTrigger(script.enterRangeTrigger);   
                }
                if (inRangeColor && distanceLoggerObject) {
                    distanceLoggerObject.setTextColor(inRangeColor);
                }
                passTriggerSent = true;
                
            }
        } else {
            if (passTriggerSent) {
                if (script.sendTriggers) {    
                    print("exit range trgger sent" + script.exitRangeTrigger);
                    global.behaviorSystem.sendCustomTrigger(script.exitRangeTrigger);
                }
                if (outofRangeColor && distanceLoggerObject) {
                    distanceLoggerObject.setTextColor(outofRangeColor);
                }
                passTriggerSent = false;
            }
        }
    } 
}

function initializeDistanceLoggerVisual() {
    // ---------------------------------------------------------------------------------------------------------------------
    // [author: Martina Kessler]: added this variable to make the gesture recognition work for gestures made with both hands
    var objB = (script.checkType == 0 || script.checkType == 2) ? script.jointGroupB : script.targetObject;
    // ---------------------------------------------------------------------------------------------------------------------
    distanceLoggerObject = global.createDistanceLogger(script.jointGroupA, objB);
}

function checkHandTracking() {
    if (script.handType == 0) {
        return global.getActiveHandController() !== null;
    } else if (script.handType == 1) {
    // ---------------------------------------------------------------------------------------------------------
    // [author: Martina Kessler]: changed this to make the gesture recognition work for both hands simultaneously
    // because global.ActiveHandController() might return the other hand if both of them are tracked
        return global.leftHand().api.isTracking();
        //return global.getHand() == "L";
    } else if (script.handType == 2) {
        return global.rightHand().api.isTracking();
        //return global.getHand() == "R";
    // ---------------------------------------------------------------------------------------------------------
    }
}

script.api.getDistance = function() {
    return rawDistance;
};

script.api.isWithinRange = function() {
    if (!checkHandTracking()) {
        return false;
    }
    return global.checkWithinRange(rawDistance, script.minDistance, script.maxDistance);
};

script.api.overwriteVisualizer = function(b, defaultTextColor) {
    if (b && !distanceLoggerObject) {
        initializeDistanceLoggerVisual();
        distanceLoggerObject.setTextColor(defaultTextColor);
    } else if (!b && distanceLoggerObject) {
        distanceLoggerObject.toggleVisual(false);
    }
};

script.api.setTextColor = function(inC, outC) {
    inRangeColor = inC;
    outofRangeColor = outC;
};

initialize();