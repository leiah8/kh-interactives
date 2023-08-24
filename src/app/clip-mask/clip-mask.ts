import { gsap } from "gsap/all";
import { svgns } from "../api"

export class CodingAnimation {
    arena : SVGSVGElement;
    printer : SVGSVGElement;
    top : SVGSVGElement;
    head : SVGSVGElement;
    string : SVGSVGElement;
    printerTip : SVGSVGElement;

    buildings : SVGUseElement[];

    tl : any;
    printerTL : any;

    diff : number = 48;
    headStartY : number;
    stringStartScale : number;

    tipX : number;
    tipXLeft : number = -13;
    tipXRight : number = 13;
    moveVal : number = 1.5;

    constructor(setup) {
        this.arena = setup.arena
        this.printer = setup.printer
        this.top = setup.top
        this.head = setup.head
        this.string = setup.string
        this.printerTip = setup.printerTip

        this.buildings = [];

        this.tl = gsap.timeline();

        this.printerTL = gsap.timeline();

        this.stringStartScale = Number(gsap.getProperty(this.string, "scaleX"))
        this.headStartY = Number(gsap.getProperty(this.head, "y"));

        this.tipX = 0;

        
        this.main();

    }

    main() {

        this.addBuildings();
        this.drawBuildings();

    }

    addBuildings() {

        var xVal = 18;

        var deltaX = 55.5;
        var singleHeight = 28;
        var yVal = 76.7;

        var b1 = document.createElementNS(svgns, "use");
        this.arena.appendChild(b1);
        b1.setAttribute("href", "#building-1");
        gsap.set(b1, {x : xVal, y : yVal});

        gsap.set(b1, {clipPath: "inset(100% 0% 0% 0%)"})

        this.buildings.push(b1);

        var b2 = document.createElementNS(svgns, "use");
        this.arena.appendChild(b2);
        b2.setAttribute("href", "#building-1");
        gsap.set(b2, {x : xVal + deltaX, y : yVal});

        this.buildings.push(b2);

        gsap.set(b2, {clipPath: "inset(100% 0% 0% 0%)"})

        var b3 = document.createElementNS(svgns, "use");
        this.arena.appendChild(b3);
        b3.setAttribute("href", "#building-3");
        gsap.set(b3, {x : xVal + 2*deltaX, y : yVal + singleHeight*3 + 2});

        this.buildings.push(b3);

        gsap.set(b3, {clipPath: "inset(100% 0% 0% 0%)"})

        var b4 = document.createElementNS(svgns, "use");
        this.arena.appendChild(b4);
        b4.setAttribute("href", "#building-3");
        gsap.set(b4, {x : xVal + 3*deltaX, y : yVal + singleHeight*3 + 2});

        this.buildings.push(b4);

        gsap.set(b4, {clipPath: "inset(100% 0% 0% 0%)"})

    }
    
    onUpdatePrinterMoveString(self) {
        const scaleVal = Number(gsap.getProperty(self.string, "scaleX"));
        // console.log(scaleVal);
        gsap.set(self.head, {y : self.headStartY + (scaleVal - self.stringStartScale)*self.diff})
        
    }

    onUpdatePrinterMoveHead(self) {
        const yVal = Number(gsap.getProperty(self.head, "y"));
        // console.log(scaleVal);
        gsap.set(self.string, {scaleX : (yVal - self.headStartY)/self.diff + self.stringStartScale})
        self.movePrinterX(self)
        
    }

    movePrinterX(self) {
        if (self.tipX >= self.tipXRight || self.tipX <= self.tipXLeft) {
            self.moveVal = -self.moveVal;
        }
        self.tipX += self.moveVal
        gsap.set(self.printerTip, {x :"+="+ self.moveVal})
       
    }

    movePrinterToMiddle() {
        this.tipX = 0;
        this.moveVal = Math.abs(this.moveVal)
        this.printerTL.to(this.printerTip, {x : 0});

    }

    drawBuildings() {

        var deltaX = 55.5;
        var self = this

        //move printer over and down
        this.tl.to(this.printer, {x : "-=" + 223, duration : 4, ease : "linear"});
        this.tl.to(this.string, {scaleX : 3.35, ease : "linear", duration : 3, onUpdate : this.onUpdatePrinterMoveString, onUpdateParams : [this]});

        this.tl.to(this.arena, {duration : 1})


        //print b1
        this.tl.to(this.buildings[0], {clipPath : "inset(75% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
        this.tl.to(this.buildings[0], {clipPath : "inset(50% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
        this.tl.to(this.buildings[0], {clipPath : "inset(25% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
        this.tl.to(this.buildings[0], {clipPath : "inset(0% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");

        

        //move printer over and down
        // this.movePrinterToMiddle()
        this.tl.to(this.printer, {x : "+=" + deltaX, duration : 2, ease : "linear", onStart : function() {
            self.movePrinterToMiddle()
        }});
        this.tl.to(this.string, {scaleX : 3.35, ease : "linear", duration : 3, onUpdate : this.onUpdatePrinterMoveString, onUpdateParams : [this]});


        //print b2
        this.tl.to(this.buildings[1], {clipPath : "inset(75% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
        this.tl.to(this.buildings[1], {clipPath : "inset(50% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
        this.tl.to(this.buildings[1], {clipPath : "inset(25% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
        this.tl.to(this.buildings[1], {clipPath : "inset(0% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
        


        //move printer over and down
        //this.movePrinterToMiddle()
        this.tl.to(this.printer, {x : "+=" + deltaX, duration : 2, ease : "linear", onStart : function() {
            self.movePrinterToMiddle()
        }});
        this.tl.to(this.string, {scaleX : 3.35, ease : "linear", duration : 3, onUpdate : this.onUpdatePrinterMoveString, onUpdateParams : [this]});


        //print b3
        this.tl.to(this.buildings[2], {clipPath : "inset(0% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");

        //move printer over and down
        // this.movePrinterToMiddle()
        this.tl.to(this.printer, {x : "+=" + deltaX, duration : 2, ease : "linear", onStart : function() {
            self.movePrinterToMiddle()
        }});
        this.tl.to(this.string, {scaleX : 3.35, ease : "linear", duration : 1, onUpdate : this.onUpdatePrinterMoveString, onUpdateParams : [this]});

        //print b4
        this.tl.to(this.buildings[3], {clipPath : "inset(0% 0% 0% 0%)", duration : 1, ease : "linear"})
        this.tl.to(this.head, {y : "-=" + 28.75, duration : 1, ease : "linear", onUpdate : this.onUpdatePrinterMoveHead, onUpdateParams : [this]}, "<");
    
        this.tl.to(this.arena, {onStart : function() {
            self.movePrinterToMiddle()
        }})
    }
}