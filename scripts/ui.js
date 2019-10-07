class UserInterface {
    GeneratorObject = undefined;
    pin_classes = ["red_pin", "green_pin", "blue_pin", "yellow_pin"];

    
    constructor(GeneratorObject){
        this.GeneratorObject = GeneratorObject;
    }

    ui_move(pin_html, pin_id, container, current, dice_value, no_per_base, current_base, bases, GeneratorObject, player)
    {
        // NPB = no_per_base

        // total number of bases
        let no_of_bases = bases.length;
        //use interval to move pin class
        //init point on the board
        let init_point = GeneratorObject.MoveObject.convert(current, undefined, no_per_base, bases).box_point;
        // console.log("init point " + init_point);
        // console.log("stop at point " + (init_point + dice_value));
        //current point on the board but controlled by NPB
        //at NPB, point gets reset
        let point = current.replace("#").substring(1);
        //current point on the board ignoring NPB
        let board_point = (init_point == 0) ? 1 : init_point + 1;
        //current base
        let base = current_base;
        //next base
        let next_base = (bases.indexOf(base) + 1);
        //used to clear point 1 of the board
        let manual_reset = false;
        let active_pin = GeneratorObject.PinObject.get(player.id);

        let movement = setInterval(() => {
        
            if (active_pin != null && active_pin.game.returned === Neutral && base === active_pin.game.base) {
                if (active_pin.game.end_block === (base +""+ point)) {
                    console.log("returned home.");
                    active_pin.game.returned = Postive;
                    clearInterval(movement);
                    return;
                }
                console.log("move 79", (base +""+ point));
            }

            console.log(board_point, "total " + (parseInt(init_point) + parseInt(dice_value)));

            if(parseInt(board_point) === (no_per_base * no_of_bases) + 1)
            {

                console.log("returning");
                active_pin.game.returned = Neutral;
                next_base = 0;
            }

            if (point >= no_per_base)
            {
                container.children("#" + base + no_per_base).find(pin_id).remove();
                //get next base
                base = GeneratorObject.MoveObject.get_next_base(bases, next_base, no_of_bases);
                //update next_base value
                next_base = bases.indexOf(base) + 1
                //if point is 1 and movement stops there
                if (parseInt(board_point) === (parseInt(init_point) + parseInt(dice_value)))
                {
                    console.log("stopping");
                    // container.children("#" + base + 1).html(pin_html);
                    container.children("#" + base + 1).append(pin_html);
                    clearInterval(movement);
                }
                else{
                    console.log("Point exceed " + point);
                    //remove pin at last point
                    // container.children("#" + base + (parseInt(point) - 1)).find(pin_class).remove();
                    
                    //reset point
                    point = 1;
                    
                    
                    if (next_base == bases[no_of_bases - 1])
                    {
                        //completed board movement
                        console.log("board completed");
                        clearInterval(movement);
                    }

                    container.children("#" + base + parseInt(point)).append(pin_html);
                    manual_reset = true;
                    
                }
            }
            else
            {
                if (manual_reset) {
                    // ##
                    container.children("#" + base + (parseInt(point) - 1)).find(pin_id).remove();
                    manual_reset = false;
                }
                
                //if current point is equal to ( old point + dice value) then moveing the pin is complete
                if (parseInt(board_point) === (parseInt(init_point) + parseInt(dice_value)))
                {
                    console.log("uimove 141",JSON.stringify(GeneratorObject.blocks));
                    clearInterval(movement);
                }

                if(point == 0)
                {
                    //if point is zero start moving on the board at point 1
                    container.children("#" + base + (1)).append(pin_html);
                }
                else
                {
                    //remove old pin
                    container.children("#" + base + (point)).find(pin_id).remove();
                    //recreate pin on new box
                    container.children("#" + base + (parseInt(point) + 1)).append(pin_html);
                }
                point++;
            }
            
            //increase the point on the board and the logical board
            board_point++;
            
            
        }, 300);
    }

    remove_from_base(parent_id, pin_id) {
        if (!pin_id.startsWith("#")) {
            pin_id = "#" + pin_id;
        }

        let element = $("#" + parent_id).children(pin_id);
        element.remove();
        //update pins object
        let positions = this.GeneratorObject.PinObject.pin_position;
        this.GeneratorObject.PinObject.update_position(pin_id, positions.board);
        
        // $("#" + parent_id).children().each(function() {
        //     console.log(this.value);
        //     let current_element = $(this);
        //     if (current_element.attr("id") == pin_id) {
                
        //     }
        //     console.log(parent_id);
        // }); 

        // let a = base_classes.children("#" + this.base_class).find("#" + pin_id);
        // console.log(a);
    }

    get_pin_parent(pin_id) {
        if (!pin_id.startsWith("#")) {
            pin_id = "#" + pin_id;
        }

        return $(pin_id).parent().attr("id");
    }
}