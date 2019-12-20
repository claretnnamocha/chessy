class Dice {
    
    GeneratorObject = undefined;
    PlayerObject = undefined;

    _dice = {};
    die_max_no = 6;
    vall = 16; counterr=0;
    pla_co = 0;

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.init();
    }

    init() {
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
        console.log("Dice initialized");
    }

    override(action, value, player_id) {
        let player = this.PlayerObject.get(player_id);
        switch (action) {
            case publish_action.dice_roll:
                console.log("Die received ", value);
                this.roll(value.nth_value, value.player_id, value.dice);
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

    set_die_max_no(value) {
        this.die_max_no = value;
    }
    get_die_max_no() {
        return this.die_max_no;
    }

    prepare(player_id) {
        let player = this.PlayerObject.get(player_id);
        
        player.game.saveable_point = 0;

        if (this.GeneratorObject.get_player() == player_id) {
            // result.nth_value = nth_value;
            this.GeneratorObject.publish({ player_id: player_id }, publish_action.dice_roll_prepare, publish_source.dice)
        }
    }
    
    roll(nth_value=undefined, player_id, custom_data=undefined) {
        console.log("Custom Data", custom_data)
        // this.counterr = 0;
        let dice = [];
        let player = this.PlayerObject.get(player_id);
        if (nth_value == undefined) nth_value = 2;
        
        for (let i = 1; i <= nth_value; i++) {
            let die_value = undefined;
            if (custom_data != undefined) {
                //load custom value
                die_value = this.gen_die_value(custom_data.dice[i - 1].val)
            }
            else {
                die_value = this.gen_die_value();
            }

            {// if (this.counterr >= 0) {
            //     die_value = this.vall;
            //     this.counterr +=1;
            //     if (this.pla_co >= 3) {
            //         die_value = this.gen_die_value();
            //     }
            //     this.pla_co++;
               
                // if(player_id == 0) {
                //      die_value = 28;
                //     //  this.counterr +=1;
                // }
            //     if(player_id == 0 && this.counterr == 3) {
            //         die_value = 5;
            //         this.counterr +=1;
            //    }

            //    if(player_id == 1 && this.counterr == 0) {
            //         die_value = 6;
            //         this.counterr +=1;
            //     }
            //     if(player_id == 1 && this.counterr == 1) {
            //         die_value = 6;
            //         this.counterr +=1;
            //     }

            // }
            }
            
            let die_title = (custom_data != undefined) ? custom_data.dice[i - 1].title : constants.DIE + i + + new Date().getMilliseconds();
            console.log("die",die_title, die_value, player_id);
            dice.push({ title: die_title, val: die_value, player_id: player_id });
            //add to dice object
            this._dice[die_title] = die_value;

            
        }
        

        let dice_vals = [];
        let dice_keys = Object.keys(dice);
        dice.forEach(element => {
            dice_vals.push(element.val);
            let button = document.createElement("button");
            button.onclick = () => {
                if (this.GeneratorObject.get_player() == element.player_id) {
                    console.log(JSON.stringify(dice_vals));
                    let action_value = $("#action").val();
                    this.action(player_id, element, action_value);
                    
                    this.GeneratorObject.publish({player_id: player_id, die: element, action: action_value }, publish_action.die_click, publish_source.dice);
                }
                else {
                    this.GeneratorObject.UIObject.display_message(messages.INVALID_ACTION, Negative, false);
                }
                
                
            };
            button.innerText = element.val;
            button.setAttribute("id", element.title);
            UIObject.replicate("#dice_value", button);
        });
        
        // console.log(dice)
        let result = { dice: dice, "Turn": (dice_vals.indexOf(6) != dice_vals.lastIndexOf(6)) };
        // player
        player.game.saveable_point ++;

        //publish
        console.log("Dice emit ",this.GeneratorObject.get_player(), player_id)
        if (this.GeneratorObject.get_player() == player_id) {
            // result.nth_value = nth_value;
            this.GeneratorObject.publish({dice: result, nth_value: nth_value}, publish_action.dice_roll, publish_source.dice)
        } 

        return  result;
    }
    

    gen_die_value(custom=undefined) {
        let die_value = 0;
        if (custom != undefined) {
            die_value = custom;
        }  
        else {
            die_value = Math.floor(Math.random() * this.get_die_max_no()) + 1;
        }      
        return die_value;
    }

    remove_from_dice(die_title, update_ui=true) {
        delete this._dice[die_title];
        if(update_ui) this.GeneratorObject.UIObject.force_remove(die_title);
        // console.log(this.get_dice().length);
        if (this.get_dice().length == 0) {
            this.GeneratorObject.set_active_player();
            this.pla_co = 0;
        }
    }

    get_dice() {
        return Object.keys(this._dice);
    }

    action(player_id, die, action) {
        let p_player = this.PlayerObject.get(player_id);
        let current_die = die;
        die = die.val;
        let max_secs = 6;
    
        setTimeout(() => {
            
            //testing
            
            //testing/
            switch(action) {
                case constants.MOVE: 
                    console.log("moving", player_id, this.GeneratorObject.get_player());
                    let active_pin = this.GeneratorObject.PinObject.get(player_id);
                    if (active_pin == null || active_pin == undefined) {
                        // some_error(player_id);
                        this.GeneratorObject.UIObject.display_message(messages.ACTIVATE_PIN, Negative, false);
                        return;
                    }
                    let PinInfo = getPinInfo(p_player, active_pin);
                    let pin = PinInfo.pin;
                    let pin_id = PinInfo.pin_id;
                    let pin_html = PinInfo.pin_html;
                    
                    if (active_pin.game.position != PinObject.pin_position.board) {
                        // UIObject.display_message(messages.ACTIVE_PIN_NOT_ON_BOARD);
                        // break;
                    }
                    // activate_pin(pin, active_pin);
                    remove_from_base(pin_id, active_pin, Positive);
                    console.log("Past moving for base");
                    // break;
                    // return;
                    // let holder = container.children().children(append_attr( pin_id));
                    let holder = active_pin.game.block;
                    let default_pin = active_pin.game.start_block;
                    
                    // let current_box_id = holder.length == 0 ? default_pin : holder.parent().attr("id").replace("#");
                    
                    // current box on the board logic
                    //.length == 0 ? default_pin : holder.parent().attr("id").replace("#")
                    let current = holder;
                    // let current_base = (current == default_pin) ? bases[p_player.number] : holder.parent().attr("id").replace("#").substring(0,1);
                    let current_base = (current == default_pin) ? bases[p_player.id] : holder.substring(0,1);
                    
                    let res = MovementObject.move(current, die, current_base, this.GeneratorObject.BlocksObject.no_per_base, bases, active_pin, this.GeneratorObject.BlocksObject.blocks, p_player);
                    console.log("Movement ", res);
                    if (res == undefined) {
                        //function was stopped
                        return;
                    }
                    current = res.point;
                    current_base = res.base;
                    let ui_move_object = new ui_move(this.GeneratorObject, die, counter, res.path_clear);
                    ui_move_object.move(pin_html, pin_id, container, res.starting_point, res.starting_base, bases, res.box_id, this.GeneratorObject, p_player);
                    counter++;
                    //remove die
                    
                    this.remove_from_dice(current_die.title);
                    break;
                case constants.REMOVE:
                    if (allowed_no.includes(die)) {
                        let active_pin = this.GeneratorObject.PinObject.get(player_id);
                        if (active_pin == null || active_pin == undefined) {
                            // some_error(player_id);
                            return;
                        }
                        let PinInfo = getPinInfo(p_player, active_pin);
                        let pin = PinInfo.pin;
                        let pin_id = PinInfo.pin_id;
                        // activate_pin(pin, active_pin);
                        // alert("No six" + pin_id);
                        if (active_pin.game.position == this.GeneratorObject.PinObject.pin_position.base) {
                            let res = remove_from_base(pin_id, active_pin, Positive);
                            if (res == undefined) {
                                //function was stopped
                                return;
                            }
                            //remove die
                            // UIObject.force_remove(current_die.title);
                            this.remove_from_dice(current_die.title);
                        }
                        else {
                            this.GeneratorObject.UIObject.display_message(messages.PIN_ON_BOARD);
                        }
                        
                        
                        break;
                    }
                    else {
                        this.GeneratorObject.UIObject.display_message(messages.REQUIRED_6);
                    }
                    
                    break;
                case constants.SAVE:
                    
                    let pins_on_board = this.GeneratorObject.PinObject.get_pins_on_board(p_player.id);
                    if (this.GeneratorObject.get_mode_type() != mode.LUDO && !pins_on_board.empty && p_player.game.saveable_point != 0 ) {
                        p_player.game.points = p_player.game.points + (die);
                        p_player.game.saveable_point -=1;           
                        
                        //testing start
                        update_ui_points();
                        //testing end 
    
                        //remove die
                        this.remove_from_dice(current_die.title);
                    }
                    else if(this.GeneratorObject.get_mode_type() == mode.LUDO) {
                        this.GeneratorObject.UIObject.display_message(messages.INVALID_ACTION,Negative, false);
                    }
                    else if(pins_on_board.empty) {
                        this.GeneratorObject.UIObject.display_message(messages.REQUIRED_PIN_ON_BOARD, Negative, false)
                    }
                    else if (p_player.game.saveable_point <= 0) {
                        this.GeneratorObject.UIObject.display_message(messages.POINT_ALREADY_SAVED, false)
                    }
                    
                    break;
                default:
                    // no valid action selected
                    break;    
            }
            
        }, 0);
    }

    empty_dice(player_id=undefined) {
        if (player_id == undefined) player_id = this.GeneratorObject.get_player();
        let keys = this.get_dice();
        if (keys.length > 0) {
            keys.forEach(die_title => {
                this.remove_from_dice(die_title);
            });
        }
        else {
            this.GeneratorObject.set_active_player();
        }

        if (this.GeneratorObject.get_player() == player_id) {
            this.GeneratorObject.publish({ empty_dice: true, player_id: player_id }, publish_action.empty_dice, publish_source.dice);
        }
        
    }

    
}