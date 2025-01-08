/**
 * author: Martina Kessler
*/
//@input Component.Camera camera
//@input Component.ScriptComponent handTracking
//@input SceneObject dragonImageMouthOpen
//@input SceneObject dragonImageMouthClosed
//@input int handType {"widget":"combobox","values":[{"value":"0","label":"Left"},{"value":"1","label":"Right"}]}


/**
 * This script attaches the screen images of the dragon to follow the hand.
 * @param {Component.Camera}          camera                 - perspective camera used for screen - world coordinate transforms
 * @param {Component.ScriptComponent} handTracking           - HandTracking script
 * @param {SceneObject}               dragonImageMouthOpen   - screen image of the dragon with mouth open
 * @param {SceneObject}               dragonImageMouthClosed - screen image of the dragon with mouth closed
 * @param {int}                       handType               - hand type (left or right)
 */


var dragonImages = [script.dragonImageMouthOpen, script.dragonImageMouthClosed];
var currentDragonImageIndex = -1;


function initialize() {
    if (!script.camera || !script.handTracking || !script.dragonImageMouthOpen || !script.dragonImageMouthClosed) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    script.createEvent("UpdateEvent").bind(onUpdate);
}


initialize();


/**
 * displays the image at the current hand position
 */
function onUpdate(e){
    if (script.handTracking.api.isTracking()){
        var mouthPosition = script.handTracking.api.getJointsAveragePosition(["index-3", "thumb-3"]);
        var perspectiveCamerasScreenPositionMouth = script.camera.worldSpaceToScreenSpace(mouthPosition);
        var orthographicCamerasScreenPositionMouth = perspectiveToOrthographic(perspectiveCamerasScreenPositionMouth);
        
        var translationVector;
        switch (script.handType) {
            case 0:
                translationVector = new vec2(-0.55, -0.25)
                break;
            case 1:
                translationVector = new vec2(0.55, -0.25)
                break;
        }
        
        var orthographicCamerasScreenPositionMouthUpdated = orthographicCamerasScreenPositionMouth.add(translationVector);
        
        for (var i = 0; i < dragonImages.length; ++i){
            var dragonImage = dragonImages[i];
            var objScreenTransform = dragonImage.getComponent("Component.ScreenTransform");
            objScreenTransform.anchors.setCenter(orthographicCamerasScreenPositionMouthUpdated);
        }

    }
}


/**
 * disables the dragon images
 * the function is called as a response to the LeftHandTracking_LOST and RightHandTracking_LOST trigger
 */
script.api.deactivateDragon = function(){
    for (var i = 0; i < dragonImages.length; ++i){
        var dragonImage = dragonImages[i];
        if (dragonImage.enabled){
            dragonImage.enabled = false;
            currentDragonImageIndex = i;
        }
    }
}


/**
 * enables the dragon images
 * the function is called as a response to the LeftHandTracking_DETECTED and RightHandTracking_DETECTED trigger
 */
script.api.activateDragon = function(){
    for (var i = 0; i < dragonImages.length; ++i){
        var dragonImage = dragonImages[i];
        if (i == currentDragonImageIndex){
            dragonImage.enabled = true;
        }
    }
}