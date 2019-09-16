class Generator{
    blocks = {}
    PlayerObject = undefined;
    PinObject = undefined;
    MoveObject = undefined;
    no_of_bases = undefined

    constructor(no_of_bases) {
        this.no_of_bases = no_of_bases;
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

    init() {
        // on initialization create player and pins objects
        this.PlayerObject = new Players(this);
        this.PinObject = new Pins(this, this.no_of_bases);
        console.log("generate 25", this.getPinObject());
        this.MoveObject = new Movement(this);
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
                this.create_block({ id: id, pins: [], actions: [], game: { wall: 0 } });
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
}