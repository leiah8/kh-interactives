import { gsap, Draggable } from "gsap/all";

export interface scrollbarSetup {
    lineMin : number,
    lineMax : number,
    rangeNum : number,
}

export function horizontalScrollAPI (_els, _setup) {
    let self = {} as horizontalScrollClass

    class horizontalScrollClass {
        els : SVGSVGElement | null;
        setup : scrollbarSetup;
        svgns : string;

        start_text : HTMLElement;
        end_text : HTMLElement

        tl : any

        constructor(els, setup) {
            console.log("hello")
            
            self = this
            this.els = els
            this.setup = setup
            this.svgns = "http://www.w3.org/2000/svg";

            this.start_text = document.getElementById("start_text") as HTMLElement
            this.end_text = document.getElementById("start_text") as HTMLElement

            this.tl = gsap.timeline()
            this.main()
        }
    
        main() {
            console.log("hello")
            gsap.set(self.start_text, {visibility : "hidden"});
    
        }
    }



}