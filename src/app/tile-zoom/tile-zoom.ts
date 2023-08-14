import { gsap, CustomEase } from "gsap/all";
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
        gsap.registerPlugin(CustomEase)

        var e = CustomEase.create("custom", "M0,0,C0,0,0.014,0.001,0.022,0.003,0.031,0.006,0.037,0.01,0.045,0.015,0.054,0.021,0.06,0.027,0.068,0.035,0.077,0.044,0.083,0.05,0.09,0.061,0.108,0.089,0.12,0.107,0.135,0.137,0.155,0.179,0.165,0.205,0.181,0.249,0.201,0.305,0.211,0.336,0.228,0.394,0.247,0.46,0.256,0.497,0.273,0.565,0.292,0.644,0.301,0.686,0.318,0.766,0.337,0.858,0.359,0.98,0.363,0.998,0.367,0.989,0.385,0.924,0.411,0.885,0.444,0.836,0.496,0.803,0.524,0.803,0.532,0.803,0.55,0.804,0.569,0.804,0.596,0.804,0.652,0.836,0.682,0.892,0.703,0.93,0.72,0.982,0.726,0.998,0.73,0.994,0.743,0.979,0.754,0.968,0.761,0.961,0.766,0.957,0.774,0.952,0.782,0.947,0.788,0.943,0.796,0.941,0.804,0.938,0.811,0.937,0.819,0.937,0.827,0.937,0.833,0.938,0.841,0.941,0.85,0.944,0.855,0.947,0.863,0.952,0.872,0.958,0.877,0.963,0.885,0.971,0.894,0.981,0.902,0.992,0.908,0.998,0.914,0.996,0.923,0.99,0.933,0.987,0.941,0.985,0.947,0.984,0.955,0.984,0.964,0.984,0.97,0.985,0.978,0.988,0.986,0.991,1,1,1,1")

        this.tl.to(this.svg, {duration : 1.5})

        var tl2 = gsap.timeline()
        //for(var i = this.TILE_NUM-1; i >= 0; i--) {
        for(var j = 0; j < order.length; j++) {
            var i = order[j]

            gsap.set(this.tiles[i], {y : "-="+ 900})
            // this.tl.to(this.tiles[i], {y : "+="+900, duration : 1.5, ease : "bounce"}, ">-1")
            // this.tl.to(this.tiles[i], {y : "+="+900, duration : 1.5, ease : e}, ">-1")

            this.tl.to(this.tiles[i], {y : "+="+900, duration : 1, ease : Power1.easeIn}, ">-1")
                .to(this.tiles[i], {y : "-="+50, duration : 0.2, ease : Power1.easeOut})
                .to(this.tiles[i], {y : "+="+50, duration : 0.2, ease : Power1.easeIn})
                .to(this.tiles[i], {y : "-="+20, duration : 0.15, ease : Power1.easeOut})
                .to(this.tiles[i], {y : "+="+20, duration : 0.15, ease : Power1.easeIn})

                // this.tl.to(this.tiles[i], {y : "+="+900, duration : 1, ease : Power1.easeIn, onComplete : function() {
                //     var t = this.targets()[0]
                //     var timeline = gsap.timeline()
                //     timeline.to(t, {y : "-="+50, duration : 0.2, ease : Power1.easeOut})
                //     .to(t, {y : "+="+50, duration : 0.2, ease : Power1.easeIn})
                //     .to(t, {y : "-="+20, duration : 0.15, ease : Power1.easeOut})
                //     .to(t, {y : "+="+20, duration : 0.15, ease : Power1.easeIn})
                // }}, ">-0.75")

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
