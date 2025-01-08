/**
 * author: Martina Kessler
*/
//@input Component.Camera camera
//@input Component.ScriptComponent handTracking
//@input SceneObject cameraImage
//@input SceneObject cameraWithFlashImage
//@input SceneObject cameraScreen
//@input int handType {"widget":"combobox","values":[{"value":"0","label":"Left"},{"value":"1","label":"Right"}]}


/**
 * This script attaches the screen images of the camera to follow the hand.
 * @param {Component.Camera}          camera               - perspective camera used for screen - world coordinate transforms
 * @param {Component.ScriptComponent} handTracking         - HandTracking script
 * @param {SceneObject}               cameraImage          - screen image of the camera
 * @param {SceneObject}               cameraWithFlashImage - screen image of the camera with flash
 * @param {SceneObject}               cameraScreen         - screen image of the camera screen (is invisible and only used for collision detection)
 * @param {int}                       handType             - hand type (left or right)
 */


var gestureImages = [script.cameraImage, script.cameraWithFlashImage, script.cameraScreen];
var currentGestureImageIndex = -1;
var cameraScreenIndex = 2;


function initialize() {
    if (!script.camera || !script.handTracking || !script.cameraImage || !script.cameraWithFlashImage || !script.cameraScreen) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    var objScreenTransform = script.cameraScreen.getComponent("Component.ScreenTransform")
    var cameraScreenSize = objScreenTransform.anchors.getSize();
    var factor = 6;
    cameraScreenSize.x *= factor;
    cameraScreenSize.y *= factor;
    objScreenTransform.anchors.setSize(cameraScreenSize);
}


initialize();


/**
 * displays the image at the current hand position
 */
function onUpdate(e){
    if (script.handTracking.api.isTracking()){
        var handPosition = script.handTracking.api.getJointsAveragePosition(["index-2", "thumb-2"]);
        var perspectiveCameraScreenPositionHand = script.camera.worldSpaceToScreenSpace(handPosition);
        var orthographicCameraScreenPositionHand = perspectiveToOrthographic(perspectiveCameraScreenPositionHand);
        
        var translationVectorCamera;
        var translationVectorScreen;
        switch (script.handType) {
            case 0:
                translationVectorCamera = new vec2(0.4, 0.05);
                translationVectorScreen = new vec2(0.17, -0.095);
                break;
            case 1:
                translationVectorCamera = new vec2(-0.4, 0.05);
                translationVectorScreen = new vec2(-0.17, -0.095);
                break;
        }
        
         var orthographicCameraScreenPositionHandUpdated = orthographicCameraScreenPositionHand.add(translationVectorCamera);
        
        for (var i = 0; i < gestureImages.length; ++i){
            var gestureImage = gestureImages[i];
            var objScreenTransform = gestureImage.getComponent("Component.ScreenTransform");
            objScreenTransform.anchors.setCenter(orthographicCameraScreenPositionHandUpdated);

            if (i != cameraScreenIndex){
                objScreenTransform.anchors.setSize(new vec2(1.2, 1.2));
            }
            else{
                objScreenTransform.anchors.setCenter(orthographicCameraScreenPositionHandUpdated.add(translationVectorScreen));    
            }
        }
    }
}


/**
 * disables the gesture images
 * the function is called as a response to the LeftHandTracking_LOST and RightHandTracking_LOST trigger
 */
script.api.deactivateGestureImages = function(){
    for (var i = 0; i < gestureImages.length; ++i){
        var gestureImage = gestureImages[i];
        gestureImage.enabled = false;
    }
}