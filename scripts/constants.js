//function
function setPinInfo(pin){
    pin = pin;
    pin_class = "." + pin;
    pin_html = "<div class='"+ pin +"'></div>";
}

//u.i container constant
let container = $(".container");

//base information
let bases = ["A", "B", "C", "D"];
//no_per_base is the numbers of blocks(boxes) each base has
let no_per_base = 14;

//initialize Generator
let GeneratorObject = new Generator(bases.length);


GeneratorObject.init_blocks(no_per_base, bases, container);
GeneratorObject.init();

//player constants
let player_counter = 0;
let player_info = [
    { name: "Mike Ade", age: "22", wins: 1, game: {} },
    { name: "Julia Thomas", age: "18", wins: 1, game: {} },
    { name: "James Darkyn", age: "23", wins: 3, game: {} },
    { name: "Silver Pulker", age: "28", wins: 8, game: {} }
];



let player_id_default = "Pl";
// get players instance
console.log("constants 31", GeneratorObject.getPlayerObject());
let pl1 = GeneratorObject.getPlayerObject();;
let pn1= undefined;
let player_id = undefined;
let pins_per_player = 4;


//init move object
let MovementObject = GeneratorObject.getMoveObject();

//pin constant
let pin = "";
let pin_class = "." + pin;
let pin_html = "<div class='"+ pin +"'></div>";