//M- master channel (general channel, master to children)
//M-SA- master [set_active player]
//C- child channel (general channel, child to master)
//
let socket = io();
let unique_id = Math.floor(Math.random() * 20) + 1 + Math.floor(Math.random() * 20) + 1;

function emit(key, value, channel=undefined) {
    // console.log("Emitting Data source ", GeneratorObject.get_player());
    if (channel == undefined) channel = "C-";
    socket.emit(channel + GeneratorObject.id, { key: key, value: value })
    // socket.emit(key, value);
}

function listen_on(channel, action=undefined) {
    console.log("Listening on channel ", channel+ GeneratorObject.id);
    socket.on(channel + GeneratorObject.id, data => {
        if (action != undefined) {
            action(data);
        }
    });
}

let chat_message_display = $("#chat_message_display");


socket.on(unique_id, data => {
    if (data.type == 'new') {
        console.log("player info", data.player_info);
        container = $(".container");
        GeneratorObject.set_id(data.generator_id);
        GeneratorObject.set_game_container(container);
        GeneratorObject.set_starting_player(data.starting_player);
        GeneratorObject.set_player_no(data.player_counter);
        GeneratorObject.set_player_info(data.player_info);
        init();
        new_player(data.player_info, data.player_counter, data.id);
        
        
    }
    else if(data.type == 'gen') {
        console.log("gen", data);
        GeneratorObject.update_generator(data.data, data.len);
        listen_on("M-", (data) => {
            // console.log("Received", JSON.stringify(data));
            GeneratorObject.update_generator(data, data.len);
        });

        // listen_on("GAP-", (data) => {
        //     console.log("Received Player", JSON.stringify(data));
        //     if (data.init_by != GeneratorObject.get_player()) GeneratorObject.set_active_player(data.active_player);
        // })

        listen_on("chat-dis-", data => {

            // alert("Received Chat" + JSON.stringify(data))
            chat_message_display.prepend("<span style='color:black'>" +data.value.name + ": " + data.value.message + "</span><br/>");
        })
    }
    

});
// console.log("Gen ID",GeneratorObject.get_id());
// socket.on("M-" + GeneratorObject.get_id(), (data) => {
//     console.log("Received", JSON.stringify(data));
//     //wasnt emitted by me
    
//     GeneratorObject.update_generator(data, data.length);
// });

// socket.on("M-SA-" + GeneratorObject.get_id(), (data) => {
//     console.log("Received Player", data);
//     // if (GeneratorObject.)
//     //wasnt emitted by me
    
//     GeneratorObject.set_active_player(data);
// });
