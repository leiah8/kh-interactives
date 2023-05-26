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

    inputMoons : InputEl[][]
    totalMoons : number
    TOTAL_ROWS : number = 10;
    TOTAL_COLS : number = 10;
    moonRows : number
    moonCols : number
    p1Moons : number
    p2Moons : number
    p1Num : number
    p2Num : number

    targetMoonCoords : Pos[]

    animationEls : SVGUseElement[]

    tl : any

    constructor(setup, p1Num, p1Moons, p2Num, p2Moons) {

        this.arena = setup.arena
        this.inputMoons = []
        this.totalMoons = 0
        
        this.moonRows = 0;
        this.moonCols = 0;
        this.p1Moons = p1Moons
        this.p2Moons = p2Moons
        this.p1Num = p1Num
        this.p2Num = p2Num
        this.animationEls = []
        this.targetMoonCoords = []

        this.tl = gsap.timeline()

        this.init()
        
    }

    init() {
        this.setupEls()
    }

    setupEls() {
        var self = this
        this.setupInputMoons(this.TOTAL_ROWS, this.TOTAL_COLS)
        this.setupArrows()
        this.setupPlanets()

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
            self.fill(self.moonRows - 1, self.moonCols) //TO DO
        }

        var down = document.createElementNS(svgns,"use")
        this.arena.appendChild(down)
        down.setAttribute("href","#arrow-down")
        gsap.set(down, {x : 300, y : 660}) 

        down.onpointerdown = function(e) {
            self.fill(self.moonRows + 1, self.moonCols) // TO DO 
        }

        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)
        left.setAttribute("href","#arrow-left")
        gsap.set(left, {x : 240, y : 615})

        left.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols - 1) // TO DO 
        }

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)
        right.setAttribute("href","#arrow-right")
        gsap.set(right, {x : 360, y : 615})

        right.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols + 1) // TO DO 
        }

    }

    setupInputMoons(rows, cols) {
        var self = this
        var inputMoonCoords = this.gridCoords(80, 75, rows, cols, 40 + 10)

        for(var i = 0; i < rows; i++) {
            this.inputMoons.push([])
            for(var j = 0; j < cols; j++) {
                var p = inputMoonCoords[i][j]
                var moon = Object.assign(document.createElementNS(svgns,"use"), {
                    num : i+1,
                    on : false, 
                })
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")
                gsap.set(moon, {x : p.x, y : p.y})
    
                this.inputMoons[i].push(moon)
            
            }
        }


    }

    fill(rows : number, cols : number) {

        if (rows < 0) rows = 0
        else if (rows > this.TOTAL_ROWS) rows = this.TOTAL_ROWS

        if (cols < 0) cols = 0
        else if (cols > this.TOTAL_COLS) cols = this.TOTAL_COLS


        //turn on needed rows 
        for(var i = 0; i < rows; i++) {
            for(var j = 0; j < cols; j++) {
                var m = this.inputMoons[i][j]
                if (!m.on) {
                    m.on = true
                    m.setAttribute("href", "#moon")
                }
            
            }
        }

        //turn off needed rows 
        for(var i = rows; i < this.TOTAL_ROWS; i++) {
            for(var j = 0; j < cols; j++) {
                var m = this.inputMoons[i][j]
                if (m.on) {
                    m.on = false
                    m.setAttribute("href", "#moon-outline")
                }
            
            }
        }

        //turn on needed columns 
        console.log(rows, cols)
        for(var j = 0; j < cols; j++) {
            for(var i = 0; i < rows; i++) {
                var m = this.inputMoons[i][j]
                if (!m.on) {
                    m.on = true
                    m.setAttribute("href", "#moon")
            }
        
        }

        //turn off needed columns 
        for(var j = cols; j < this.TOTAL_COLS; j++) {
            for(var i = 0; i < rows; i++) {
                var m = this.inputMoons[i][j]
                if (m.on) {
                    m.on = false
                    m.setAttribute("href", "#moon-outline")
                }
            
            }
        }
    }

        this.moonRows = rows
        this.moonCols = cols
        this.totalMoons = rows*cols
    }

    setupPlanets() {
        var planetsNum = this.p1Num + this.p2Num
        var pCoords = this.gridCoords(635, 50, Math.ceil((planetsNum + 1)/ 4), 4, 100 + 75)

        var r = 60

        var moonIndex = 0
        for(var i = 0; i < this.p1Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet1")
            
            var p = pCoords[Math.floor(i / 4)][i % 4]
            gsap.set(planet, {x : p.x, y : p.y, scale : 1, transformOrigin : "center"})

            //add moons 
            var coords = this.circleCoords(this.p1Moons, p.x + 10, p.y + 30, 60)
            for(var j = 0; j < this.p1Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")

                this.targetMoonCoords.push(coords[j])
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y})
                moonIndex++;
            }

        }

        for(var i = this.p1Num; i < this.p1Num + this.p2Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet2")
            
            var p = pCoords[Math.floor(i / 4)][i % 4]
            gsap.set(planet, {x : p.x, y : p.y, scale : 1, transformOrigin : "center"})

            //add moons 
            var coords = this.circleCoords(this.p2Moons, p.x + 10, p.y + 30, 60)
            for(var j = 0; j < this.p2Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")

                this.targetMoonCoords.push(coords[j])
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y})
                moonIndex++;
            }
        }
    }
    

    playAnimation() {
        //make animation moons and reset input moons 
        var moons = []
        for(var i = 0; i < this.moonRows; i++) {
            for(var j = 0; j < this.moonCols; j++) {
                var m = this.inputMoons[i][j]
                m.setAttribute("href", "#moon-outline")
                m.on = false

                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon")
                gsap.set(moon, {x : gsap.getProperty(m, "x"), y : gsap.getProperty(m, "y")})
                moons.push(moon)
            }
        }

        for(var i = 0; i < this.totalMoons; i++) {
            this.tl.to(moons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y })
        }

        this.totalMoons = 0
        this.moonCols = 0
        this.moonRows = 0
    }

    /*

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
    */

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
        var coords : Pos[][] = [];
          for (var i = 0; i < rows; i++) {
            coords.push([])
            for (var j = 0; j < cols; j++) {
              coords[i].push({x : xVal + j * delta, y : yVal + i * delta});
            }
          }
          return coords;
    }

}