class Players {
    players = {}
    GeneratorObject = undefined;

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
    }
    
    
    new(number, id, info, max_no, no_of_pins=0, base, pin) {
        
        //add new player
        this.add(number, id, info, max_no, no_of_pins, base, pin);
    }
    add(number, id, info, max_no, no_of_pins, base, pin) {
        //add new player data
        //max_no is the maxium number of players per game
        if (Object.keys(this.players).length < max_no) {
            this.players[id] = { id: id, number: number, info: info, game: { pin: pin, valid: Postive, points: info.game.points, saveable_point: 0 } }
            //create pins for players
            this.GeneratorObject.PinObject.create_pins(this.get(id), no_of_pins, base);

            console.log("Player " + info.name + " has joined the game.");
        }
        else {
            //display/throw error
            //error: Maxium no of players reached.
            this.GeneratorObject.getUIObject().display_message(messages.MAX_PLAYERS_REACHED)
        }
    }

    get(player_id) {
        // console.log(this.players, player_id)
        return this.players[player_id];
    }

    update_points(player_id, value) {
        let player = this.get(player_id);
        player.game.points = value;
        //testing start
        update_ui_points();
        //testing end
    }

}