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
const player_info = [
    { name: "Mike Ade", age: "22", wins: 1, game: { points: 50 } },
    { name: "Julia Thomas", age: "18", wins: 1, game: { points: 50 } },
    { name: "James Darkyn", age: "23", wins: 3, game: { points: 50 } },
    { name: "Silver Pulker", age: "28", wins: 8, game: { points: 50 } }
];

let emitted_data = [];

let generator_id = 0;

/// generator info </>


//channels
let master_channel = "M-" + generator_id;
let set_active_player_channel = "M-SA-" + generator_id;
let get_active_channel = "GA-" + generator_id;
let child_channel = "C-" + generator_id;
//


function emitNewPlayer(id) {
    //add to players
    players.push(id);

    console.log("Emitting new Player");
    io.emit(id, {id: id, player_info: player_info[player_counter], player_counter: player_counter, generator_id: generator_id, type: 'new'});
    io.emit(id, { data: emitted_data, type: 'gen', len: emitted_data.length, player_id: id });
    io.emit(id, {players: players})
    player_counter++;
    
}

function get_active_player() {
    return players[active_player];
}
function set_active_player() {
    if (active_player > players.length) {
        active_player = 0
    }
    else {
        active_player++;
    }
}

function emitInfo(data) {
    io.emit(master_channel, data)
}

function emit_active_player() {
    io.emit(set_active_player_channel, get_active_player());
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
    // console.log("a user  connected");

    socket.on("new_visitor", user => {
        console.log("new visitor", user);
        socket.user = user;
        emitNewPlayer(user.id);
        // emitVisitors();
    });

    socket.on(child_channel, data => {
        console.log("gen update", emitted_data);
        emitted_data.push(data)
        
        console.log("gen update", data, emitted_data);
        emitInfo([data])
    });

    socket.on(get_active_channel, () => {
        emit_active_player();
    })

    socket.on("SA-" + generator_id, () => {
        emit_active_player();
    })

    socket.on("reset_game", (data) => {
        player_counter = 0;
        emitted_data = [];
    });

    
    // socket.on("disconnect", function() {
    //     // console.log("user disconnected");
    //     // emitVisitors();
    // });
    // socket.emit("new_visitor", {fst: 2})
})
http.listen(port, function(){
  console.log(`listening on *:${port}`);
});