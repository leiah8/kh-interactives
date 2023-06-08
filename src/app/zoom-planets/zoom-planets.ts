import {svgns} from "../api"
import { gsap, Draggable, Power1, Elastic } from "gsap/all";

interface Pos {
    x : number,
    y : number
}

export class ZoomAPI {

    arena : any 

    constructor(setup) {
        this.arena = setup.arena
        this.setup()
    }

    setup() {

        var n = 8
        var r = 275
        var xVal = 500
        var yVal = 350

        var a = document.createElementNS(svgns,"use")
        this.arena.appendChild(a)
        a.setAttribute("href","#moon")

        gsap.set(a, {scale : 10, transformOrigin : "center"})
        gsap.set(a, {x : xVal, y : yVal})

        var aCoords = this.circleCoords(n, xVal, yVal, r)
        for(var i = 0; i < n; i++) {

            var b = document.createElementNS(svgns,"use")
            this.arena.appendChild(b)
            b.setAttribute("href","#sun")

            gsap.set(b, {scale : 2, transformOrigin : "center"})
            gsap.set(b, {x : aCoords[i].x, y : aCoords[i].y})

            var bCoords = this.circleCoords(n, aCoords[i].x, aCoords[i].y, r/3.5)
            for(var j = 0; j < n; j++) {
                var c = document.createElementNS(svgns,"use")
                this.arena.appendChild(c)
                c.setAttribute("href","#planet")

                gsap.set(c, {scale : 1, transformOrigin : "center"})
                gsap.set(c, {x : bCoords[j].x, y : bCoords[j].y})

                var cCoords = this.circleCoords(n, bCoords[j].x, bCoords[j].y, r/12)
                for(var k = 0; k < n; k++) {
                    var d = document.createElementNS(svgns,"use")
                    this.arena.appendChild(d)
                    d.setAttribute("href","#moon")

                    gsap.set(d, {scale : 0.3, transformOrigin : "center"})
                    gsap.set(d, {x : cCoords[k].x, y : cCoords[k].y})

                    var dCoords = this.circleCoords(n, cCoords[k].x, cCoords[k].y, r/40)
                    for(var l = 0; l < n; l++) {
                        var e = document.createElementNS(svgns,"use")
                        this.arena.appendChild(e)
                        e.setAttribute("href","#moon")

                        gsap.set(e, {scale : 0.1, transformOrigin : "center"})
                        gsap.set(e, {x : dCoords[l].x, y : dCoords[l].y})
                    }
                    

                }

            }

        }


    }

    circleCoords(num, xVal, yVal, r) {
        var coords : Pos[] = [];
        var theta;
        for(var i = 0; i < num; i++) {
            theta = (i / (num/2)) * Math.PI + Math.PI/2
            coords.push({x : r * Math.cos(theta) + xVal, y : r * Math.sin(theta) + yVal})
        }
        return coords

    }
}