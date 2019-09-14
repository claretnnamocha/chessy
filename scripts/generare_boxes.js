class Generator{
    boxes(no_per_base, bases, container){
        //used for testing purposes
        //to generate boxes needed
        for(let base = 0; base < bases.length; base++) {
            console.log("base " + bases[base])
            for(let i = 1; i <= no_per_base; i++) {
                console.log("Point " + (bases[base] + "" + i))
                // divs for boxes
                let div = document.createElement("div");
                // let attr = document.createAttribute("class");
                // attr.value = "box";
                div.setAttribute("class", "box");
                div.setAttribute("id", (bases[base] + "" + i));

                //append to the parent
                console.log(div);
                container.children().html("<div class='box' id='" + (bases[base] + "" + i) + "'></div>");
                // document.querySelector(".container").appendChild(div);
            }
            //create a div for clearing
            let div = document.createElement("div");
            div.style.clear = "both";
            //append to the parent
            container.children().html(div);
        }
        
    }
}