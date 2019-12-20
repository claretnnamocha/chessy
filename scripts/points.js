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
            default: this.price * 2,
            acquire: this.price * 4
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

    override(action, value, player_id) {
        let player = this.PlayerObject.get(player_id);
        switch (action) {
            case publish_action.increase_armour:
                this.increase_armour(value.player_id, value.pin, value.type, value.value);
                break;
            case publish_action.increase_block_level:
                this.increase_block_level(value.player_id, value.block, value.type, value.value);
                break;
            case publish_action.set_trap:
                this.set_trap(value.player_id, value.block, value.type, value.value);
                break;
            case publish_action.point_use:
                this.use(value.type, value.action, value.player_id, value.pin_id, value.block_id);
                break;
            default:
                break;
        }
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
        if (this.GeneratorObject.get_player() == player_id) {
            this.GeneratorObject.publish({ type: type, action: action, player_id: player_id, pin_id: pin_id, block_id: block_id }, publish_action.point_use, publish_source.point)
        }
    }

    get_price(key,value=undefined) {
        let price = 0;
        if (value != undefined) {
            price = this.pricing[key][value]
        }
        else {
            price = this.pricing[key].default;
        }
        return price;
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
        console.log("Block Action", player_id, block_id, action);
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
                else if (block.game.owner == undefined) {
                    this.UIObject.display_message(messages.PURCHASE_BLOCK_FIRST);
                }
                else {
                    this.UIObject.display_message(messages.NOT_MY_BLOCK);
                }
                
                break;
            case constants.TRAP:
                if (block.game.owner == player_id) {
                    this.set_trap(player_id, block);
                }
                else if (block.game.owner == undefined) {
                    this.UIObject.display_message(messages.PURCHASE_BLOCK_FIRST);
                }
                else {
                    this.UIObject.display_message(messages.NOT_MY_BLOCK);
                }
                break;
            case constants.TERRAIN:
                if (block.game.owner == player_id) {
                    this.set_trap(player_id, block);
                }
                else if (block.game.owner == undefined) {
                    this.UIObject.display_message(messages.PURCHASE_BLOCK_FIRST);
                }
                else {
                    this.UIObject.display_message(messages.NOT_MY_BLOCK);
                }
                this.block_action(player_id, block_id, action);
                break;
            default:
                break;
        }
    }

    increase_armour(player_id, pin, type="default", value=undefined) {
        // console.log(pin)
        let player = this.PlayerObject.get(player_id);
        let price = ((pin.game.armour == 0) ? 1 :pin.game.armour) * this.pricing.armour[type];
        if (player.game.points >= price) {
            pin.game.armour = pin.game.armour + 1;
            this.PlayerObject.update_points(player_id, parseInt(player.game.points) - parseInt(price));
            this.UIObject.display_message("increased armour "+ pin.game.pin_id + " currently armour is " +  pin.game.armour);
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
        
    }

    increase_block_level(player_id, block, type="default", value=undefined) {
        let player = this.PlayerObject.get(player_id);

        let price = ((block.game.wall.level == 0) ? 1 : block.game.wall.level) * this.pricing.wall[type];
        if (player.game.points >= price) {
            this.GeneratorObject.BlocksObject.update_wall_level(block.id, block.game.wall.level + 1);
            this.GeneratorObject.BlocksObject.own_wall(block.id, block.game.owner);
            this.PlayerObject.update_points(player_id, parseInt(player.game.points) - parseInt(price));
            this.UIObject.display_message("increased block " + block.id + " currently wall level " + block.game.wall.level);
            
            //
            let base_color = this.GeneratorObject.get_base_pins()[player_id];
            //showing on ui
            this.UIObject.apply_css(block.id, undefined, { background: base_color.replace("_pin",''), color: "white" })
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
        
    }

    set_trap(player_id, block, type="default", value=undefined) {
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
            this.UIObject.display_message("setting block " + block.id + " trap level " + block.game.trap.level + " owner: " + block.game.owner);
            //
            if (this.GeneratorObject.get_player() == player_id) {
                this.UIObject.apply_css(block.id, undefined, { background: "black", color: "white" });
            }
        }
        else {
            this.UIObject.display_message(messages.NOT_ENOUGH_POINTS);
        }
    }

    trigger_terrain(player_id, status=Neutral) {
        let player = this.PlayerObject.get(player_id);
        let result = this.BlocksObject.get_terrain_blocks(player_id);
        let blocks = result.blocks;
        if (result.active == Negative){
            result.active = Neutral;
        } 
        else if (result.active == Neutral) {
            result.active = Negative;
        }

        setTimeout(() => {
            
        }, timeout);

        for (let i = 0; i < blocks.length; i++) {
            let block = this.BlocksObject.get(blocks[i]);
            if (block.game.terrain.valid == Neutral) {
                if (result.active == Negative) result.active = Neutral;
                block.game.terrain.active = result.active;
            }
            else if (block.game.terrain.valid == Negative) {
                this.BlocksObject.delete_from_terrain_blocks(blocks[i], player_id);
            }
        }
    }

}