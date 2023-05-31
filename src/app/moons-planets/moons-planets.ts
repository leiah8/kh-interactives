import {svgns} from "../api"
import { gsap, Draggable, Power1, Elastic } from "gsap/all";

interface Pos {
    x : number,
    y : number
}

interface InputEl extends SVGUseElement {
    row : number, 
    col : number,
    on : boolean,
}

interface AnimationEl extends SVGUseElement {
    xVal : number, 
    yVal : number,
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
    groups : boolean
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
    targetMoons : SVGUseElement[]

    animationMoons : AnimationEl[]
    gameEls : SVGUseElement[]
    playBtn : SVGUseElement;
    retryBtn : SVGUseElement;
    nextBtn : SVGUseElement

    canEdit : boolean

    tl : any

    constructor(setup, games) {
        this.games = games
        this.game = games[0]
        this.gameIndex = 0

        this.arena = setup.arena
        this.controls = setup.controls
        this.groups = setup.groups
        this.inputMoons = []
        this.totalMoons = 0
        
        this.moonRows = 0;
        this.moonCols = 0;
        this.p1Moons = this.game.p1Moons
        this.p2Moons = this.game.p2Moons
        this.p1Num = this.game.p1Num
        this.p2Num = this.game.p2Num
        this.animationMoons = []
        this.gameEls = []
        this.targetMoonCoords = []
        this.targetMoons = []
        this.pCoords = []

        this.canEdit = true

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
        this.setupPlanets()

        //buttons
        var playBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(playBtn)
        playBtn.setAttribute("href","#play-btn")
        gsap.set(playBtn, {x : 10, y : 10, transformOrigin : "35px 35px"})

        playBtn.onpointerdown = function(e) {
            self.game.attempts++;
            self.canEdit = false
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
            self.fill(self.moonRows - 1, self.moonCols) 
        }

        var down = document.createElementNS(svgns,"use")
        this.arena.appendChild(down)
        down.setAttribute("href","#arrow-down")
        gsap.set(down, {x : 300, y : 645}) 

        down.onpointerdown = function(e) {
            self.fill(self.moonRows + 1, self.moonCols) 
        }

        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)
        left.setAttribute("href","#arrow-left")
        gsap.set(left, {x : 240, y : 600})

        left.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols - 1)  
        }

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)
        right.setAttribute("href","#arrow-right")
        gsap.set(right, {x : 360, y : 600})

        right.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols + 1) 
        }

    }

    setupInputMoons() {
        var self = this
        var inputMoonCoords = this.gridCoords(100, 100, this.TOTAL_ROWS, this.TOTAL_COLS, 45)

        //create empty input moons
        for(var i = 0; i < this.TOTAL_ROWS; i++) {
            this.inputMoons.push([])
            for(var j = 0; j < this.TOTAL_COLS; j++) {
                var p = inputMoonCoords[i][j]
                var moon = Object.assign(document.createElementNS(svgns,"use"), {
                    row : i+1, 
                    col : j+1,
                    on : false, 
                })
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")
                gsap.set(moon, {x : p.x, y : p.y, scale : 1.4})
    
                this.inputMoons[i].push(moon)
            }
        }

        //click to fill
        this.inputMoons.forEach(l => {
            l.forEach(moon => {
                moon.onpointerdown = function(e) {
                    self.fill(moon.row, moon.col)
                }
            })
        });

        
    }

    //fill the array of moons to an n by m array
    fill(rows : number, cols : number) {

        if (!this.canEdit) return

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
            for(var j = 0; j < this.TOTAL_COLS; j++) {
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
            for(var i = 0; i < this.TOTAL_ROWS; i++) {
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

        //PLANET COORDINATES
        // (722.5, 50) (897.5, 50) (1072.5, 50)
        // (635, 225) (810, 225) (985, 225), (1160, 225)
        // (722.5, 400) (897.5, 400) (1072.5, 400)
        var yVal = 130
        var xVal = 622.5
        var delta = 210
        this.pCoords = self.rowCoords(xVal, yVal, 4, 175)
        
        //xVal -= (delta/2)
        yVal += delta
        this.pCoords = this.pCoords.concat(self.rowCoords(xVal, yVal, 4, 175))
        
        //xVal += (delta/2)
        yVal += delta
        this.pCoords = this.pCoords.concat(self.rowCoords(xVal, yVal, 4, 175))
        
        //add all p1 planets
        var r = 60
        var planetIndex = 0
        for(var i = 0; i < this.p1Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet1")
            
            var p = this.pCoords[planetIndex]
            gsap.set(planet, {x : p.x, y : p.y, transformOrigin : "center"})
            planetIndex++;

            this.gameEls.push(planet)

            var path = document.createElementNS(svgns,"use")
            this.arena.appendChild(path)
            path.setAttribute("href","#moons-path")
            gsap.set(path, {x : p.x - 40, y : p.y - 40, transformOrigin : "center"})
            this.gameEls.push(path)

            //add moons around planet
            var coords = this.circleCoords(this.p1Moons, p.x + 15, p.y + 15, 65)
            for(var j = 0; j < this.p1Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")

                this.targetMoonCoords.push(coords[j])
                this.gameEls.push(moon)
                this.targetMoons.push(moon)
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y, scale : 1})
            }
        }

        //add all p2 planets
        for(var i = this.p1Num; i < this.p1Num + this.p2Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#planet2")
            
            var p = this.pCoords[planetIndex]
            gsap.set(planet, {x : p.x, y : p.y, transformOrigin : "center"})
            planetIndex++;
            this.gameEls.push(planet)

            var path = document.createElementNS(svgns,"use")
            this.arena.appendChild(path)
            path.setAttribute("href","#moons-path")
            gsap.set(path, {x : p.x - 40, y : p.y - 40, transformOrigin : "center"})
            this.gameEls.push(path)


            //add moons around planet
            var coords = this.circleCoords(this.p2Moons, p.x + 15, p.y + 15, 65)
            for(var j = 0; j < this.p2Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")

                this.targetMoonCoords.push(coords[j])
                this.gameEls.push(moon)
                this.targetMoons.push(moon)
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y, scale : 1})
            }
        }
    }
    

    playAnimation() {
        var self = this
        var goal = this.p1Num*this.p1Moons + this.p2Num*this.p2Moons

        var timeBetweenAnim = 0.2
        var timeBetweenStages = 0.5

        var index = 0
        //make animation moons and reset input moons 
        for(var i = 0; i < this.moonRows; i++) {
            for(var j = 0; j < this.moonCols; j++) {
                var m = this.inputMoons[i][j]
                m.setAttribute("href", "#moon-outline")
                m.on = false

                var moon = Object.assign(document.createElementNS(svgns,"use"), {
                        xVal : null,
                        yVal : null
                }) ;

                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon")
                gsap.set(moon, {x : gsap.getProperty(m, "x"), y : gsap.getProperty(m, "y"), scale : 1.4})
                this.animationMoons.push(moon)
                index++;
            }
        }
        
        self.tl.to(self.playBtn, {duration : timeBetweenStages})

        //move moons to targets
        if (this.groups)
            this.moveMoonsToTargetsGroups(goal, timeBetweenAnim)
        else 
            this.moveMoonsToTargetsOnes(goal, timeBetweenAnim)

        self.tl.to(self.playBtn, {duration : timeBetweenStages})
        
        if (this.totalMoons == goal) {
            //add x/y values to spin around moons
            for(var i = 0; i < this.totalMoons; i++) {
                this.animationMoons[i].xVal =  self.targetMoonCoords[i].x
                this.animationMoons[i].yVal =  self.targetMoonCoords[i].y
            }

            this.game.attempts = 3

            //spin moons around planets

            //delete all targets 
            this.tl.to(this.targetMoons, {scale : 0, duration : 0})

            //transform origin of all animation moons 
            var index = 0
            for(var i = 0; i < this.p1Num + this.p2Num; i++) { //loop through planets
                var p = this.pCoords[i]
                if (i < this.p1Num) {
                    for(var j = 0; j < this.p1Moons; j++) {
                        this.tl.to(this.animationMoons[index], {transformOrigin : (p.x + 27.5 - self.animationMoons[index].xVal) + " " + (p.y + 27.5  - self.animationMoons[index].yVal), scale : 1, duration : 0});
                        index++;
                    }
                }
                else {
                    for(var j = 0; j < this.p2Moons; j++) {
                        this.tl.to(this.animationMoons[index], {transformOrigin : (p.x + 27.5 - self.animationMoons[index].xVal) + " " + (p.y + 27.5  - self.animationMoons[index].yVal), scale : 1, duration : 0});
                        index++;
                    }
                }
            }

            //rotate all animation moons
            this.tl.to(this.animationMoons, {rotation : 360, duration : 4, ease : "linear"})
            // this.tl.to(this.targetMoons, {scale : 0.8, duration : 0})


        }
        else if (this.totalMoons < goal){
            //scale empty targets up and down
            gsap.set(self.targetMoons[self.totalMoons], {transformOrigin : "center"})
            this.tl.to(self.targetMoons[self.totalMoons], {scale : "+="+0.3})
            for(var i = this.totalMoons+1; i < goal; i++) {
                gsap.set(self.targetMoons[i], {transformOrigin : "center"})
                this.tl.to(self.targetMoons[i], {scale : "+="+0.3}, "<")
            }

            this.tl.to(self.targetMoons[self.totalMoons], {scale : "-="+0.3})
            for(var i = this.totalMoons+1; i < goal; i++) {
                this.tl.to(self.targetMoons[i], {scale : "-="+0.3}, "<")
            }

        }
        else { //totalMoons > goal
            //scale extra moons up and down
            gsap.set(this.animationMoons[goal], {transformOrigin : "center"})
            this.tl.to(this.animationMoons[goal], {scale : "+="+0.3})
            for(var i = goal+1; i < this.totalMoons; i++) {
                gsap.set(this.animationMoons[i], {transformOrigin : "center"})
                this.tl.to(this.animationMoons[i], {scale : "+="+0.3}, "<")
            }

            this.tl.to(this.animationMoons[goal], {scale : "-="+0.3})
            for(var i = goal+1; i < this.totalMoons; i++) {
                this.tl.to(this.animationMoons[i], {scale : "-="+0.3}, "<")
            }
        }

        self.tl.to(self.playBtn, {duration : timeBetweenStages})

        //show retry and/or next button 
        if (this.game.attempts > 2) {
            gsap.set(self.retryBtn, {scale : 0, x : 10, y : 10, rotation : 0})
            this.tl.to([self.retryBtn, self.nextBtn], {scale : 1, rotation : 0})
        }
        else {
           gsap.set(self.nextBtn,{duration: 0, scale: 0})
            
           //rotatating retry in middle
           gsap.set(self.retryBtn, {scale : 0, x : 610, y : 320, rotation : 0})
           this.tl.to(self.retryBtn, {scale : 3})
           this.tl.to(self.retryBtn, {repeat : -1, duration : 4, rotation : 360, ease: "bounce"}) 
        }

        this.totalMoons = 0
        this.moonCols = 0
        this.moonRows = 0
    }

    moveMoonsToTargetsOnes(goal, timeBetweenAnim) {
        var self = this
        var time = 0.3
        
        // for(var i = 0; i < this.totalMoons && i < goal; i++) {
        //     self.tl.to(this.animationMoons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1, duration : time})
        // }

        //make groups of the targetMoonCoords
        var moonGroups = []
        var tempGroup;
        var index = 0;

        for(var i = 0; i < this.p1Num; i++) {
            tempGroup = []
            for(var j = 0; j < this.p1Moons; j++) {
                tempGroup.push(this.targetMoonCoords[index])
                index++;
            }
            moonGroups.push(tempGroup)
        }

        for(var i = 0; i < this.p2Num; i++) {
            tempGroup = []
            for(var j = 0; j < this.p2Moons; j++) {
                tempGroup.push(this.targetMoonCoords[index])
                index++;
            }
            moonGroups.push(tempGroup)
        }
        var unfilledPlanets = this.p1Num + this.p2Num
        var moonNum = -1
        var index = 0;

        var newOrderMoons = Array(this.totalMoons)
        for(var i = 0; i < this.totalMoons && i < goal; i++) {
            if (i % unfilledPlanets == 0) {
                moonNum++;
            }
            try {
                var pos = moonGroups[i % unfilledPlanets][moonNum]
                self.tl.to(this.animationMoons[i], {x : pos.x, y : pos.y, scale : 1, duration : time})
                self.tl.to(this.animationMoons[i], {duration : timeBetweenAnim})
                newOrderMoons[(i % unfilledPlanets)*moonGroups.length + moonNum] = this.animationMoons[i]
            } catch {
                i--;
                unfilledPlanets--;
            }
        }

        //change order of animation moons to match rotation 

        this.animationMoons = newOrderMoons
        console.log(newOrderMoons)


    }

    moveMoonsToTargetsGroups(goal, timeBetweenAnim) {
        var self = this
        var switchPlanets = this.p1Num*this.p1Moons
        var time = 0.5

        for(var i = 0; i < this.totalMoons && i < goal; i++) {
            //first moon to planet 2
            if (i >= switchPlanets && (i - switchPlanets) % this.p2Moons == 0) {
                self.tl.to(this.animationMoons[i], {duration : timeBetweenAnim})
                self.tl.to(this.animationMoons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1, duration : time})
            }
            //first moon to planet 1
            else if (i < switchPlanets && i % this.p1Moons == 0) {
                self.tl.to(this.animationMoons[i], {duration : timeBetweenAnim})
                self.tl.to(this.animationMoons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1, duration : time})
            }
            //other moons (follow the first)
            else {
                self.tl.to(this.animationMoons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1, duration : time}, "<")
            }
        }
    }

    reset() {
        var self = this
        this.animationMoons.forEach(el => {
            this.arena.removeChild(el)
        });
        this.animationMoons = []

        //reset buttons
        gsap.set(self.playBtn, {scale : 1})
        gsap.set(self.retryBtn, {scale : 0, rotation : 0, duration : 0})
        
        if (self.game.attempts > 2)
            gsap.set(self.nextBtn, {scale : 1})
        else
            gsap.set(self.nextBtn, {scale : 0})

        this.canEdit = true
        
        this.tl.clear()
    }
    
    nextGame() {
        //increment game and change values
        this.gameIndex = (this.gameIndex + 1) % this.games.length;
        this.game = this.games[this.gameIndex]

        this.p1Num = this.game.p1Num
        this.p2Num = this.game.p2Num
        this.p1Moons = this.game.p1Moons
        this.p2Moons = this.game.p2Moons

        this.pCoords = []

        this.reset()

        //remove target moons and planets 
        this.gameEls.forEach(el => {
            this.arena.removeChild(el)
        });
        this.gameEls = []
        this.targetMoonCoords = []
        this.targetMoons = []

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