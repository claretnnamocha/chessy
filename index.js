let express =  require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);


// app.set('view engine', 'ejs');
app.use('/scripts', express.static('scripts'));

const port = 4000;



//Generator info
//player constants
let active_player = 0;

let players = [];

let player_counter = 0;
let player_point = 1500;
const player_info = [
    { name: "Mike Ade", age: "22", wins: 1, game: { points: player_point } },
    { name: "Julia Thomas", age: "18", wins: 1, game: { points: player_point } },
    { name: "James Darkyn", age: "23", wins: 3, game: { points: player_point } },
    { name: "Silver Pulker", age: "28", wins: 8, game: { points: player_point } }
];

let emitted_data = [];

let generator_id = 0;

let bases = ["A", "B", "C", "D"];
let base_pins = ["red_pin", "blue_pin", "green_pin", "yellow_pin"];
//no_per_base is the numbers of blocks(boxes) each base has
let no_per_base = 19;

/// generator info </>


//channels
let master_channel = "M-" + generator_id;
let set_active_player_channel = "M-SAP-" + generator_id;
let get_active_player_channel = "GAP-" + generator_id;
let child_channel = "C-" + generator_id;
let chat_channel = "chat-" + generator_id;
let chat_dist_channel = "chat-dis-" + generator_id;
//


function emitNewPlayer(id) {
    //add to players
    players.push(id);

    console.log("Emitting new Player", emitted_data);
    io.emit(id, {id: id, player_info: player_info[player_counter], player_counter: player_counter, generator_id: generator_id, 'starting_player': active_player, type: 'new'});
    io.emit(id, { data: emitted_data, type: 'gen', len: emitted_data.length, player_id: id });
    io.emit(id, { players: players });
    player_counter++;
    
}

function get_active_player() {
    return active_player;
}
function set_active_player() {
    if (active_player > players.length) {
        active_player = 0;
    }
    else {
        active_player++;
    }
}

function emitInfo(data) {
    console.log("Emitting on master channel", data);
    io.emit(master_channel, data)
}

function emit_active_player(player_id) {
    io.emit(get_active_player_channel, { active_player: get_active_player(), init_by: player_id });
}


app.get('/', function(req, res){
  res.sendFile(__dirname + "/ludo.html");
});

app.get('/index', function(req, res){
    res.sendFile(__dirname + "/index.html");
  });

app.get("/contact", function (req, res) {
    // console.log("contact");
    // res.render('contact');
})



io.on('connection', function(socket) {
    console.log("a user  connected");

    socket.on("new_visitor", user => {
        //new user joined game
        console.log("new visitor", user);
        socket.user = user;
        emitNewPlayer(user.id);
    });

    socket.on(child_channel, data => {
        console.log("gen update", emitted_data);
        emitted_data.push(data)
        
        console.log("gen update", data, emitted_data);
        emitInfo([data])
    });

    socket.on(get_active_player_channel, () => {
        //requesting active player
        emit_active_player();
    })

    socket.on(set_active_player_channel, (data) => {
        //change of active player
        set_active_player();
        emit_active_player(data.player_id);
    })

    socket.on("reset_game", (data) => {
        player_counter = 0;
        active_player = 0;
        emitted_data = [];
		console.log("reset game", data);
        io.emit('reset_status', true);
    });
	
	socket.on("connect_f", (data) => {
		console.log("connect", data);
	   io.emit('send_data', data);
	});
	

    socket.on(chat_channel, data => {
        console.log(chat_channel, data)
        io.emit(chat_dist_channel, data);
    })

    
    // socket.on("disconnect", function() {
    //     // console.log("user disconnected");
    //     // emitVisitors();
    // });
    // socket.emit("new_visitor", {fst: 2})
});
// http. , "192.168.137.1"
http.listen(port, function(){
  console.log(`listening on *:${port}`);
});