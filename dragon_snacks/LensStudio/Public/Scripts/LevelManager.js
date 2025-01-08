/**
 * author: Martina Kessler
*/
//@input Component.ScriptComponent itemStorage
//@input Component.ScriptComponent stunnedManagerLeft
//@input Component.ScriptComponent stunnedManagerRight
//@input Component.Camera camera
//@input Asset.ObjectPrefab pizzaPrefab
//@input Asset.ObjectPrefab burgerPrefab
//@input Asset.ObjectPrefab hotDogPrefab
//@input Asset.ObjectPrefab sushiPrefab
//@input Asset.ObjectPrefab donutPrefab
//@input Asset.ObjectPrefab cupcakePrefab
//@input Asset.ObjectPrefab lollipopPrefab
//@input Asset.ObjectPrefab iceCreamPrefab
//@input Asset.ObjectPrefab bombPrefab
//@input float simulationSpeed = 1.0


/**
 * This script reads in the level data as a csv, each csv entry consists of name,position,time,speed\n. It generates these items when the corresponding time is reached
 * and lets them fall from the top of the screen with the indicated speed. It also takes care of the game logic, so it checks if the game is over or if the 
 * level or the whole game is completed.
 * @param {Component.ScriptComponent} itemStorage         - itemStorage script
 * @param {Component.ScriptComponent} stunnedManagerLeft  - StunnedManager script for the left hand
 * @param {Component.ScriptComponent} stunnedManagerRight - StunnedManager script for the right hand
 * @param {Component.Camera}          camera              - orthographic camera used for screen - world coordinate transforms
 * @param {Asset.ObjectPrefab}        pizzaPrefab         - prefab for pizza item
 * @param {Asset.ObjectPrefab}        burgerPrefab        - prefab for burger item
 * @param {Asset.ObjectPrefab}        hotDogPrefab        - prefab for hot dog item
 * @param {Asset.ObjectPrefab}        sushiPrefab         - prefab for sushi item
 * @param {Asset.ObjectPrefab}        donutPrefab         - prefab for donut item
 * @param {Asset.ObjectPrefab}        cupcakePrefab       - prefab for cupcake item
 * @param {Asset.ObjectPrefab}        lollipopPrefab      - prefab for lollipop item
 * @param {Asset.ObjectPrefab}        iceCreamPrefab      - prefab for ice cream item
 * @param {Asset.ObjectPrefab}        bombPrefab          - prefab for bomb item
 * @param {float}                     simulationSpeed     - speed of the whole simulation, can be used for debugging to make it faster or slower
 */


var diffPosition = new vec2(0, -1);
var passedTime = 0;
var updateEvent;
var items = {
    Pizza: script.pizzaPrefab,
    Burger: script.burgerPrefab,
    Hotdog: script.hotDogPrefab,
    Sushi: script.sushiPrefab,
    Donut: script.donutPrefab,
    Cupcake: script.cupcakePrefab,
    Lollipop: script.lollipopPrefab,
    Icecream: script.iceCreamPrefab,
    Bomb: script.bombPrefab
};
var currentIndex = 0;
var tutorialVersion = false;
var levelData;
var levelCSV;
var tutorialCSV = 'Burger,0,0,0.15\nDonut,0,8,0.15\nPizza,0,16,0.15\nHotdog,0,20,0.15\nIcecream,0,24,0.15\nCupcake,0,28,0.15\nBurger,0,36,0.15\nHotdog,0.25,36.4,0.15\nPizza,0.5,36.8,0.15\nDonut,0,44.8,0.15\nIcecream,-0.25,45.2,0.15\nCupcake,-0.5,45.6,0.15\nHotdog,-0.1,51.6,0.15\nDonut,0.1,53.6,0.15\nHotdog,-0.1,55.6,0.15\nDonut,0.1,57.6,0.15\nHotdog,-0.1,59.6,0.15\nBurger,0.2,66.1,0.15\nBurger,0.346410161513776,66.6,0.15\nBurger,0.4,67.1,0.15\nBurger,0.346410161513775,67.6,0.15\nBurger,0.2,68.1,0.15\nBurger,4.90059381963448E-17,68.6,0.15\nCupcake,-0.2,70.1,0.15\nCupcake,-0.346410161513776,70.6,0.15\nCupcake,-0.4,71.1,0.15\nCupcake,-0.346410161513775,71.6,0.15\nCupcake,-0.2,72.1,0.15\nCupcake,-9.80118763926896E-17,72.6,0.15\nBurger,0.2,74.1,0.15\nBurger,0.346410161513776,74.6,0.15\nBurger,0.4,75.1,0.15\nBurger,0.346410161513775,75.6,0.15\nBurger,0.2,76.1,0.15\nBurger,4.90059381963448E-17,76.6,0.15\nBomb,0,80.6,0.15\nBomb,-0.8,84.6,0.15\nBomb,-0.6,84.6,0.15\nBomb,-0.4,84.6,0.15\nBomb,-0.2,84.6,0.15\nBomb,0,84.6,0.15\nBomb,0.2,84.6,0.15\nBomb,0.4,84.6,0.15\nBomb,0.6,84.6,0.15\nBomb,0.8,84.6,0.15\nPizza,-0.1,88.6,0.15\nIcecream,0.1,90.1,0.15\nPizza,-0.1,91.6,0.15\nIcecream,0.1,93.1,0.15\nPizza,-0.1,94.6,0.15\nIcecream,0.1,96.1,0.15\nPizza,-0.1,97.6,0.15\nIcecream,0.1,99.1,0.15\nPizza,-0.1,100.6,0.15\nIcecream,0,104.6,0.15\nIcecream,-0.1,105.6,0.15\nIcecream,0.1,105.6,0.15\nIcecream,-0.3,106.6,0.15\nIcecream,0.3,106.6,0.15\nIcecream,0,106.6,0.15\nIcecream,-0.5,107.6,0.15\nIcecream,0.5,107.6,0.15\nIcecream,-0.25,107.6,0.15\nIcecream,0.25,107.6,0.15\nIcecream,0,107.6,0.15\nIcecream,0.25,108.6,0.15\nIcecream,-0.25,108.6,0.15\nIcecream,0,108.6,0.15\nIcecream,0,109.6,0.15';
var level1CSV = 'Donut,0.25,0,0.15\nCupcake,0.1,0.4,0.15\nDonut,-0.05,0.8,0.15\nCupcake,-0.2,1.2,0.15\nDonut,-0.35,1.6,0.15\nCupcake,-0.5,2,0.15\nPizza,-0.25,4,0.15\nBurger,-0.1,4.3,0.15\nPizza,0.05,4.6,0.15\nBurger,0.2,4.9,0.15\nPizza,0.35,5.2,0.15\nBurger,0.5,5.5,0.15\nDonut,0.25,7.5,0.15\nCupcake,0.1,7.7,0.15\nDonut,-0.05,7.9,0.15\nCupcake,-0.2,8.1,0.15\nDonut,-0.35,8.3,0.15\nCupcake,-0.5,8.5,0.15\nPizza,-0.25,10.5,0.15\nBurger,-0.1,10.6,0.15\nPizza,0.05,10.7,0.15\nBurger,0.2,10.8,0.15\nPizza,0.35,10.9,0.15\nBurger,0.5,11,0.15\nCupcake,0.25,13,0.15\nDonut,0.1,13,0.15\nCupcake,-0.05,13,0.15\nDonut,-0.2,13,0.15\nCupcake,-0.35,13,0.15\nDonut,-0.5,13,0.15\nCupcake,-0.5,13.5,0.15\nDonut,-0.5,14,0.15\nCupcake,-0.5,14.5,0.15\nDonut,-0.5,15,0.15\nCupcake,-0.5,15.5,0.15\nBurger,-0.25,17.5,0.15\nPizza,-0.1,17.5,0.15\nBurger,0.05,17.5,0.15\nPizza,0.2,17.5,0.15\nBurger,0.35,17.5,0.15\nPizza,0.5,17.5,0.15\nBurger,0.5,18,0.15\nPizza,0.5,18.5,0.15\nBurger,0.5,19,0.15\nPizza,0.5,19.5,0.15\nBurger,0.5,20,0.15\nCupcake,0.25,23,0.15\nDonut,0.1,23.5,0.15\nCupcake,-0.05,24,0.15\nDonut,-0.2,24.5,0.15\nCupcake,-0.35,25,0.15\nDonut,-0.5,25.5,0.15\nCupcake,-0.5,26,0.15\nDonut,-0.5,26.5,0.15\nCupcake,-0.5,27,0.15\nDonut,-0.5,27.5,0.15\nCupcake,-0.5,28,0.15\nBurger,-0.25,30,0.15\nPizza,-0.1,30,0.15\nBurger,0.05,30,0.15\nPizza,0.2,30,0.15\nBurger,0.35,30,0.15\nPizza,0.5,30,0.15\nBurger,0.35,30.5,0.15\nPizza,0.2,31,0.15\nBurger,0.05,31.5,0.15\nPizza,-0.1,32,0.15\nBurger,-0.25,32.5,0.15\nCupcake,0.25,35,0.15\nDonut,0.1,35.5,0.15\nCupcake,-0.05,36,0.15\nDonut,-0.2,36.5,0.15\nCupcake,-0.35,37,0.15\nDonut,-0.5,37.5,0.15\nCupcake,-0.35,37.5,0.15\nDonut,-0.2,37.5,0.15\nCupcake,-0.05,37.5,0.15\nDonut,0.1,37.5,0.15\nCupcake,0.25,37.5,0.15\nPizza,-0.1,40.5,0.15\nDonut,0.1,42.5,0.15\nPizza,-0.1,44.5,0.15\nDonut,0.1,46.5,0.15\nPizza,-0.1,48.5,0.15\nBurger,0.2,51,0.15\nBurger,0.346410161513776,51.5,0.15\nBurger,0.4,52,0.15\nBurger,0.346410161513775,52.5,0.15\nBurger,0.2,53,0.15\nBurger,4.90059381963448E-17,53.5,0.15\nCupcake,-0.2,55,0.15\nCupcake,-0.346410161513776,55.5,0.15\nCupcake,-0.4,56,0.15\nCupcake,-0.346410161513775,56.5,0.15\nCupcake,-0.2,57,0.15\nCupcake,-9.80118763926896E-17,57.5,0.15\nBurger,0.2,59,0.15\nBurger,0.346410161513776,59.5,0.15\nBurger,0.4,60,0.15\nBurger,0.346410161513775,60.5,0.15\nBurger,0.2,61,0.15\nBurger,4.90059381963448E-17,61.5,0.15\nHotdog,-0.1,65.5,0.15\nIcecream,0.1,65.5,0.15\nBurger,-0.1,67,0.15\nCupcake,0.1,67,0.15\nPizza,-0.1,68.5,0.15\nDonut,0.1,68.5,0.15\nHotdog,-0.1,70,0.15\nIcecream,0.1,70,0.15\nBurger,-0.1,71.5,0.15\nCupcake,0.1,71.5,0.15\nPizza,-0.1,73,0.15\nDonut,0.1,73,0.15\nIcecream,-0.1,74.5,0.15\nCupcake,-0.3,76,0.15\nDonut,-0.5,77.5,0.15\nHotdog,-0.1,79.5,0.15\nBurger,0.1,81,0.15\nPizza,0.3,82.5,0.15\nHotdog,0.5,84,0.15\nCupcake,0.1,86,0.15\nDonut,-0.1,87.5,0.15\nIcecream,-0.3,89,0.15\nCupcake,-0.5,90.5,0.15\nHotdog,-0.1,92.5,0.15\nBurger,0.1,94,0.15\nPizza,0.3,95.5,0.15\nHotdog,0.5,97,0.15\nBurger,-0.375,100,0.15\nBurger,-0.125,100,0.15\nBurger,0.125,100,0.15\nBurger,0.375,100,0.15\nBurger,-0.425,100.55,0.15\nBurger,-0.255,100.55,0.15\nBurger,-0.085,100.55,0.15\nBurger,0.085,100.55,0.15\nBurger,0.255,100.55,0.15\nBurger,0.425,100.55,0.15\nBurger,-0.375,101.1,0.15\nBurger,-0.125,101.1,0.15\nBurger,0.125,101.1,0.15\nBurger,0.375,101.1,0.15\nBurger,-0.275,101.65,0.15\nBurger,0,101.65,0.15\nBurger,0.275,101.65,0.15\nBurger,0.125,102.2,0.15\nBurger,-0.125,102.2,0.15';
var level2CSV = 'Burger,0.2,0.4,0.2\nBurger,0.346410161513776,0.8,0.2\nBurger,0.4,1.2,0.2\nBurger,0.346410161513775,1.6,0.2\nBurger,0.2,2,0.2\nBurger,4.90059381963448E-17,2.4,0.2\nDonut,-0.2,3.8,0.2\nDonut,-0.346410161513776,4.2,0.2\nDonut,-0.4,4.6,0.2\nDonut,-0.346410161513775,5,0.2\nDonut,-0.2,5.4,0.2\nDonut,-9.80118763926896E-17,5.8,0.2\nBurger,0.2,7.2,0.2\nBurger,0.346410161513776,7.6,0.2\nBurger,0.4,8,0.2\nBurger,0.346410161513775,8.4,0.2\nBurger,0.2,8.8,0.2\nBurger,4.90059381963448E-17,9.2,0.2\nDonut,-0.2,10.6,0.2\nDonut,-0.346410161513776,11,0.2\nDonut,-0.4,11.4,0.2\nDonut,-0.346410161513775,11.8,0.2\nDonut,-0.2,12.2,0.2\nDonut,-9.80118763926896E-17,12.6,0.2\nPizza,0,14.6,0.2\nIcecream,0,15.6,0.2\nPizza,0,16.6,0.2\nIcecream,0,17.6,0.2\nPizza,0,18.6,0.2\nIcecream,0,19.6,0.2\nPizza,0,20.6,0.2\nIcecream,0,21.6,0.2\nBomb,-0.5,26.6,0.2\nBomb,0,26.6,0.2\nBomb,0.5,26.6,0.2\nPizza,0.19798,31.6,0.2\nPizza,-0.11954,31.62584,0.2\nPizza,-0.32088,31.87364,0.2\nPizza,0.40966,31.97172,0.2\nPizza,-0.38542,32.3486,0.2\nPizza,0.5,32.52416,0.2\nPizza,-0.25634,32.71516,0.2\nPizza,-0.0339,32.88672,0.2\nPizza,0.49484,33.12304,0.2\nPizza,0.3348,33.70128,0.2\nPizza,-0.0339,34.08672,0.2\nDonut,0.0339,36.69344,0.2\nDonut,-0.3348,37.07888,0.2\nDonut,-0.49484,37.65712,0.2\nDonut,0.0339,37.89344,0.2\nDonut,0.25634,38.065,0.2\nDonut,-0.5,38.256,0.2\nDonut,0.38542,38.43156,0.2\nDonut,-0.40966,38.80844,0.2\nDonut,0.32088,38.90652,0.2\nDonut,0.11954,39.15432,0.2\nDonut,-0.19798,39.18016,0.2\nBomb,-0.5,42.18016,0.2\nBomb,0,42.18016,0.2\nBomb,0.5,42.18016,0.2\nDonut,0,44.18016,0.2\nDonut,-0.25,44.18016,0.2\nDonut,-0.5,44.18016,0.2\nPizza,0,46.18016,0.2\nPizza,0.25,46.18016,0.2\nPizza,0.5,46.18016,0.2\nBomb,-0.5,48.18016,0.2\nBomb,0,48.18016,0.2\nBomb,0.5,48.18016,0.2\nDonut,-0.5,50.18016,0.2\nDonut,-0.5,51.18016,0.25\nDonut,-0.5,52.18016,0.33\nDonut,-0.5,53.18016,0.5\nPizza,0.5,53.48016,0.2\nPizza,0.5,54.48016,0.25\nPizza,0.5,55.48016,0.33\nPizza,0.5,56.48016,0.5\nDonut,-0.5,56.78016,0.2\nDonut,-0.5,57.78016,0.25\nDonut,-0.5,58.78016,0.33\nDonut,-0.5,59.78016,0.5\nPizza,0.5,60.08016,0.2\nPizza,0.5,61.08016,0.25\nPizza,0.5,62.08016,0.33\nPizza,0.5,63.08016,0.5\nBomb,-0.9,63.38016,0.2\nDonut,-0.5,63.38016,0.2\nBomb,-0.9,64.38016,0.2\nDonut,-0.4,64.38016,0.2\nBomb,-0.9,65.38016,0.2\nDonut,-0.3,65.38016,0.2\nBomb,-0.9,66.38016,0.2\nDonut,-0.2,66.38016,0.2\nBomb,-0.9,67.38016,0.2\nDonut,-0.1,67.38016,0.2\nBomb,-0.9,68.38016,0.2\nDonut,0,68.38016,0.2\nPizza,0.5,70.88016,0.2\nDonut,-0.5,70.88016,0.2\nPizza,0,72.38016,0.2\nPizza,0.5,73.88016,0.2\nDonut,-0.5,73.88016,0.2\nDonut,0,75.38016,0.2\nPizza,0.5,76.88016,0.2\nDonut,-0.5,76.88016,0.2\nPizza,0,78.38016,0.2\nPizza,0.5,79.88016,0.2\nDonut,-0.5,79.88016,0.2\nPizza,0,81.08016,0.2\nBomb,0,82.28016,0.2\nDonut,0,83.48016,0.2\nPizza,0,84.68016,0.2\nBomb,0,85.88016,0.2\nDonut,0,87.08016,0.2\nPizza,0,88.28016,0.2\nBomb,0,89.48016,0.2\nDonut,0,90.68016,0.2\nPizza,0,91.88016,0.2\nBomb,0,93.08016,0.2\nDonut,0,97.08016,0.2\nDonut,0.123606797749979,97.1095260902229,0.2\nDonut,-0.123606797749979,97.1095260902229,0.2\nDonut,0.235114100916989,97.194749803375,0.2\nDonut,-0.235114100916989,97.194749803375,0.2\nDonut,0.323606797749979,97.3274888486245,0.2\nDonut,-0.323606797749979,97.3274888486245,0.2\nDonut,-0.380422606518061,97.494749803375,0.2\nDonut,0.380422606518061,97.494749803375,0.2\nDonut,0.4,97.68016,0.2\nDonut,-0.4,97.68016,0.2\nDonut,0.380422606518061,97.865570196625,0.2\nDonut,-0.380422606518061,97.865570196625,0.2\nDonut,0.323606797749979,98.0328311513755,0.2\nDonut,-0.323606797749979,98.0328311513755,0.2\nDonut,0.235114100916989,98.165570196625,0.2\nDonut,-0.235114100916989,98.165570196625,0.2\nDonut,0.123606797749979,98.2507939097771,0.2\nDonut,-0.123606797749979,98.2507939097771,0.2\nDonut,0,98.28016,0.2';
var level3CSV = 'Donut,0.139057647468726,0,0.2\nCupcake,-0.139057647468726,0,0.2\nCupcake,0.364057647468726,0.52311062016386,0.2\nDonut,-0.364057647468726,0.52311062016386,0.2\nDonut,0.45,1.36952138346502,0.2\nCupcake,-0.45,1.36952138346502,0.2\nCupcake,0.364057647468726,2.21593214676618,0.2\nDonut,-0.364057647468726,2.21593214676618,0.2\nDonut,0.139057647468726,2.73904276693004,0.2\nCupcake,-0.139057647468726,2.73904276693004,0.2\nBurger,0.139057647468726,4.73904276693004,0.2\nHotdog,-0.139057647468726,4.73904276693004,0.2\nHotdog,0.364057647468726,5.2621533870939,0.2\nBurger,-0.364057647468726,5.2621533870939,0.2\nBurger,0.45,6.10856415039506,0.2\nHotdog,-0.45,6.10856415039506,0.2\nHotdog,0.364057647468726,6.95497491369623,0.2\nBurger,-0.364057647468726,6.95497491369623,0.2\nBurger,0.139057647468726,7.47808553386009,0.2\nHotdog,-0.139057647468726,7.47808553386009,0.2\nBomb,0.139057647468726,9.47808553386009,0.2\nBomb,-0.139057647468726,9.47808553386009,0.2\nBomb,0.364057647468726,10.0011961540239,0.2\nBomb,-0.364057647468726,10.0011961540239,0.2\nBomb,0.45,10.8476069173251,0.2\nBomb,-0.45,10.8476069173251,0.2\nBomb,0.364057647468726,11.6940176806263,0.2\nBomb,-0.364057647468726,11.6940176806263,0.2\nBomb,0.139057647468726,12.2171283007901,0.2\nBomb,-0.139057647468726,12.2171283007901,0.2\nIcecream,0.139057647468726,14.2171283007901,0.2\nCupcake,-0.139057647468726,14.2171283007901,0.2\nCupcake,0.364057647468726,14.740238920954,0.2\nIcecream,-0.364057647468726,14.740238920954,0.2\nIcecream,0.45,15.5866496842551,0.2\nBurger,0,15.5866496842551,0.2\nCupcake,-0.45,15.5866496842551,0.2\nCupcake,0.364057647468726,16.4330604475563,0.2\nIcecream,-0.364057647468726,16.4330604475563,0.2\nIcecream,0.139057647468726,16.9561710677202,0.2\nCupcake,-0.139057647468726,16.9561710677202,0.2\nPizza,0.139057647468726,18.9561710677202,0.2\nHotdog,-0.139057647468726,18.9561710677202,0.2\nHotdog,0.364057647468726,19.479281687884,0.2\nPizza,-0.364057647468726,19.479281687884,0.2\nPizza,0.45,20.3256924511852,0.2\nDonut,0,20.3256924511852,0.2\nHotdog,-0.45,20.3256924511852,0.2\nHotdog,0.364057647468726,21.1721032144864,0.2\nPizza,-0.364057647468726,21.1721032144864,0.2\nPizza,0.139057647468726,21.6952138346502,0.2\nHotdog,-0.139057647468726,21.6952138346502,0.2\nIcecream,-0.5,23.6952138346502,0.2\nIcecream,-0.25,23.6952138346502,0.2\nIcecream,0,23.6952138346502,0.2\nHotdog,0,26.6952138346502,0.3\nHotdog,0.25,26.6952138346502,0.3\nHotdog,0.5,26.6952138346502,0.3\nCupcake,-0.5,29.6952138346502,0.4\nCupcake,-0.25,29.6952138346502,0.4\nCupcake,0,29.6952138346502,0.4\nPizza,0,32.6952138346502,0.5\nPizza,0.25,32.6952138346502,0.5\nPizza,0.5,32.6952138346502,0.5\nBomb,-0.9,34.6952138346502,0.25\nBomb,-0.6,34.6952138346502,0.25\nBomb,-0.3,34.6952138346502,0.25\nBomb,0,34.6952138346502,0.25\nBomb,0.3,34.6952138346502,0.25\nBomb,0.6,34.6952138346502,0.25\nBomb,0.9,34.6952138346502,0.25\nPizza,0,35.6952138346502,0.5\nDonut,-0.5,38.6952138346502,0.2\nCupcake,-0.3,38.6952138346502,0.25\nDonut,-0.1,38.6952138346502,0.3\nCupcake,0.1,38.6952138346502,0.35\nDonut,0.3,38.6952138346502,0.4\nBurger,0.2,42.0952138346502,0.25\nHotdog,0.346410161513776,42.4952138346502,0.25\nBurger,0.4,42.8952138346502,0.25\nBomb,-0.7,42.8952138346502,0.25\nHotdog,0.346410161513775,43.2952138346502,0.25\nBurger,0.2,43.6952138346502,0.25\nHotdog,4.90059381963448E-17,44.0952138346502,0.25\nCupcake,-0.2,45.4952138346502,0.25\nIcecream,-0.346410161513776,45.8952138346502,0.25\nCupcake,-0.4,46.2952138346502,0.25\nBomb,0.7,46.2952138346502,0.25\nIcecream,-0.346410161513775,46.6952138346502,0.25\nCupcake,-0.2,47.0952138346502,0.25\nIcecream,-9.80118763926896E-17,47.4952138346502,0.25\nBurger,0.2,48.8952138346502,0.25\nHotdog,0.346410161513776,49.2952138346502,0.25\nBurger,0.4,49.6952138346502,0.25\nBomb,-0.7,49.6952138346502,0.25\nHotdog,0.346410161513775,50.0952138346502,0.25\nBurger,0.2,50.4952138346502,0.25\nHotdog,4.90059381963448E-17,50.8952138346502,0.25\nCupcake,-0.2,52.2952138346502,0.25\nIcecream,-0.346410161513776,52.6952138346502,0.25\nCupcake,-0.4,53.0952138346502,0.25\nBomb,0.7,53.0952138346502,0.25\nIcecream,-0.346410161513775,53.4952138346502,0.25\nCupcake,-0.2,53.8952138346502,0.25\nIcecream,-9.80118763926896E-17,54.2952138346502,0.25\nPizza,-0.25,56.2952138346502,0.25\nIcecream,0.25,56.2952138346502,0.25\nBomb,-0.9,58.2952138346502,0.35\nBomb,-0.6,58.2952138346502,0.35\nBomb,-0.3,58.2952138346502,0.35\nBomb,0,58.2952138346502,0.35\nBomb,0.3,58.2952138346502,0.35\nBomb,0.6,58.2952138346502,0.35\nBomb,0.9,58.2952138346502,0.35\nDonut,0.1,61.2952138346502,0.25\nCupcake,-0.05,61.6952138346502,0.25\nDonut,-0.2,62.0952138346502,0.25\nCupcake,-0.35,62.4952138346502,0.25\nDonut,-0.5,62.8952138346502,0.25\nBomb,-0.65,63.2952138346502,0.25\nPizza,-0.1,65.2952138346502,0.25\nBurger,0.05,65.5952138346502,0.25\nPizza,0.2,65.8952138346502,0.25\nBurger,0.35,66.1952138346502,0.25\nBomb,0.5,66.4952138346502,0.25\nBomb,0.65,66.7952138346502,0.25\nDonut,0.1,68.7952138346502,0.25\nCupcake,-0.05,68.9952138346502,0.25\nDonut,-0.2,69.1952138346502,0.25\nBomb,-0.35,69.3952138346502,0.25\nBomb,-0.5,69.5952138346502,0.25\nBomb,-0.65,69.7952138346502,0.25\nPizza,-0.1,71.7952138346502,0.25\nBurger,0.05,71.8952138346502,0.25\nBomb,0.2,71.9952138346502,0.25\nBomb,0.35,72.0952138346502,0.25\nBomb,0.5,72.1952138346502,0.25\nBomb,0.65,72.2952138346502,0.25\nDonut,0.1,74.2952138346502,0.25\nBomb,-0.05,74.2952138346502,0.25\nBomb,-0.2,74.2952138346502,0.25\nBomb,-0.35,74.2952138346502,0.25\nBomb,-0.5,74.2952138346502,0.25\nBomb,-0.65,74.2952138346502,0.25\nHotdog,-0.2,77.2952138346502,0.25\nBomb,0,77.2952138346502,0.25\nIcecream,0.2,77.2952138346502,0.25\nBurger,-0.2,77.7952138346502,0.25\nBomb,0,77.7952138346502,0.25\nCupcake,0.2,77.7952138346502,0.25\nPizza,-0.2,78.2952138346502,0.25\nBomb,0,78.2952138346502,0.25\nDonut,0.2,78.2952138346502,0.25\nHotdog,-0.2,78.7952138346502,0.25\nBomb,0,78.7952138346502,0.25\nIcecream,0.2,78.7952138346502,0.25\nBurger,-0.2,79.2952138346502,0.25\nBomb,0,79.2952138346502,0.25\nCupcake,0.2,79.2952138346502,0.25\nPizza,-0.2,79.7952138346502,0.25\nBomb,0,79.7952138346502,0.25\nDonut,0.2,79.7952138346502,0.25\nHotdog,-0.2,80.2952138346502,0.25\nBomb,0,80.2952138346502,0.25\nIcecream,0.2,80.2952138346502,0.25\nBurger,-0.2,80.7952138346502,0.25\nBomb,0,80.7952138346502,0.25\nCupcake,0.2,80.7952138346502,0.25\nPizza,-0.2,81.2952138346502,0.25\nBomb,0,81.2952138346502,0.25\nDonut,0.2,81.2952138346502,0.25\nPizza,-0.45,85.2952138346502,0.25\nPizza,-0.3,85.4952138346502,0.25\nPizza,-0.38,85.6452138346502,0.25\nPizza,-0.15,85.6952138346502,0.25\nPizza,0,85.8952138346502,0.25\nPizza,-0.31,85.9952138346502,0.25\nPizza,0.15,86.0952138346502,0.25\nPizza,0.3,86.2952138346502,0.25\nPizza,-0.24,86.3452138346502,0.25\nPizza,0.45,86.4952138346502,0.25\nPizza,-0.17,86.6952138346502,0.25\nPizza,0.33,86.7202138346502,0.25\nPizza,0.21,86.9452138346502,0.25\nPizza,-0.1,87.0452138346502,0.25\nPizza,0.09,87.1702138346502,0.25\nPizza,-0.03,87.3952138346502,0.25';
var level4CSV = 'Hotdog,-0.2,0,0.25\nBomb,0,0,0.25\nIcecream,0.2,0,0.25\nBurger,-0.2,0.5,0.25\nBomb,0,0.5,0.25\nCupcake,0.2,0.5,0.25\nPizza,-0.2,1,0.25\nBomb,0,1,0.25\nDonut,0.2,1,0.25\nBomb,-0.9,3,0.35\nBomb,-0.6,3,0.35\nBomb,-0.3,3,0.35\nBomb,0,3,0.35\nBomb,0.3,3,0.35\nBomb,0.6,3,0.35\nBomb,0.9,3,0.35\nDonut,0.25,6,0.25\nCupcake,0.1,6,0.25\nDonut,-0.05,6,0.25\nCupcake,-0.2,6,0.25\nDonut,-0.35,6,0.25\nCupcake,-0.5,6,0.25\nBomb,-0.65,6,0.25\nBomb,-0.65,6.3,0.25\nBomb,-0.65,6.6,0.25\nBomb,-0.65,6.9,0.25\nBomb,-0.65,7.2,0.25\nBomb,-0.65,7.5,0.25\nBomb,-0.65,7.8,0.25\nPizza,-0.25,9.8,0.25\nBurger,-0.1,9.8,0.25\nPizza,0.05,9.8,0.25\nBurger,0.2,9.8,0.25\nPizza,0.35,9.8,0.25\nBurger,0.5,9.8,0.25\nBomb,0.65,9.8,0.25\nBomb,0.65,10.1,0.25\nBomb,0.65,10.4,0.25\nBomb,0.65,10.7,0.25\nBomb,0.65,11,0.25\nBomb,0.65,11.3,0.25\nBomb,0.65,11.6,0.25\nDonut,0.25,13.6,0.25\nCupcake,0.1,13.6,0.25\nDonut,-0.05,13.6,0.25\nCupcake,-0.2,13.6,0.25\nDonut,-0.35,13.6,0.25\nCupcake,-0.5,13.6,0.25\nBomb,-0.65,13.6,0.25\nBomb,-0.65,13.9,0.25\nBomb,-0.65,14.2,0.25\nBomb,-0.65,14.5,0.25\nBomb,-0.65,14.8,0.25\nBomb,-0.65,15.1,0.25\nBomb,-0.65,15.4,0.25\nPizza,-0.25,17.4,0.25\nBurger,-0.1,17.4,0.25\nPizza,0.05,17.4,0.25\nBurger,0.2,17.4,0.25\nPizza,0.35,17.4,0.25\nBurger,0.5,17.4,0.25\nBomb,0.65,17.4,0.25\nBomb,0.65,17.7,0.25\nBomb,0.65,18,0.25\nBomb,0.65,18.3,0.25\nBomb,0.65,18.6,0.25\nBomb,0.65,18.9,0.25\nBomb,0.65,19.2,0.25\nBomb,-0.9,23.2,0.25\nIcecream,-0.5,23.2,0.25\nBomb,-0.9,23.7,0.25\nDonut,-0.4,23.7,0.25\nBomb,-0.9,24.2,0.25\nIcecream,-0.3,24.2,0.25\nBomb,-0.9,24.7,0.25\nDonut,-0.2,24.7,0.25\nBomb,-0.9,25.2,0.25\nIcecream,-0.1,25.2,0.25\nBomb,-0.9,25.7,0.25\nDonut,0,25.7,0.25\nBomb,0.9,26.2,0.25\nPizza,0.5,26.2,0.25\nBomb,0.9,26.7,0.25\nHotdog,0.4,26.7,0.25\nBomb,0.9,27.2,0.25\nPizza,0.3,27.2,0.25\nBomb,0.9,27.7,0.25\nHotdog,0.2,27.7,0.25\nBomb,0.9,28.2,0.25\nPizza,0.1,28.2,0.25\nBomb,0.9,28.7,0.25\nHotdog,0,28.7,0.25\nBomb,-0.9,29.2,0.25\nIcecream,-0.5,29.2,0.25\nBomb,-0.9,29.7,0.25\nDonut,-0.4,29.7,0.25\nBomb,-0.9,30.2,0.25\nIcecream,-0.3,30.2,0.25\nBomb,-0.9,30.7,0.25\nDonut,-0.2,30.7,0.25\nBomb,-0.9,31.2,0.25\nIcecream,-0.1,31.2,0.25\nBomb,-0.9,31.7,0.25\nDonut,0,31.7,0.25\nBomb,0.9,32.2,0.25\nPizza,0.5,32.2,0.25\nBomb,0.9,32.7,0.25\nHotdog,0.4,32.7,0.25\nBomb,0.9,33.2,0.25\nPizza,0.3,33.2,0.25\nBomb,0.9,33.7,0.25\nHotdog,0.2,33.7,0.25\nBomb,0.9,34.2,0.25\nPizza,0.1,34.2,0.25\nBomb,0.9,34.7,0.25\nHotdog,0,34.7,0.25\nPizza,0.19798,37.7,0.25\nPizza,-0.11954,37.72584,0.25\nPizza,-0.32088,37.97364,0.25\nPizza,0.40966,38.07172,0.25\nPizza,-0.38542,38.4486,0.25\nPizza,0.5,38.62416,0.25\nPizza,-0.25634,38.81516,0.25\nPizza,-0.0339,38.98672,0.25\nPizza,0.49484,39.22304,0.25\nPizza,0.3348,39.80128,0.25\nBomb,-0.0339,40.18672,0.25\nDonut,0.0339,41.67344,0.25\nDonut,-0.3348,42.05888,0.25\nDonut,-0.49484,42.63712,0.25\nBomb,0.0339,42.87344,0.25\nDonut,0.25634,43.045,0.25\nDonut,-0.5,43.236,0.25\nDonut,0.38542,43.41156,0.25\nDonut,-0.40966,43.78844,0.25\nDonut,0.32088,43.88652,0.25\nDonut,0.11954,44.13432,0.25\nDonut,-0.19798,44.16016,0.25\nDonut,-0.25,47.16016,0.2\nDonut,-0.25,48.16016,0.25\nDonut,-0.25,49.16016,0.33\nBomb,-0.25,51.16016,0.5\nPizza,0.25,51.46016,0.2\nPizza,0.25,52.46016,0.25\nPizza,0.25,53.46016,0.33\nBomb,0.25,55.46016,0.5\nIcecream,-0.25,55.76016,0.2\nIcecream,-0.25,56.76016,0.25\nIcecream,-0.25,57.76016,0.33\nBomb,-0.25,59.76016,0.5\nHotdog,0.25,60.06016,0.2\nHotdog,0.25,61.06016,0.25\nHotdog,0.25,62.06016,0.33\nBomb,0.25,64.06016,0.5\nPizza,0,65.56016,0.25\nIcecream,0,66.36016,0.25\nPizza,0,67.16016,0.25\nIcecream,0,67.96016,0.25\nPizza,0,68.76016,0.25\nIcecream,0,69.56016,0.25\nPizza,0,70.36016,0.25\nIcecream,0,71.16016,0.25\nIcecream,0,75.16016,0.25\nCupcake,0.1345762,75.52212,0.25\nCupcake,-0.1345762,75.52212,0.25\nDonut,0.2360952,75.88868,0.25\nDonut,-0.2360952,75.88868,0.25\nCupcake,0.3079329,76.32752,0.25\nCupcake,-0.3079329,76.32752,0.25\nIcecream,0,76.44016,0.25\nDonut,0.323554,76.76636,0.25\nDonut,-0.323554,76.76636,0.25\nDonut,0.1017852,76.83348,0.25\nDonut,-0.1017852,76.83348,0.25\nCupcake,0.2189132,77.01416,0.25\nCupcake,-0.2189132,77.01416,0.25';
var levelCSVs = [tutorialCSV, level1CSV, level2CSV, level3CSV, level4CSV];
var currentLevelIndex;
// indices for the csv data
var itemNameIndex = 0;
var itemPositionIndex = 1;
var itemTimeIndex = 2;
var itemSpeedIndex = 3;

function initialize() {
    if (!script.itemStorage || !script.stunnedManagerLeft || !script.stunnedManagerRight || !script.pizzaPrefab || !script.burgerPrefab || !script.hotDogPrefab || !script.sushiPrefab || !script.donutPrefab || !script.cupcakePrefab || !script.lollipopPrefab || !script.iceCreamPrefab || !script.bombPrefab) {
        print("Missing input on " + script.getSceneObject().name);
    }
    
    global.behaviorSystem.addCustomTriggerResponse("tutorial_start", onTutorialStart);
    global.behaviorSystem.addCustomTriggerResponse("level_1_start", onLevel1Start);
    global.behaviorSystem.addCustomTriggerResponse("level_2_start", onLevel2Start);
    global.behaviorSystem.addCustomTriggerResponse("level_3_start", onLevel3Start);
    global.behaviorSystem.addCustomTriggerResponse("level_4_start", onLevel4Start);
    global.behaviorSystem.addCustomTriggerResponse("next_level_start", onNextLevelStart);
    global.behaviorSystem.addCustomTriggerResponse("same_level_start", onSameLevelStart);
    
    levelData = readCSV(level1CSV);
}


initialize();


/**
 * resets the level
 */
function resetLevel(){
    passedTime = 0;
    currentIndex = 0;
    tutorialVersion = false;
    
    for (var i = 0; i < script.itemStorage.api.items.length; ++i){
        script.itemStorage.api.items[i].destroy();
    }
    
    for (var i = 0; i < script.itemStorage.api.foodInMouthLeft.length; ++i){
        script.itemStorage.api.foodInMouthLeft[i].destroy();
    }
    
    for (var i = 0; i < script.itemStorage.api.foodInMouthRight.length; ++i){
        script.itemStorage.api.foodInMouthRight[i].destroy();
    }
    
    script.itemStorage.api.items = [];
    script.itemStorage.api.foodInMouthLeft = [];
    script.itemStorage.api.foodInMouthRight = [];
}


/**
 * starts the level
 */
function startLevel(){
    updateEvent = script.createEvent("UpdateEvent")
    updateEvent.bind(onUpdate);
}


/**
 * starts the tutorial
 * the function is called as a response to the trigger tutorial_start
 */
function onTutorialStart(){
    currentLevelIndex = 0;
    levelData = readCSV(levelCSVs[currentLevelIndex]);
    resetLevel();
    startLevel();
    tutorialVersion = true;
}


/**
 * starts level 1
 * the function is called as a response to the trigger level_1_start
 */
function onLevel1Start(){
    currentLevelIndex = 1;
    levelData = readCSV(levelCSVs[currentLevelIndex]);
    resetLevel();
    startLevel();
}


/**
 * starts level 2
 * the function is called as a response to the trigger level_2_start
 */
function onLevel2Start(){
    currentLevelIndex = 2;
    levelData = readCSV(levelCSVs[currentLevelIndex]);
    resetLevel();
    startLevel();
}


/**
 * starts level 3
 * the function is called as a response to the trigger level_3_start
 */
function onLevel3Start(){
    currentLevelIndex = 3;
    levelData = readCSV(levelCSVs[currentLevelIndex]);
    resetLevel();
    startLevel();
}


/**
 * starts level 4
 * the function is called as a response to the trigger level_4_start
 */
function onLevel4Start(){
    currentLevelIndex = 4;
    levelData = readCSV(levelCSVs[currentLevelIndex]);
    resetLevel();
    startLevel();
}


/**
 * starts the next level
 * the function is called as a response to the trigger next_level_start
 */
function onNextLevelStart(){
    currentLevelIndex += 1;
    levelData = readCSV(levelCSVs[currentLevelIndex]);
    resetLevel();
    startLevel();
}


/**
 * restarts the same level
 * the function is called as a response to the trigger same_level_start
 */
function onSameLevelStart(){
    resetLevel();
    startLevel();
}


/**
 * let the objects fall down and creates the objects of which the indicated time is achieved
 * checks if the game is over or if the level is completed
 */
function onUpdate(e){
    var deltaTime = getDeltaTime() * script.simulationSpeed;
    passedTime += deltaTime;
    
    for (var i = 0; i < script.itemStorage.api.items.length; ++i){
        var currentItem = script.itemStorage.api.items[i];
        var itemScript = currentItem.getComponent("Component.ScriptComponent");
        var rectangle = currentItem.getComponent("Component.ScreenTransform").anchors;
        var screenPosition = rectangle.getCenter();
        var speed = itemScript.script.speed;
        var updatedScreenPosition = screenPosition.add(diffPosition.mult(new vec2(0, speed * deltaTime)));
        rectangle.setCenter(updatedScreenPosition);
        if (updatedScreenPosition.y < -1.0){
            script.itemStorage.api.items[i].destroy();
            script.itemStorage.api.items.splice(i, 1);
        }
    }
    
    for (var i = currentIndex; i < levelData.length; ++i){
        if (levelData[i][itemTimeIndex] <= passedTime){
            createItemFromPrefab(items[levelData[i][itemNameIndex]], Number(levelData[i][itemPositionIndex]), Number(levelData[i][itemSpeedIndex]));
            currentIndex += 1;
        }
        if (levelData[i][itemTimeIndex] > passedTime){
            break;
        }
    }
    
    var reset = false;
    
    if (!tutorialVersion && script.stunnedManagerLeft.api.getStunnedState() && script.stunnedManagerRight.api.getStunnedState()){
        global.behaviorSystem.sendCustomTrigger("game_over");
        reset = true;
    }
    else if (currentIndex >= levelData.length && script.itemStorage.api.items.length == 0 && script.itemStorage.api.foodInMouthLeft.length == 0 && script.itemStorage.api.foodInMouthRight.length == 0){
        if (currentLevelIndex < levelCSVs.length - 1){
            global.behaviorSystem.sendCustomTrigger("level_completed");
            print("level completed");
        }
        else{
            global.behaviorSystem.sendCustomTrigger("game_completed");
            currentLevelIndex = 0;
        }
       
        reset = true;
    }
    
    if (reset){
        resetLevel();
        script.removeEvent(updateEvent);
        print("removing update event");
    }
}


/**
 * creates an item from the prefab at location (screenPosition, 0) with speed
 * @param {Asset.ObjectPrefab} prefab            - prefab to create
 * @param {Number}             startingPositionX - x coordinate of the screen position
 * @param {Number}             speed             - speed of the generated item
 */
function createItemFromPrefab(prefab, startingPositionX, speed){   
    var createdItem = prefab.instantiate(script.getSceneObject().getParent());
    var itemScript = createdItem.getComponent("Component.ScriptComponent");
    itemScript.script.speed = speed;
    var objectPosition = new vec2(startingPositionX, 1);
    var objScreenTransform = createdItem.getComponent("Component.ScreenTransform");
    objScreenTransform.anchors.setCenter(objectPosition);
    
    script.itemStorage.api.items.push(createdItem);
}