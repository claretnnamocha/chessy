class Dice {
    
    GeneratorObject = undefined;
    PlayerObject = undefined;

    _dice = {};
    die_max_no = 6;
    vall = 16; counterr=0;
    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.init();
    }

    init() {
        this.PlayerObject = this.GeneratorObject.getPlayerObject();
        console.log("Dice initialized");
    }

    set_die_max_no(value) {
        this.die_max_no = value;
    }
    get_die_max_no() {
        return this.die_max_no;
    }
    pla_co = 0;
    roll(nth_value=undefined, player_id, custom_data=undefined) {
        console.log("Custom Data", custom_data)
        // this.counterr = 0;
        let dice = [];
        if (nth_value == undefined) nth_value = 2;
        
        for (let i = 1; i <= nth_value; i++) {
            let die_value = undefined;
            if (custom_data != undefined) {
                //load custom value
                die_value = this.gen_die_value(custom_data.dice[i - 1].val)
            }
            else {
                die_value = this.gen_die_value();
            }

            // if (this.counterr >= 0) {
            //     die_value = this.vall;
            //     this.counterr +=1;
            //     if (this.pla_co >= 3) {
            //         die_value = this.gen_die_value();
            //     }
            //     this.pla_co++;
               
                // if(player_id == 0) {
                //      die_value = 28;
                //     //  this.counterr +=1;
                // }
            //     if(player_id == 0 && this.counterr == 3) {
            //         die_value = 5;
            //         this.counterr +=1;
            //    }

            //    if(player_id == 1 && this.counterr == 0) {
            //         die_value = 6;
            //         this.counterr +=1;
            //     }
            //     if(player_id == 1 && this.counterr == 1) {
            //         die_value = 6;
            //         this.counterr +=1;
            //     }

            // }
            
            let die_title = (custom_data != undefined) ? custom_data.dice[i - 1].title : constants.DIE + i + + new Date().getMilliseconds();
            console.log("die",die_title, die_value, player_id);
            dice.push({ title: die_title, val: die_value, player_id: player_id });
            //add to dice object
            this._dice[die_title] = die_value;

            
        }
        

        let dice_vals = [];
        let dice_keys = Object.keys(dice);
        dice.forEach(element => {
            dice_vals.push(element.val);
            let button = document.createElement("button");
            button.onclick = () => {
                console.log(JSON.stringify(dice_ids))
                die_action(player_id, element);
            };
            button.innerText = element.val;
            button.setAttribute("id", element.title);
            UIObject.replicate("#dice_value", button);
        });
        
        // console.log(dice)
        let result = { dice: dice, "Turn": (dice_vals.indexOf(6) != dice_vals.lastIndexOf(6)) };

        //publish
        console.log("Dice emit ",this.GeneratorObject.get_player(), player_id)
        if (this.GeneratorObject.get_player() == player_id) {
            // result.nth_value = nth_value;
            this.GeneratorObject.publish({dice: result, nth_value: nth_value}, publish_action.dice_roll, publish_source.dice)
        } 

        return  result;
    }
    

    gen_die_value(custom=undefined) {
        let die_value = 0;
        if (custom != undefined) {
            die_value = custom;
        }  
        else {
            die_value = Math.floor(Math.random() * this.get_die_max_no()) + 1;
        }      
        return die_value;
    }

    remove_from_dice(die_title, update_ui=true) {
        delete this._dice[die_title];
        if(update_ui) this.GeneratorObject.UIObject.force_remove(die_title);

        if (this.get_dice().length == 0) {
            this.GeneratorObject.set_active_player();
            this.pla_co = 0;
        }
    }

    get_dice() {
        return Object.keys(this._dice);
    }

    empty_dice() {
        let keys = this.get_dice();
        if (keys.length > 0) {
            keys.forEach(die_title => {
                this.remove_from_dice(die_title);
            });
        }
        else {
            this.GeneratorObject.set_active_player();
        }
        
    }

    override(action, value) {
        let player = this.PlayerObject.get(value.player_id);
        console.log("Die received ", value);
        switch (action) {
            case publish_action.dice_roll:
                this.roll(value.nth_value, player.id, value.dice);
                break;
        }
    }
}