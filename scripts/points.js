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
        },
        block: {
            default: this.price * 2
        }
    }

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.init();
        
    }

    init() {
        this.PinObject = this.GeneratorObject.getPinObject();
        this.UIObject = this.GeneratorObject.getUIObject();
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
        this.BlocksObject = this.GeneratorObject.getBlocksObject();
        console.log("Points initialized");
    }

    use(type, action="", player_id=undefined, pin_id=undefined, block_id=undefined) {

        switch(type) {
            case constants.PIN:
                this.pin_action(player_id, pin_id, action);
                break;
            case constants.BLOCK:
                console.log("Case Block [UP]");
                this.block_action(player_id, block_id, action);
                break;
            default:
                break;
        }
    }

    pin_action(player_id, pin_id, action) {
        let active_pin = this.PinObject.get(undefined, pin_id);
        
        switch(action) {
            case constants.ARMOUR:
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
        let block = this.GeneratorObject.BlocksObject.get(block_id);
        if (block == undefined) {
            this.UIObject.display_message(messages.ACTIVATE_BLOCK);
            return;
        }
        console.log("Block Action [UP]");
        switch(action) {
            case constants.WALL:
                if (block.game.owner == player_id) {
                    this.increase_block_level(player_id, block);
                }
                else {
                    this.UIObject.display_message(messages.PURCHASE_BLOCK_FIRST);
                }
                
                break;
            case constants.TRAP:
                if (block.game.owner != undefined) {
                    this.set_trap(player_id, block);
                }
                else {
                    this.UIObject.display_message(messages.PURCHASE_BLOCK_FIRST);
                }
                break;
            default:
                break;
        }
    }

    increase_armour(player_id, pin, type="default", value) {
        // console.log(pin)
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
            this.GeneratorObject.BlocksObject.update_wall_level(block.id, block.game.wall.level + 1);
            this.GeneratorObject.BlocksObject.own_wall(block.id, block.game.owner);
            this.PlayerObject.update_points(player_id, parseInt(player.game.points) - parseInt(price));
            console.log("increased block", block.id + " currently wall level " + block.game.wall.level, block.game.wall);
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
        
    }

    set_trap(player_id, block, type="default", value) {
        let player = this.PlayerObject.get(player_id);
        

        if (block.game.trap == undefined) {
            block.game.trap = {level: 0, owner: player_id, id: new Date().getMilliseconds() }
        }

        let price = ((block.game.trap.level == 0) ? 1 : block.game.trap.level) * this.pricing.trap[type];
        // console.log(price)
        if (player.game.points >= price) {
            block.game.owner = player_id;
            block.game.trap.level++;
            this.PlayerObject.update_points(player_id, parseInt(player.game.points) - parseInt(price));
            console.log("setting block", block.id + " trap level " + block.game.trap.level + " owner: " + block.game.owner);
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
    }

}