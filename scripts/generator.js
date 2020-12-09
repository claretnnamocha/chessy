class Generator{
    id = undefined;
    PlayerObject = undefined;
    PinObject = undefined;
    MoveObject = undefined;
    DiceObject = undefined;
    UIObject = undefined;
    PointsObject = undefined;
    BlocksObject = undefined;
    FactorsObject = undefined;
    TimerHandlerObject = undefined;

    no_of_bases = undefined;
    no_per_base=undefined;
    container = undefined;
    
    base_classes = undefined;
    active_player = 0;
    
    mode_type = mode.LUDO;
    nth_val = undefined;
    winner = undefined;
    game_status = game_status.STARTING;
    
    mode_of_attack = undefined;
    
    allowed_no = [6];
    player_no = undefined;
    player_info = undefined;
    local_play = false;

    bases = ["red_pin", "blue_pin", "green_pin", "yellow_pin"];
    base_pins = ["red_pin", "blue_pin", "green_pin", "yellow_pin"];

    publish_action = {
        pin_create: 0
    }

    publish_source = {
        pin: 0,
        block: 1,
        dice: 2,
        move: 3,
        point: 4,
        ui: 5,
        player: 6
    }
    

    constructor(no_per_base, base_classes, bases, mode_type, nth_val) {
        // this.id = id;
        this.no_per_base = no_per_base;
        this.base_classes = base_classes;
        this.nth_val = nth_val;
        this.mode_type = mode_type;
        this.bases = bases;
        this.no_of_bases = this.bases.length;
    }
    
    getPlayerObject() {
        return this.PlayerObject;
    }
    getPinObject() {
        return this.PinObject;
    }
    getMoveObject() {
        return this.MoveObject;
    }
    getUIObject() {    
        return this.UIObject;
    }
    getPointsObject() {
        return this.PointsObject;
    }
    getDiceObject() {
        return this.DiceObject;
    }
    getBlocksObject() {
        return this.BlocksObject;
    }
    getFactorsObject() {
        return this.FactorsObject;
    }
    getTimerHandlerObject() {
        return this.TimerHandlerObject;
    }


    init() {
        console.log("Generator initializing");
        // on initialization create player and pins objects
        this.PlayerObject = new Players(this);
        this.PinObject = new Pins(this, this.no_of_bases, this.mode_type, this.nth_val, this.mode_of_attack);
        this.MoveObject = new Movement(this);
        this.DiceObject = new Dice(this);
        this.UIObject = new UserInterface(this);
        this.PointsObject = new Points(this);
        this.DiceObject = new Dice(this);
        this.BlocksObject = new Blocks(this);
        this.FactorsObject = new Factor(this);
        this.TimerHandlerObject = new TimerHandler(this);
        this.set_game_status(game_status.ONGOING);
        console.log("Generator initialized");
    }

    set_id(id) {
        this.id = id;
    }
    set_player_no(player_no) {
        this.player_no = player_no;
    }

    set_starting_player(player_id) {
        //set active player
        this.active_player = player_id;
    }

    set_game_container(container) {
        this.container = container;
    }

    set_player_info(player_info) {
        this.player_info == player_info;
    }

    set_mode_of_attack(mode_of_attack) {
        this.mode_of_attack = mode_of_attack;
        switch(this.mode_type) {
            case mode.LUDO:
                this.mode_of_attack = attack_mode.LUDO;
                break;
            default:
                break;

        }
    }

    set_active_player(custom=undefined) {
        let players = this.getPlayerObject().get_players();
        let prev_player = (players[this.active_player]);
        prev_player = this.PlayerObject.get(prev_player);
        console.log("Prev Player ", prev_player)
        if (custom != undefined) {
            //received next player from server
            console.log("Setting Active player", custom);
            this.active_player = custom;
        }
        else {
            if (!this.get_local_play()) {
                emit(1, { player_id: this.get_player() }, "M-SAP-");
            }
            
            // console.log("setting active", players, this.active_player, Object.keys(players).length, (this.active_player >= Object.keys(players).length - 1));
            if (this.active_player >= players.length - 1) {
                // console.log("resetting active")
                this.active_player = 0;
            }
            else {
                this.active_player ++;
            }
            
        } 

        let player = players[this.active_player];
        console.log(player, this.active_player);
        player = this.PlayerObject.get(player);
        
        //testing
        console.log("-----Next Player-----")
        console.log("switching",players,player)
        document.getElementById("player_value").innerHTML = "<div>Current player: " + player.info.name + " <span style='color: " + (player.game.pin).toString().split("_")[0] + "'>" + player.game.pin + "</span> ||| prev player:" + prev_player.info.name + " prev pin: <span style='color: " + (prev_player.game.pin).toString().split("_")[0] + "'>" + prev_player.game.pin + "</span></div>";
        //remove ui reminants
        $("#pins_value").children().remove();
        ///testing
    }

    set_winner(player_id) {
        this.winner = player_id;
        this.set_game_status(game_status.ENDED);
    }

    set_game_status(status) {
        this.game_status = status;
    }

    add_to_bases(data) {
        this.bases = this.bases.concat(data);
    }
    add_to_base_pins(data) {
        this.base_pins = this.base_pins.concat(data);
    }

    
    get_id() {
        return this.id;
    }
    get_bases() {
        return this.bases;
    }
    get_allowed_numbers() {
        return this.allowed_no;
    }

    get_local_play() {
        return this.local_play;
    }

    get_base_pins() {
        return this.base_pins;
    }
    get_player_info() {
        return this.player_info;
    }
    

    get_active_player() { 
        //get from server
        // emit("GA-", 1);
        // let players = this.getPlayerObject().players;
        // let keys = Object.keys(players);
        // console.log(players, keys, this.active_player, keys[this.active_player]);
        // return keys[this.active_player];
        return this.active_player;
    }

    get_player() {
        return this.player_no;
    }

    get_game_status() {
        return this.game_status;
    }

    get_mode_type() {
        return this.mode_type;
    }

    get_mode_of_attack() {
        return this.mode_of_attack;
    }

    return_basic_info() {
        let info = { 
            game_status: this.get_game_status(), PlayerObject: this.getPlayerObject(), active_player: this.get_active_player(), player_id: this.get_player()
        }
        return info;
    }

    make_checks(active_pin=undefined, value_to_check=constants.PIN, die_value=undefined, block=undefined, reversed=false) {


        //
        if (value_to_check != undefined && value_to_check == constants.PIN || value_to_check == constants.ALL) {
            if (active_pin == null || active_pin == undefined) {
                //error occured
                
                this.UIObject.display_message(messages.ERROR_OCCURED);
                return false;
            }
        }
        

        if (value_to_check != undefined && value_to_check == constants.BLOCK || value_to_check == constants.ALL) {
            // console.log("Block check", block)
            if (block == null || block == undefined) {
                this.UIObject.display_message(messages.ERROR_OCCURED);
                return false;
            }
        }
        

        if (value_to_check != undefined && reversed && value_to_check != constants.REMOVE_FROM_BASE || value_to_check == constants.ALL) {
            //if excluded, removing from base would be excluded from this check
            //if pin not on board, stop
            // console.log("REMOVE_FROM_BASE", constants.REMOVE_FROM_BASE, value_to_check)
            if (active_pin.game.position != this.PinObject.pin_position.board) {
                this.UIObject.display_message(messages.ACTIVE_PIN_NOT_ON_BOARD);
                return false;
            }
        }
        
        //if game isnt ongoing, stop
        switch(this.get_game_status()) {
            case game_status.STARTING:
                this.UIObject.display_message(messages.INVALID_ACTION);
                return false;
            case game_status.ENDED:
                this.UIObject.display_message(messages.GAME_ENDED);
                return false;
            default:
                break;
        }


        return true;
    }

    publish(value, publish_action, publish_source) {
        // console.log("Publish ", value, publish_action, publish_source);
        if (!this.local_play) {
            value.player_id = this.get_player();
            value.source = publish_source;
            // value.len = len;
            emit(publish_action, value);
            console.log("emitting", publish_action, value);
        }
    }

    update_generator(data, len=1) {
        // console.log("Data", data, " len", len, this.get_player());
        for (let i = 0; i < len; i++) {
            if (parseInt(data[i].value.player_id) != (this.get_player())) {
                
                let publish_action = data[i].key;
                let value = data[i].value;
                console.log("Updating ", publish_action, value)
                switch(value.source) {
                    case publish_source.pin:
                        this.PinObject.override(publish_action, value);
                        // console.log(value);
                        break;
                    case publish_source.player:
                        this.PlayerObject.override(publish_action, value)
                        break;
                    case publish_source.dice:
                        this.DiceObject.override(publish_action, value);
                        break;
                    case publish_source.ui:
                        this.UIObject.override(publish_action, value);
                        break;
                    case publish_source.point:
                        this.PointsObject.override(publish_action, value);
                        break;
                    case publish_source.block:
                        this.BlocksObject.override(publish_action, value);
                        break;
                    default:
                        break;

                }
            }
            
        }
        
    }

}