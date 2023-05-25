import {svgns} from "../api"
import { gsap, Draggable, Power1, Elastic } from "gsap/all";


interface Pos {
    x : number,
    y : number
}

interface InputEl extends SVGUseElement {
    num : number, 
    on : boolean,
}

export class MoonsPlanetsAPI {
    arena : SVGSVGElement

    inputMoons : InputEl[]
    totalMoons : number

    constructor(setup, p1Moons, p2Moons) {

        this.arena = setup.arena
        this.inputMoons = []
        this.totalMoons = 0

        this.init()
        
    }

    init() {
        this.setupInputMoons()
        this.setupArrows()
    }

    setupArrows() {
        var self = this

        var up = document.createElementNS(svgns,"use")
        this.arena.appendChild(up)
        up.setAttribute("href","#arrow-up")
        gsap.set(up, {x : 240, y : 550})

        up.onpointerdown = function(e) {
            self.fill(self.totalMoons - 10)
        }

        var down = document.createElementNS(svgns,"use")
        this.arena.appendChild(down)
        down.setAttribute("href","#arrow-down")
        gsap.set(down, {x : 240, y : 650})

        down.onpointerdown = function(e) {
            self.fill(self.totalMoons + 10)
        }

        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)
        left.setAttribute("href","#arrow-left")
        gsap.set(left, {x : 180, y : 600})

        left.onpointerdown = function(e) {
            self.fill(self.totalMoons - 1)
        }

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)
        right.setAttribute("href","#arrow-right")
        gsap.set(right, {x : 300, y : 600})

        right.onpointerdown = function(e) {
            self.fill(self.totalMoons + 1)
        }

    }

    setupInputMoons() {
        var self = this
        var inputMoonCoords = this.gridCoords(20, 40, 10, 10, 40 + 10)

        var i = 0
        inputMoonCoords.forEach(p => {
            //var moon = document.createElementNS(svgns,"use")
            var moon = Object.assign(document.createElementNS(svgns,"use"), {
                num : i+1,
                on : false
            })
            this.arena.appendChild(moon)
            moon.setAttribute("href","#moon-outline")
            gsap.set(moon, {x : p.x, y : p.y})

            this.inputMoons.push(moon)

            moon.onpointerdown = function(e) {
                self.fill(moon.num)
            }

            i++;
        }); 
    }
    
    fill(num) {
        //var num = moon.num
        if (num <= 0) {
            for(var i = 0; i < this.totalMoons; i++) {
                m = this.inputMoons[i]
                if (m.on) {
                    m.setAttribute("href","#moon-outline")
                    m.on = false
                }
            }
            this.totalMoons = 0
            return
        }
        else if(num > 100) num = 100

        var moon = this.inputMoons[num-1]
        
        if (!moon.on) {
            
            for(var i = this.totalMoons; i < num; i++) {
                var m = this.inputMoons[i]
                if (!m.on) {
                    m.setAttribute("href","#moon")
                    m.on = true
                }
            }
        }
        else {
            for(var j = num; j < this.totalMoons; j++) {
                var m = this.inputMoons[j]
                if (m.on) {
                    m.setAttribute("href","#moon-outline")
                    m.on = false
                }
            }
        }
        this.totalMoons = num
        //console.log(this.totalMoons)
    }

    gridCoords(xVal, yVal, rows, cols, delta) {
        var coords : Pos[] = [];
          for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
              coords.push({x : xVal + j * delta, y : yVal + i * delta});
            }
          }
          return coords;
    }

}