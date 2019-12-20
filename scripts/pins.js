
class Pins {
    GeneratorObject = undefined;
    PlayerObject = undefined;
    UIObject = undefined;
    BlocksObject=undefined;
    no_of_bases = 0;
    pins = {}
    pins_per_player = 4;
    max_no = 0;
    pin_position = {
        base: 0,
        board: 1,
        safe_zone: 2,
        safe: 3
    }
    safe_pins = {}
    nth_value = 1;
    mode_type = mode.LUDO;
    mode_of_attack = attack_mode.LUDO;
    pin_state = {
        dormant: "dormant",
        stopped: "stopped",
        standby: "standy",
        moving: "moving"
    }
    pin_order = {
        offensive: 0,
        defensive: 1,
    }

    bag_items = {
        home_advantage: {}
    }
    

    constructor(GeneratorObject, no_of_bases, mode_type, nth_value, attack_mode) {
        this.GeneratorObject = GeneratorObject;
        
        this.max_no = (no_of_bases * this.pins_per_player);
        //set game mode
        this.set_mode(mode_type, nth_value, attack_mode);
        this.init();        
    }

    init() {
        this.UIObject = this.GeneratorObject.getUIObject();
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
        this.BlocksObject = this.GeneratorObject.getBlocksObject();
        console.log("Pins initialized")
    }

    override(action, value) {
        let player = this.PlayerObject.get(value.player_id);
        switch (action) {
            case publish_action.pin_create:
                this.create_pins(player, value.no_of_pins, value.base);
                break;
            case publish_action.pin_get:
                this.get(value.player_id, value.pin_id);
                break;
            case publish_action.pin_activate:
                this.activate(value.pin_id, value.automated, value.player_id);
                break;
            default:
                break;
        }
    }

    set_mode(mode_type, no, attack_mode) {
        this.nth_value = no
        this.mode_type = mode_type; 
        this.mode_of_attack = attack_mode;  
    }

    // set_bag_items(mode_type) {
    //     switch(mode_type) {
    //         case mode.
    //     }
    // }
    new (player, base, id) {
        let pins_total = Object.keys(this.pins).length;
        // console.log("Pins ", JSON.stringify(this.pins));
        let no_per_base = this.GeneratorObject.BlocksObject.no_per_base;
        let safe_zone_start = this.GeneratorObject.BlocksObject.no_of_public_blocks + 1;
        console.log("sz_start", safe_zone_start, no_per_base, this.GeneratorObject.BlocksObject.no_of_public_blocks)
        if(pins_total < this.max_no) {
            //player: holds the information of the current
            //game: holds the information needed by this pin during gameplay
            // let pin_id = player.game.pin + pins_total.toString();
            
            let pin_id = player.game.pin + id;
            this.pins[pin_id] = {  
                player: player, 
                game: 
                { 
                    pin_id: pin_id, active: Negative, 
                    block: base + 0, base: base, start_block: base + 3,
                    end_block: base + no_per_base , returned: Negative, position: this.pin_position.base,
                    state: this.pin_state.dormant, order: this.pin_order.defensive,
                    safe_zone: { triggered: Negative, trigger: base + 1, start: base + safe_zone_start, end: base + no_per_base},
                    info: {
                        bases: 0
                    }
                }, 
                info:{

                },
                bag: {} 
            }

            switch (this.GeneratorObject.get_mode_of_attack()){
                case attack_mode.BASIC:
                    this.pins[pin_id].game.armour = 1;
                    this.pins[pin_id].game.factors = { agility: agility }
                    break;
                case attack_mode.TEIR_1:
                    this.pins[pin_id].game.factors = pin_factor[pin_id];
                    this.GeneratorObject.FactorsObject.calc_power(pin_id)
                    break;
                default:
                    break;
            }

        }
        else {
            //display error
            //error: Maxium no of pins reached.
            this.UIObject.display_message(messages.MAX_PINS_REACHED)
        }
        
    }

    create_pins(player, no_of_pins, base) {
        // console.log("Player", player, " No of pins ", no_of_pins, " base", base)
        //generate pins for players  
        let pin_counter = 0;
        let publish_action = this.GeneratorObject.publish_action;
        let publish_source = this.GeneratorObject.publish_source;

        while(pin_counter < no_of_pins) {
            this.new(player, base, pin_counter);
            pin_counter++;
        }
        
        //publish if action is from me
        if (this.GeneratorObject.get_player() == player) {
            console.log("Player ", player, " emitting")
            this.GeneratorObject.publish({base: base, no_of_pins: no_of_pins },  publish_action.pin_create, publish_source.pin);
        } 
        console.log("Pins ", this.pins);
        //activating one pin for testing purposes
        // this.pins[Object.keys(this.pins).length - 1].game.active = Positive;
        // this.pins["red_pin"+3].game.active = Positive;
        // if (this.pins["red_pin"+0] != undefined) this.pins["red_pin"+0].game.armour = 2;
        // if (this.pins["blue_pin"+0] != undefined) this.pins["blue_pin"+0].game.order = this.pin_order.defensive;
        // console.log("PINS", this.pins)   
    }

    get_all_pins() {
        //returns all pins
        return this.pins;
    }

    get(player_id=undefined, pin_id=undefined) {
        let pin_keys = Object.keys(this.get_all_pins());
        let pin_returned = null;
        
        // console.log(this.pins)
        for (let i=0; i< pin_keys.length; i++) {
            // console.log("Pins", this.pins[pin_keys[i]].player.id, " Player id", player_id)
            //get active pin for this player
            if (player_id != undefined) {
                if (this.pins[pin_keys[i]].player.id == player_id && this.pins[pin_keys[i]].game.active == Positive) {
                    //return only active pin
                    // console.log("pins 76", this.pins[pin_keys[i]], player_id)
                    if (pin_returned == null )pin_returned = this.pins[pin_keys[i]];
                    
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
        // console.log("pin returned", pin_returned);
        //publish if action is from me
        if (this.GeneratorObject.get_player() == player_id) this.GeneratorObject.publish({player_id: player_id, pin_id: pin_id },  publish_action.pin_get, publish_source.pin);
        return pin_returned;
    }

    update_pin_info(pin_id, info=constants.BASES, value) {
        let current_pin = this.get(undefined, pin_id);
        switch(info) {
            case constants.BASES:
                current_pin.game.info.bases = value;
                break;
            default:
                break;
        }
    }

    update_pins(old_box_id, current_box_id, player, blocks, bases) {
        //old_box_id: old id of block holding current pin
        //current_box_id: current id of block to hold current pin

        //update information stored in blocks with each movement
        //update current player info for blocks

        //get active pin information for this player
        
        let current_pin = this.get(player.id);
        // if (!this.GeneratorObject.make_checks(current_pin)) return;
        //update block info stored in pin
        current_pin.game.block = current_box_id;
        // console.log("Update Pin", old_box_id, current_box_id)
        if (old_box_id == current_box_id) {
            //same block
            return;
        }
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
            //on first run, old_box_id would be nulll/udnefined
            //remove player from previous block if player's pin exists there
            this.GeneratorObject.BlocksObject.remove_pin_from_block(old_box_id,current_pin.game.pin_id);
            this.GeneratorObject.FactorsObject.reduce_agility(current_pin.game.pin_id);
        }

        this.check_win(current_pin, current_box_id, player, this.mode_type);  
    }



    check_win(current_pin=undefined, current_box_id=undefined, player, mode_type) {
        // console.log("Check win", mode_type)
        if (current_pin == undefined && current_box_id == undefined) {
            this.GeneratorObject.UIObject.display_message(messages.INVALID_ACTION);
            return;
        }

        switch(mode_type) {
            case mode.PIN:
                // this.pin_mode(current_pin,current_box_id, player);
                break;
            case mode.POINTS:
                break;
            case mode.LUDO:
                this.nth_value = 4;
                break;
            default:
                break;
        }

        this.pin_mode(current_pin,current_box_id, player);
        
    }

    get_safe_pins() {
        return Object.keys(this.safe_pins);
    }

    pin_mode(current_pin, current_box_id, player) {
        // console.log("Pin check", current_pin, current_box_id, current_pin.game.returned)
        if(current_pin.game.end_block == current_box_id && current_pin.game.returned == Neutral) {
            // console.log(this.GeneratorObject.UIObject);
            this.GeneratorObject.UIObject.display_message(player.info.name + " has gotten a pin to safety.");
            this.update_position(current_pin.game.pin_id, this.pin_position.safe);
            let keys = this.get_safe_pins();
            // console.log("ened empty", JSON.stringify(this.safe_pins), (keys.length));
            if (keys.indexOf((player.id).toString()) == -1) {
                this.safe_pins[player.id] = {pins: 1}
                console.log("first safe", player.id);
            }
            else {
                this.safe_pins[player.id].pins = this.safe_pins[player.id].pins+1;                
                console.log("second safe", player.id);
            }
            if (this.safe_pins[player.id].pins == this.nth_value) {
                this.GeneratorObject.UIObject.display_message(player.info.name + " has won.");
                this.GeneratorObject.set_winner(player.id);
            }
            console.log("safe pins", Object.keys(this.safe_pins), this.safe_pins, (keys.indexOf(player.id) == -1), keys)  
            
        }
    }

    add_to_block(blocks = undefined, current_box_id, current_pin) {
        // console.log(blocks, current_box_id, current_pin);
        
        if (blocks == undefined) {
            blocks = this.GeneratorObject.BlocksObject.blocks;
            
        } 
        
        //add pin to new block
        let block = this.GeneratorObject.BlocksObject.get(current_box_id);
        // console.log(block, current_box_id) 
        if (!this.GeneratorObject.make_checks(undefined, constants.BLOCK, undefined, block)) return;

        if (block.pins.indexOf(current_pin) != -1) {
            //pin exists already
            return;
        }
        block.pins.push(current_pin);

        if (block.pins.length > 1) {
            // alert("block not empty");
           console.log("block not empty")
            this.start_battle(blocks, current_box_id, current_pin);
            
        }   
        if (block.game.trap != undefined) {
            //trap has been set
            this.GeneratorObject.BlocksObject.trigger_trap(current_box_id, current_pin.game.pin_id);
        }
    }

    start_battle(blocks,current_box_id, current_pin) {

        // alert("block not empty");
        let strongest_pin = { pin: undefined, armour: undefined };
        let strongest_player = undefined;
        let pins_left = blocks[current_box_id].pins.length;
        let winner = undefined;
        let block = this.GeneratorObject.BlocksObject.get(current_box_id);
        let pins = [];
        console.log("Attack mode", this.mode_of_attack)
        switch(this.GeneratorObject.get_mode_of_attack()) {
            case attack_mode.LUDO:
                winner = current_pin;
                strongest_pin.pin = undefined;
                pins = block.pins;
                // console.log("PINS len", pins.length, pins, block.pins, strongest_pin, winner);
                for (let i = pins.length - 1; i >= 0; i--) {
                    let element = pins[i];

                    if (element.player.id == winner.player.id) {
                        continue;
                    }
                    // console.log("Stronges Pin here ", element.player.id, winner.player.id)
                    strongest_pin.pin = element.game.pin_id;
                    break;
                }
                
                
                // strongest_pin.pin = shifted_pin.game.pin_id;
                // strongest_pin.armour = shifted_pin.game.armour;
                console.log("PINS ", pins, block.pins, strongest_pin);
                break;
            case -4:
                // check which player has higher armour as to who remains in block
                strongest_pin = { pin: current_pin.game.pin_id, armour: current_pin.game.armour};
                strongest_player = current_pin.player.id;

                pins = block.pins;
                for (let i = 0; i < pins.length; i++) {
                    let element = pins[i];
                    
                    if (element.player.id != strongest_player && element.game.armour > strongest_pin.armour && pins_left > 0) {
                        console.log("Fighting element", element.game.pin_id, element.game.armour, strongest_pin.pin, strongest_pin.armour)
                        
                        this.update_pin_arsenal(element.game.pin_id, parseFloat(element.game.armour) - parseFloat(strongest_pin.armour), constants.DAMAGE, this.damage_by(strongest_pin.pin, constants.PIN));
                        this.lost(strongest_pin.pin, element.game.pin_id);
                        pins_left--;
                        strongest_pin.pin = element.game.pin_id;
                        strongest_pin.armour = element.game.armour;
                        // console.log
                        strongest_player = element.player.id;
                        
                        
                    }
                    else if(element.player.id != strongest_player && element.game.armour == strongest_pin.armour) {
                        
                        if (strongest_player == undefined && pins_left > 0) {
                            strongest_pin.pin = element.game.pin_id;
                            strongest_pin.armour = element.game.armour;
                            strongest_player = element.player.id;
                        }
                        else if (pins_left > 0) {
                            console.log("Fighting equal", element.game.pin_id, element.game.armour, strongest_pin.pin, strongest_pin.armour)
                            this.lost(strongest_pin.pin, element.game.pin_id);
                            this.lost(element.game.pin_id, strongest_pin.pin);
                            pins_left--;
                            pins_left--;
                            // reset values
                            strongest_pin.armour = 0;
                            strongest_pin.pin = undefined;
                            strongest_player = undefined;
                        }
                        
                    }
                    else if (element.player.id != strongest_player && strongest_pin.armour > element.game.armour && pins_left > 0) {
                        console.log("Fighting strongest", element.game.pin_id, element.game.armour, strongest_pin.pin, strongest_pin.armour)
                        let updated_armour = parseFloat(strongest_pin.armour) - parseFloat(element.game.armour);
                        // console.log("Updated Armour = ", updated_armour);
                        this.update_pin_arsenal(strongest_pin.pin, updated_armour);
                        strongest_pin.armour = updated_armour;
                        this.lost(element.game.pin_id, strongest_pin.pin);
                        pins_left--;
                        // console.log
                    }
                }
                break;
            default:
                let result = this.strongest_check(current_pin, block);
                strongest_player = result.strongest_player;
                strongest_pin = result.strongest_pin;
                break
        }
        
        // alert(JSON.stringify(strongest_player));
        
        //after getting player with strongest armour
        //remove other pins
        if (this.GeneratorObject.get_mode_of_attack() == attack_mode.LUDO) {
            this.remove_weaker(current_box_id, strongest_pin.pin, Positive, winner.game.pin_id);
            console.log("strongest player", strongest_player, "PINS", block.pins.length, winner.game.pin_id, strongest_pin);
        }
        else {
            this.remove_weaker(current_box_id, strongest_pin.pin);
            console.log("strongest player", strongest_player, "PINS", block.pins.length, strongest_pin);
        }
        
    }

    strongest_check(current_pin, block, ) {
        let strongest_pin = { pin: current_pin.game.pin_id };
        let strongest_player = current_pin.player.id;
        let pins = block.pins;
        let pins_left = pins.length;
        let mode_of_attack = this.GeneratorObject.get_mode_of_attack();
        switch(mode_of_attack) {
            case attack_mode.BASIC:
                    strongest_pin.value = current_pin.game.armour;
                break;
            case attack_mode.TEIR_1:
                    strongest_pin.value = this.GeneratorObject.FactorsObject.calc_power(strongest_pin.pin);
                break;
            default:
                break;
        }
        for (let i = 0; i < pins.length; i++) {
            let element = pins[i];
            let element_value = 0; let strongest_pin_value = 0;
            
            switch(mode_of_attack) {
                case attack_mode.BASIC:
                    element_value = element.game.armour;
                    strongest_pin_value = strongest_pin.value;
                    
                    break;
                case attack_mode.TEIR_1:
                    element_value = this.GeneratorObject.FactorsObject.calc_power(element.game.pin_id)
                    strongest_pin_value = strongest_pin.value;
                    break;
                default:
                    break;
            }
            
            if (element.player.id != strongest_player && element_value > strongest_pin_value && pins_left > 0) {
                
                console.log("Fighting element", element.game.pin_id, element_value, strongest_pin.pin, strongest_pin.value)
                let updated_value = parseFloat(element_value) - parseFloat(strongest_pin_value);
                this.update_pin_arsenal(element.game.pin_id, updated_value, constants.DAMAGE, this.damage_by(strongest_pin.pin, constants.PIN));
                this.lost(strongest_pin.pin, element.game.pin_id);
                pins_left--;
                strongest_pin.pin = element.game.pin_id;
                strongest_pin.value = updated_value;
                // console.log
                strongest_player = element.player.id;
                
                
            }
            else if(element.player.id != strongest_player && element_value == strongest_pin_value) {
                
                if (strongest_player == undefined && pins_left > 0) {
                    strongest_pin.pin = element.game.pin_id;
                    if(mode_of_attack == attack_mode.BASIC) {
                        strongest_pin.value = element.game.armour;
                    }
                    else {

                        strongest_pin.value = this.GeneratorObject.FactorsObject.calc_power(element.game.pin_id);
                    }
                    strongest_player = element.player.id;
                }
                else if (pins_left > 0) {
                    console.log("Fighting equal", element.game.pin_id, element_value, strongest_pin.pin, strongest_pin_value)
                    this.lost(strongest_pin.pin, element.game.pin_id);
                    this.lost(element.game.pin_id, strongest_pin.pin);
                    pins_left--;
                    pins_left--;
                    // reset values
                    strongest_pin.value = 0;
                    strongest_pin.pin = undefined;
                    strongest_player = undefined;
                }
                
            }
            else if (element.player.id != strongest_player && strongest_pin_value > element_value && pins_left > 0) {
                console.log("Fighting strongest", element.game.pin_id, element_value, strongest_pin.pin, strongest_pin_value)
                let updated_value = parseFloat(strongest_pin_value) - parseFloat(element_value);
                // console.log("Updated Armour = ", updated_armour);
                this.update_pin_arsenal(strongest_pin.pin, updated_value);
                strongest_pin.value = updated_value;
                this.lost(element.game.pin_id, strongest_pin.pin);
                pins_left--;
                // console.log
            }
        }
        
            return { strongest_pin: strongest_pin, strongest_player: strongest_player }
    }

    damage_by(damage_by, type) {
        return { damage_by: damage_by, type:type }
    }

    update_pin_arsenal(pin_id, value, type=constants.DAMAGE, type_details=undefined) {
        //type_details = {damage_by,type}
        let current_pin = this.get(undefined, pin_id);

        switch(this.GeneratorObject.get_mode_of_attack()) {
            case attack_mode.BASIC:
                current_pin.game.armour = value;
                console.log("Updating armour", pin_id, value);
                
                break;
            case attack_mode.TEIR_1:
                //reset pin factors
                this.GeneratorObject.FactorsObject.convert_power_to_factors(pin_id, value)
                break;
            default:
                break;
        }

        if (type == constants.DAMAGE && value == 0) {
            //pin was defeated
            if (type_details == undefined) {
                type_details = { damage_by: undefined, type: undefined }
            }
            this.lost(pin_id, type_details.damage_by, type_details.type, true);
        }
    }

    lost(pin_id, lost_to=undefined, type=constants.PIN, auto_remove=false) {
        let current_pin =this.get(undefined,pin_id);
        switch(type) {
            case constants.PIN:
                console.log(pin_id, "Lost to Pin ", lost_to);
                this.update_pin_arsenal(pin_id, 0, constants.LOST);
                break;
            case constants.WALL:
                console.log(pin_id, "Lost to Wall ", lost_to);
                this.update_pin_arsenal(pin_id, 0, constants.LOST);
                break;
            case constants.TRAP:
                    console.log(pin_id, "Lost to Trap ", lost_to);
                    this.update_pin_arsenal(pin_id, 0, constants.LOST);
                    break;
            default:
                break;
        }

        if (auto_remove) {
            this.GeneratorObject.BlocksObject.remove_pin_from_block(current_pin.game.block, pin_id);
            this.GeneratorObject.UIObject.force_remove(undefined, "id", pin_id);   
            //return pin to base
            this.GeneratorObject.UIObject.add_to_base(pin_id);
            //return weaker pin back to base
            current_pin.game.returned = Negative;
            this.update_position(pin_id, this.pin_position.base);

            
        }
        
    }

    remove_weaker(current_box_id, pin, reverse=Negative, winner_id=undefined) {
        // console.log(current_box_id, pin, reverse, winner_id);
        //if reversed, only one pin would be removed
        if (reverse == Positive && pin == undefined) {
            //no pin should be removed
            return;
        }

        // let blocks = this.GeneratorObject.BlocksObject.get_blocks();
        let block = this.GeneratorObject.BlocksObject.get(current_box_id);
        let pins = block.pins;
        let player_id = undefined;
        if (pin != undefined) {
            pin = this.get(undefined, pin);
            player_id = pin.player.id;
        }


        for (let i = 0; i < pins.length; i++) {
            let element = pins[i];
            console.log("Removing weaker", element.player.id, player_id)
            if (reverse == Negative && player_id != undefined && element.player.id == player_id) {
                //my pin, skip
                continue;
            }
            else if (reverse == Positive && pin.game.pin_id != element.game.pin_id) {
                //remove only passed pin
                continue;
                
            }
            
            if(reverse == Negative && this.mode_of_attack == attack_mode.LUDO && player_id != undefined) {
               this.lost(element.game.pin_id, pin.game.pin_id); 
            } 
            else if (reverse == Positive && this.mode_of_attack == attack_mode.LUDO && player_id != undefined) {
                this.lost(element.game.pin_id, winner_id); 
            }
            this.GeneratorObject.UIObject.force_remove(undefined, "id", element.game.pin_id);   
            //return pin to base
            this.GeneratorObject.UIObject.add_to_base(element.game.pin_id);
            //return weaker pin back to base
            element.game.returned = Negative;
            this.update_position(element.game.pin_id, this.pin_position.base);
            this.GeneratorObject.BlocksObject.remove_pin_from_block(current_box_id, element.game.pin_id);
            
            if (reverse == Positive) break;
            
            
            
        }
    }

    activate(pin_id, automated=Neutral, player_id=undefined) {
        // get current pin
        let current_pin = this.get(undefined, pin_id);
        //make null checkfor pin here

        let owner = current_pin.player;
        //get player's active pin
        let active_pin = this.get(owner.id, undefined);
        //get pins on same block
        let block_pins = this.get_pins_on_same_block(pin_id, player_id);
        console.log("same block", block_pins, player_id, owner)
        //if not have more and player_id is passed, returned pin is mine
        if (block_pins != undefined && !block_pins.has_more_of_mine && block_pins.pins.length == 1 && player_id != undefined) {
            current_pin = this.get(undefined, block_pins.pins[0]);
            owner = current_pin.player;
            active_pin = this.get(owner.id, undefined);
        }

        this.hightlight_my_pins(owner.id);

        if (block_pins == undefined || !block_pins.has_more_of_mine || automated == Negative) {
            if (active_pin == null) {
                active_pin = current_pin;
                active_pin.game.active = Positive;
            }
            else {
                if (current_pin !== active_pin) {
                    active_pin.game.active = Negative;
                    current_pin.game.active = Positive;
                    active_pin = current_pin;
                }
            }
            console.log("active pin ", active_pin);
            if (this.GeneratorObject.get_player() == owner.id) this.GeneratorObject.publish({ pin_id: pin_id, automated:automated, player_id: player_id }, publish_action.pin_activate, publish_source.pin)
            return active_pin;
        }
        else {
            let my_pins = [];
            let UIObject = this.GeneratorObject.UIObject;
            // loop through and get players pins only
            block_pins.pins.forEach(id => {
                let pin = this.get(undefined, id);
                // console.log("OWNER", owner.id, "RN", pin.player);
                if (pin.player.id == player_id) {
                    my_pins.push(id);
                    if (player_id == this.GeneratorObject.get_player()) {
                        UIObject.replicate("#pins_value", UIObject.create_element(undefined, undefined,() => {
                            this.activate(id, automated=Negative);
                            my_pins.forEach(element => {
                                this.GeneratorObject.UIObject.force_remove(constants.PIN + element);
                            });
                            
                        }, id, constants.PIN + id ));
                    }
                    
                }
            });
            return;
        }
    }
    
    update_pin_trigger(pin_id, trigger) {
        let current_pin = this.get(undefined, pin_id);
        if (current_pin == null || current_pin == undefined) {
            this.GeneratorObject.UIObject.display_message(messages.ACTIVATE_PIN);
            return;
        }
        current_pin.game.safe_zone.triggered = trigger;
    }

    update_position(pin_id, position) {
        let current_pin = this.get(undefined, pin_id);
        current_pin.game.position = position; 
        switch(position) {
            case this.pin_position.base:
                this.update_pin_state(pin_id, this.pin_state.dormant);
                this.update_pin_info(pin_id,constants.BASES, 0);
                this.update_pin_trigger(pin_id, Negative);
                break;
            case this.pin_position.board:
                this.update_pin_state(pin_id, this.pin_state.standby);
                if (this.GeneratorObject.get_mode_of_attack() == attack_mode.BASIC && current_pin.game.armour == 0) {
                    current_pin.game.armour = 1;
                }
                
                break;
            case this.pin_position.safe:
                this.update_pin_state(pin_id, this.pin_state.dormant);
                current_pin.game.returned = Positive;  
                break;
        }
    }

    hightlight_my_pins(player_id) {
        let pins_on_board = this.get_pins_on_board();
        if (!pins_on_board.empty) {
            pins_on_board.pins.forEach(key => {
                let pin = this.get(undefined, key);
                if (pin.player.id == player_id) {
                    //increase z-index
                    this.GeneratorObject.UIObject.apply_css(pin.game.pin_id,undefined, {'z-index': 5});
                }
                else  {
                    //reduce z-index
                    this.GeneratorObject.UIObject.apply_css(pin.game.pin_id,undefined, {'z-index': 2});
                }
            });
        }
        
    }

    get_pins_on_board(player_id=undefined) {
        let pins_on_board = [];
        if (player_id != undefined) {
            let pins = this.get_player_pins(player_id);
            pins.forEach(key => {
                let pin = this.get(undefined, key);
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
                    pins_on_board.push(key);
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
                pins.push(key);
            }
        });
        return pins;
    }

    get_pins_on_same_block(pin_id, player_id=undefined) {
        let current_pin = this.get(undefined,pin_id);

        let block = this.GeneratorObject.BlocksObject.get(current_pin.game.block);
        // console.log("block", block, "player_id", player_id)

        if (block != undefined) {
            let pins = [];
        
            block.pins.forEach(pin => {
            // console.log("Pin", pin)
                if (pin.game.block == block.id) {
                    
                    // console.log("Pin", pin, "block", block)
                    if (player_id != undefined) {
                        // console.log("Pin", pin, "block", block, "player_id", player_id, pin.player.id)
                        //if player id is passed, get only my pins on the same block
                        if (pin.player.id == player_id) {
                            pins.push(pin.game.pin_id);
                        }
                    }
                    else {
                        pins.push(pin.game.pin_id);
                    }
                    
                    
                    // block.pins.
                }
                else {
                    //block not updated, pin not on this block
                    this.GeneratorObject.BlocksObject.remove_pin_from_block(block.id, pin.game.pin_id);
                }
            
            });
            
            let result = undefined;
            
            if (player_id == undefined) {
                result = { has_more_of_mine: false, pins: pins, total_pins: block.pins.length };
            }
            else {
                result = { has_more_of_mine: (pins.length > 1), pins: pins, total_pins: block.pins.length }
            }
            return result;
        }
        
    }

    update_pin_state(pin_id, state) {
        let pin = this.get(undefined, pin_id);
        pin.game.state = state;
    }

}