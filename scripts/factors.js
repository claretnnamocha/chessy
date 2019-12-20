class Factor {
    PinObject = undefined;
    GeneratorObject = undefined;
    factors = ['attack', 'defense', 'magic']

    constructor(GeneratorObject) {
        this.GeneratorObject = GeneratorObject;
        this.PinObject = this.GeneratorObject.getPinObject();
    }

    calc_power(pin_id) {
        let pin = this.PinObject.get(undefined, pin_id);
        let pin_order = this.PinObject.pin_order;
        let factors = pin.game.factors;
        let power = 0;
        let agility_factor = (0.4 * factors.agility.value);
        let random = pin.player.game.luck;
        switch(pin.game.order) {
            case pin_order.offensive:
                power = (3 * factors.attack) + (2 * factors.defense) + (2 * factors.magic) + (5 * agility_factor) + random;
                break;
            case pin_order.defensive:
                power = (2 * factors.attack) + (3* factors.defense) + (2 * factors.magic) + (5 * agility_factor) + random;
                break;
            default:
                break;
        }
        console.log("Pin id",pin_id," POWER ", power, " Factors", factors)
        return power;
    }

    convert_power_to_factors(pin_id, power=0, auto_update=true) {
        let current_pin = this.GeneratorObject.PinObject.get(undefined, pin_id);
        console.log("PIN", current_pin)
        let percentage = { }
        let result = { }
        let total = 0;
        let pin_factors = current_pin.game.factors;
        //calculate attack percentage
        this.factors.forEach(factor => {
            percentage[factor] = pin_factors[factor]
            total += pin_factors[factor]
        });
        //get percentage value for each factor
        this.factors.forEach(factor => {
            percentage[factor] = (percentage[factor]/total) * 100;
            console.log(pin_id, factor, " percentage :",(percentage[factor]/total) * 100,percentage[factor], total )
        });
        //divide power by percentages
        this.factors.forEach(factor => {
            console.log(pin_id, factor, " power :",(percentage[factor]/100) * power,percentage[factor], power )
            result[factor] = (percentage[factor]/100) * power;
            
        });

        if (auto_update) {
            current_pin.game.factors = result;
        }
        console.log(percentage, total, result, power);
        return result;
    }

    reduce_agility(pin_id){
        let current_pin = this.GeneratorObject.PinObject.get(undefined, pin_id);
        let pin_state = this.GeneratorObject.PinObject.pin_state;
        let updated_agility = current_pin.game.factors.agility.value - current_pin.game.factors.agility.rate;
        if (updated_agility < 0) {
            updated_agility = 0;
            this.GeneratorObject.PinObject.update_pin_state(pin_id, pin_state.dormant);
            setTimeout(() => {
                this.increase_agility(pin_id);
                this.GeneratorObject.PinObject.update_pin_state(pin_id, pin_state.standy);
            }, 15000);
        }
        current_pin.game.factors.agility.value = updated_agility;
        console.log(pin_id, " Agility:", current_pin.game.factors.agility.value, " Rate",current_pin.game.factors.agility.rate)
    }

    increase_agility(pin_id, value=undefined){
        let current_pin = this.GeneratorObject.PinObject.get(undefined, pin_id);
        if (value == undefined) {
            value = current_pin.game.factors.agility.default;
        }
        current_pin.game.factors.agility.value = value;
        console.log(pin_id, " Agility:", current_pin.game.factors.agility.value, " Rate",current_pin.game.factors.agility.rate)
    }
}