

class TimerHandler {
    GeneratorObject = undefined;
    PinObject = undefined;
    BlocksObject = undefined;
    timers = {}

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.init();

    }

    init() {
        this.PinObject = this.GeneratorObject.getPinObject();
        this.BlocksObject = this.GeneratorObject.getBlocksObject();
    }

    get_timers() {
        let keys = Object.keys(this.timers);
        return keys;
    }

    get_player_timers(player_id) {
        return this.timers[player_id];
    }

    get_timer(player_id, comp_id, timer_type) {
        let timers = this.get_player_timers(player_id);
        if (timers == undefined) {
            return timers;
        }
        console.log("TImer ", timers)
        timers = timers[comp_id];
        console.log("TImers", timers)
        let timer = undefined;
        for (let i = 0; i < timers.length; i++) {
            // this.timers[player_id][comp_id]
            if (timers[i].timer_type == timer_type) {
                timer = timers[i];
            }

        }
        return timer;
    }

    add_timer(player_id, comp_id, timer, timer_type, type) {
        let keys = this.get_timers();
        console.log("add TImer", keys, player_id, keys.indexOf(player_id) == -1, keys.indexOf("0"))
        let timer_details = { timer: timer, timer_type: timer_type, type: type };
        if (keys.indexOf(player_id.toString()) == -1) {
            console.log("Ading new timer and player")
            this.timers[player_id] = {}
            this.timers[player_id][comp_id] = [timer_details]
        }
        else {
            if (this.get_timer(player_id, comp_id, timer_type) == undefined) {
                console.log("Ading new timer")
                //timer doesnt exisit
                this.timers[player_id][comp_id].push(timer_details)
            }
        }
        
    }

    stop_timer(player_id, comp_id, timer_type) {
        let timer = this.get_timer(player_id, comp_id, timer_type);
        console.log("stopping timer ", timer.timer)
        switch(timer.type) {
            case 'I':
                    clearInterval(timer.timer)
                break;
            case 'T':
                    clearTimeout(timer.timer)
                break;
            default:
                break;

        }
        
    }

    new_timeout(player_id, comp_id, action, timeout=5000, timer_type) {
        if (this.get_timer(player_id, comp_id, timer_type) == undefined) {
            let timer = setTimeout(() => {
                action();
            }, timeout);

            this.add_timer(player_id, comp_id, timer, timer_type, 'T');
        }
        
    }

    new_interval(player_id, comp_id, action, interval=5000, timer_type) {
        if (this.get_timer(player_id, comp_id, timer_type) == undefined) {
            let timer = setInterval(() => {
                action();
            }, interval);

            this.add_timer(player_id, comp_id, timer, timer_type, 'I');
        }
    }
}