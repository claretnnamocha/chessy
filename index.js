const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handlebars = require('express-handlebars')
const port = process.env.PORT || 5000
let connectedUsers = 0;
let players = {}
let games = {}
let connections = {}


//-------------------------------------------------------------
//							Socket.io 
//------------------------------------------------------------- 
io.on('connect', (socket) => {
    connectedUsers += 1
    console.log(`connection to ${socket.id} established!`)
    connections[socket.id] = socket
    io.sockets.emit('connection-update',connectedUsers)
    io.sockets.emit('game-update',JSON.stringify(games))

    socket.on('disconnect', () => {
        connectedUsers -= 1
        delete connections[socket.id]
    	io.sockets.emit('connection-update',connectedUsers)
        console.log(`connection to ${socket.id} lost!`)
    })

    socket.on('new-player', (player_name) => {

        if (!players[player_name]) {
            socket.emit('player-name-reserved', player_name)
            players[player_name] = { player_name, socket }
            console.log(`player ${player_name} online!`)
        } else {
            socket.emit('player-name-exists', player_name)
            return
        }

        socket.on('disconnect', () => {
            delete players[player_name]
            console.log(`player ${player_name} is offline!`)
        })

        socket.on('change-name', (name) => {
        	delete players[name]
            console.log(`removed player named '${name}'!`)
        })

        socket.on('new-game', (game_type) => {
            games[game_type] = games[game_type] || {}
            games[game_type].players = games[game_type].players || []
            games[game_type].onlinePlayers = games[game_type].onlinePlayers || 0
            games[game_type].players.push(player_name)
            games[game_type].onlinePlayers += 1
            console.log(`${player_name} joined ${game_type} game!`)
            io.sockets.emit('game-update',JSON.stringify(games))
            socket.on('disconnect', () => {
                games[game_type].onlinePlayers -= 1
                games[game_type].players.pop(games[game_type].players.indexOf(player_name))
                delete players[player_name]
            	io.sockets.emit('game-update',JSON.stringify(games))
                console.log(`${player_name} left ${game_type} game!`)
            })
        })
    })

    socket.on('group-inquiry',(group_name)=>{
        console.log(`requesting details of ${group_name}!`)
        details = games[group_name.trim()] || {}
    	socket.emit('group-details',JSON.stringify(details))    	
    })
})
//-------------------------------------------------------------
//							Socket.io [end] 
//------------------------------------------------------------- 




//-------------------------------------------------------------
//							Routes 
//------------------------------------------------------------- 
app.engine('html', handlebars({
    defaultLayout: 'main',
    extname: '.html'
}))
app.set('view engine', 'html')

app.use('/assets', express.static('static/'))

// Game
app.get('/game', function(req, res) {
    res.render('game/setup')
})
// End Game


// Admin
app.get('/admin', (req, res) => {
    res.render('admin/dashboard', { layout: 'admin' });
})
// End Admin


//-------------------------------------------------------------
//							Routes [end]
//------------------------------------------------------------- 




let Server = server.listen(port, () => {
    console.log(`App Running on http://localhost:${Server.address().port}`)
})