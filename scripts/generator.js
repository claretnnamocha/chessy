class Generator{
    blocks = {}
    PlayerObject = undefined;
    PinObject = undefined;
    MoveObject = undefined;
    no_of_bases = undefined
    container = undefined;
    DiceObject = undefined;
    UIObject = undefined;
    base_classes = undefined;
    active_player = 0;
    PointsObject = undefined;
    DiceObject = undefined;

    constructor(no_of_bases, container, base_classes) {
        this.no_of_bases = no_of_bases;
        this.container = container;
        this.base_classes = base_classes;
    }
    
    getPlayerObject() {
        return this.PlayerObject;
    }
    getPinObject() {
        return this.PinObject;
    }
    getMoveObject() {
        return this.MoveObject;
    }
    getUIObject() {
        return this.UIObject;
    }
    getPointsObject() {
        return this.PointsObject;
    }
    getDiceObject() {
        return this.DiceObject;
    }


    init() {
        console.log("initializing")
        // on initialization create player and pins objects
        this.PlayerObject = new Players(this);
        this.PinObject = new Pins(this, this.no_of_bases);
        this.MoveObject = new Movement(this);
        this.DiceObject = new Dice(this);
        this.UIObject = new UserInterface(this);
        this.PointsObject = new Points(this);
        this.DiceObject = new Dice(this);console.log("initialized")
    }
    create_block(info) {
        // Generator.blocks.push(info.id);
        
        //create block and assign value
        this.blocks[""+info.id+""] = info;
        
        // console.log(JSON.stringify(Generator.blocks));
        // this.blocks.[info.id] = info 
    }
    init_blocks(no_per_base, bases, container){
        //divs for testing purposes
        //to generate block(boxes) needed
        for(let base = 0; base < bases.length; base++) {
            for(let i = 1; i <= no_per_base; i++) {
                // console.log("Point " + (bases[base] + "" + i))
                // divs for boxes
                let div = document.createElement("div");
                // let attr = document.createAttribute("class");
                // attr.value = "box";
                div.setAttribute("class", "box");
                let id = (bases[base] + "" + i);
                div.setAttribute("id", id);

                //append to the parent
                // console.log(div);
                // container.children().html(div);
                // document.querySelector(".container").appendChild(div);
               
                //register this box as a block
                //default keys are listed below
                this.create_block({ id: id, pins: [], actions: [], game: { wall: { level: 0, owner: undefined }, active: Negative, trap: undefined } });
                // pins: player pins on this particular block
                // actions: items placed on this box
                // used the move.js file
                
                
            }
            //create a div to clear
            let div = document.createElement("div");
            div.style.clear = "both";
            
            //append to the parent
            // container.children().html(div);
        }
        
    }

    get(block_id = undefined) {
        // gets activated block
        let block = undefined;
        let keys = Object.keys(this.blocks);
        if (block_id == undefined) {
            for(let i = 0; i < keys.length; i++) {
                if (this.blocks[keys[i]].game.active != Negative) {
                    block = this.blocks[keys[i]];
                    return block;
                }
            }
            return;
        }
        else {
            block = this.blocks[block_id];
        }
        return block;
    }

    get_active_player() { 
        return this.active_player;
    }

    set_active_player(custom=undefined) {
        if (custom != undefined) {

        }
        else {
            let players = this.getPlayerObject().players;
            // console.log("setting active", players, this.active_player, Object.keys(players).length, (this.active_player >= Object.keys(players).length - 1));
            if (this.active_player >= Object.keys(players).length - 1) {
                // console.log("resetting active")
                this.active_player = 0;
            }
            else {
                this.active_player ++;
            }
            
        } 
    }

    activate_block(block_id=undefined, player_id) {
       
        let keys = Object.keys(this.blocks);
        if (block_id != undefined) {
            for(let i = 0; i < keys.length; i++) {
                let current_block = this.blocks[keys[i]];
                if (current_block.game.active != Negative) {
                    current_block.game.active = Negative;
                }
            }
            this.blocks[block_id].game.active = Postive;
            this.blocks[block_id].game.owner = player_id;
            console.log("block " + block_id + " activated. Owned by " + this.blocks[block_id].game.owner);
        }

    }
}