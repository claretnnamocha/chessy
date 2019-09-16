class Pins {
    no_of_bases = 0;
    pins = {}
    pins_per_player = 4;
    max_no = 0;

    constructor(GeneratorObject, no_of_bases) {
        this.GeneratorObject = GeneratorObject;
        this.PlayerObject = GeneratorObject.getPlayerObject();
        this.max_no = (no_of_bases * this.pins_per_player);
    }
    
    GeneratorObject = undefined;
    PlayerObject = undefined;

    new (player) {
        let pins_total = Object.keys(this.pins).length;
        if(pins_total < this.max_no) {
            //player: holds the information of the current
            //game holds the information needed by this pin during gameplay
            this.pins[pins_total] = { player: undefined, game: { armour: 0, active: false, block: "A0" },  }
            this.pins[pins_total].player = player
        }
        else {
            //display error
            //error: Maxium no of pins reached.
        }
        
    }

    create_pins(player, no_of_pins) {
        //generate pins for players  
        let pin_counter = 0;
        while(pin_counter < no_of_pins) {
            this.new(player);
            pin_counter++;
        }
        //activating one pin for testing purposes
        this.pins[Object.keys(this.pins).length - 1].game.active = true;
    }

    get(player_id) {
        //get active pin for this player
        let pin_keys = Object.keys(this.pins);
        let pin_returned = null;
        // pin_keys.forEach(key => {
        //     console.log("pins 28", Pins.pins[key].player.id + " <> " + player_id)
        //     if (Pins.pins[key].player.id == player_id && Pins.pins[key].game.active) {
        //         console.log("pins 29", Pins.pins[key].player.id == player_id && Pins.pins[key].game.active)
        //         pin_returned = Pins.pins[key];
        //         break;
        //     }
        // });
        for (let i=0; i< pin_keys.length; i++) {
            if (this.pins[i].player.id == player_id && this.pins[i].game.active) {
                console.log("pins 57", this.pins[i].player.id == player_id && this.pins[i].game.active)
                pin_returned = this.pins[i];
                break;
            }
        }
        return pin_returned;
    }
}