class Dice {
    
    GeneratorObject = undefined;
    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
    }

    vall = 6; counterr=0;
    roll(nth_value=undefined, player_id, custom_data=undefined) {
        this.counterr = 0;
        let dice = [];
        if (nth_value == undefined) nth_value = 2;
        
        for (let i = 1; i <= nth_value; i++) {
            let die_value = this.gen_die_value();
            if (this.counterr == 0) {
                die_value = this.vall;
                this.counterr +=1;
                if(player_id == 0) {
                    die_value = 16;
                }
                

            }
            dice.push({ title: constants.DIE + i + Math.floor(Math.random() * 6), val: die_value, player_id: player_id });
        }

        let dice_vals = [];
        let dice_keys = Object.keys(dice);
        dice.forEach(element => {
            dice_vals.push(element.val);
        });
        
        // console.log(dice)
        return { dice: dice, "Turn": (dice_vals.indexOf(6) != dice_vals.lastIndexOf(6)) };
    }

    gen_die_value(custom=undefined) {
        let die_value = 0;
        if (custom != undefined) {
            die_value = custom;
        }  
        else {
            die_value = Math.floor(Math.random() * 6) + 1;
        }
        return die_value;
    }
}