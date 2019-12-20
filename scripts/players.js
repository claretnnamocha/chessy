class Players {
    players = {}
    server_players = [];
    GeneratorObject = undefined;
    UIObject = undefined;
    PinObject = undefined;

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.init();
    }

    init() {
        this.UIObject = this.GeneratorObject.getUIObject();
        this.PinObject = this.GeneratorObject.getPinObject();
        console.log("Players initialized");
    }
    
    override(action, value) {
        console.log("Player override", action, value)
        let player = this.get(value.player_id);
        let counter = 0;
        switch (action) {
            case publish_action.player_create:
                    console.log("Player override", action, value)
                // while (counter < value.len) {
                   this.new(value.number, value.id, value.info, value.max_no, value.no_of_pins, value.base, value.pin, value.luck );
                //    counter ++;
                // }
                break;
            default:
                break;
        }
    }
    
    new(number, id, info, max_no, no_of_pins=0, base, pin, luck=undefined) {
        
        //add new player
        this.add(number, id, info, max_no, no_of_pins, base, pin, luck);
    }
    add(number, id, info, max_no, no_of_pins, base, pin, luck=undefined) {
        console.log("number ", number, id, max_no, no_of_pins, base, pin);
        //add new player data
        //max_no is the maxium number of players per game
        luck = (luck!=undefined) ? luck : Math.floor(Math.random() * 10) + 1;
        if (Object.keys(this.players).length < max_no) {
            this.players[number] = { id: number, number: id, info: info, game: { pin: pin, valid: Positive, points: info.game.points, saveable_point: 0, luck:luck } }
            //create pins for players
            this.GeneratorObject.PinObject.create_pins(this.get(number), no_of_pins, base);
            this.GeneratorObject.BlocksObject.assign_blocks(number, base);
            update_ui_points();
            //publish player
            if(this.GeneratorObject.get_player() == number) {
                this.GeneratorObject.publish({number: number, id: id, info: info, max_no: max_no, no_of_pins: no_of_pins, base: base, pin: pin, luck:luck }, publish_action.player_create, publish_source.player)
            } 
            console.log("Player " + info.name + " has joined the game.");
            this.GeneratorObject.UIObject.display_message("Player " + info.name + " has joined the game.");
        }
        else {
            //display/throw error
            //error: Maxium no of players reached.
            this.GeneratorObject.UIObject.display_message(messages.MAX_PLAYERS_REACHED)
        }
    }

    set_server_players(players) {
        this.server_players = players;
    }

    get_players() {
        // if (this.GeneratorObject.get_local_play()) {
        //     return this.server_players;
        // }
        return Object.keys(this.players);
    }

    get(player_id) {
        // console.log(this.players, player_id)
        return this.players[player_id];
    }

    update_points(player_id, value) {
        let player = this.get(player_id);
        player.game.points = value;
        //testing start
        if (this.GeneratorObject.get_mode_type() != mode.LUDO) {
            update_ui_points();
        }
        
        //testing end
    }

    

}