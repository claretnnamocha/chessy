class Pins {
    no_of_bases = 0;
    pins = {}
    pins_per_player = 4;
    max_no = 0;
    pin_position = {
        base: 0,
        board: 1,
        safe: 2
    }
    safe_pins = {}
    nth_pin = 4;
    
    

    constructor(GeneratorObject, no_of_bases) {
        this.GeneratorObject = GeneratorObject;
        this.PlayerObject = GeneratorObject.getPlayerObject();
        this.max_no = (no_of_bases * this.pins_per_player);
        this.UIObject = GeneratorObject.getUIObject();
        
    }
    
    GeneratorObject = undefined;
    PlayerObject = undefined;
    UIObject = undefined;

    set_nth_pins(no) {
        this.nth_pin = no;
    }
    new (player, base) {
        let pins_total = Object.keys(this.pins).length;
        if(pins_total < this.max_no) {
            //player: holds the information of the current
            //game: holds the information needed by this pin during gameplay
            this.pins[player.game.pin + pins_total.toString()] = {  player: undefined, game: { pin_id: player.game.pin + pins_total.toString(), armour: 0, active: Negative, block: base + 0, 
                base: base, start_block: base + 3, end_block: base + 10 , 
                returned: Negative, position: this.pin_position.base },  }

            this.pins[player.game.pin + pins_total.toString()].player = player
        }
        else {
            //display error
            //error: Maxium no of pins reached.
            this.UIObject.display_message(messages.MAX_PINS_REACHED)
        }
        
    }

    create_pins(player, no_of_pins, base) {
        //generate pins for players  
        let pin_counter = 0;
        while(pin_counter < no_of_pins) {
            this.new(player, base);
            pin_counter++;
        }
        //activating one pin for testing purposes
        // this.pins[Object.keys(this.pins).length - 1].game.active = Postive;
        // this.pins["red_pin"+3].game.active = Postive;
        this.pins["red_pin"+0].game.armour = 1;
        // console.log("PINS", this.pins)   
    }

    get(player_id=undefined, pin_id=undefined) {
        
        let pin_keys = Object.keys(this.pins);
        let pin_returned = null;
        for (let i=0; i< pin_keys.length; i++) {
            //get active pin for this player
            if (player_id != undefined) {
                if (this.pins[pin_keys[i]].player.id == player_id && this.pins[pin_keys[i]].game.active == Postive) {
                    // console.log("pins 50", this.pins[i])
                    pin_returned = this.pins[pin_keys[i]];
                    break;
                }
            }
            //get pin details for passed pin
            else if (pin_id != undefined) {
                if (pin_id.toString().startsWith("#")) {
                    pin_id = pin_id.toString().replace("#","");
                }
                if (this.pins[pin_keys[i]].game.pin_id == pin_id) {
                    // console.log("pin 58", this.pins[i].game.pin_id, pin_id);
                    pin_returned = this.pins[pin_keys[i]];
                    break;
                }
            }
            
        }
        console.log("pin returned", pin_returned);
        
        return pin_returned;
    }

    update_pins(old_box_id, current_box_id, player, blocks, bases) {
        //old_box_id: old id of block holding current pin
        //current_box_id: current id of block to hold current pin

        //update information stored in blocks with each movement
        //update current player info for blocks

        //get active pin information for this player
        let current_pin = this.get(player.id);
        //update block info stored in pin
        current_pin.game.block = current_box_id;
        this.add_to_block(blocks, current_box_id, current_pin);
        //new pin entry i.e a new pin heading out of the base
        let new_pin_entry = false;
        bases.forEach(base => {
            let id = base + 0;
            if (old_box_id === id) {
                new_pin_entry = true;
            }
        });

        if (!new_pin_entry){
            let old_block = blocks[old_box_id];
            console.log("pins 79 " + old_block.pins.indexOf(current_pin));
            //on first run, old_box_id would be nulll/udnefined
            //remove player from previous block if player's pin exists there
            let pin_index = old_block.pins.indexOf(current_pin);
            if (pin_index != -1) {
                blocks[old_box_id].pins.splice(pin_index-1, 1);
            } 
        }

        if(current_pin.game.end_block == current_box_id && current_pin.game.returned == Neutral) {
            // console.log(this.GeneratorObject.UIObject);
            this.GeneratorObject.UIObject.display_message(player.info.name + " has gotten a pin to safety.");
            current_pin.game.returned = Postive;
            this.update_position(current_pin.game.pin_id, this.pin_position.safe);
            if (Object.keys(this.safe_pins).includes(player)) {
                this.safe_pins[player].pins.push(current_pin.game.pin_id);
                if (this.safe_pins[player].pins.length == this.nth_pin) {
                    //game has finished
                    this.GeneratorObject.UIObject.display_message(player.info.name + " has won the game.");
                }
            }
            else {
                this.safe_pins[player] = { pins: [current_pin.game.pin_id] }
            }
            
        }
    }

    add_to_block(blocks, current_box_id, current_pin) {
        // console.log(blocks, current_box_id, current_pin);   
        //add pin to new block
        blocks[current_box_id].pins.push(current_pin);

        if (blocks[current_box_id].pins.length > 0) {
            // alert("block not empty");
            let strongest_pin = { no: 0, armour: 0};
            let strongest_player = undefined;
            // check which player has higher armour as to who remains in block
            blocks[current_box_id].pins.forEach(element => {
                console.log("storng", element)
                if (element.game.armour > strongest_pin.armour) {
                    
                    strongest_pin.no = element;
                    strongest_pin.armour = element.game.armour;
                    strongest_player = element.player.id;
                }
            });
            // alert(JSON.stringify(strongest_player));
            console.log("strongest player", strongest_player);
            //after getting player with strongest armour
            //remove other pins
            for (let i = 0; i < blocks[current_box_id].pins.length; i++) {
                let element = blocks[current_box_id].pins[i];
                if (element.player.id != strongest_player && strongest_player != undefined) {
                    // console.log("element.pindid", element.game.pin_id);
                    this.GeneratorObject.UIObject.force_remove(undefined, "id", element.game.pin_id);   
                    this.GeneratorObject.UIObject.add_to_base(element.game.pin_id);
                    //return weaker pin back to base
                    element.game.block = element.game.start_block;
                    element.game.returned = Negative;
                    this.update_position(element.game.pin_id, this.pin_position.base);
                }
            }
            
        }   
    }

    activate(pin_id) {
        // get current pin
        let current_pin = this.get(undefined, pin_id);
        let owner = current_pin.player;
        //get player's active pin
        let active_pin = this.get(owner.id, undefined);
        if (active_pin == null) {
            active_pin = current_pin;
            active_pin.game.active = Postive;
        }
        else {
            if (current_pin !== active_pin) {
                active_pin.game.active = Negative;
                current_pin.game.active = Postive
            }
        }
        console.log("active pin ", active_pin);
        return active_pin;

    }
    
    update_position(pin_id, position) {
        let current_pin = this.get(undefined, pin_id)
        current_pin.game.position = position;
    }

    get_pins_on_board(player_id=undefined) {
        let pins_on_board = [];
        if (player_id != undefined) {
            let pins = this.get_player_pins(player_id);
            pins.forEach(pin => {
                if (pin.game.position == this.pin_position.board) {
                    pins_on_board.push(pin);
                }
            })
        }
        else {
            let pin_keys = Object.keys(this.pins);
            pin_keys.forEach(key => {
                let pin = this.pins[key];
                if (pin.game.position == this.pin_position.board) {
                    pins_on_board.push(pin);
                }
            });
        }
        
        return { empty: (pins_on_board.length == 0), pins: pins_on_board }
    }

    get_player_pins(player_id) {
        let pins = [];
        let pin_keys = Object.keys(this.pins);
        pin_keys.forEach(key => {
            let pin = this.pins[key];
            if (pin.player.id == player_id) {
                pins.push(pin);
            }
        });
        return pins;
    }
}