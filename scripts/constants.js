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
    "ERROR_OCCURED": "An error occured.",
    "ACTIVE_PIN_NOT_ON_BOARD": "Active pin not on board",
    "REQUIRED_6": "Die value of 6 required.",
    "REQUIRED_PIN_ON_BOARD": "Action requires a pin on board.",
    "POINT_ALREADY_SAVED": "You can't save any more die from this turn.",
    "PIN_ON_BOARD": "Pin already on board.",
    "GAME_ENDED": "Game has ended.",
    "PIN_COMPLETED": "Active pin is has completed game play.",
    "PURCHASE_BLOCK_FIRST": "Please purchase block to perform selected action.",
    "NOT_MY_BLOCK": "Block not yours.",
}

constants = {
    DIE: "die",
    PIN: "pin",
    BLOCK: "block",
    HTML: "html",
    GENERATED: "generated",
    MOVE: "move",
    REMOVE: "remove",
    SAVE: "save",
    ID: "id",
    CLASS: "class",
    HASHTAG: "#",
    WALL: "wall",
    TRAP: "trap",
    ARMOUR: "armour",
    ALL: "*",
    MOVE: 'move',
    REMOVE_FROM_BASE: 'remove-from-base',
    BASES: 'bases',
    OWNER: 'owner',
    GENERATOR: 'generator',
    DAMAGE: 'damage',
    UPGRADE: 'upgrade',
    LOST: 'lost',
    ACQUIRE: 'acquire',
    TERRAIN: 'terrain'
}

mode = {
    PIN: 0,
    POINT: 1,
    LUDO: 2
}

attack_mode = {
    LUDO: 0,
    BASIC: 1,
    TEIR_1: 2
}

side = {
    LEFT: 0,
    RIGHT: 1,
    BOTH: 2
}

game_status = {
    STARTING: 0,
    ONGOING: 1,
    ENDED: 2
}

// len 13
publish_action = {
    //pin
    pin_create: 0,
    pin_get: 4,
    pin_activate: 5,
    //player
    player_create: 1,
    //dice
    dice_roll: 2,
    die_click: 6,
    dice_roll_prepare: 7,
    empty_dice: 12,
    //ui
    display_message: 3,
    //Point
    set_trap: 8,
    increase_armour: 9,
    increase_block_level: 10,
    point_use: 11,
    //block
    acquire_block: 13,


}

publish_source = {
    pin: 0,
    block: 1,
    dice: 2,
    move: 3,
    point: 4,
    ui: 5,
    player: 6
}



//u.i container constant
let container = $(".container");
let base_classes = $("#base_classes");

//base information
let bases = ["A", "B", "C", "D"];
let base_pins = ["red_pin", "blue_pin", "green_pin", "yellow_pin"];
let allowed_no = [1,2,3,4,5,6, 16]
//no_per_base is the numbers of blocks(boxes) each base has
let no_per_base = 19;


//variable constants
let Positive = 1;
let Negative = -1;
let Neutral = 0;

//
let counter = 0;

//player constants
let player_counter = 0;
//formulae = ((NPB * 2) * (NOB/2)) + ((NPB * (NOB/2))/2)
let agility = { value: ((19 * 2) * 2) + ((19 * 2)/2), rate: 2, default: 20 }
let pin_factor = {
    'red_pin0': { attack: 90, defense: 20, magic: 10, agility: agility },
    'red_pin1': { attack: 100, defense: 25, magic: 20, agility: agility },
    'red_pin2': { attack: 100, defense: 15, magic: 20, agility: agility },
    'red_pin3': { attack: 95, defense: 20, magic: 20, agility: agility },
    //blue pins
    'blue_pin0': { attack: 10, defense: 120, magic: 30, agility: agility },
    'blue_pin1': { attack: 25, defense: 90, magic: 35, agility: agility },
    'blue_pin2': { attack: 15, defense: 95, magic: 30, agility: agility },
    'blue_pin3': { attack: 20, defense: 130, magic: 40, agility: agility },
    //green pins
    'green_pin0': { attack: 60, defense: 60, magic: 20, agility: agility },
    'green_pin1': { attack: 55, defense: 60, magic: 20, agility: agility },
    'green_pin2': { attack: 65, defense: 50, magic: 10, agility: agility },
    'green_pin3': { attack: 70, defense: 50, magic: 10, agility: agility },
    //yellow pins
    'yellow_pin0': { attack: 20, defense: 40, magic: 130, agility: agility },
    'yellow_pin1': { attack: 15, defense: 30, magic: 120, agility: agility },
    'yellow_pin2': { attack: 25, defense: 20, magic: 100, agility: agility },
    'yellow_pin3': { attack: 30, defense: 20, magic: 130, agility: agility },
}

let timer_type = {
    terrain_stopped: 0
}



let player_id_default = "Pl";

// let pn1= undefined;
let player_id = undefined;
let pins_per_player = 4;

//initialize Generator
let GeneratorObject = new Generator(no_per_base, base_classes, bases, mode.PIN, 2);

//init move object
let MovementObject = undefined;
let UIObject = undefined;
// get players instance
let PlayerObject = undefined;
let PointsObject = undefined;
let DiceObject = undefined;
let PinObject = undefined;
let BlocksObject = undefined;


function init() {
    GeneratorObject.init();
    GeneratorObject.set_mode_of_attack(attack_mode.TEIR_1)
    MovementObject = GeneratorObject.getMoveObject();
    UIObject = GeneratorObject.getUIObject();
    PlayerObject = GeneratorObject.getPlayerObject();
    PointsObject = GeneratorObject.getPointsObject();
    DiceObject = GeneratorObject.getDiceObject();
    PinObject = GeneratorObject.getPinObject();
    BlocksObject = GeneratorObject.getBlocksObject();
    FactorObject = GeneratorObject.getFactorsObject();
    // 
    console.log("loaded");
    GeneratorObject.BlocksObject.init_blocks(container);
    //

    for (let i = 0; i < container.children().length; i++) {
        // container.children()[i].attr("id");
        // console.log(("#" + container.children()[i].id))
        // container.children()[i].text();
        
        //div [clear:both] has not id
        if (container.children()[i].id != '') {
            document.getElementById(container.children()[i].id).innerHTML = "<span style='z-index:0'>" + container.children()[i].id + "</span>";
        } 
    }
}

 

