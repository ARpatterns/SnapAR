/**
 * author: Martina Kessler
*/
//@input Component.ScriptComponent scoreManager
//@input Component.AudioComponent dance1Audio
//@input Component.AudioComponent dance2Audio
//@input Asset.ObjectPrefab downDownLeftPrefab
//@input Asset.ObjectPrefab downUpLeftPrefab
//@input Asset.ObjectPrefab upDownLeftPrefab
//@input Asset.ObjectPrefab upUpLeftPrefab
//@input Asset.ObjectPrefab downDownRightPrefab
//@input Asset.ObjectPrefab downUpRightPrefab
//@input Asset.ObjectPrefab upDownRightPrefab
//@input Asset.ObjectPrefab upUpRightPrefab
//@input float simulationSpeed = 1.0

/**
 * This script generates the different choreographies. It creates a puppet with a given pose, then lets it fall from the top of the screen onto the stage.
 * When timePerPose time has passed, then it creates a new puppet with the next pose indicated by the choreography CSV.
 * @param {Component.ScriptComponent} scoreManager        - ScoreManager script
 * @param {Component.AudioComponent}  dance1Audio         - audio track for dance 1
 * @param {Component.AudioComponent}  dance2Audio         - audio track for dance 2
 * @param {Asset.ObjectPrefab}        downDownLeftPrefab  - prefab for down_down_left pose
 * @param {Asset.ObjectPrefab}        downUpLeftPrefab    - prefab for down_up_left pose
 * @param {Asset.ObjectPrefab}        upDownLeftPrefab    - prefab for up_down_left pose
 * @param {Asset.ObjectPrefab}        upUpLeftPrefab      - prefab for up_up_left pose
 * @param {Asset.ObjectPrefab}        downDownRightPrefab - prefab for down_down_right pose
 * @param {Asset.ObjectPrefab}        downUpRightPrefab   - prefab for down_up_right pose
 * @param {Asset.ObjectPrefab}        upDownRightPrefab   - prefab for up_down_right pose
 * @param {Asset.ObjectPrefab}        upUpRightPrefab     - prefab for up_up_right pose
 * @param {float}                     simulationSpeed     - speed of the whole simulation, can be used for debugging to make it faster or slower
*/

var playInLensStudio = true; // boolean variable to indicate if the game should look good when playing in Lens Studio or when playing on an iPad Air 2 or similar
var speed;
var endPosition;
var initialOffsetDance1 = 0;
var initialOffsetDance2 = 0;
var timePerPose;
var timePerPoseTutorial = 4.1379;
var timePerPoseDance1 = 4.16;
var timePerPoseDance2 = 4.16;
var leftObject;
var rightObject;
var diffPosition = new vec2(0, -1);
var evaluationTriggered = false;
var totalTime = 0;
var levelFinished = false;
var tutorialCSV = 'down_down_left,down_down_right\ndown_down_left,up_down_right\ndown_down_left,down_down_right\nup_down_left,down_down_right\ndown_down_left,down_down_right\ndown_down_left,up_down_right\nup_down_left,down_down_right\ndown_down_left,down_down_right\ndown_down_left,down_up_right\ndown_down_left,down_down_right\ndown_up_left,down_down_right\ndown_down_left,down_down_right\ndown_down_left,down_up_right\ndown_up_left,down_down_right\ndown_down_left,down_down_right\ndown_up_left,down_up_right\ndown_down_left,down_down_right\nup_down_left,up_down_right\ndown_down_left,down_down_right\ndown_up_left,down_down_right\nup_up_left,down_down_right\nup_up_left,up_down_right\nup_up_left,up_up_right\nup_up_left,up_down_right\nup_up_left,down_down_right\ndown_up_left,down_down_right\ndown_down_left,down_down_right';
var dance1CSV = 'up_down_left,up_down_right\nup_up_left,up_down_right\nup_down_left,up_up_right\nup_up_left,up_down_right\nup_down_left,up_up_right\nup_down_left,up_down_right\nup_down_left,down_down_right\nup_down_left,up_down_right\nup_down_left,down_down_right\nup_down_left,up_down_right\ndown_down_left,down_down_right\nup_down_left,up_down_right\ndown_down_left,down_down_right\nup_down_left,up_down_right\nup_up_left,up_up_right\nup_down_left,up_down_right\ndown_down_left,down_down_right\ndown_up_left,down_down_right\nup_up_left,down_down_right\nup_up_left,up_down_right\nup_up_left,up_up_right\nup_up_left,up_down_right\nup_up_left,down_down_right\ndown_up_left,down_down_right\ndown_down_left,down_down_right\nup_down_left,down_down_right\nup_down_left,down_up_right\nup_down_left,down_down_right\ndown_down_left,down_down_right\nup_down_left,down_down_right\nup_down_left,down_up_right\nup_down_left,up_up_right\nup_up_left,up_up_right\nup_down_left,up_up_right\nup_down_left,down_up_right\nup_down_left,down_down_right\ndown_down_left,down_down_right\nup_up_left,down_down_right\ndown_down_left,down_down_right\ndown_down_left,up_up_right\ndown_down_left,down_down_right\ndown_up_left,down_down_right\ndown_down_left,up_down_right\ndown_up_left,down_down_right\ndown_down_left,up_down_right\nup_down_left,up_down_right\nup_up_left,up_up_right\nup_down_left,up_down_right\ndown_down_left,down_down_right\ndown_down_left,up_down_right\nup_down_left,down_down_right\nup_down_left,down_up_right\nup_up_left,down_down_right';
var dance2CSV = 'up_down_left,up_down_right\nup_down_left,up_up_right\nup_down_left,down_up_right\nup_down_left,up_up_right\nup_up_left,up_down_right\ndown_up_left,up_down_right\nup_up_left,up_down_right\nup_down_left,up_down_right\nup_up_left,up_down_right\nup_up_left,down_down_right\nup_up_left,up_down_right\nup_up_left,down_down_right\ndown_down_left,up_up_right\nup_up_left,down_down_right\ndown_down_left,up_up_right\nup_up_left,down_down_right\nup_down_left,up_up_right\nup_up_left,down_down_right\nup_down_left,up_up_right\nup_up_left,down_down_right\nup_down_left,up_down_right\nup_up_left,down_down_right\nup_down_left,up_down_right\ndown_down_left,up_up_right\ndown_down_left,down_down_right\nup_up_left,up_down_right\ndown_down_left,down_down_right\nup_down_left,up_up_right\ndown_up_left,down_down_right\nup_down_left,up_up_right\ndown_up_left,down_down_right\nup_down_left,up_up_right\nup_down_left,down_up_right\ndown_up_left,up_down_right\nup_down_left,down_up_right\ndown_up_left,up_down_right\nup_up_left,down_down_right\ndown_up_left,up_down_right\nup_up_left,down_down_right\ndown_up_left,up_down_right\ndown_down_left,up_up_right\ndown_up_left,up_down_right\ndown_down_left,up_up_right\ndown_up_left,up_down_right\nup_down_left,down_down_right\ndown_up_left,up_down_right\nup_down_left,down_down_right\ndown_up_left,up_down_right\nup_down_left,down_down_right\ndown_down_left,down_down_right\nup_down_left,down_down_right\nup_down_left,up_down_right';
var choreography;
var leftPoseIndex = 0;
var rightPoseIndex = 1;
var currentChoreographyIndex = 0;
var poses = {
    down_down_left: script.downDownLeftPrefab,
    down_up_left: script.downUpLeftPrefab,
    up_down_left: script.upDownLeftPrefab,
    up_up_left: script.upUpLeftPrefab,
    down_down_right: script.downDownRightPrefab,
    down_up_right: script.downUpRightPrefab,
    up_down_right: script.upDownRightPrefab,
    up_up_right: script.upUpRightPrefab
};
var updateEvent;


function initialize(){
    if (!script.scoreManager || !script.dance1Audio || !script.downDownLeftPrefab || !script.downUpLeftPrefab || !script.upDownLeftPrefab || !script.upUpLeftPrefab || !script.downDownRightPrefab || !script.downUpRightPrefab || !script.upDownRightPrefab || !script.upUpRightPrefab || !script.simulationSpeed) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    global.behaviorSystem.addCustomTriggerResponse("tutorial_start", onTutorialStart);
    global.behaviorSystem.addCustomTriggerResponse("dance_1_start", onDance1Start);
    global.behaviorSystem.addCustomTriggerResponse("dance_2_start", onDance2Start);
    
    if (playInLensStudio){
        speed = 0.15;
        endPosition = -0.135;
    }
    else{
        speed = 0.21;
        endPosition = -0.18;
    }
}


initialize();


/**
 * starts the choreography
 */
function startChoreography(){
    updateEvent = script.createEvent("UpdateEvent")
    updateEvent.bind(onUpdate);
}


/**
 * resets the choreography
 */
function resetChoreography(){
    currentChoreographyIndex = 0;
    leftObject = createObjectFromPrefab(poses[choreography[currentChoreographyIndex][leftPoseIndex]], true);
    rightObject = createObjectFromPrefab(poses[choreography[currentChoreographyIndex][rightPoseIndex]], false);
    currentChoreographyIndex++;
    
    totalTime = 0;
    evaluationTriggered = false;
    levelFinished = false;
}


/**
 * reads in the tutorial CSV and starts the choreography
 */
function onTutorialStart(){
    choreography = readCSV(tutorialCSV);
    timePerPose = timePerPoseTutorial;
    resetChoreography();
    startChoreography();
}


/**
 * reads in the Dance 1 CSV and starts the choreography
 */
function onDance1Start(){
    choreography = readCSV(dance1CSV);
    timePerPose = timePerPoseDance1;
    resetChoreography();
    startChoreography();
    totalTime = initialOffsetDance1;
    script.dance1Audio.play(1);
}


/**
 * reads in the Dance 2 CSV and starts the choreography
 */
function onDance2Start(){
    choreography = readCSV(dance2CSV);
    timePerPose = timePerPoseDance2;
    resetChoreography();
    startChoreography();
    totalTime = initialOffsetDance2;
    script.dance2Audio.play(1);
}


/**
 * lets the pose fall down
 * evaluates the pose if has reached endPosition
 * generates a new pose when timePerPose is over
 */
function onUpdate(e){
    var deltaTime = getDeltaTime() * script.simulationSpeed;
    totalTime += deltaTime;
    
    if(!evaluationTriggered){
        var rectangleLeft = leftObject.getComponent("Component.ScreenTransform").anchors;
        var rectangleRight = rightObject.getComponent("Component.ScreenTransform").anchors;
        
        var screenPositionLeft = rectangleLeft.getCenter();
        var screenPositionRight = rectangleRight.getCenter();
        
        var updatedScreenPositionLeft = screenPositionLeft.add(diffPosition.mult(new vec2(0, speed * deltaTime)));
        var updatedScreenPositionRight = screenPositionRight.add(diffPosition.mult(new vec2(0, speed * deltaTime)));
        
        rectangleLeft.setCenter(updatedScreenPositionLeft);
        rectangleRight.setCenter(updatedScreenPositionRight);

        if (updatedScreenPositionLeft.y <= endPosition){
            //script.scoreManager.api.printPoses();
            script.scoreManager.api.checkPoses();
            evaluationTriggered = true;
        } 
    }
    else{
        if (totalTime >= timePerPose){
            leftObject.destroy();
            rightObject.destroy();

            if (levelFinished){
                global.behaviorSystem.sendCustomTrigger("dance_completed_start");
                script.removeEvent(updateEvent);
            }
            else{
                leftObject = createObjectFromPrefab(poses[choreography[currentChoreographyIndex][leftPoseIndex]], true);
                rightObject = createObjectFromPrefab(poses[choreography[currentChoreographyIndex][rightPoseIndex]], false);
                totalTime = 0;
                
                print(currentChoreographyIndex);
                currentChoreographyIndex++;
                
                if (currentChoreographyIndex >= choreography.length){
                    levelFinished = true;
                }            
            
                evaluationTriggered = false;
            }
        }
    }
}


/**
 * creates an object from a prefab
 * @param  {Asset.ObjectPrefab} prefab - the prefab to instantiate
 * @param  {Boolean}            left   - indicates if the prefab is from the left (left = true) or right (left = false) side of the pose
 */

function createObjectFromPrefab(prefab, left){
    if(prefab){
        var instanceObject = prefab.instantiate(script.getSceneObject());
        var objScreenTransform = instanceObject.getComponent("Component.ScreenTransform");
        
        var x;
        var y;
        var objectPosition;
        
        if (playInLensStudio){
            objScreenTransform.scale = new vec3(0.1, 0.1, 0.1);
            x = 0.0395;
            y = 0.4;
        }
        else{
            objScreenTransform.scale = new vec3(0.2, 0.2, 0.2);
            x = 0.079;
            y = 0.6;
        }
        
        if (left){
            objectPosition = new vec2(-x, y);
        }
        else{
            objectPosition = new vec2(x, y);
        }
        
        objScreenTransform.anchors.setCenter(objectPosition);
        
        var poseScript = instanceObject.getComponent("Component.ScriptComponent");
        
        if (left){
            script.scoreManager.api.leftPoseFallingPuppetChanged(poseScript.script.poseName);
        }
        else{
            script.scoreManager.api.rightPoseFallingPuppetChanged(poseScript.script.poseName);
        }
        
        
        return instanceObject;
    }
    else{
        print("createObjectFromPrefab() failed")
        return undefined;
    }
}


/**
 * reads a csv and returns it
 * @param {String} csv  - csv string, comma separated values with \n as the new line character
 */
function readCSV(csv){
    var lines = csv.split('\n');
    //var columnNamesLine = lines[0];
    //var columnNames = parse(columnNamesLine);
    //var dataLines = lines.slice(1);
    return lines.map(parse);
}


/**
 * parses one row of the csv
 * @param {String} row - csv string, comma separated values of one line
 */
function parse(row){
    var entries = [];                                                 
    var entry = [];
    row.split('').forEach(function (character) {                         
        if(character == ",") {                           
            entries.push(entry.join(''));                                  
            entry = [];                                                    
        }
        else {
            entry.push(character);                                         
        }                                                                                                                                
    });
    entries.push(entry.join(''));                                        
    return entries;                                                      
}
