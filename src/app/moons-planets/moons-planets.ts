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

export interface Game {
    p1Num : number, 
    p2Num : number, 
    p1Moons : number, 
    p2Moons : number, 
    attempts : number, 
}

export class MoonsPlanetsAPI {
    arena : SVGSVGElement
    controls : SVGSVGElement
    games : Game[]
    game : Game
    gameIndex : number;

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
    pCoords : Pos[];

    targetMoonCoords : Pos[]

    animationEls : SVGUseElement[]
    gameEls : SVGUseElement[]
    playBtn : SVGUseElement;
    retryBtn : SVGUseElement;
    nextBtn : SVGUseElement

    tl : any

    constructor(setup, games) {
        this.games = games
        this.game = games[0]
        this.gameIndex = 0

        this.arena = setup.arena
        this.controls = setup.controls
        this.inputMoons = []
        this.totalMoons = 0
        
        this.moonRows = 0;
        this.moonCols = 0;
        this.p1Moons = this.game.p1Moons
        this.p2Moons = this.game.p2Moons
        this.p1Num = this.game.p1Num
        this.p2Num = this.game.p2Num
        this.animationEls = []
        this.gameEls = []
        this.targetMoonCoords = []
        this.pCoords = []

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
        this.controls.appendChild(playBtn)
        playBtn.setAttribute("href","#play-btn")
        gsap.set(playBtn, {x : 10, y : 10, transformOrigin : "35px 35px"})

        playBtn.onpointerdown = function(e) {
            self.game.attempts++;
            self.tl.to(playBtn, {duration : 0.2, scale : 0})
            self.playAnimation()
        }   
        this.playBtn = playBtn

        var retryBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(retryBtn)
        retryBtn.setAttribute("href","#retry-btn")
        gsap.set(retryBtn, {x : 10, y : 10, transformOrigin : "35px 35px", scale : 0})

        retryBtn.onpointerdown = function(e) {
            self.reset()
        }
        this.retryBtn = retryBtn

        var nextBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(nextBtn)
        nextBtn.setAttribute("href","#next-btn")
        gsap.set(nextBtn, {x : 1180, y : 10, transformOrigin : "35px 35px", scale : 0})

        nextBtn.onpointerdown = function(e) {
            self.nextGame()
        }
        this.nextBtn = nextBtn

    }

    setupArrows() {
        var self = this

        var up = document.createElementNS(svgns,"use")
        this.arena.appendChild(up)
        up.setAttribute("href","#arrow-up")
        gsap.set(up, {x : 300, y : 560})

        up.onpointerdown = function(e) {
            self.fill(self.moonRows - 1, self.moonCols) //TO DO
        }

        var down = document.createElementNS(svgns,"use")
        this.arena.appendChild(down)
        down.setAttribute("href","#arrow-down")
        gsap.set(down, {x : 300, y : 645}) 

        down.onpointerdown = function(e) {
            self.fill(self.moonRows + 1, self.moonCols) // TO DO 
        }

        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)
        left.setAttribute("href","#arrow-left")
        gsap.set(left, {x : 240, y : 600})

        left.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols - 1) // TO DO 
        }

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)
        right.setAttribute("href","#arrow-right")
        gsap.set(right, {x : 360, y : 600})

        right.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols + 1) // TO DO 
        }

    }

    setupInputMoons(rows, cols) {
        var self = this
        var inputMoonCoords = this.gridCoords(100, 100, rows, cols, 45)

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
                gsap.set(moon, {x : p.x, y : p.y, scale : 1.2})
    
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
        var self = this
        var planetsNum = this.p1Num + this.p2Num
        //var pCoords = this.gridCoords(635, 50, Math.ceil((planetsNum + 1)/ 4), 4, 100 + 75)

        // (722.5, 50) (897.5, 50) (1072.5, 50)
        // (635, 225) (810, 225) (985, 225), (1160, 225)
        // (722.5, 400) (897.5, 400) (1072.5, 400)
        var yVal = 100
        var xVal = 722.5
        var delta = 175
        this.pCoords = self.rowCoords(xVal, yVal, 3, 175)
        
        xVal -= (delta/2)
        yVal += delta
        this.pCoords = this.pCoords.concat(self.rowCoords(xVal, yVal, 4, 175))
        
        xVal += (delta/2)
        yVal += delta
        this.pCoords = this.pCoords.concat(self.rowCoords(xVal, yVal, 3, 175))
        
        //planet positions 

        var r = 60

        var moonIndex = 0
        var planetIndex = 0
        for(var i = 0; i < this.p1Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet1")
            
            //var p = this.pCoords[Math.floor(i / 4)][i % 4]
            var p = this.pCoords[planetIndex]
            gsap.set(planet, {x : p.x, y : p.y, transformOrigin : "center"})
            planetIndex++;

            this.gameEls.push(planet)

            //add moons 
            var coords = this.circleCoords(this.p1Moons, p.x + 12, p.y + 35, 60)
            for(var j = 0; j < this.p1Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")

                this.targetMoonCoords.push(coords[j])
                this.gameEls.push(moon)
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y})
                moonIndex++;
            }

        }

        for(var i = this.p1Num; i < this.p1Num + this.p2Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet2")
            
            //var p = this.pCoords[Math.floor(i / 4)][i % 4]
            var p = this.pCoords[planetIndex]
            gsap.set(planet, {x : p.x, y : p.y, transformOrigin : "center"})
            planetIndex++;
            this.gameEls.push(planet)

            //add moons 
            var coords = this.circleCoords(this.p2Moons, p.x + 12, p.y + 35, 60)
            for(var j = 0; j < this.p2Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")

                this.targetMoonCoords.push(coords[j])
                this.gameEls.push(moon)
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y})
                moonIndex++;
            }
        }
    }
    

    playAnimation() {
        var self = this
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
                gsap.set(moon, {x : gsap.getProperty(m, "x"), y : gsap.getProperty(m, "y"), scale : 1.2})
                moons.push(moon)
                this.animationEls.push(moon)
            }
        }

        var goal = this.p1Num*this.p1Moons + this.p2Num*this.p2Moons
        var switchMoons = this.p1Num*this.p1Moons
        var time = 0.5
        self.tl.to(self.playBtn, {duration : 0.5})
        var moonGroups = []
        var tempMoons = []
        for(var i = 0; i < this.totalMoons && i < goal; i++) {
            if (i >= switchMoons && (i - switchMoons) % this.p2Moons == 0) {
                self.tl.to(moons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1, duration : time})
                if (tempMoons.length > 0) moonGroups.push(tempMoons)
                tempMoons = [moons[i]]

            }
            else if (i < switchMoons && i % this.p1Moons == 0) {
                self.tl.to(moons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1, duration : time})
                if (tempMoons.length > 0) moonGroups.push(tempMoons)
                tempMoons = [moons[i]]
            }
            else {
                self.tl.to(moons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1, duration : time}, "<")
                tempMoons.push(moons[i])
            }
        }

        //TO DO: success or fail animation 
        if (this.totalMoons == goal) {
            //console.log("success")
            this.game.attempts = 3
            this.tl.to([self.retryBtn, self.nextBtn], {scale : 1, rotation : 0})

            //TO DO: spin moons around planets
            //this.tl.to(moonGroups[0], {transformOrigin : "10px 10px", duration : 0})
            //this.tl.to(moonGroups[0], {rotation : 360, duration : 1})
            // 
            for(var i = 0; i < this.pCoords.length; i++) {
                var cx = this.pCoords[i].x + 27.5
                var cy = this.pCoords[i].y + 27.5

                console.log(cx, cy)

                //not working
                // for(var j = 0; j < moonGroups[i].length; j++) {
                //     var mx = gsap.getProperty(moonGroups[i][j], "x")
                //     var my = gsap.getProperty(moonGroups[i][j], "y")

                //     console.log(mx, my, cx, cy)
                //     this.tl.to(moonGroups[i][j], {transformOrigin : (cx - mx) + " " + (cy - my), duration : 0})
                //     this.tl.to(moonGroups[i][j], {rotation : 360, duration : 1})
                // }
                //this.tl.to(moonGroups[i], {transformOrigin : cx + " " + cy, duration : 0})
                //this.tl.to(moonGroups[i], {rotation : 360, duration : 1})
            }

        }
        else if (this.totalMoons < goal){
            //console.log("fail")
            //TO DO: some fail animation 
            //show restart button

            
        }
        else { //totalMoons > goal
            gsap.set(moons[goal], {transformOrigin : "center"})
            this.tl.to(moons[goal], {scale : "+="+0.3})
            for(var i = goal+1; i < this.totalMoons; i++) {
                gsap.set(moons[i], {transformOrigin : "center"})
                this.tl.to(moons[i], {scale : "+="+0.3}, "<")
            }
            this.tl.to(moons[goal], {scale : "-="+0.3})
            for(var i = goal+1; i < this.totalMoons; i++) {
                this.tl.to(moons[i], {scale : "-="+0.3}, "<")
            }
        }

        if (this.game.attempts > 2) {
            gsap.set(self.retryBtn, {scale : 0, x : 10, y : 10, rotation : 0})
            this.tl.to([self.retryBtn, self.nextBtn], {scale : 1, rotation : 0})
        }
        else {
           //self.tl.to([self.retryBtn], {scale : 1})
           //rotatating retry in middle
           gsap.set(self.nextBtn,{duration: 0, scale: 0})
     
           gsap.set(self.retryBtn, {scale : 0, x : 610, y : 320, rotation : 0})
           this.tl.to(self.retryBtn, {scale : 3})
           //self.tl.to(self.retryBtn, {duration: 1, scale: 3}) 

           //TO DO: rotating retry button
           //snapping bug???
           //self.tl.to(self.retryBtn, {repeat : -1, duration : 4, rotation : 360, ease: "bounce"}) 
        }

        this.totalMoons = 0
        this.moonCols = 0
        this.moonRows = 0
    }

    reset() {
        var self = this
        this.animationEls.forEach(el => {
            this.arena.removeChild(el)
        });
        this.animationEls = []

        gsap.set(self.playBtn, {scale : 1})
        
        if (self.game.attempts > 2)
            gsap.set(self.nextBtn, {scale : 1})
        else
            gsap.set(self.nextBtn, {scale : 0})
        
        self.tl.to(self.retryBtn, {scale : 0, rotation : 0, duration : 0})
    }
    
    nextGame() {
        this.gameIndex = (this.gameIndex + 1) % this.games.length;
        this.game = this.games[this.gameIndex]

        this.p1Num = this.game.p1Num
        this.p2Num = this.game.p2Num
        this.p1Moons = this.game.p1Moons
        this.p2Moons = this.game.p2Moons

        this.reset()

        //remove target moons and planets 
        this.gameEls.forEach(el => {
            this.arena.removeChild(el)
        });
        this.gameEls = []
        this.targetMoonCoords = []

        this.setupPlanets()


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

    rowCoords(xVal, yVal, cols, delta) {
        var coords : Pos[] = []
        for(var i = 0; i < cols; i++) {
            coords.push({x : xVal + i * delta, y : yVal})
        }
        return coords
    }

}