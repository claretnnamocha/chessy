//M- master channel (general channel, master to children)
//M-SA- master [set_active player]
//C- child channel (general channel, child to master)
//
let socket = io();
//generate random unique_id for p
let unique_id = Math.floor(Math.random() * 20) + 1 + Math.floor(Math.random() * 20) + 1;

function emit(key, value, channel=undefined) {
    if (channel == undefined) channel = "C-";
    socket.emit(channel + GeneratorObject.id, { key: key, value: value })
}

function listen_on(channel, action=undefined) {
    console.log("Listening on channel ", channel+ GeneratorObject.id);
    socket.on(channel + GeneratorObject.id, data => {
        if (action != undefined) {
            action(data);
        }
    });
}

setTimeout(function() {
   // your page initialization code here
   // the DOM will be available here
   let d = { key: 1, value: 1 }
   socket.emit("connect_f", d);
   console.log("emiited", d);
}, 3000);



let chat_message_display = $("#chat_message_display");


socket.on(unique_id, data => {
    //listening on player_unique_id
    if (data.type == 'new') {
        // console.log("player info", data.player_info);
        container = $(".container");
        GeneratorObject.set_id(data.generator_id);
        GeneratorObject.set_game_container(container);
        GeneratorObject.set_starting_player(data.starting_player);
        GeneratorObject.set_player_no(data.player_counter);
        GeneratorObject.set_player_info(data.player_info);
        init();
        //create a new player object locally
        new_player(data.player_info, data.player_counter, data.id);
    }
    else if(data.type == 'gen') {

        console.log("gen", data);
        GeneratorObject.update_generator(data.data, data.len);
        listen_on("M-", (data) => {
            GeneratorObject.update_generator(data, data.len);
        });

        listen_on("chat-dis-", data => {
            chat_message_display.prepend("<span style='color:black'>" +data.value.name + ": " + data.value.message + "</span><br/>");
        })
    }
    

});

