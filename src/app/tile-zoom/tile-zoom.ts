import { gsap } from "gsap/all";
import { Power2, Power1 } from "gsap";
import { svgns } from "../api"


export class TileZoomAPI {
    arena : HTMLElement;
    svg : HTMLElement;

    TILE_W : number = 300;
    TILE_H : number = 190;

    DELTA : number = 20;
    TILE_NUM : number = 12;
    ROWS : number = 3;
    COLS : number = 4

    XVAL : number = 10;
    YVAL : number = 10;

    tl : any

    tiles : SVGUseElement[];

    constructor(setup) {
        this.arena = setup.arena
        this.svg = setup.svg

        this.tl = gsap.timeline()
        this.tiles = []

        this.setup()
        this.start()

        if (setup.num > 0 && setup.num <= 12)
            this.animate(setup.num)
        else {
            this.pane(7)
            this.pane(9)
            this.animate(1)
        }

    }

    setup() {
        var count = 1
        for(var i = 0; i <= this.COLS; i++) {
            for(var j = 0; j <= this.ROWS; j++) {

                var temp = document.createElementNS(svgns, "use")
                this.arena.appendChild(temp)
                temp.setAttribute("href", "#tile" + (count).toString())
                gsap.set(temp, { x: this.XVAL + this.TILE_W*j + this.DELTA*j, y: this.YVAL + this.TILE_H*i + this.DELTA*i })
                this.tiles.push(temp)

                count++;
            }
        }


    }

    start() {
        // this.tl.to(this.svg, { duration: 2})
        // //have blocks fall in 

        var order = [11, 10, 9, 8, 4, 5, 6, 7, 3, 2, 1, 0]

        this.tl.to(this.svg, {duration : 2.5})
        //for(var i = this.TILE_NUM-1; i >= 0; i--) {
        for(var j = 0; j < order.length; j++) {
            var i = order[j]

            gsap.set(this.tiles[i], {y : "-="+ 900})
            this.tl.to(this.tiles[i], {y : "+="+900, duration : 2.5}, "<1")

        }
    }

    animate(num) {

        this.tl.to(this.svg, { duration: 2})

        var col = (num-1) % this.COLS
        var row = Math.floor((num-1) / this.COLS)

        var x = col*(this.TILE_W + this.DELTA) + this.XVAL
        var y = row*(this.TILE_H + this.DELTA) + this.YVAL

        var vb = (x).toString() + " " + (y).toString() + " " + (this.TILE_W).toString() + " " + (this.TILE_H).toString()

        this.tl.to(this.svg, {attr: { viewBox: vb }, duration: 4 })


        this.tl.to(this.svg, {duration: 2})

        this.tl.to(this.svg, {attr: { viewBox: "0 0 1280 720" }, duration: 2})

    }

    pane(num) {
        this.tl.to(this.svg, { duration: 2})

        var col = (num-1) % this.COLS
        var row = Math.floor((num-1) / this.COLS)

        var x = col*(this.TILE_W + this.DELTA) + this.XVAL
        var y = row*(this.TILE_H + this.DELTA) + this.YVAL

        var vb = (x).toString() + " " + (y).toString() + " " + (this.TILE_W).toString() + " " + (this.TILE_H).toString()

        this.tl.to(this.svg, {attr: { viewBox: vb }, duration: 4 })

        this.tl.to(this.svg, {duration: 2})

    }

    
}
