loadEvents = () => {
    // Player Name [start]
    document.querySelector('#player-name .form').onsubmit = (event) => {
        event.preventDefault()
        player_name = document.querySelector('#player-name .name').value
        settings = { player_name, created: Date.now() }
        console.log(settings)
        socket.emit('new-player', player_name)
        socket.on('player-name-exists', (name) => {
            alert(`player name '${name}' is already in use!`)
        })
        socket.on('player-name-reserved', (name) => {
            // alert(`welcome ${name}!`)
            document.querySelector('#game-type .player-name').innerHTML = name
            document.querySelector('#player-name').style.display = 'none'
            document.querySelector('#game-type').style.display = 'block'
        })
    }
    // Player Name [end]


    // Game Type [start]
    document.querySelector('#game-type .change-name').onclick = (event) => {
        event.preventDefault()
        name = document.querySelector('#game-type .player-name').innerHTML
        socket.emit('change-name', name)
        document.querySelector('#player-name').style.display = 'block'
        document.querySelector('#game-type').style.display = 'none'
    }

    document.querySelector('#game-type .form').onsubmit = (event) => {
        event.preventDefault()
        game_name = document.querySelector('#game-type .game').value
        socket.emit('new-game', game_name)

		document.querySelector('#game .player-name').innerHTML = player_name
		document.querySelector('#game .game-type').innerHTML = game_name
        document.querySelector('#game-type').style.display = 'none'
        document.querySelector('#game').style.display = 'block'

        // Game [start]
        socket.on('game-update', (games) => {
            document.querySelector('#game .gamers-count').innerHTML = JSON.parse(games)[game_name].onlinePlayers
        })
        // Game [end]
    }
    // Game Type [end]
}