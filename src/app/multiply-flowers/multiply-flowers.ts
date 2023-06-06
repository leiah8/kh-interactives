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

    signs = []

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
        this.playBtn = setup.playBtn
        this.nextBtn = setup.nextBtn
        this.retryBtn = setup.retryBtn
        this.inputMoons = []
        this.totalMoons = 0
        
        this.moonRows = 1;
        this.moonCols = 1;
        this.p1Moons = this.game.p1Moons
        this.p2Moons = this.game.p2Moons
        this.p1Num = this.game.p1Num
        this.p2Num = this.game.p2Num
        this.animationMoons = []
        this.gameEls = []
        this.targetMoonCoords = []
        this.targetMoons = []
        this.pCoords = (this.rowCoords(720, 150, 4, 140).concat(this.rowCoords(720, 350, 4, 140))).concat(this.rowCoords(720, 550, 4, 140))
        
        this.signs = []

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
        this.fill(1,1)
        this.setupArrows()
        this.setupPlanets()

        this.playBtn.onpointerdown = function(e) {
            self.game.attempts++;
            self.canEdit = false
            self.tl.to(self.playBtn, {duration : 0.2, scale : 0})
            self.playAnimation()
        }   
        
        gsap.set(this.retryBtn, {scale : 0})

        this.retryBtn.onpointerdown = function(e) {
            self.reset()
        }

        gsap.set(this.nextBtn, {scale : 0})

        this.nextBtn.onpointerdown = function(e) {
            self.nextGame()
        }

    }

    setupArrows() {
        var self = this
        var x = 300
        var y = 580

        var up = document.createElementNS(svgns,"use")
        this.arena.appendChild(up)
        up.setAttribute("href","#arrow-up")
        gsap.set(up, {x : x+62, y : y})

        up.onpointerdown = function(e) {
            self.fill(self.moonRows + 1, self.moonCols) 
        }

        var down = document.createElementNS(svgns,"use")
        this.arena.appendChild(down)
        down.setAttribute("href","#arrow-down")
        gsap.set(down, {x : x+62, y : y+80}) 

        down.onpointerdown = function(e) {
            self.fill(self.moonRows - 1, self.moonCols) 
        }

        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)
        left.setAttribute("href","#arrow-left")
        gsap.set(left, {x : x, y : y+40})

        left.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols - 1)  
        }

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)
        right.setAttribute("href","#arrow-right")
        gsap.set(right, {x : x+125, y : y+40})

        right.onpointerdown = function(e) {
            self.fill(self.moonRows, self.moonCols + 1) 
        }

    }

    setupInputMoons() {
        var self = this
        var inputMoonCoords = this.gridCoords(110, 75, this.TOTAL_ROWS, this.TOTAL_COLS, 40)

        for(var j = 0; j < this.TOTAL_COLS; j++) {
            var rowOutline = document.createElementNS(svgns, "rect")
            this.arena.appendChild(rowOutline)
            gsap.set(rowOutline, {x : inputMoonCoords[0][j].x - 6 + j*15, y : inputMoonCoords[0][j].y - 7.5, height : this.TOTAL_ROWS*50 +5, width : 40, rx : 16, fill : "#4F311C"})

        }

        //create empty input moons
        for(var i = this.TOTAL_ROWS-1; i >= 0; i--) {
            this.inputMoons.push([])
            
            for(var j = 0; j < this.TOTAL_COLS; j++) {
                var p = inputMoonCoords[i][j]
                var moon = Object.assign(document.createElementNS(svgns,"use"), {
                    row : this.TOTAL_ROWS - i, 
                    col : j+1,
                    on : false, 
                })
                this.arena.appendChild(moon)
                moon.setAttribute("href","#moon-outline")
                gsap.set(moon, {x : p.x + j*15, y : p.y + i*10, scale : 1.3})
    
                this.inputMoons[this.TOTAL_ROWS - 1 - i].push(moon)
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

        if (rows < 1) rows = 1
        else if (rows > this.TOTAL_ROWS) rows = this.TOTAL_ROWS

        if (cols < 1) cols = 1
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

        //REMOVE p1 vs p2 and just have planets/pots+signs and different types of flowers
        
        //add all p1 planet
        var planetIndex = 0
        for(var i = 0; i < this.p1Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#pot")
            
            var p = this.pCoords[planetIndex]
            gsap.set(planet, {x : p.x, y : p.y, transformOrigin : "center"})
            planetIndex++;

            this.gameEls.push(planet)

            var sign = document.createElementNS(svgns,"use")
            this.arena.appendChild(sign)
            sign.setAttribute("href","#pot-sign")
            gsap.set(sign, {x : p.x - 32, y : p.y - 90 })
            //150 - 75
            this.gameEls.push(sign)
            this.signs.push(sign)

            //add flowers to the sign
            var coords = (this.rowCoords(p.x - 20, p.y -75, 5, 23).concat(this.rowCoords(p.x - 20, p.y -75+25, 5, 23)))
            coords.splice(this.p1Moons)
            for(var j = 0; j < this.p1Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#flower")

                this.targetMoonCoords.push(coords[j])
                this.gameEls.push(moon)
                this.targetMoons.push(moon)
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y, scale : 1.1})
            }
        }

        /*
        //add all p2 planets
        for(var i = this.p1Num; i < this.p1Num + this.p2Num; i++) {
            var planet = document.createElementNS(svgns,"use")
            this.arena.appendChild(planet)
            planet.setAttribute("href","#pot")
            
            var p = this.pCoords[planetIndex]
            gsap.set(planet, {x : p.x, y : p.y, transformOrigin : "center"})
            planetIndex++;
            this.gameEls.push(planet)

            var sign = document.createElementNS(svgns,"use")
            this.arena.appendChild(sign)
            sign.setAttribute("href","#pot-sign")
            gsap.set(sign, {x : p.x - 32, y : p.y - 82 })
            this.signs.push(sign)
            this.gameEls.push(sign)


            //add moons around planet
            var coords = (this.rowCoords(p.x - 25.5, p.y -70, 5, 21).concat(this.rowCoords(p.x - 25.5, p.y -70+25, 5, 21)))
            coords.splice(this.p2Moons)
            for(var j = 0; j < this.p2Moons; j++) {
                var moon = document.createElementNS(svgns,"use")
                this.arena.appendChild(moon)
                moon.setAttribute("href","#flower")

                this.targetMoonCoords.push(coords[j])
                this.gameEls.push(moon)
                this.targetMoons.push(moon)
                
                gsap.set(moon, {x : coords[j].x, y : coords[j].y, scale : 1})
            }
        }
        */
    }
    

    playAnimation() {
        var self = this
        var goal = this.p1Num*this.p1Moons + this.p2Num*this.p2Moons

        var timeBetweenAnim = 0.2
        var timeBetweenStages = 0.5

        var stems = []
        if (this.totalMoons == goal) {
            var numOfStems = self.p1Num + self.p2Num;
            //if (self.p1Moons > 0) numOfStems += self.p1Num
            //if (self.p2Moons > 0) numOfStems += self.p2Num // assume it is greater than 0
            //add stems
            for(var i = 0; i < numOfStems; i++) {
                
                var p = self.pCoords[i]
                var stem = document.createElementNS(svgns,"use")
                self.arena.appendChild(stem)
                stem.setAttribute("href","#stem")
                gsap.set(stem, {x : p.x + 35, y : p.y - 30, transformOrigin : "bottom center", scale : 0})
                
                self.gameEls.push(stem)
                stems.push(stem)

            }
        }

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
                gsap.set(moon, {x : gsap.getProperty(m, "x"), y : gsap.getProperty(m, "y"), scale : 1.3})
                this.animationMoons.push(moon)
                index++;
            }
        }

        //switch targets to outlines 
        this.tl.to(this.targetMoons, { transformOrigin : "center", duration : 0})

        this.tl.to(this.targetMoons, {scale : 0, duration : 0.3, onComplete : function(e) {
            for(var i = 0; i < self.targetMoons.length;i++) {
                self.targetMoons[i].setAttribute("href","#flower-outline")
            }
        }})
        this.tl.to(this.targetMoons, {scale : 1.1, duration : 0.3})

        //grow animation
        this.tl.to(this.inputMoons, { transformOrigin : "10px 30px", duration : 0})

        this.tl.to(this.animationMoons, { transformOrigin : "10px 30px", duration : 0})
        this.tl.to(this.animationMoons, {scale : 0, duration : 1, onComplete : function(e) {
            for(var i = 0; i < self.animationMoons.length;i++) {
                self.animationMoons[i].setAttribute("href","#flower")
            }
        }})
        this.tl.to(this.inputMoons, { scale : 0, duration : 1}, "<")
        this.tl.to(this.animationMoons, {scale : 1.3, duration : 2, ease : "elastic"})
        this.tl.to(this.animationMoons, { transformOrigin : "0px 0px", duration : 0})
        
        
        //move moons to targets
        if (this.groups) 
            this.moveMoonsToTargetsGroups(goal, timeBetweenAnim)
        else 
            this.moveMoonsToTargetsOnes(goal, timeBetweenAnim)

        if (this.totalMoons == goal) {
            this.game.attempts = 3

            //delete all targets 
            this.tl.to(this.targetMoons, {scale : 0, duration : 0})

            var coords = []
            var w  = 75 //gsap.getProperty(this.pot)
            for(var i = 0; i < this.pCoords.length; i++) {
                var p = this.pCoords[i]
                if (i < this.p1Num) {
                    var width = this.bouquetWidth(this.p1Moons, 20)
                    coords = coords.concat(this.bouquetCoords(p.x + w/2 - width/2, p.y, this.p1Moons, 20))
                }
                else {
                    var width = this.bouquetWidth(this.p2Moons, 20)
                    coords = coords.concat(this.bouquetCoords(p.x + w/2 - width/2, p.y, this.p2Moons, 20))
                }
            }

            var switchPlanets = this.p1Num*this.p1Moons
            var time = 0.5

            self.tl.to(this.animationMoons[i], {duration : timeBetweenAnim})

            this.tl.to(this.signs, {transformOrigin : "bottom center", duration : 0})
            this.tl.to(this.signs, {scale : 0, duration : time})
            this.tl.to(stems, {scale : 1, duration : time})

            //to do use function to do this (adjust to groups function )
            for(var i = 0; i < this.totalMoons && i < goal; i++) {
                //first moon to planet 2
                /* 
                if (i >= switchPlanets && (i - switchPlanets) % this.p2Moons == 0) {
                    self.tl.to(this.animationMoons[i], {x : coords[i].x, y : coords[i].y - 65,  duration : time}, "<")
                }
                //first moon to planet 1
                else if (i < switchPlanets && i % this.p1Moons == 0) {
                */
                
                if (i % this.p1Moons == 0) {
                    self.tl.to(this.animationMoons[i], {x : coords[i].x, y : coords[i].y - 65,  duration : time}, "<")
                }
                //other moons (follow the first)
                else {
                    self.tl.to(this.animationMoons[i], {x : coords[i].x, y : coords[i].y - 65, duration : time}, "<")
                }
            }

        }
        else if (this.totalMoons < goal){
            
            //wiggle empty/partially empty signs 

            //find the first sign to wiggle 
            var startWiggle = this.signs.length
            if (this.totalMoons < this.p1Num*this.p1Moons) {
                startWiggle = (this.totalMoons - (this.totalMoons % this.p1Moons)) / this.p1Moons
            }
            else {
                var y = this.totalMoons - this.p1Num*this.p1Moons
                startWiggle = this.p1Num + (y - (y % this.p2Moons)) / this.p2Moons
            }

            var wiggleSigns = this.signs.splice(startWiggle)
            gsap.set(wiggleSigns, {transformOrigin : "bottom center"})
            this.tl.to(wiggleSigns, {scale : 1.2})
            this.tl.to(wiggleSigns, {scale : 1})

            //TO DO: wiggle target moons too

           

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

        if (this.totalMoons != 0)
            self.tl.to(self.playBtn, {duration : timeBetweenStages})

        //show retry and/or next button 
        if (self.game.attempts > 2) {
            self.tl.to(self.retryBtn, {scale : 0, x : 10, y : 10, rotation : 0, duration : 0})
            self.tl.to([self.retryBtn, self.nextBtn], {scale : 1, rotation : 0})
        }
        else {
           gsap.set(self.nextBtn,{duration: 0, scale: 0})
            
           //rotatating retry in middle
           gsap.set(self.retryBtn, {scale : 0, x : 610, y : 320, rotation : 0})
           this.tl.to(self.retryBtn, {scale : 3, duration : 1})
           this.tl.to(self.retryBtn, {repeat : -1, duration : 4, rotation : 360, ease: "bounce"}) 
        }

        this.totalMoons = 0
        this.moonCols = 0
        this.moonRows = 0
    }

    //edit
    moveMoonsToTargetsOnes(goal, timeBetweenAnim) {
        var self = this
        var time = 0.3
        
        var moonNum = -1
        var index = 0;

        var moonGroups = []
        for(var i = 0; i < this.p1Num; i++) moonGroups.push(this.p1Moons)
        for(var i = 0; i < this.p2Num; i++) moonGroups.push(this.p2Moons)

        var newOrderMoons = Array(this.totalMoons)
        var inc = 1;
        var index = 0
        var y = 0;

        var moonNum = 0

        for(var i = 0; i < this.totalMoons && i < goal; i++) {

            //console.log(i, index)
            var pos = this.targetMoonCoords[index] //moonGroups[i % unfilledPlanets][moonNum]
            self.tl.to(this.animationMoons[i], {x : pos.x, y : pos.y, scale : 1.1, duration : time})
            self.tl.to(this.animationMoons[i], {duration : timeBetweenAnim})
            newOrderMoons[index] = this.animationMoons[i]
            

            if ((i+inc) % moonGroups.length == 0 && i > 0) {
                moonNum++; 

                var sum = 0
                var keep = []
                for(var j = 0; j < moonGroups.length; j++) {
                    sum += moonGroups[j]
                    if (moonGroups[j] > moonNum) {
                        keep.push(moonGroups[j])
                    }
                    else {
                        inc -= 1
                    }
                }

                sum -= moonGroups[moonGroups.length-1]

                moonGroups = keep

                index -= sum
                index += 1

                //console.log(moonGroups)
            }
            else {
                index += moonGroups[i % moonGroups.length]
            }            
        }

        //change order of animation moons to match rotation 
        this.animationMoons = newOrderMoons

    }

    moveMoonsToTargetsGroups(goal, timeBetweenAnim) {
        var self = this
        var switchPlanets = this.p1Num*this.p1Moons
        var time = 0.5

        for(var i = 0; i < this.totalMoons && i < goal; i++) {
            /*
            //first moon to planet 2
            if (i >= switchPlanets && (i - switchPlanets) % this.p2Moons == 0) {
                this.tl.to(this.animationMoons[i], {duration : timeBetweenAnim})
                this.tl.to(this.animationMoons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1.1, duration : time})
            }
            //first moon to planet 1
            else if (i < switchPlanets && i % this.p1Moons == 0) {
            */
            if (i % this.p1Moons == 0) {
                this.tl.to(this.animationMoons[i], {duration : timeBetweenAnim})
                this.tl.to(this.animationMoons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1.1, duration : time})
            }
            //other moons (follow the first)
            else {
                this.tl.to(this.animationMoons[i], {x : this.targetMoonCoords[i].x, y : this.targetMoonCoords[i].y, scale : 1.1, duration : time}, "<")
            }
        }
    }

    reset() {
        var self = this
        this.animationMoons.forEach(el => {
            this.arena.removeChild(el)
        });
        this.animationMoons = []

        this.gameEls.forEach(el => {
            this.arena.removeChild(el)
        });
        this.gameEls = []
        this.signs = []

        //reset buttons
        gsap.set(self.playBtn, {scale : 1})
        gsap.set(self.retryBtn, {scale : 0, rotation : 0, duration : 0})
        
        if (self.game.attempts > 2)
            gsap.set(self.nextBtn, {scale : 1})
        else
            gsap.set(self.nextBtn, {scale : 0})

        this.canEdit = true

        gsap.set(this.inputMoons, {scale : 1.3})

        this.setupPlanets()
        
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

        this.targetMoonCoords = []
        this.targetMoons = []

        this.reset()

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

    bouquetWidth(num, delta) {
        if (num < 1) return 0
        else if (num == 1) {
            return delta
        }
        else if (num == 2) {
            return delta*2
        }
        else if (num == 3) {
            return delta*2
        }
        else if (num == 4) {
            return delta*2.5
        }
        else if (num == 5) {
            return delta*3
        }
        else if (num == 6){ //change maybe 
            return delta*3.5
        }
        else if (num == 7) { 
            return delta*3
        }
        else if (num == 8) { //change maybe
            return 3
        }
        else if (num == 9) { //change maybe
            return delta*3.5
        }
        else if (num == 10) { 
            return delta*4
        }
    }

    bouquetCoords(xVal, yVal, num, delta) {
        if (num < 1) return []
        else if (num == 1) {
            return [{x : xVal, y : yVal}]
        }
        else if (num == 2) {
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}]
        }
        else if (num == 3) {
            return [{x : xVal, y : yVal+delta}, {x : xVal + delta, y : yVal + delta}, {x : xVal + delta/2, y : yVal}]
        }
        else if (num == 4) {
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}, {x : xVal + delta/2, y : yVal +delta}, {x : xVal + delta +delta/2, y : yVal +delta}]
        }
        else if (num == 5) {
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}, {x : xVal - delta/2 , y : yVal+delta}, {x : xVal + delta/2, y : yVal+delta}, {x : xVal + delta + delta/2, y : yVal + delta}]
        }
        else if (num == 6){ //change maybe 
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}, {x : xVal + delta*2, y : yVal}, {x : xVal + delta/2, y : yVal+delta}, {x : xVal + delta/2 + delta, y : yVal + delta}, {x : xVal + delta*2 + delta/2, y : yVal + delta}]
        }
        else if (num == 7) { 
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}, {x : xVal - delta/2, y : yVal + delta}, {x : xVal + delta/2, y : yVal+delta}, {x : xVal + delta/2 + delta, y : yVal + delta}, {x : xVal, y : yVal + delta*2}, {x : xVal +delta, y : yVal + delta*2}]
        }
        else if (num == 8) { //change maybe
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}, {x : xVal + delta*2, y : yVal}, {x : xVal + delta/2, y : yVal + delta}, {x : xVal + delta + delta/2, y : yVal + delta}, {x : xVal, y : yVal + delta*2}, {x : xVal + delta, y : yVal + delta*2}, {x : xVal + delta*2, y : yVal + delta*2}]
        }
        else if (num == 9) { //change maybe
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}, {x : xVal + delta*2, y : yVal}, {x : xVal + delta/2, y : yVal + delta}, {x : xVal + delta + delta/2, y : yVal + delta},{x : xVal + delta*2 + delta/2, y : yVal + delta}, {x : xVal, y : yVal + delta*2}, {x : xVal + delta, y : yVal + delta*2}, {x : xVal + delta*2, y : yVal + delta*2}]
        }
        else if (num == 10) { 
            return [{x : xVal, y : yVal}, {x : xVal + delta, y : yVal}, {x : xVal + delta*2, y : yVal}, {x : xVal - delta/2, y : yVal + delta}, {x : xVal + delta/2, y : yVal + delta}, {x : xVal + delta + delta/2, y : yVal + delta},{x : xVal + delta*2 + delta/2, y : yVal + delta}, {x : xVal, y : yVal + delta*2}, {x : xVal + delta, y : yVal + delta*2}, {x : xVal + delta*2, y : yVal + delta*2}]
        }
        
    }

}