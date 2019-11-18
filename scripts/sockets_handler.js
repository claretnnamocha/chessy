//M- master channel (general channel, master to children)
//M-SA- master [set_active player]
//C- child channel (general channel, child to master)
//
let socket = io();
let unique_id = Math.floor(Math.random() * 20) + 1 + Math.floor(Math.random() * 20) + 1;

function emit(key, value) {
    console.log("Emitting Data source ", GeneratorObject.get_player());
    socket.emit("C-" + GeneratorObject.id, { key: key, value: value })
    // socket.emit(key, value);
}

function listen_on(channel) {
    console.log("Listening on channel ", channel);
    return socket.on(channel + GeneratorObject.id, data => data);
}

socket.on(unique_id, data => {
    if (data.type == 'new') {
        console.log("player info", data.player_info);
        GeneratorObject.set_id(data.generator_id);
        GeneratorObject.set_player_no(data.player_counter);
        init();
        new_player(data.player_info, data.player_counter, data.id);
    }
    else if(data.type == 'gen') {
        console.log("gen", data);
        GeneratorObject.update_generator(data.data, data.len);
    }
    
    socket.on("M-" + GeneratorObject.id, (data) => {
        console.log("Received", data);
        //wasnt emitted by me
        
        GeneratorObject.update_generator(data, data.length);
    });

    socket.on("M-SA-" + GeneratorObject.id, (data) => {
        console.log("Received Player", data);
        // if (GeneratorObject.)
        //wasnt emitted by me
        
        GeneratorObject.set_active_player(data);
    });
});
