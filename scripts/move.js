class Movement {

    GeneratorObject = undefined;
    PlayerObject = undefined;
    PinObject = undefined;
    UIObject = undefined;
    
    constructor(GeneratorObject){
        this.GeneratorObject = GeneratorObject;
        this.PinObject = this.GeneratorObject.getPinObject();
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
        this.UIObject = this.GeneratorObject.getUIObject();
    }

    

    move(box_id = 0, die1, die2, current_base, no_per_base, bases, blocks=undefined, player=undefined){
         //if game isnt ongoing stop interval
         switch(this.GeneratorObject.get_game_status()) {
            case game_status.STARTING:
                clearInterval(movement);
                this.UIObject.display_message(messages.GAME_ENDED);
                return;
            case game_status.STARTING:
                clearInterval(movement);
                this.UIObject.display_message(messages.INVALID_ACTION);
                return;
            default:
                break;
        }

        let old_box_id = box_id;
        let no_of_bases = bases.length
        //total travel distance for pin
        let total_travel_distance = die1 + die2;
        
        //current point on the board
        let point = box_id === 0 ? 0 : this.convert(box_id=box_id, undefined, no_per_base, bases).box_point;
        //current base
        let old_base = current_base;
        //move pin based on dice roll
        // console.log("Rolled die1: " + die1 + " die2: " + die2);
        //below, get the ending point for this turn
        
        let board_point = ( point + total_travel_distance );
        //box_id to return the id, point and base of the pin from board point
        box_id = this.convert(undefined, board_point, no_per_base, bases);
        current_base = box_id.base;
        // console.log(JSON.stringify(box_p));
        console.log("Moving to box " + box_id.box_id + "");

        return { point: box_id.point, base: current_base, box_id: box_id.box_id, starting_point: old_box_id, starting_base: old_base };
    }

    

    convert(box_id, board_point, no_per_base, all_base)
    {
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
            let base_num_value = parseInt((all_base.indexOf(base) * no_per_base));
            
            return {box_point: (base_num_value + parseInt(point))};
        }
        
        if (box_id == undefined || box_id == null)
        {
            // ##

            let total_point = all_base.length * no_per_base;
            console.log("move js", point);
            if (point > total_point) 
            {
                point = point - total_point;
            }
            console.log("move js", point);
            //use point to get box id
            //formula base = (point/NoPerBase) to lower
            //point = (point - (NoPerBase * base))
            base = Math.floor((point/no_per_base));
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
            point = (point - (no_per_base * all_base.indexOf(base)));
            if (point === 0) {
                //default pin location is [base]0
                //i.e point should be 1
                point = 1;
            }
            // console.log("convert point " + point);
            box_id =  base +""+ point;
            
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
