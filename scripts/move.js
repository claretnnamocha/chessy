class Movement {
    
    constructor(GeneratorObject){
        this.GeneratorObject = GeneratorObject;
        this.PinObject = this.GeneratorObject.getPinObject();
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
    }

    GeneratorObject = undefined;
    PlayerObject = undefined;
    PinObject = undefined;

    move(box_id = 0, die1, die2, current_base, no_per_base, bases, blocks=undefined, player=undefined){
        console.log("move 14", player)

        let old_box_id = box_id;
        let no_of_bases = bases.length
        //total travel distance for pin
        let total_travel_distance = die1 + die2;
        
        //current point on the board
        let point = box_id === 0 ? 0 : this.convert(box_id=box_id, undefined, no_per_base, bases).box_point;
        console.log("move 20", box_id, point)
        //current base
        let old_base = current_base;
        //move pin based on dice roll
        console.log("Rolled die1: " + die1 + " die2: " + die2);
        //below, get the ending point for this turn
        
        let board_point = ( point + total_travel_distance );
        console.log(board_point)
        //box_id to return the id, point and base of the pin from board point
        box_id = this.convert(undefined, board_point, no_per_base, bases);
        current_base = box_id.base;
        console.log(box_id);
        // console.log(JSON.stringify(box_p));
        console.log("Moving to box " + box_id.box_id + "");
        
        
        
        if(blocks != undefined && player != undefined) {
            this.GeneratorObject.PinObject.update_pins(old_box_id, box_id.box_id, player, blocks, bases);
        }

        return { point: box_id.point, base: current_base, box_id: box_id.box_id, starting_point: old_box_id, starting_base: old_base };
    }

    

    convert(box_id, board_point, no_per_base, all_base)
    {
        console.log("all_base " + all_base)
        console.log("no per base ",no_per_base)
        console.log("move 165", box_id);
        //if base is undefined, supply default base which is bases[0] else get base from box id
        let base = (box_id == undefined || box_id == null) ? all_base[0] : box_id.replace("#","").substring(0,1);
        //if board point is undefined pick the point from box_id else use board point value
        let point = (board_point == undefined) ? parseInt(box_id.replace("#","").substring(1)) : board_point;
        // console.log("board_point " + board_point, "box_id " + box_id);
        
        if (board_point == undefined || board_point == null)
        {
            console.log("in  board_point");
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

// function move(box_id = 0, die1, die2, current_base, no_per_base, bases){
//     let no_of_bases = bases.length
//     //total travel distance for pin
//     let total_travel_distance = die1 + die2;
//     //current point on the board
//     let point = box_id === 0 ? 0 : convert(box_id=box_id, box_no=undefined, no_per_base, bases).box_id;
//     //current base
//     let base = current_base;
//     //next base
//     let next_base = (bases.indexOf(base) + 1);
// 	//move pin based on dice roll
//     console.log("Rolled die1: " + die1 + " die2: " + die2);
//     //get supposed box id for this pin
//     let box_p = convert(undefined, box_no = ( point + total_travel_distance ), no_per_base, bases);
//     // console.log(JSON.stringify(box_p));
//     console.log("Moving to box " + box_p.box_id + "");
// 	for (let i=1; i < total_travel_distance; i++)
//     {
// 		if (point >= (total_travel_distance + point))
// 		{
// 			break;
// 		}
		
// 		if (point > no_per_base)
// 		{
// 			base = next_base;
// 		}
		
// 		if (point === 0)
// 		{
// 			point = 1;
// 		}		
		
// 		point++;
//     }
    
//     return { point: point, base: base, box_id: box_p.box_id, starting_point: box_id, starting_base: current_base };
// }

// function ui_move(pin_class, pin_html, container, current, dice_value, no_per_base, current_base, bases)
// {
//     // total number of bases
//     let no_of_bases = bases.length;
//     //use interval to move pin class
//     //init point on the board
//     let init_point = convert(current, undefined, no_per_base, bases).box_id;
//     // console.log("init point " + init_point);
//     // console.log("stop at point " + (init_point + dice_value));
//     //current point on the board but controlled by no_per_base
//     //at NPB, point gets reset
//     let point = current.replace("#").substring(1);
//     //current point on the board ignoring no_per_base
//     let board_point = (init_point == 0) ? 1 : init_point + 1;
//     //current base
//     let base = current_base;
//     //next base
//     let next_base = (bases.indexOf(base) + 1);
//     //used to clear point 1 of the board
//     let manual_reset = false;

//     let movement = setInterval(() => {
	
//         console.log(board_point, "total " + (parseInt(init_point) + parseInt(dice_value)));

//         if(parseInt(board_point) >= (no_per_base * bases.length))
//         {
//             console.log("Game Ended");
//             clearInterval(movement);
//         }

//         if (point >= no_per_base)
//         {
//             container.children("#" + base + no_per_base).find(pin_class).remove();
//             //get next base
//             base = get_next_base(bases, next_base);
//             //if point is 1 and movement stops there
//             if (parseInt(board_point) === (parseInt(init_point) + parseInt(dice_value)))
//             {
//                 console.log("stopping");
//                 // container.children("#" + base + 1).html(pin_html);
//                 container.children("#" + base + 1).html(pin_html);
//                 clearInterval(movement);
//             }
//             else{
//                 console.log("Point exceed " + point);
//                 //remove pin at last point
//                 // container.children("#" + base + (parseInt(point) - 1)).find(pin_class).remove();
                
//                 //reset point
//                 point = 1;
                
                
//                 if (next_base == bases[bases.length - 1])
//                 {
//                     //completed board movement
//                     console.log("board completed");
//                     clearInterval(movement);
//                 }

//                 container.children("#" + base + parseInt(point)).html(pin_html);
//                 manual_reset = true;
                
//             }
//         }
//         else
//         {
//             if (manual_reset) {
//                 container.children("#" + base + (parseInt(point) - 1)).find(pin_class).remove();
//                 manual_reset = false;
//             }
            
//             //if current point is equal to ( old point + dice value) then movement is complete
//             if (parseInt(board_point) === (parseInt(init_point) + parseInt(dice_value)))
//             {
//                 clearInterval(movement);
//             }

//             if(point == 0)
//             {
//                 //if point is zero start moving on the board at point 1
//                 container.children("#" + base + (1)).html(pin_html);
//             }
//             else
//             {
//                 //remove old pin
//                 container.children("#" + base + (point)).find(pin_class).remove();
//                 //recreate pin on new box
//                 container.children("#" + base + (parseInt(point) + 1)).html(pin_html);
//             }
//             point++;
//         }
        
//         //increase the point on the board and the logical board
//         board_point++;
        
        
//     }, 300);
// }


// function convert(box_id, box_no, no_per_base, all_base)
// {
//     console.log(all_base)
// 	let base = (box_id == undefined || box_id == null) ? all_base[0] : box_id.replace("#","").substring(0,1);
// 	let point = (box_no == undefined) ? box_id.replace("#","").substring(1) : box_no;
// 	// console.log("box_no " + box_no, "box_id " + box_id);
	
// 	if (box_no == undefined || box_no == null)
// 	{
//         console.log("in  box_no");
// 		//use box id to calculate point in board logic
// 		//formula (IndexOfBase * NoPerBase) + point
// 		return {box_id: parseInt((all_base.indexOf(base) * no_per_base) + parseInt(point))};
// 	}
	
// 	if (box_id == undefined || box_id == null)
// 	{
// 		//formula base = (point%NoPerBase) 
// 		//point = (point - (NoPerBase * base))
// 		base = Math.floor((point/no_per_base));
// 		base = all_base[base];
		
// 		point = (point - (no_per_base * all_base.indexOf(base)));
// 		// console.log("convert point " + point);
// 		box_id =  base +""+ point;
		
// 		return {base: base, point: parseInt(point), box_id: box_id};
// 	}
// 	return null;
// }
// function get_next_base(all_base, next_base){
//     let base = undefined;
//     if (next_base >= all_base.length)
//     {
//         //completed movement
//         base = bases[all_base.length - 1];
//     }
//     else
//     {
//         //then move to the next base
//         base = bases[next_base];
//     }
//     return base;
// }

