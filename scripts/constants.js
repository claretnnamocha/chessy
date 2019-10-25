//Constants
PIN = "pin";
BLOCK = "block";

messages = {
    "ACTIVATE_PIN": "Please activate a pin.",
    "INVALID_PLAYER": "Player not valid.",
    "ACTIVATE_BLOCK": "Please activate a block.",
    "PIN_INFO_NOT_FOUND": "Pin information not found.",
    "MAX_PLAYERS_REACHED": "Maxium no of players reached.",
    "MAX_PINS_REACHED": "Maxium no of pins reached.",
    "NOT_ENOUGH_POINTS": "You do not have enough points.",
    "INVALID_ACTION": "Invalid Action.",
    "ACTIVE_PIN_NOT_ON_BOARD": "Active pin not on board",
    "REQUIRED_6": "Die value of 6 required.",
    "REQUIRED_PIN_ON_BOARD": "Action requires a pin on board.",
    "POINT_ALREADY_SAVED": "You can't save any more die from this turn.",
    "PIN_ON_BOARD": "Pin already on board."
}

constants = {
    DIE: "die"
}

//function to update pin info
function setPinInfo(pin, id){
    console.log("pin info",pin, id)
    pin = pin;
    pin_class = "." + pin;
    pin_id = "#" + id;
    pin_html = "<div class='"+ pin +"' id='" + id + "'></div>";
}

//u.i container constant
let container = $(".container");
let base_classes = $("#base_classes");

//base information
let bases = ["A", "B", "C", "D"];
let base_pins = ["red_pin", "blue_pin", "green_pin", "yellow_pin"];
//no_per_base is the numbers of blocks(boxes) each base has
let no_per_base = 14;

//initialize Generator
let GeneratorObject = new Generator(bases.length, container, base_classes);

//variable constants
let Postive = 0;
let Negative = -1;
let Neutral = 1;

GeneratorObject.init_blocks(no_per_base, bases, container);
GeneratorObject.init();

//player constants
let player_counter = 0;
let player_info = [
    { name: "Mike Ade", age: "22", wins: 1, game: { points: 0 } },
    { name: "Julia Thomas", age: "18", wins: 1, game: { points: 0 } },
    { name: "James Darkyn", age: "23", wins: 3, game: { points: 0 } },
    { name: "Silver Pulker", age: "28", wins: 8, game: { points: 0 } }
];



let player_id_default = "Pl";
// get players instance
let playerObject = GeneratorObject.getPlayerObject();;
// let pn1= undefined;
let player_id = undefined;
let pins_per_player = 4;


//init move object
let MovementObject = GeneratorObject.getMoveObject();
let UIObject = GeneratorObject.getUIObject();
let PlayerObject = GeneratorObject.getPlayerObject();
let PointsObject = GeneratorObject.getPointsObject();
let DiceObject = GeneratorObject.getDiceObject();
let PinObject = GeneratorObject.getPinObject();
 
//pin constant
let pin = "";
let pin_class = "." + pin;
let pin_html = "<div class='"+ pin +"'></div>";
let pin_id = "#0";