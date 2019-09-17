class Pins {
    no_of_bases = 0;
    pins = {}
    pins_per_player = 4;
    max_no = 0;

    constructor(GeneratorObject, no_of_bases) {
        this.GeneratorObject = GeneratorObject;
        this.PlayerObject = GeneratorObject.getPlayerObject();
        this.max_no = (no_of_bases * this.pins_per_player);
    }
    
    GeneratorObject = undefined;
    PlayerObject = undefined;

    new (player) {
        let pins_total = Object.keys(this.pins).length;
        if(pins_total < this.max_no) {
            //player: holds the information of the current
            //game: holds the information needed by this pin during gameplay
            this.pins[pins_total] = {  player: undefined, game: { pin_id: pins_total, armour: 0, active: false, block: "A0" },  }
            this.pins[pins_total].player = player
        }
        else {
            //display error
            //error: Maxium no of pins reached.
        }
        
    }

    create_pins(player, no_of_pins) {
        //generate pins for players  
        let pin_counter = 0;
        while(pin_counter < no_of_pins) {
            this.new(player);
            pin_counter++;
        }
        //activating one pin for testing purposes
        this.pins[Object.keys(this.pins).length - 1].game.active = true;
        this.pins[3].game.armour = 1;
    }

    get(player_id) {
        //get active pin for this player
        let pin_keys = Object.keys(this.pins);
        let pin_returned = null;
        for (let i=0; i< pin_keys.length; i++) {
            if (this.pins[i].player.id == player_id && this.pins[i].game.active) {
                console.log("pins 57", this.pins[i].player.id == player_id && this.pins[i].game.active)
                pin_returned = this.pins[i];
                break;
            }
        }
        return pin_returned;
    }

    update_pins(old_box_id, current_box_id, player, blocks) {
        //old_box_id: old id of block holding current pin
        //current_box_id: current id of block to hold current pin

        //update information stored in blocks with each movement
        //update current player info for blocks

        //get active pin information for this player
        let current_pin = this.get(player.id);
        //update block infor stored in pin
        current_pin.game.block = current_box_id;
        this.add_to_block(blocks, current_box_id, current_pin);
        if (old_box_id !== "A0"){
            let old_block = blocks[old_box_id];
            console.log("pins 79 " + old_block.pins.indexOf(current_pin));
            //on first run, old_box_id would be nulll/udnefined
            //remove player from previous block if player's pin exists there
            let pin_index = old_block.pins.indexOf(current_pin);
            if (pin_index != -1) {
                blocks[old_box_id].pins.splice(pin_index-1, 1);
            }
            
        }
    }

    add_to_block(blocks, current_box_id, current_pin) {
        if (blocks[current_box_id].pins.length > 0) {
            // alert("Pin not empty");
            let strongest_pin = { no: 0, armour: 0};
            let strongest_player = undefined;
            // check which player has higher armour as to who remains in block
            blocks[current_box_id].pins.forEach(element => {
                if (element.game.armour > strongest_pin.armour) {
                    // strongest_pin.no = element
                    strongest_player = element;
                }
            });
            // alert(JSON.stringify(strongest_player));
        }
        else {
            //add pin to new block
            blocks[current_box_id].pins.push(current_pin);
        }
        
        
    }
}