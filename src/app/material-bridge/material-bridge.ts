import { svgns } from "../api"
import { gsap, Draggable } from "gsap/all";


export interface GameInput {

}

export class MaterialBridgeAPI {

    input : HTMLElement;
    inputImg : HTMLElement;
    currentImg : SVGUseElement
    inputSize : HTMLSelectElement;

    constructor(setup, games) {
        var self =this
        this.input = setup.input
        this.inputImg = setup.inputImg
        this.inputSize = setup.inputSize

        gsap.set(this.input, {x : 190, y : 550})

        this.currentImg = document.createElementNS(svgns, "use")
        this.inputImg.appendChild(this.currentImg)
        this.currentImg.setAttribute("href", "#one")
        gsap.set(this.currentImg, { x: 0, y: 0 })


        
        this.inputSize.onchange = function(e) {
            var val = self.inputSize.value
            if (val == "1")
                self.currentImg.setAttribute("href", "#one")
            else if (val == "1/2")
                self.currentImg.setAttribute("href", "#half")
            else if (val == "1/3")
                self.currentImg.setAttribute("href", "#third")
            else if (val == "1/4")
                self.currentImg.setAttribute("href", "#fourth")

        }


        
    }
}