class UserInterface {
    GeneratorObject = undefined;
    MoveObject = undefined;
    PinObject = undefined;
    pin_classes = ["red_pin","blue_pin", "green_pin", "yellow_pin"];
    //pin_default holds the initial properties and attributes of said pin
    //to be used in returning the pin to base
    pin_default = {}

    last_message = "";

    
    constructor(GeneratorObject){
        this.GeneratorObject = GeneratorObject;
        this.init();
        
    }

    init() {
        this.MoveObject = this.GeneratorObject.getMoveObject();
        this.PinObject = this.GeneratorObject.getPinObject();
        console.log("UI initialized.");
    }

    override(action, value) {
        let player = this.GeneratorObject.PlayerObject.get(value.player_id);
        switch (action) {
            case publish_action.display_message:
                // console.log("in UI messages")
                this.display_message(value.message, value.type, false, true, value.player_id);
                break;
        }
    }

    display_message(message, type=Neutral, emit_message=false, is_emitted_message=false, message_from=this.GeneratorObject.get_active_player()) {
        // alert(message);
        let message_display = $('#message_display');
        let html_content = this.return_html(undefined,undefined,"span", message)
        // console.log(message_display)
        switch (type) {
            case Positive:
                    html_content = "<span style='color:green'>" + message + "</span>";
                break;
            case Neutral:
                    html_content = "<span style='color:black'>" + message + "</span>";
                break;
            case Negative:
                    html_content = "<span style='color:red'>" + message + "</span>";
                break;
        
            default:
                break;
        }
        
        // console.log(html_content);
        if (emit_message && this.GeneratorObject.get_player() == message_from){
            // emit_message
            this.GeneratorObject.publish({ message: message, type: type }, publish_action.display_message, publish_source.ui);
            // message_display.prepend(html_content + " <br/>");
        } 
        else {
            
            if (this.GeneratorObject.get_player() == message_from) {
                if (html_content != this.last_message) {
                    // message_display.prepend(html_content + " <br/>");
                    this.last_message = html_content;
                } 
            }   
        }

        if (is_emitted_message && this.GeneratorObject.get_player() != message_from) {
            // message_display.prepend(html_content + " <br/>");
        }
        message_display.prepend(html_content + " <br/>");

    }

    get_logic_board(log=true, section=constants.PIN, BlocksObject) {
        let res = undefined;

        let keys = Object.keys(BlocksObject.blocks);
        switch (section) {
            case constants.PIN:
                if (log) {
                    res = "";
                    keys.forEach(key => {
                        res += `------\nkey: ${key}, pins: ${JSON.stringify(BlocksObject.blocks[key].pins)} \n`
                    });
                }
                else {
                    res = {};
                    keys.forEach(key => {
                        res[key] = BlocksObject.blocks[key].pins;
                    });
                }
                
            break;
        
        case constants.ALL:
             if (log) {
                res = "";
                keys.forEach(key => {
                    res += `------\nkey: ${key}, all: ${JSON.stringify(BlocksObject.blocks[key])} \n`
                });
             }
             else {
                res = {};
                keys.forEach(key => {
                    res[key] = BlocksObject.blocks[key];
                });
             }
            
            break;
        case constants.WALL:
                if (log) {
                    res = "";
                    keys.forEach(key => {
                        res += `------\nkey: ${key}, wall: ${JSON.stringify(BlocksObject.blocks[key].game.wall)} \n`
                    });
                }
                else {
                    res = {};
                    keys.forEach(key => {
                        res[key] = BlocksObject.blocks[key].game.wall;
                    });
                }
                
                break;
        case constants.BLOCK:
                if (log) {
                    res = "";
                    keys.forEach(key => {
                        res += `------\nkey: ${key}, wall: ${JSON.stringify(BlocksObject.blocks[key])} \n`
                    });
                }
                else {
                    res = {};
                    keys.forEach(key => {
                        res[key] = BlocksObject.blocks[key];
                    });
                }
                
                break;
            case constants.TERRAIN:
                if (log) {
                    res = "";
                    keys.forEach(key => {
                        res += `------\nkey: ${key}, wall: ${JSON.stringify(BlocksObject.blocks[key].game.terrain)} \n`
                    });
                }
                else {
                    res = {};
                    keys.forEach(key => {
                        res[key] = BlocksObject.blocks[key].game.terrain;
                    });
                }
                
                break;
        case constants.TRAP:
                if (log) {
                    res = "";
                    keys.forEach(key => {
                        res += `------\nkey: ${key}, trap: ${JSON.stringify(BlocksObject.blocks[key].game.trap)} \n`
                    });
                }
                else {
                    res = {};
                    keys.forEach(key => {
                        res[key] = BlocksObject.blocks[key].game.trap;
                    });
                }
                
                break;
        case constants.GENERATOR:
                res = this.GeneratorObject.return_basic_info();
                break;
        default:
            break;
        }
        if (log) console.log("Board:\n", res);
        return log;
    }

    update_pins(curent_point, old_point, player, blocks, bases, current_base, old_base) {
        let old_box_id =  old_base + old_point;
        let box_id = (current_base + curent_point);
        // console.log("UPDATE PINS", curent_point, old_point, player, blocks, bases, current_base, old_base);
        this.PinObject.update_pins(old_box_id, box_id, player, blocks, bases);
    }

    remove_from_base(parent_id, pin_id, send_to_board=Negative, pin_html=undefined, blocks=undefined, bases=undefined) {
        
        let _pin_id = this.append_attr(pin_id);
        let active_pin = this.PinObject.get(undefined, pin_id);
        console.log("pin_id", pin_id, active_pin);
        if (!this.GeneratorObject.make_checks(active_pin, constants.REMOVE_FROM_BASE, undefined, undefined, true)) {
            console.log("UI failed")
            return;
        }
        console.log("pin_id", pin_id, active_pin);
        let player = active_pin.player;
        
        let _parent_id = this.append_attr(parent_id);

        // alert(JSON.stringify($(_parent_id)))
        let element = $(_parent_id).find(_pin_id);
        
        this.pin_default[_pin_id] = { element: element, parent: _parent_id };
        this.force_remove(element.attr("id"));
        if (send_to_board == Positive && active_pin != null) {
            this.GeneratorObject.container.children(this.append_attr(active_pin.game.start_block)).append(pin_html);
            this.PinObject.update_pins(active_pin.game.block, active_pin.game.start_block, player, blocks, bases)
            
            // this.GeneratorObject.BlocksObject.blocks[active_pin.game.start_block].pins.push(active_pin);
            // active_pin.game.block = active_pin.game.start_block;
            console.log("Removing ", blocks, active_pin);
            this.PinObject.update_position(active_pin.game.pin_id, this.PinObject.pin_position.board);
            this.PinObject.add_to_block(blocks, active_pin.game.start_block, active_pin)
            
            // this.PinObject.update_pin_state(pin_id, this.PinObject.pin_state.standby);
        }

        //update pins object
        
        let positions = this.GeneratorObject.PinObject.pin_position;
        this.GeneratorObject.PinObject.update_position(pin_id, positions.board);
    }

    add_to_base(pin_id, type="id") {
        let _pin_id = this.append_attr(pin_id);
        let current_pin = this.GeneratorObject.PinObject.get(undefined, pin_id);
        

        console.log("addtobase", this.pin_default, _pin_id )
        if (Object.keys(this.pin_default).includes(_pin_id)) {
            let parent_id = this.pin_default[_pin_id].parent;
            let element = this.pin_default[_pin_id].element;
            $(parent_id).append(element);
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

    force_remove(value, type="id", pin_id=undefined) {
        let element = undefined;
        let active_pin = (pin_id != undefined) ? this.PinObject.get(undefined, pin_id) : null;
        // if (type == undefined) type = "id";
        // console.log("active active", active_pin)
        switch(type) {
            case "id":
                try {
                    if (pin_id == undefined) {
                        element = document.getElementById(value);
                        // console.log("force remove", $(".container").children(this.append_attr(active_pin.game.block)).children("#"+value), "value passed", value, element);
                        element.remove();
                    }
                    else {
                        if (active_pin != null) {
                            element = $(this.GeneratorObject.container).children(this.append_attr(active_pin.game.block)).children(this.append_attr(active_pin.game.pin_id));
                            element.remove(); 
                        }
                        
                    }
                    
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

    remove_pin(id, id_type="id", parent, parent_type, active_pin) {
        let element = $(this.append_attr(parent, parent_type)).children(this.append_attr(active_pin.game.block)).children(this.append_attr(id, id_type));
        if (element != undefined || element != null) {
            element.remove();
        } 
    }

    replicate(render_on, html_content) {
        $(render_on).append(html_content);
    }

    return_html(id=undefined, class_name=undefined, element=undefined, content=undefined) {
        let html_content = undefined;
        if (id != undefined && class_name !=undefined) {
            html_content = "<" + element + " class='" + class_name + "' id='" + id + "'></" + element + ">";
        }
        else if(id != undefined && class_name == undefined) {
            html_content = "<" + element + " id='" + id + "'></" + element + ">";
        }
        else if(id == undefined && class_name != undefined) {
            html_content = "<" + element + " class='" + class_name + "'></" + element + ">";
        }
        else {
            html_content = "<"+ element +"></" + element + ">"
        }
        // console.log(html_content)
        return html_content;
    }

    create_element(element_type="button", styling={}, action=undefined, inner_text, element_id=undefined,element_class=undefined) {
        let element = document.createElement(element_type);
        if (action != undefined) {
            element.onclick = () => {
                action();
            };
        }
        
        element.innerText = inner_text;
        if (element_id != undefined) element.setAttribute("id", element_id);
        if (element_class != undefined) element.setAttribute("class", element_class);
        if (styling != {}) {
            this.apply_css(element, undefined, styling, constants.GENERATED);
            // let keys = Object.keys(styling);
            // keys.forEach(key => {
            //     element.style.setProperty(key, styling[key]);
            // });
        } 
        // console.log("returning element ", element_type, element)
        return element;
    }
    
    apply_css(_element, type=constants.ID, styling={}, element_type=constants.HTML) {
        let element = (element_type == constants.GENERATED) ? _element : undefined;
        if (element_type == constants.HTML) {
            switch(type) {
                case constants.ID:
                    element = document.getElementById(_element);
                    break;
                case constants.CLASS:
                    element = document.getElementsByClassName(_element);
                    break;
            }
        }
        
        if (styling != {}) {
            let keys = Object.keys(styling);
            keys.forEach(key => {
                element.style.setProperty(key, styling[key]);
            });
        }
        
    }

}

class ui_move {
    PinObject=undefined;
    UIObject=undefined;
    GeneratorObject=undefined;
    die_value = undefined;
    id =undefined;
    path_clear = Neutral;
    constructor(GeneratorObject, die_value, id, path_clear) {
        console.log("New intance ", id)
        this.PinObject = GeneratorObject.getPinObject();
        this.UIObject = GeneratorObject.getUIObject();
        this.GeneratorObject = GeneratorObject;
        this.die_value = die_value;
        this.id = id;
        this.path_clear = path_clear;
        // console.log("Path Clear ", this.path_clear)
        // this.ui_move(pin_html, pin_id, container, current, die_value, no_per_base, current_base, bases, stopping_block, GeneratorObject, player);
    }

    move(pin_html, pin_id, container, current, current_base, bases, stopping_block, GeneratorObject, player)
    {
        let current_pin = GeneratorObject.PinObject.get(undefined, pin_id);
        let no_per_base = GeneratorObject.BlocksObject.no_per_base;
        let no_of_public_blocks = GeneratorObject.BlocksObject.no_of_public_blocks;
        let die_value = this.die_value;
        // NPB = no_per_base
        // total number of bases
        let no_of_bases = bases.length;
        //use interval to move pin class
        //init point on the board
        let init_point = GeneratorObject.MoveObject.convert(current, undefined, no_of_public_blocks, bases, pin_id, no_of_public_blocks).box_point;
        //at NPB, point gets reset
        let point = current.replace("#").substring(1);
        //current point on the board ignoring NPB
        let board_point = (init_point == 0) ? 1 : init_point + 1;
        //current base
        let base = current_base;
        //next base
        let next_base = (bases.indexOf(base) + 1);
        //used to manually update/reset info
        let manual_reset = { status:false, value: {} };
        
        this.UIObject = GeneratorObject.getUIObject();
        pin_id = this.UIObject.append_attr(pin_id)

        let blocks = GeneratorObject.BlocksObject.blocks;
        let pin_state = this.PinObject.pin_state;
        //pin path clear default to Neutral
        let path = { clear: this.path_clear }
        let prev_base = undefined;
        let block = undefined;

        let movement = setInterval(() => {
            //if game isnt ongoing stop interval
            switch(GeneratorObject.get_game_status()) {
                case game_status.ENDED:
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

            current_pin = GeneratorObject.PinObject.get(undefined, pin_id);
            console.log("UI PIN", current_pin, pin_id)
            block = this.GeneratorObject.BlocksObject.get(current_pin.game.block);
            if (this.GeneratorObject.get_mode_of_attack() != attack_mode.LUDO) {
                if (block.game.terrain.active != Negative) {
                    current_pin.game.factors.agility.rate = 10;
                    /**
                     * paused at testing time handler
                     * next step: stopping pin on entry of terrain
                     */

                    // this.GeneratorObject.TimerHandlerObject.new_interval(player.id, current_pin.game.pin_id, () => {console.log("timer done")}, 10000, timer_type.terrain_stopped);

                    // this.GeneratorObject.TimerHandlerObject.stop_timer(player.id, current_pin.game.pin_id, timer_type.terrain_stopped);
                    // this.GeneratorObject.TimerHandlerObject.get_timer(player.id, current_pin.game.pin_id, timer_type.terrain_stopped);
                }
                else {
                    current_pin.game.factors.agility.rate = 2;
                }
            }

            if (current_pin.game.state == pin_state.dormant) {
                clearInterval(movement);
                return;
            }
            

            if (current_pin.game.safe_zone.trigger == base + parseInt(point)) {
                //trigger safety for this pin
                console.log("returning true Pin on trigger")
                this.PinObject.update_pin_trigger(pin_id, Neutral);
                manual_reset.status = true;
                manual_reset.value['point'] = (point);
                manual_reset.value['prev_point'] = no_of_public_blocks;
                point = parseInt(current_pin.game.safe_zone.start.toString().replace(base, '')) - 1; // 14
                
                /*** 
                 * update displaymessages, showToAll? 
                 * 
                 * */
            }

            if (current_pin.game.safe_zone.start == base + parseInt(point) && current_pin.game.safe_zone.triggered == Neutral) {
                //update pin safe zone trigger to Positive
                console.log("returning Pin safe zone triggered")
                this.PinObject.update_pin_trigger(pin_id, Positive);
            }
            // console.log(current_pin.game.block, stopping_block)
            //if current pin has reached stopping_block, clear interval
            if (current_pin.game.block == stopping_block) {
                // container.children(this.append_attr(current_pin.game.block)).find(pin_id).remove();
                // current_pin.game.block = current_pin.game.base + 0;
                this.UIObject.get_logic_board(true, constants.PIN, BlocksObject);
                this.PinObject.update_pin_state(pin_id, pin_state.standby)
                clearInterval(movement);
                return;
            }
            
            //if pin was defeated, stop interval
            if (current_pin.game.position == this.PinObject.pin_position.base) {
                container.children(this.UIObject.append_attr(current_pin.game.block)).find(pin_id).remove();
                current_pin.game.block = current_pin.game.base + 0;
                clearInterval(movement);
                return;
            }

            
            // //if pin was stopped e.g by wall, and doesnt have accpeted die roll stop interval
            // if (current_pin.game.state == pin_state.stopped && allowed_no.indexOf(die_value) == -1) {
            //     this.UIObject.display_message(messages.REQUIRED_6);
            //     this.UIObject.get_logic_board(true, constants.PIN, BlocksObject);
            //     clearInterval(movement);
            //     return;
            // }
            // else if (current_pin.game.state == pin_state.stopped && allowed_no.indexOf(die_value) != -1) {
            //     console.log("path is cleared");
            //     //force pin to clear
            //     path.clear = Positive;
            //     this.PinObject.update_pin_state(pin_id, pin_state.moving);
            // }

            //check if next block has a wall
            // this.GeneratorObject.BlocksObject.get_blocks_on_side(current_pin.game.block, side.RIGHT, 1)
            //if path is neutral, make checks for next block && current_pin.game.state != pin_state.stopped
            console.log("Path ", path.clear)
            if (path.clear == Neutral ){
                switch (this.GeneratorObject.get_mode_of_attack()) {
                    case attack_mode.BASIC:
                        let next_block = this.GeneratorObject.BlocksObject.get_blocks_on_side(current_pin.game.block, side.RIGHT, 1);
                        console.log("Next block", next_block);
                        path.clear = this.GeneratorObject.BlocksObject.check_path(next_block, undefined, pin_id, 1).clear;
                        console.log("Next Path", path);
                        if (path.clear == Negative) {
                            clearInterval(movement);
                            return;
                        }
                        
                    default:
                        break;
                }
                
            } 
            

            //if pin's path isnt clear i.e was stopped e.g by wall, stop interval
            if (current_pin.game.state == pin_state.stopped) {
                if (this.GeneratorObject.get_allowed_numbers().indexOf(this.die_value) == -1) {
                    if (path.clear == Neutral) {
                        this.UIObject.display_message(messages.REQUIRED_6)
                    }
                    if (this.GeneratorObject.get_mode_of_attack() == attack_mode.LUDO) {
                        this.UIObject.get_logic_board(true, constants.PIN, BlocksObject);
                    }
                    else {
                        this.UIObject.get_logic_board(true, constants.WALL, BlocksObject);
                    }
                    
                    clearInterval(movement);
                    return;
                }
                else {
                    
                    this.PinObject.update_pin_state(pin_id, pin_state.moving)
                }
                
            }

            //if pin has completed play, stop interval
            if (current_pin.game.position == this.PinObject.pin_position.safe) {
                // this.UIObject.display_message(messages.PIN_COMPLETED);
                clearInterval(movement);
                return;
            }

            
            // if (current_pin.game.block == current_pin.game.end_block && current_pin.game.returned == Neutral ) {
            //     console.log("returned home.");
            //     // current_pin.game.returned = Positive;
            //     //update pin handles position update currently
            //     this.PinObject.update_position(pin_id, this.PinObject.pin_position.safe);
            //     clearInterval(movement);
            //     return;
            // }

            // console.log("board point", board_point, "total", (no_per_base * no_of_bases), "npb", no_per_base)
            if(parseInt(board_point) === (no_of_public_blocks * no_of_bases) + 1)
            {
                //pin is returning to base
                console.log("returning");
                current_pin.game.returned = Neutral;
                next_base = 0;
            }

            // console.log(JSON.stringify(current_pin))
            // console.log("Point", point, "Board Point", board_point, "Pin id", pin_id)
            prev_base = base;
            if (point >= no_of_public_blocks && current_pin.game.safe_zone.triggered == Negative)
            {
                container.children("#" + base + no_of_public_blocks).find(pin_id).remove();
                
                //previous base
                
                //get next base
                
                base = GeneratorObject.MoveObject.get_next_base(bases, next_base, no_of_bases);

                //update pin info
                if(blocks != undefined && player != undefined) {
                    
                    this.UIObject.update_pins(1, no_of_public_blocks, player, blocks, bases, base, prev_base);
                    
                    this.PinObject.update_pin_info(pin_id, constants.BASES, (current_pin.game.info.bases + 1))
                    console.log("current pin info", current_pin.game.info)
                }

                //reset point
                point = 1;
                
                //update next_base value
                next_base = bases.indexOf(base) + 1;
                //if point is 1 and movement stops there
                // if (parseInt(board_point) === (parseInt(init_point) + parseInt(die_value)))
                // {
                //     container.children("#" + base + parseInt(point)).append(pin_html);
                // }
                // else{

                container.children("#" + base + parseInt(point)).append(pin_html);
                // manual_reset.status = true;   
                // }

                
            }
            else
            {
                if (manual_reset.status) {
                    // console.log("Manual Reset ", manual_reset);
                    // ## ??
                    // container.children("#" + base + (parseInt(point) - 1)).find(pin_id).remove();
                    if (manual_reset.value.point != undefined) {
                        // console.log("Manual Update Pins", manual_reset.value['point'], manual_reset.value['prev_point'], base);
                        container.children("#" + base + manual_reset.value['point']).find(pin_id).remove();
                        this.GeneratorObject.BlocksObject.remove_pin_from_block(base + manual_reset.value['point'], current_pin.game.pin_id);
                        // this.UIObject.update_pins(manual_reset.value['point'], manual_reset.value['prev_point'], player, blocks, bases, base, prev_base);
                    } 
                    
                    manual_reset.status = false;
                    
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
                    // console.log("pin_id id", pin_id, "#" + base + (point));
                    //recreate pin on new box
                    container.children("#" + base + (parseInt(point) + 1)).append(pin_html);
                }
                //update pin info
                if(blocks != undefined && player != undefined) {
                    // console.log
                    this.UIObject.update_pins((parseInt(point) + 1), point, player, blocks, bases, base, base);
                }

                if (current_pin.game.state == pin_state.standby) this.PinObject.update_pin_state(pin_id, pin_state.moving);
                
                point++;
            }

            
            //increase the point on the board and the logical board
            board_point++;
            path.clear = Neutral;
            
            
        }, 300);
    }
}