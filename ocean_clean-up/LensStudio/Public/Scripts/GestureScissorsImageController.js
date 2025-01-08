/**
 * author: Martina Kessler
*/
//@input Component.Camera camera
//@input Component.ScriptComponent handTracking
//@input SceneObject scissorsOpenImage
//@input SceneObject scissorsClosedImage
//@input SceneObject scissorsColliderImage
//@input int handType {"widget":"combobox","values":[{"value":"0","label":"Left"},{"value":"1","label":"Right"}]}


/**
 * This script attaches the screen images of the scissors gesture to follow the hand.
 * @param {Component.Camera}          camera                - perspective camera used for screen - world coordinate transforms
 * @param {Component.ScriptComponent} handTracking          - HandTracking script
 * @param {SceneObject}               cameraImage           - screen image of the camera
 * @param {SceneObject}               cameraWithFlashImage  - screen image of the camera with flash
 * @param {SceneObject}               scissorsOpenImage     - screen image of the open scissors
 * @param {SceneObject}               scissorsClosedImage   - screen image of the closed scissors
 * @param {SceneObject}               scissorsColliderImage - screen image of the scissors collider (is invisible and only used for collision detection)
 * @param {int}                       handType              - hand type (left or right)
 */


var gestureImages = [script.scissorsOpenImage, script.scissorsClosedImage, script.scissorsColliderImage];
var currentGestureImageIndex = -1;
var cameraScreenIndex = 2;


function initialize() {
    if (!script.camera || !script.handTracking|| !script.scissorsOpenImage || !script.scissorsClosedImage  || !script.scissorsColliderImage) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    script.createEvent("UpdateEvent").bind(onUpdate);
    
    var objScreenTransform = script.scissorsColliderImage.getComponent("Component.ScreenTransform")
    var scissorsColliderSize = objScreenTransform.anchors.getSize();
    var factor = 1.38;
    scissorsColliderSize.x *= factor;
    scissorsColliderSize.y *= factor;
    objScreenTransform.anchors.setSize(scissorsColliderSize);
}


initialize();


/**
 * displays the image at the current hand position
 */
function onUpdate(e){
    if (script.handTracking.api.isTracking()){
        var handPosition = script.handTracking.api.getJointsAveragePosition(["index-3", "mid-3"]);
        var perspectiveCameraScreenPositionHand = script.camera.worldSpaceToScreenSpace(handPosition);
        var orthographicCameraScreenPositionHand = perspectiveToOrthographic(perspectiveCameraScreenPositionHand);
        
        var translationVector;
        var translationVectorCollider;
        
        switch (script.handType) {
            case 0:
                translationVector = new vec2(-0.7, 0);
                translationVectorCollider = new vec2(0.35, 0);
                break;
            case 1:
                translationVector = new vec2(0.7, 0);
                translationVectorCollider = new vec2(-0.35, 0);
                break;
        }
        
        var orthographicCameraScreenPositionHandUpdated = orthographicCameraScreenPositionHand.add(translationVector);
        
        for (var i = 0; i < gestureImages.length; ++i){
            var gestureImage = gestureImages[i];
            var objScreenTransform = gestureImage.getComponent("Component.ScreenTransform");
            objScreenTransform.anchors.setCenter(orthographicCameraScreenPositionHandUpdated);
            var getCenter = objScreenTransform.anchors.getCenter();
            
            if (i != cameraScreenIndex){
                objScreenTransform.anchors.setSize(new vec2(1.5, 1.5));
            }
            else{
                objScreenTransform.anchors.setCenter(orthographicCameraScreenPositionHandUpdated.add(translationVectorCollider));      
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