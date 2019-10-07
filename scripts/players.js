class Players {
    players = {}
    GeneratorObject = undefined;

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
    }
    
    
    new(number, id, info, max_no, no_of_pins=0, base) {
        //add new player
        this.add(number, id, info, max_no, no_of_pins, base);
    }
    add(number, id, info, max_no, no_of_pins, base) {
        //add new player data
        //max_no is the maxium number of players per game
        if (Object.keys(this.players).length < max_no) {
            this.players[id] = { id: id, number: number, info: info }
            
            //create pins for players
            this.GeneratorObject.PinObject.create_pins(this.get(id), no_of_pins, base);

            console.log("Player " + info.name + " has joined the game.");
        }
        else {
            //display/throw error
            //error: Maxium no of players reached.
            alert("Maxium no of players reached");
        }
    }

    get(player_id) {
        return this.players[player_id];
    }

}