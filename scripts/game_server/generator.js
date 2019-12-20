export default class Generator{
    id = undefined;
    PlayerObject = undefined;
    PinObject = undefined;
    MoveObject = undefined;
    DiceObject = undefined;
    UIObject = undefined;
    PointsObject = undefined;
    BlocksObject = undefined;

    no_of_bases = undefined;
    no_per_base=undefined;
    container = undefined;
    
    base_classes = undefined;
    active_player = 2;
    
    mode_type = mode.LUDO;
    nth_val = undefined;
    winner = undefined;
    game_status = game_status.STARTING;
    
    mode_of_attack = undefined;
    bases = ["red_pin", "blue_pin", "green_pin", "yellow_pin"];
    allowed_no = [6];
    player_no = undefined;
    local_play = false;

    constructor(no_per_base, container, base_classes, bases, mode_type, nth_val) {
        // this.id = id;
        this.no_per_base = no_per_base;
        this.container = container;
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
        // console.log("Gen UIObject", this.UIObject);
        // if (this.UIObject == undefined) {
        //     this.init();
        //     console.log("Gen UIObject", this.UIObject);
        // }
        
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


    init() {
        console.log("Generator initializing");
        this.mode_of_attack = attack_mode.BASIC;
        switch(this.mode_type) {
            case mode.LUDO:
                this.mode_of_attack = attack_mode.LUDO;
                break;
            case mode.PIN:
                // 
                break;
            case mode.POINT:
                // this.mode_of_attack = attack_mode.BASIC;
                break;
            default:
                break;

        }
        // on initialization create player and pins objects
        this.PlayerObject = new Players(this);
        this.PinObject = new Pins(this, this.no_of_bases, this.mode_type, this.nth_val, this.mode_of_attack);
        this.MoveObject = new Movement(this);
        this.DiceObject = new Dice(this);
        this.UIObject = new UserInterface(this);
        this.PointsObject = new Points(this);
        this.DiceObject = new Dice(this);
        this.BlocksObject = new Blocks(this);
        this.set_game_status(game_status.ONGOING);
        console.log("Generator initialized");
    }

    set_id(id) {
        this.id = id;
    }
    set_player_no(player_no) {
        this.player_no = player_no;
    }

    add_to_bases(data) {
        this.bases = this.bases.concat(data);
    }

    
    get_bases() {
        return this.bases;
    }
    get_allowed_numbers() {
        return this.allowed_no;
    }

    get_active_player() { 
        //get from server gen object
        return this.active_player;
    }

    set_active_player(custom=undefined) {
        if (custom != undefined) {
            this.active_player = custom;
        }
        else {
            let players = this.getPlayerObject().players;
            let prev_player = (players[Object.keys(players)[this.active_player]]);
            // console.log("setting active", players, this.active_player, Object.keys(players).length, (this.active_player >= Object.keys(players).length - 1));
            if (this.active_player >= Object.keys(players).length - 1) {
                // console.log("resetting active")
                this.active_player = 0;
            }
            else {
                this.active_player ++;
            }
            let player = (players[Object.keys(players)[this.active_player]]);
            
            //testing
            console.log("-----Next Player-----")
            console.log("switching",Object.keys(players),player)
            document.getElementById("player_value").innerHTML = "<div>Current player: " + player.info.name + " <span style='color: " + (player.game.pin).toString().split("_")[0] + "'>" + player.game.pin + "</span> ||| prev player:" + prev_player.info.name + " prev pin: <span style='color: " + (prev_player.game.pin).toString().split("_")[0] + "'>" + prev_player.game.pin + "</span></div>";
            ///testing
            
        } 
    }

    get_player() {
        return this.player_no;
    }

    set_winner(player_id) {
        this.winner = player_id;
        this.set_game_status(game_status.ENDED);
    }

    set_game_status(status) {
        this.game_status = status;
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
        let info = { game_status: this.get_game_status(), PlayerObject: this.getPlayerObject() }
        return info;
    }

    make_checks(active_pin, exclude=undefined, die_value=undefined) {
        let position_excluded = [constants.MOVE, constants.REMOVE_FROM_BASE];

        if (active_pin == null || active_pin == undefined) {
            //error occured
            this.UIObject.display_message(messages.ERROR_OCCURED);
            return false;
        }

        if (exclude !=undefined && position_excluded.indexOf(exclude) == -1) {
            //if pin not on board, stop
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

        //check pin state
        if (exclude !=undefined && exclude == constants.MOVE) {
            if (active_pin.game.state == this.PinObject.pin_state.stopped && die_value != undefined && allowed_no.indexOf(die_value) == -1) {
                this.UIObject.display_message(messages.REQUIRED_6);
                return false;
            }
        }

        return true;
    }

    publish(value, player_id, publish_type) {
        if (!this.local_play) {
            value.player = player_id;
            emit(publish_type, value);
            console.log("emitting", publish_type, value);
        }
    }

}

