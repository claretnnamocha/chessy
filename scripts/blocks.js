class Blocks {
    GeneratorObject = undefined;
    PinObject = undefined;
    PlayerObject = undefined;
    UIObject = undefined;
    PointsObject = undefined;

    blocks = {}
    public_blocks = []
    terrain_blocks = {}
    //block info
    no_per_base=undefined;
    no_of_blocks = 6;
    no_of_SZ_blocks = 6;
    no_of_public_blocks = 0;
    block_tapped = 0;

    //side
    terrain_side_blocks_min = 2;


    wall_order = {
        allow: 0,
        stop: 1,
        defend: 2,
        lure: 3,
        toll: 4
    }
    
    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.init();
    }

    init() {
        this.PinObject = this.GeneratorObject.getPinObject();
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
        this.UIObject = this.GeneratorObject.getUIObject();
        this.PointsObject = this.GeneratorObject.getPointsObject();
        console.log("Blocks initialized.")
    }

    override(action, value, player_id) {
        let player = this.PlayerObject.get(player_id);
        switch (action) {
            case publish_action.acquire_block:
                console.log("Die received ", value);
                this.acquire_block(value.block_id, value.player_id, value.base, value.from_system);
                break;
            case publish_action.die_click:
                this.action(value.player_id, value.die, value.action);
                break;
            case publish_action.dice_roll_prepare:
                this.prepare(value.player_id);
                break;
            case publish_action.empty_dice:
                this.empty_dice(value.player_id);
                break;
            default:
                break;
        }
    }

    create_block(data) {
        // Generator.blocks.push(info.id);
        
        //create block and assign value
        this.blocks[data.id] = data;
        
        // console.log(JSON.stringify(Generator.blocks));
        // this.blocks.[info.id] = info 
    }

    get_blocks(include_safe=Negative) {
        let blocks = [];
        if (include_safe != Negative) {
            blocks = Object.keys(this.blocks);
        }
        else {
            blocks = this.public_blocks;
        }
        return blocks;
    }

    init_blocks(container){
        this.no_per_base = no_per_base;
        this.no_of_public_blocks = no_per_base - this.no_of_SZ_blocks;
        let bases = this.GeneratorObject.bases;
        //divs for testing purposes
        //to generate block(boxes) needed
        for(let base = 0; base < bases.length; base++) {
            for(let i = 1; i <= no_per_base; i++) {
               let id =bases[base] + i;
                //register this box as a block
                //default keys are listed below
                if (i > this.no_of_public_blocks) {
                    //safe zone block 
                    this.create_block({ id: id, pins: [], actions: [], game: 
                        { 
                            wall: {
                                level: 0, owner: undefined, order: this.wall_order.stop 
                            },
                            terrain: {
                                active: Negative, valid: Negative, type: undefined
                            },
                            active: Negative, trap: undefined, 
                            safe_zone: Positive
                            
                        } 
                    });
                }
                else {
                    this.public_blocks.push(id);
                    this.create_block({ id: id, pins: [], actions: [], game: 
                    { 
                            wall: {
                                level: 0, owner: undefined, order: this.wall_order.stop 
                            }, 
                            terrain: {
                                active: Negative, valid: Negative, type: undefined
                            },
                            active: Negative, trap: undefined, safe_zone: Negative
                            
                        } 
                    });
                }
                
                // pins: player pins on this particular block
                // actions: items placed on this box
                // used the move.js file
                // element_type?: string, styling?: {}, action?: any, inner_text: any, element_id?: any, element_class?: any)
                let block = this.GeneratorObject.UIObject.create_element("div",undefined,undefined, "", id, "box");
                block.addEventListener("click", (e) => {
                    if (this.block_tapped == 0) {
                        setTimeout(() => {
                            if (this.block_tapped == 1) {
                                this.activate_block(id, this.GeneratorObject.get_player());
                            }
                            else if (this.block_tapped == 2) {
                                // alert("double tap")
                                this.acquire_block(id, this.GeneratorObject.get_player(), bases[base]);
                                this.activate_block(id, this.GeneratorObject.get_player());
                            }
                            
                            this.block_tapped = 0;
                        }, 500);
                        
                        
                    }
                    this.block_tapped ++;
                    
                    e.stopPropagation();
                }, false);


                this.GeneratorObject.UIObject.replicate(container, block);
                
                
            }
            //create a div to clear
            let div = document.createElement("div");
            div.style.clear = "both";

            this.GeneratorObject.UIObject.replicate(container, div);
            
        }
        
    }

    get(block_id = undefined, player_id=undefined) {
        // gets activated block
        let block = undefined;
        let keys = Object.keys(this.blocks);
        if (block_id == undefined) {
            for(let i = 0; i < keys.length; i++) {
                if (player_id != undefined && (this.blocks[keys[i]].game.active != Negative && this.blocks[keys[i]].game.owner == player_id )) {
                    block = this.blocks[keys[i]];
                    break;
                }
                else if (player_id == undefined && this.blocks[keys[i]].game.active != Negative) {
                    block = this.blocks[keys[i]];
                    break;
                }
            }
        }
        else {
            block = this.blocks[block_id];
        }
        return block;
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
            this.blocks[block_id].game.active = Positive;
            console.log("active block", this.blocks[block_id])
            
        }

    }

    remove_pin_from_block(block_id, pin_id) {
        // console.log("Before ", JSON.stringify(this.blocks[block_id].pins), "pin_id", pin_id, block_id);
        this.blocks[block_id].pins = this.blocks[block_id].pins.filter(pin => pin.game.pin_id !=pin_id );
        // console.log("After ", JSON.stringify(this.blocks[block_id].pins))
    }

    get_blocks_on_side( block_id, on_side=side.RIGHT, nth_val = 0, player_id, ending_block=undefined, include_safe=false) {
        let block = this.get(block_id);
        let player = this.PlayerObject.get(player_id);
        let keys = this.public_blocks;
        if (include_safe) {
            keys = Object.keys(this.blocks);
        }
        let index = keys.indexOf(block_id);
        
        let counter = 0;
        let blocks = [];
        switch(on_side) {
            case side.LEFT:
                index = index -1;
                if (index <= -1) {
                    index = keys.length - 1;
                }
                // console.log("SIDE LEFT", index)
                for (let i = index; i >= 0;) {
                    let current_block_id = keys[i];
                    // console.log("current_block_id", current_block_id, ' i', i, ' counter', counter, nth_val)
                    //end loop if nth blocks has been gotten
                    if (nth_val != 0 && counter >= nth_val) break;
                    
                    //if nth val is supplied and at last block, continue getting other block
                    if ((nth_val != 0 && i == 0) || (ending_block != undefined && i == 0)) {
                        i = keys.length - 1;
                        blocks.push(keys[0]);
                        counter++;i--;
                        continue;
                    }

                    if (keys[i] != undefined) blocks.push(keys[i]);

                    if (current_block_id == ending_block) break; //stop loop if blocks gotten reached ending block
                    i--; counter++;
                }
                break;
            case side.RIGHT:
                    index = index + 1;
                    // console.log("side blocks index", index, " keys leng", keys.length, " block id", block_id);
                if (index >= keys.length) {
                    index = 1;
                }
                let keys_last_index = keys.length - 1;
                for (let i = index; i < keys.length;) {
                    let current_block_id = keys[i];
                    if (nth_val != 0 && counter >= nth_val) break;

                    if ((nth_val != 0 && (i == keys_last_index)) || (ending_block != undefined && i == 0)) {
                        i = 0;
                        blocks.push(keys[keys_last_index]);
                        counter++;i++;
                        continue;
                    }
                    
                    if (keys[i] != undefined) blocks.push(keys[i]);

                    if (current_block_id == ending_block) break; //stop loop if blocks gotten reached ending block
                    i++; counter++;
                }
                break;
            default:
                break;
        }
        
        if (on_side == side.LEFT) {
            blocks = blocks.reverse()
        }
        if (blocks.length == 1) {
            blocks = blocks[0];
        }
        return blocks;
    }

    make_terrain_checks(blocks, player_id) {
        let counter = 0;
        let terrain_side_blocks_min = this.get_terrain_side_blocks_min();
        let terrain_start_at = [];
        let temp = []
        let made_changes = Negative;
        for (let i = 0; i < blocks.length; i++) {
            let block = this.get(blocks[i]);
            if (block.game.owner == player_id) {
                
                
                if (counter >= terrain_side_blocks_min) {
                    made_changes = Positive;
                    if (block.game.terrain.valid == Negative) {
                        this.add_terrain_block(blocks[i], player_id);
                        block.game.terrain.active = Neutral;
                        this.UIObject.apply_css(blocks[i], undefined,{background: "grey"})
                    }
                }
                else {
                    
                    //store block id for manipulation later
                    temp.push(blocks[i]);
                    if (made_changes != Positive) made_changes = Neutral;
                }
                counter++;
            }
            else {
                
                if (made_changes == Positive) {
                    terrain_start_at= terrain_start_at.concat(temp);
                    temp = [];
                }
                counter = 0;
                made_changes = Negative;
            }

        }

        //validate remaining blocks
        for (let i = 0; i < terrain_start_at.length; i++) {
            let block = this.get(terrain_start_at[i]);
            if (block.game.terrain.valid == Negative) {
                this.add_terrain_block(terrain_start_at[i], player_id)
                this.UIObject.apply_css(blocks[i], undefined,{background: "grey"})
                block.game.terrain.active = Neutral;

            }
        }
        
    }

    acquire_block(block_id, player_id, base, from_system=false) {
        //if base isn't players own, charge more
        let player = this.PlayerObject.get(player_id);
        let price = -1;
        let terrain_side_blocks_min = this.get_terrain_side_blocks_min();
        

        if (this.blocks[block_id].game.owner == undefined) {
            price = this.PointsObject.get_price(constants.BLOCK, constants.ACQUIRE);
        }
        else {
            return;
        }
        
        if (from_system) {
            price = 0;
        }

        if (price > -1 && player.game.points >= price) {
            this.blocks[block_id].game.owner = player_id;
            this.PlayerObject.update_points(player_id, parseInt(player.game.points) - parseInt(price));
            let blocks_on_sides = [];
            blocks_on_sides = blocks_on_sides.concat(this.get_blocks_on_side(block_id, side.LEFT, terrain_side_blocks_min, player_id));
            blocks_on_sides.push(block_id);
            blocks_on_sides = blocks_on_sides.concat(this.get_blocks_on_side(block_id, side.RIGHT, terrain_side_blocks_min, player_id));
            //make terrain checks
            this.make_terrain_checks(blocks_on_sides, player_id)
            

            console.log("block " + block_id + ". Owned by " + this.blocks[block_id].game.owner);

            if (!from_system && this.GeneratorObject.get_player() == player_id) {
                this.GeneratorObject.publish({ block_id: block_id, player_id: player_id, base: base, from_system: from_system }, publish_action.acquire_block, publish_source.block);
            }
        }
        else if (player.game.points < price) {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
        
        
    }

    assign_blocks(player_id, base) {
        let keys = Object.keys(this.blocks);
        let player = this.PlayerObject.get(player_id);
        let pin_id = this.PinObject.get_player_pins(player_id)[0]
        console.log("pin_id", pin_id);
        let current_pin = this.PinObject.get(undefined, pin_id);
        
        //using pin to get starting block
        let start_block = current_pin.game.start_block;
        
        let index = keys.indexOf(start_block);
        let side_blocks = this.get_blocks_on_side(start_block,side.RIGHT, this.no_of_blocks, player_id);
        // console.log(side_blocks)
        for (let i = 0; i < side_blocks.length; i++ ) {
            this.acquire_block(side_blocks[i], player_id, base, true);
        }
    }

    get_terrain_side_blocks_min() {
        return this.terrain_side_blocks_min;
    }

    get_terrain_blocks(player_id=undefined) {
        if (player_id != undefined) {
            return this.terrain_blocks[player_id];
        }
        return this.terrain_blocks;
    }

    add_terrain_block(block_id, player_id) {
        let block = this.get(block_id);
        block.game.terrain.valid = Neutral;
        let keys = Object.keys(this.get_terrain_blocks())
        if (keys.indexOf(player_id) == -1) {
            this.terrain_blocks[player_id] = { blocks: [block_id], active: Negative } ;
        }
        else {
            this.terrain_blocks[player_id].blocks.push(block_id);
        }
    }

    delete_from_terrain_blocks(block_id, player_id) {
        let result = this.get_terrain_blocks(player_id);
        let blocks = result.blocks;
        result.blocks = blocks.filter(x => blocks[x] != block_id);

    }

    get_blocks_by_base(base) {
        let blocks = [];
        let no_per_base = this.no_per_base;
        let bases = this.GeneratorObject.bases;
        let keys = Object.keys(this.blocks);
        let base_index = bases.indexOf(base);
        for (let i = 1; i <= no_per_base; i++) {
            blocks.push(base + i);
        }

        return blocks;
    }


    get_safe_zone_blocks(base) {
        console.log(base)
        let blocks = [];
        let no_per_base = this.no_per_base;
        let no_of_SZ_blocks = this.no_of_SZ_blocks;
        let sz_start = (no_per_base - no_of_SZ_blocks) + 1;
        for (let i = sz_start; i <= no_per_base; i++) {
            blocks.push(base + i);
            console.log("returning Safe ZOne Block", (base + i))
        }
        return blocks;
    }

    get_base(block_id) {
        return block_id.toString().substring(0,1);
    }

    distance_till_end_block(pin_id, trigger=undefined) {
        let current_pin = this.PinObject.get(undefined, pin_id);
        let current_block = current_pin.game.block;
        let end_block = current_pin.game.end_block;
        let safe_zone_trigger = current_pin.game.safe_zone.trigger;
        let distance = 0;
        if (trigger == undefined) {
            trigger = current_pin.game.safe_zone.triggered;
        }
        console.log("trigger", trigger);
        switch(trigger) {
            case Negative:
                distance = this.distance_between_blocks(current_block, safe_zone_trigger);
                distance +=this.no_of_SZ_blocks;
                break;
            case Neutral:
                distance = this.no_of_SZ_blocks;
                break;
            case Positive:
                let sz_blocks = this.get_safe_zone_blocks(current_pin.game.base);

                distance = this.no_of_SZ_blocks - (sz_blocks.indexOf(current_block) + 1);
                break;
        }

        return distance;
    }

    distance_between_blocks(first_block_id, second_block_id, include_safe=Negative) {
        let keys = this.get_blocks(include_safe);
        let sz_blocks = undefined;
        let first_base = this.get_base(first_block_id);
        let first_block_index = keys.indexOf(first_block_id);
        let second_block_index = keys.indexOf(second_block_id);
        let second_base = this.get_base(second_block_id);
        console.log("indexed", first_block_index, second_block_index, keys.length)
        let distance = 0;
        
        if (first_block_index > second_block_index) {
            // e.g 52 > 2
            //sz starts at 15
            //2nd id in 
            distance = (keys.length - first_block_index) - 1;
            distance = distance + second_block_index;
        }
        else if (first_block_index < second_block_index) {
            distance = (second_block_index - first_block_index);
            
        }
        else {
            distance = 0;
        }
        
        console.log("distance between ", first_block_id, " and second ", second_block_id, " is ", distance);
        return distance;
    }

    check_path(start_block_id, ending_block_id=undefined, pin_id, len=0) {
        let path = { clear: Neutral, blocked_at: [] };
        let pin_state = this.PinObject.pin_state;


        let start_block = this.get(start_block_id);
        let next_blocks = [start_block_id];
        console.log("start block wall", start_block)
        let current_pin = this.PinObject.get(undefined, pin_id);
        if (start_block == undefined || start_block == null) {
            return;
        }
        if (len >= 1) {
            let side_blocks = this.get_blocks_on_side(start_block_id, side.RIGHT, len);
            
            if (side_blocks.length !=undefined) {
                next_blocks = next_blocks.concat(side_blocks);
            }
            else {
                next_blocks.push(side_blocks);
            }
            
        }
        
        let i = 0;
        console.log("I is", i, " len", len);
        while (i < len) {
            console.log("I is", i, " len", len, this.GeneratorObject.get_mode_of_attack());
            //loop not functional
            let block_id = next_blocks[i];


            // console.log("Checking Wall",start_block.id,  start_block.game.wall, current_pin.player.id)
            switch(this.GeneratorObject.get_mode_of_attack()) {
                case attack_mode.LUDO:
                    let result = this.get_pins_on_block(block_id, pin_id);
                    // console.log("2 Wall Check", result);
                    if (result.wall && result.owner != current_pin.player.id) {
                        this.PinObject.update_pin_state(pin_id, pin_state.stopped);
                        if (path.clear == Neutral) path.clear = Negative; path.blocked_at.push(block_id);
                        
                    }

                    break;
                case attack_mode.BASIC:
                    if (start_block.game.wall != undefined && start_block.game.wall.level != 0) {
                        
                        let player = start_block.game.wall.owner;
                        
                        if ( player != current_pin.player.id) {
                            // there is a wall
                            let player = this.PlayerObject.get(start_block.game.wall.owner);
                            //do armour vs level here
                            // 
                            
                            path.clear = this.wall_check(block_id, pin_id);
                            if (path.clear == Negative) path.blocked_at.push(block_id);
                            console.log("Wall here", start_block, current_pin.player.id, " result", path);
                        }
                    }
                    break;
                default:
                    break;
            }

            i++
        }
        
        if (path.blocked_at.length > 0) {  path.clear = Negative }
        console.log("Result",path )
        return path;

    }


    get_pins_on_block(block_id, pin_id, player_id=undefined) {
        let current_pin = this.get(undefined,pin_id);

        let block = this.get(block_id);
        let result = {};
        // console.log("block", block, "player_id", player_id)

        if (block != undefined) {
            let pins = [];
            let pin_players = [];
        
            block.pins.forEach(pin => {
            // console.log("Pin", pin)
                if (pin.game.block == block.id) {
                    
                    // console.log("Pin", pin, "block", block)
                    if (player_id != undefined) {
                        //not used

                        // console.log("Pin", pin, "block", block, "player_id", player_id, pin.player.id)
                        //if player id is passed, get only my pins on the same block
                        if (pin.player.id == player_id) {
                            pins.push(pin.game.pin_id);
                        }
                    }
                    else {
                        pins.push(pin.game.pin_id);
                        if (pin_players.indexOf(pin.player.id) == -1) {
                            pin_players.push(pin.player.id);
                        }
                        else {
                            result[constants.WALL] = true;
                            result[constants.OWNER] = pin.player.id;
                            
                        }
                    }
                    
                    
                    // block.pins.
                }
                else {
                    //block not updated, pin not on this block
                    this.remove_pin_from_block(block.id, pin.game.pin_id);
                }
            
            });
            result['pins'] = pins;
            result['total_pins'] = block.pins.length;
            return result;
        }
    }

    get_my_blocks(player_id) {
        let blocks = [];
        let keys = Object.keys(this.blocks);
        keys.forEach((block) => {
            block = this.get(block);
            if (block.game.owner == player_id) {
                blocks.push(block.id);
            }
        });
    }

    trigger_trap(block_id, pin_id) {
        
        let block = this.get(block_id);
        // console.log("block id", block_id, block.game.trap, pin_id)
        let current_pin = this.PinObject.get(undefined, pin_id);
        
        let pin_state = this.PinObject.pin_state;
        // console.log("trap ", block.game.trap.level, "Armour", current_pin.game.armour)
        if ((block.game.trap == undefined || current_pin==null) || (block.game.trap != undefined && block.game.trap.owner == current_pin.player.id)) {
            return;
        }
        

        switch(this.GeneratorObject.mode_of_attack) {
            case attack_mode.BASIC:
                if (block.game.trap.level > current_pin.game.armour) {
                    //trap wins
                    console.log("trap wins ")
                    this.update_trap_level(block_id, (block.game.trap.level - current_pin.game.armour));
                    this.PinObject.lost(pin_id, block_id, constants.TRAP, true);
                    this.GeneratorObject.UIObject.get_logic_board(true, constants.TRAP, this)
                    
                }
                else if (block.game.trap.level < current_pin.game.armour) {
                    //trap lost
                    console.log("trap lost ");
                    this.PinObject.update_pin_armour(pin_id, (current_pin.game.armour - block.game.trap.level));
                    this.destroy(block_id, pin_id, constants.TRAP);
                }
                else if (block.game.trap.level == current_pin.game.armour) {
                    //both lost
                    console.log("trap tie ");
                    this.PinObject.lost(pin_id, block_id, constants.TRAP, true);
                    this.destroy(block_id, pin_id, constants.TRAP);
                    this.GeneratorObject.UIObject.get_logic_board(true, constants.TRAP, this)
                }
                break;
            default:
                break;
        }
    }

    destroy(block_id, pin_id, source) {
        switch (source) {
            case constants.BLOCK:
                console.log("wall lost to ", pin_id);
                this.update_wall_level(block_id, 0);
                this.UIObject.apply_css(block_id, undefined, { background: "white", color: "black" });
                break;
            case constants.TRAP:
                console.log("trap lost to ", pin_id);
                this.update_trap_level(block_id, 0);
                this.UIObject.apply_css(block_id, undefined, { background: "white", color: "black" });
                break;
        
            default:
                break;
        }
        
    }

    update_wall_level(block_id, level_value) {
        let block = this.get(block_id);
        block.game.wall.level = level_value;
    }

    update_trap_level(block_id, level_value) {
        let block = this.get(block_id);
        if (level_value == 0) {
            block.game.trap = undefined;
        }
        else {
            block.game.trap.level = level_value;
        }
        
    }

    own_wall(block_id, player_id) {
        let block = this.get(block_id);
        block.game.wall.owner = player_id;
    }
    
    wall_check(block_id, pin_id) {
        let result = Negative;
        let block = this.get(block_id);
        let current_pin = this.PinObject.get(undefined, pin_id);
        let pin_state = this.PinObject.pin_state;
        switch(this.GeneratorObject.mode_of_attack) {
            case attack_mode.BASIC:
                if (block.game.wall.level >  current_pin.game.armour) {
                    console.log("wall is more powerful");
                    this.PinObject.update_pin_state(pin_id, pin_state.stopped);
                    // this.update_wall_level(block_id, (block.game.wall.level - current_pin.game.armour));
                    // this.PinObject.lost(pin_id, block_id, constants.WALL);
                    result = Negative;
                } 
                else if (block.game.wall.level <  current_pin.game.armour) {
                    console.log("wall is less");
                    this.PinObject.update_pin_armour(pin_id, (current_pin.game.armour - block.game.wall.level));
                    this.destroy(block_id, pin_id, constants.BLOCK);
                    result = Neutral;
                    
                }
                else if (block.game.wall.level ==  current_pin.game.armour) {
                    console.log("wall equal");
                    this.PinObject.update_pin_state(pin_id, pin_state.stopped);
                    result = Negative;
                }
                break;
            default: break;
        }
        console.log("Wall Check Immediate res ", result);
        return result;
        
    }

}