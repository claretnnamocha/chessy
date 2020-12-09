class Movement {

    GeneratorObject = undefined;
    PlayerObject = undefined;
    PinObject = undefined;
    UIObject = undefined;
    BlocksObject = undefined;
    
    constructor(GeneratorObject){
        this.GeneratorObject = GeneratorObject;
        this.init();
    }

    init() {
        this.PinObject = this.GeneratorObject.getPinObject();
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
        this.UIObject = this.GeneratorObject.getUIObject();
        this.BlocksObject = this.GeneratorObject.getBlocksObject();
        console.log("Movement initialized");
    }

    

    move(box_id = 0, die, current_base, no_per_base, bases, active_pin, blocks=undefined, player=undefined, sight=1.2){
        // console.log(active_pin)
        
        let no_of_public_blocks = this.GeneratorObject.BlocksObject.no_of_public_blocks;
        let old_box_id = box_id;
        let no_of_bases = bases.length
        //total travel distance for pin
        let total_travel_distance = die;
        let path_clear = Neutral;

        
        if (!this.GeneratorObject.make_checks(active_pin)) {
            return;
        }
        
        let block = this.GeneratorObject.BlocksObject.get(active_pin.game.block);
        
        let next_block = this.GeneratorObject.BlocksObject.get_blocks_on_side(active_pin.game.block, side.RIGHT, 1);
        
        console.log("Active pin state", active_pin.game.state, block.game.terrain.active, active_pin.game.block);
        //if block's terrain is active reduce die and terrain is not mine
        if (block.game.terrain.active != Negative && block.game.owner !== active_pin.player.id) {
            die = Math.floor(die/2);
            if (die < 1){
                die = 1;
            }
        } 

        if (active_pin.game.state == this.PinObject.pin_state.stopped) {
            let result = this.GeneratorObject.BlocksObject.check_path(next_block,undefined, active_pin.game.pin_id, 1);
            path_clear = result.clear;
            console.log("Pin Already Stopped", result)
            if (result.clear == Negative ) {
                if (die != undefined && this.GeneratorObject.get_allowed_numbers().indexOf(die) == -1) {
                    this.GeneratorObject.UIObject.display_message(messages.REQUIRED_6);
                    return;
                }
                else {
                    path_clear = Positive;
                }
                
            }
            else if(result.clear == Neutral) {
                //wall isnt present anymore
                this.PinObject.update_pin_state(active_pin.game.pin_id, this.PinObject.pin_state.moving);
            }
        }

        if (active_pin.game.returned == Positive) {
            //pin has returned
            this.GeneratorObject.UIObject.display_message(messages.PIN_COMPLETED);
            return;
        }

        if (active_pin.game.info.bases >= Math.floor(bases.length /sight)) {
            //sight: 
            //check distance till pin is safe
            let distance = this.GeneratorObject.BlocksObject.distance_till_end_block(active_pin.game.pin_id);
            console.log("distance till stop", distance);
            if (die > distance) {
                //if die is greater than distance e.g die(6) - dist(4)
                //stop
                this.GeneratorObject.UIObject.display_message("Die value of " + distance + " needed.");
                // clearInterval(movement);
                return;
            }

            
        }

        if (this.GeneratorObject.get_mode_type() == mode.LUDO) {
            
            let result = this.GeneratorObject.BlocksObject.check_path(next_block,undefined, active_pin.game.pin_id, die);
            console.log("2 wall Result", result)
            path_clear = result.clear;
            if (result.clear == Negative && this.GeneratorObject.get_allowed_numbers().indexOf(die) == -1) {
                // && this.GeneratorObject.get_allowed_numbers().indexOf(die) == -1
                let blocked_at = result.blocked_at;
                let distance = this.GeneratorObject.BlocksObject.distance_between_blocks(active_pin.game.block, blocked_at[blocked_at.length - 1]);
                if (die >= distance) {
                    this.GeneratorObject.UIObject.display_message("Wall: " + distance + " blocks. please throw less than distance or a 6.");
                    return;
                }
                
            }
            else if(result.clear == Negative && this.GeneratorObject.get_allowed_numbers().indexOf(die) != -1) {
                path_clear = Positive;
            }
        }

        //current point on the board
        let point = box_id === 0 ? 1 : this.convert(box_id=box_id, undefined, no_per_base, bases, active_pin.game.pin_id, no_of_public_blocks).box_point;
        console.log("Point", point);
        //current base
        let old_base = current_base;
        //move pin based on dice roll
        // console.log("Rolled die1: " + die1 + " die2: " + die2);
        //below, get the ending point for this turn
        
        let board_point = ( point + die );
        console.log("Board Point", board_point);
        //box_id to return the id, point and base of the pin from board point
        box_id = this.convert(undefined, board_point, no_per_base, bases, active_pin.game.pin_id, no_of_public_blocks, old_base, die);
        current_base = box_id.base;
        // console.log(JSON.stringify(box_p));
        console.log("Moving to box " + box_id.box_id + "");

        return { point: box_id.point, base: current_base, box_id: box_id.box_id, starting_point: old_box_id, starting_base: old_base, path_clear: path_clear };
    }

    

    convert(box_id, board_point, no_per_base, all_base, pin_id, no_of_public_blocks, prev_base=undefined, die=undefined)
    {
        // console.log("returning", box_id, board_point, no_per_base, all_base, pin_id, no_of_public_blocks)
        let current_pin = this.PinObject.get(undefined, pin_id);
        let pin_position = this.PinObject.pin_position;
        // console.log("all_base " + all_base)
        // console.log("no per base ",no_per_base)
        // console.log("move 165", box_id);
        //if base is undefined, supply default base which is bases[0] else get base from box id
        let base = (box_id == undefined || box_id == null) ? all_base[0] : box_id.replace("#","").substring(0,1);
        //if board point is undefined pick the point from box_id else use board point value
        let point = (board_point == undefined) ? parseInt(box_id.replace("#","").substring(1)) : board_point;
        // console.log("board_point " + board_point, "box_id " + box_id);
        
        if (board_point == undefined || board_point == null)
        {
            // console.log("in  board_point");
            //use box id to calculate point in board logic
            //formula (IndexOfBase * NoPerBase) + point
            let base_num_value = 0;
            if (current_pin.game.safe_zone.triggered != Positive) {
                base_num_value = parseInt((all_base.indexOf(base) * no_of_public_blocks));
            }
            else {
                base_num_value = parseInt((all_base.indexOf(base) * no_per_base));
            }
            
            return {box_point: (base_num_value + parseInt(point))};
        }
        
        if (box_id == undefined || box_id == null)
        {
            let total_point = 0;
            if (current_pin.game.safe_zone.triggered != Positive) {
                //get max point in board
                total_point = all_base.length * no_of_public_blocks;
                //no of bases pin has currently passed
                let passed_bases = current_pin.game.info.bases;
                console.log("Passed bases", passed_bases)

                console.log("move js", point, total_point);
                if (point > total_point) 
                {
                    point = point - total_point;
                }
                // console.log("move js", point);
                //use point to get box id
                //formula base = (point/NoPerBase) to lower
                //point = (point - (NoPerBase * base))
                // let prev_base = base;
                base = Math.floor(((point - 1)/no_of_public_blocks));
                //for last layer base would be = to length of all bases
                //set base value to last base
                if (base == all_base.length) {
                    base = all_base.length -1;
                }
                base = all_base[base];
                //b2 == 16
                //16/14 = 1 ..2
                //13/14 0 ..9
                //56/14 = 4
                // 1 ..2 = bases[1] point 2 
                //0 ..9 = bases[0] point 13
                //4 ..0 = bases[4] point 0 reverted = bases[3]

                //new point would be
                point = (point - (no_of_public_blocks * all_base.indexOf(base)));
                if (point === 0) {
                    //default pin location is [base]0
                    //i.e point should be 1
                    point = 1;
                }
                // console.log("convert point " + point);
                box_id =  base + point;
                console.log("Moving to ", box_id);
                //4(d) + 2(b)
                // passed_bases += all_base.indexOf(base) + 1;
                let base_position = all_base.indexOf(base) + 1;
                let prev_base_position = all_base.indexOf(prev_base) + 1;
                //get no of bases pin is predicted to pass
                if (prev_base_position > base_position) {
                    //formula PaB = passed_bases, PrB = prev_base, BP = base_position
                    //if base = A, PrB = C, all_bases = [A,b,c,d]
                    //PaB = PaB + (lenOfAllBase - PrB) + BP
                    //PaB = PaB + (4 - (2+1)) + (0+1)
                    //PaB = PaB + (1) + 1
                    //PaB = PaB + 2
                    passed_bases += ((all_base.length - prev_base_position) + base_position);
                }
                else if(prev_base_position == base_position) {
                    if (die > no_per_base) {
                        //if die is greater than no_per_base then calculate how many bases passed
                        passed_bases += ((all_base.length - prev_base_position) + base_position);
                    }
                    
                }
                else if (prev_base_position < base_position) {
                    //if base = C, PrB = A, all_bases = [A,b,c,d]
                    //PaB = PaB + BP - PrB
                    //e.g PaB = PaB + (2+1) - (0+1) == (3) - (1) = 2
                    //PaB = PaB + 2
                    passed_bases += ( base_position -  prev_base_position);
                }
                
                console.log("Passed bases", passed_bases)
                //pin would be returning
                if (passed_bases >= (all_base.length)) {
                    //Pin has gone min of once around all bases
                    if (all_base.indexOf(base) >= all_base.indexOf(current_pin.game.base) ) {
                        let safe_zone_trigger_point = current_pin.game.safe_zone.trigger.replace(current_pin.game.base, '');
                        //if point (A4) >= sztp(A1)
                        if (point >= safe_zone_trigger_point && current_pin.game.position == pin_position.board) {
                            //pin is returning re route
                            //ed = 4 - 1 = 3
                            let extra_distance = point - safe_zone_trigger_point;
                            //get safe zone blocks
                            let sz_blocks = this.GeneratorObject.BlocksObject.get_safe_zone_blocks(current_pin.game.base);
                            let splice = undefined;
                            //get safe zone blocks to append
                            if (sz_blocks.length > extra_distance) {
                                //get sz blocks up to ed
                                splice = sz_blocks.splice(0, extra_distance)
                            }
                            else {
                                splice = sz_blocks;
                            }
                            if (splice.length > 0) {
                                //change pin base
                                base = splice[splice.length - 1].substring(0, 1);
                                //update point
                                point = splice[splice.length - 1].replace(base, '');
                                //reroute pin
                                box_id = base + point;
                            } 
                        }
                    }
                }
            }
            else {
                //get max point in board
                total_point = all_base.length * no_per_base;

                console.log("sz move js", point, no_per_base, total_point);
                if (point > total_point) 
                {
                    point = point - total_point;
                }
                // console.log("move js", point);
                //use point to get box id
                //formula base = (point/NoPerBase) to lower
                //point = (point - (NoPerBase * base))
                // let prev_base = base;
                base = Math.floor(((point - 1)/no_per_base));
                console.log("Else base", base)
                //for last layer base would be = to length of all bases
                //set base value to last base
                if (base == all_base.length) {
                    base = all_base.length -1;
                }
                base = all_base[base];
                console.log("Else base II", base)
                //b2 == 16
                //16/14 = 1 ..2
                //13/14 0 ..9
                //56/14 = 4
                // 1 ..2 = bases[1] point 2 
                //0 ..9 = bases[0] point 13
                //4 ..0 = bases[4] point 0 reverted = bases[3]

                //new point would be
                point = (point - (no_per_base * all_base.indexOf(base)));
                console.log("Else Point", point)
                if (point === 0) {
                    //default pin location is [base]0
                    //i.e point should be 1
                    point = 1;
                }
                console.log("Else Point", point)
                // console.log("convert point " + point);
                box_id =  base +""+ point;
            }
            
            
            return {base: base, point: parseInt(point), box_id: box_id};
        }
        return null;
    }

    get_next_base(all_base, next_base, no_of_bases)
    {
        let base = undefined;
        if (next_base >= no_of_bases)
        {
            //completed movement
            base = bases[no_of_bases - 1];
        }
        else
        {
            //then move to the next base
            base = bases[next_base];
        }
        return base;
    }
}
