class Points {
    GeneratorObject = undefined;
    PinObject = undefined;
    UIObject = undefined;
    PlayerObject = undefined
    price = 6;
    pricing = {
        trap: {
            default: this.price * 4,
            custom: this.price * 6
        },
        wall: {
            default: this.price * 4
        },
        armour: {
            default: this.price * 2
        }
    }

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.PinObject = this.GeneratorObject.PinObject;
        this.UIObject = GeneratorObject.getUIObject();
        this.PlayerObject = GeneratorObject.getPlayerObject();
    }

    use(type, action="", player_id=undefined, pin_id=undefined, block_id=undefined) {
        switch(type) {
            case "pin":
                this.pin_action(player_id, pin_id, action);
                break;
            case "block":
                this.block_action(player_id, block_id, action);
                break;
            default:
                break;
        }
    }

    pin_action(player_id, pin_id, action) {
        let active_pin = this.PinObject.get(undefined, pin_id);
        
        switch(action) {
            case "armour":
                if (active_pin != null) {
                    this.increase_armour(player_id, active_pin);
                }
                else {
                    this.UIObject.display_message(messages.ACTIVATE_PIN)
                }
                
                break;
            default:
                break;
        }
    }

    block_action(player_id, block_id, action) {
        let block = this.GeneratorObject.get(block_id);
        if (block == undefined) {
            this.UIObject.display_message(messages.ACTIVATE_BLOCK);
            return;
        }
        switch(action) {
            case "wall":
                if (block.game.owner == player_id) {
                    this.increase_block_level(player_id, block);
                }
                break;
            case "trap":
                if (block.game.owner == undefined) {
                    this.set_trap(player_id, block);
                }
                break;
            default:
                break;
        }
    }

    increase_armour(player_id, pin, type="default", value) {
        console.log(pin)
        let player = this.PlayerObject.get(player_id);
        let price = ((pin.game.armour == 0) ? 1 :pin.game.armour) * this.pricing.armour[type];
        if (player.game.points >= price) {
            pin.game.armour = pin.game.armour + 1;
            this.PlayerObject.update_points(player_id, parseInt(player.game.points) - parseInt(price));
            console.log("increased armour", pin.game.pin_id + " currently armour is " +  pin.game.armour);
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
        
    }

    increase_block_level(player_id, block, type="default", value) {
        let player = this.PlayerObject.get(player_id);
        let price = ((block.game.wall.level == 0) ? 1 : block.game.wall.level) * this.pricing.wall[type];
        if (player.game.points >= price) {
            block.game.wall.level = block.game.wall.level + 1;
            this.PlayerObject.update_points(player_id, parseInt(player.game.points) - parseInt(price));
            console.log("increased block", block.id + " currently wall level " + block.game.wall.level);
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
        
    }

    set_trap(player_id, block, type="default", value) {
        let player = this.PlayerObject.get(player_id);
        let price = ((block.game.trap == 0) ? 1 : block.game.trap) * this.pricing.trap[type];
        if (player.game.points >= price) {
            block.game.owner = player_id;
            block.game.trap +=1;
            console.log("setting block", block.id + " trap level " + block.game.trap + " owner: " + block.game.owner);
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
    }

}