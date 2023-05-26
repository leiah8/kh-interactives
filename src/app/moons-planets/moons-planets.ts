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
    p1Moons : number
    p2Moons : number

    animationEls : SVGUseElement[]

    tl : any

    constructor(setup, p1Moons, p2Moons) {

        this.arena = setup.arena
        this.inputMoons = []
        this.totalMoons = 0
        this.p1Moons = p1Moons
        this.p2Moons = p2Moons
        this.animationEls = []

        this.tl = gsap.timeline()

        this.init()
        
    }

    init() {
        this.setupEls()
    }

    setupEls() {
        var self = this
        this.setupInputMoons()
        this.setupArrows()

        var playBtn = document.createElementNS(svgns,"use")
        this.arena.appendChild(playBtn)
        playBtn.setAttribute("href","#play-btn")
        gsap.set(playBtn, {x : 10, y : 10})

        playBtn.onpointerdown = function(e) {
            self.playAnimation()
        }   

    }

    setupArrows() {
        var self = this

        var up = document.createElementNS(svgns,"use")
        this.arena.appendChild(up)
        up.setAttribute("href","#arrow-up")
        gsap.set(up, {x : 300, y : 575})

        up.onpointerdown = function(e) {
            self.fill(self.totalMoons - 10)
        }

        var down = document.createElementNS(svgns,"use")
        this.arena.appendChild(down)
        down.setAttribute("href","#arrow-down")
        gsap.set(down, {x : 300, y : 660})

        down.onpointerdown = function(e) {
            self.fill(self.totalMoons + 10)
        }

        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)
        left.setAttribute("href","#arrow-left")
        gsap.set(left, {x : 240, y : 615})

        left.onpointerdown = function(e) {
            self.fill(self.totalMoons - 1)
        }

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)
        right.setAttribute("href","#arrow-right")
        gsap.set(right, {x : 360, y : 615})

        right.onpointerdown = function(e) {
            self.fill(self.totalMoons + 1)
        }

    }

    setupInputMoons() {
        var self = this
        var inputMoonCoords = this.gridCoords(80, 75, 10, 10, 40 + 10)

        var i = 0
        inputMoonCoords.forEach(p => {
            //var moon = document.createElementNS(svgns,"use")
            var moon = Object.assign(document.createElementNS(svgns,"use"), {
                num : i+1,
                on : false, 
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

    reset() {
        this.animationEls.forEach(el => {
            this.arena.removeChild(el)
        });
        this.animationEls = []
    }

    playAnimation() {
        this.reset()

        //make animation moons and reset input moons 
        var moons = []
        for(var i = 0; i < this.totalMoons; i++) {
            var m = this.inputMoons[i]
            m.setAttribute("href", "#moon-outline")
            m.on = false

            var moon = document.createElementNS(svgns,"use")
            this.arena.appendChild(moon)
            moon.setAttribute("href","#moon")
            gsap.set(moon, {x : gsap.getProperty(m, "x"), y : gsap.getProperty(m, "y")})
            moons.push(moon)
        }

        //get coordinates for planets //TO DO 
        var p1Num = Math.floor(this.totalMoons / this.p1Moons)
        var planetsNum = p1Num + Math.floor((this.totalMoons - p1Num*this.p1Moons) / this.p2Moons)
        var pCoords = this.gridCoords(635, 50, Math.ceil((planetsNum + 1)/ 4), 4, 100 + 75)

        //move moons
        var self = this
        var i = 0
        var index = 0
        var r = 60
        var planets = []
        while(this.totalMoons - i >= this.p1Moons) {
            //make planet 
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet1")
            planets.push(planet)
            gsap.set(planet, {x : pCoords[index].x, y : pCoords[index].y, scale : 0, transformOrigin : "center"})
            self.tl.to(planet, {scale : 1})

            //add moons //TO DO 
            var coords = self.circleCoords(self.p1Moons, pCoords[index].x + 10, pCoords[index].y + 30, r)
            self.tl.to(moons[i], {x : coords[0].x, y : coords[0].y})
            for(var j = 1; j < this.p1Moons; j++) {
                self.tl.to(moons[i+j], {x : coords[j].x, y : coords[j].y}, "<")
            }
            i += this.p1Moons
            index++;
        }

        while(this.totalMoons - i >= this.p2Moons) {
            
            //make planet 
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet2")
            planets.push(planet)
            gsap.set(planet, {x : pCoords[index].x, y : pCoords[index].y, scale : 0, transformOrigin : "center"})
            self.tl.to(planet, {scale : 1})


            //add moons //TO DO 
            var coords = self.circleCoords(self.p2Moons, pCoords[index].x + 10, pCoords[index].y + 30, r)
            self.tl.to(moons[i], {x : coords[0].x, y : coords[0].y})
            for(var j = 1; j < this.p2Moons; j++) {
                self.tl.to(moons[i+j], {x : coords[j].x, y : coords[j].y}, "<")
            }
            i += this.p2Moons
            index++;
        }

        var leftoverMoons = this.totalMoons - i
        var leftoverCoords = this.gridCoords(pCoords[index].x,pCoords[index].y,leftoverMoons, 1, 50)
        self.tl.to(moons[i], {x : leftoverCoords[0].x, y : leftoverCoords[0].y})
        for(var j = 1; j < leftoverMoons; j++) {
            self.tl.to(moons[i+j], {x : leftoverCoords[j].x, y : leftoverCoords[j].y}, "<")
        }

        this.animationEls = planets.concat(moons)
        this.totalMoons = 0


        
    }

    circleCoords(num, xVal, yVal, r) {
        var coords : Pos[] = [];
        var theta;
        for(var i = 0; i < num; i++) {
            theta = (i / (num/2)) * Math.PI
            coords.push({x : r * Math.cos(theta) + xVal, y : r * Math.sin(theta) + yVal})
        }

        return coords

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