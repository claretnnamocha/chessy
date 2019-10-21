class UserInterface {
    GeneratorObject = undefined;
    MoveObject = undefined;
    pin_classes = ["red_pin","blue_pin", "green_pin", "yellow_pin"];
    //pin_default holds the initial properties and attributes of said pin
    //to be used in returning the pin to base
    pin_default = {}

    
    constructor(GeneratorObject){
        this.GeneratorObject = GeneratorObject;
        this.MoveObject = GeneratorObject.getMoveObject();
    }

    display_message(message) {
        alert(message);
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

        let blocks = GeneratorObject.blocks;

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

                    if(blocks != undefined && player != undefined) {
                        let old_box_id = "#" + base + parseInt(point - 1);
                        let box_id = ("#" + base + parseInt(point));
                        
                        
                        this.GeneratorObject.PinObject.update_pins(old_box_id, box_id, player, blocks, bases);
                    }
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
                //update pin info
                if(blocks != undefined && player != undefined) {
                    let old_box_id = "#" + base + parseInt(point);
                    let box_id = ("#" + base + parseInt(point) + 1);
                    
                    
                    this.GeneratorObject.PinObject.update_pins(old_box_id, box_id, player, blocks, bases);
                }
                point++;
            }
            
            //increase the point on the board and the logical board
            board_point++;
            
            
        }, 300);
    }

    remove_from_base(parent_id, pin_id) {
        let _pin_id = this.append_attr(pin_id);
        
        let _parent_id = this.append_attr(parent_id);

        // alert(JSON.stringify($(_parent_id)))
        let element = $(_parent_id).find(_pin_id);
        
        this.pin_default[_pin_id] = { element: element, parent: _parent_id };
        console.log("$pin", element);
        console.log("$pin", element.attr("id"));
        this.force_remove(element.attr("id"))

        // element.remove();  
        // element.css("background","hue")
        // $(parent_id).children(_pin_id).css("background","pink");
        // $(_pin_id).remove();
        // alert(JSON.stringify($(_parent_id)));
        // $(parent_id).find(_pin_id).remove();
        // $(parent_id).append(element);
        //update pins object
        
        let positions = this.GeneratorObject.PinObject.pin_position;
        this.GeneratorObject.PinObject.update_position(pin_id, positions.board);
    }
    add_to_base(pin_id) {
        let _pin_id = this.append_attr(pin_id);
        let current_pin = this.GeneratorObject.PinObject.get(undefined, pin_id);
        

        console.log("addtobase", JSON.stringify(this.pin_default), _pin_id )
        if (Object.keys(this.pin_default).includes(_pin_id)) {
            let parent = this.pin_default[_pin_id].parent;
            let element = this.pin_default[_pin_id].element;
            console.log("add to base", this.pin_default, parent,element );
            if (current_pin != undefined) {
                //remove pin from current block its on
                let current_block = current_pin.game.block;
                console.log("ui 165", $("#" + current_block).children(), "curr b " + current_block, "pd " + pin_id);
                this.force_remove(current_pin.game.pin_id);
                // _pin_id .children()
                // this.GeneratorObject.container.children("#" + current_block).find(".red_pin").css("background", "pink");
                // let pin_block = this.GeneratorObject.container.children("#" + current_block).children("#4").css("background", "pink");
                //pin_block.remove();
                // console.log("pin_block", pin_block);
                // $("#" + current_block).find(_pin_id).remove();
            }
            //send pin to base
            // $(parent).append(element);
        }
        else {
            this.display_message(messages.PIN_INFO_NOT_FOUND);
        }

    }

    get_pin_parent(pin_id) {
        pin_id = this.append_attr(pin_id);

        return $(pin_id).parent().attr("id");
    }
    append_attr(value, type="id") {
        if (type === "id") {
            if (!value.toString().startsWith("#")) {
                value = "#" + value;
            }
            return value
        }
    }

    force_remove(value, type="id") {
        let element = undefined;
        switch(type) {
            case "id":
                try {
                    element = document.getElementById(value);
                    console.log("force remove", document.getElementById("blue_pin4"), "value passed", value, element);
                    element.remove();
                }
                catch {

                }
                
                
                break;
            case "class":
                element = document.getElementsByClassName(value);
                console.log("force remove", element);
                element.remove();
                break;
            default:
                break;
        }
    }
}