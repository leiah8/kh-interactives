import {svgns} from "../api"
import { gsap, Draggable, Power1, Elastic } from "gsap/all";

interface Pos {
    x : number,
    y : number
}

export class ZoomAPI {

    arena : HTMLElement;
    svg : HTMLElement; 
    plusBtn : HTMLElement; 
    minusBtn : HTMLElement; 
    inputBtns : HTMLElement;
    width : number;
    height : number;

    zoomIn : boolean;

    constructor(setup) {
        var self = this
        this.arena = setup.arena
        this.svg = setup.svg
        this.plusBtn = setup.plusBtn
        this.minusBtn = setup.minusBtn
        this.inputBtns = setup.inputBtns
        this.height = 720
        this.width = 1280

        this.zoomIn = true
        this.setup()

        var svgHeight = gsap.getProperty(self.svg, "height")
        var svgWidth = gsap.getProperty(self.svg, "width")

        this.svg.onpointerdown = function(e) {

            if (self.zoomIn) {
                self.width -= 50;
                self.height -= 50;
            }
            else {
                self.width += 50;
                self.height += 50;
            }

            if (self.width < 0 || self.height < 0) return

            var h = window.innerHeight 
            var w = window.innerWidth

            var x = e.x - self.width/2 //self.width * (e.x / w)
            var y = e.y - self.height/2 //self.height * (e.y / h) 

            var vb = x + " "+ y + " " + self.width + " " + self.height

            console.log(vb)

            gsap.set(self.svg, {attr:{viewBox: vb}})
        }
    }

    setup() {

        this.setupPlusMinus()

        var n = 4
        var r = 275
        var xVal = 600
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

    setupPlusMinus() {
        var self = this
        //INITIALIZE TO POSITIVE
        gsap.set(self.inputBtns, {scale : 0.7})
        gsap.set(self.plusBtn, {stroke : "#fff"})
        this.plusBtn.onpointerdown = function(e) {
          if (self.zoomIn == false) 
            self.setPlusBtn()
        }
  
        this.minusBtn.onpointerdown = function(e) {
          if (self.zoomIn) 
            self.setMinusBtn()
        }
      }
  
    setPlusBtn() {
        var self = this
        gsap.set(self.plusBtn, {stroke : "#fff"})
        gsap.set(self.minusBtn, {stroke : "#23a3ff"})

        
        self.zoomIn = true
    }
  
    setMinusBtn() {
        var self = this
        gsap.set(self.minusBtn, {stroke : "#fff"})
        gsap.set(self.plusBtn, {stroke : "#23a3ff"})        
      
        
        self.zoomIn = false
    }
}