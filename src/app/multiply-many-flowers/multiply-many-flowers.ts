import {svgns} from "../api"
import { gsap, Draggable } from "gsap/all";

export interface FlowersSetup {
    columns : number;
    rows : number;
    dividers : number; 
    mode : string
}

export interface GameInput {
    goal : number[]; // [1, 3] means you need 1 of type 1 and 3 of type 2 on each target
    targets : number
}

interface Game extends GameInput {
    goal : number[]; // [1, 3] means you need 1 of type 1 and 3 of type 2 on each target
    targets : number;
    attempts : number;
    completed : boolean 

}

interface InputEl extends SVGUseElement{
    row : number
    col : number
    on : boolean
}

interface DividerEl extends SVGUseElement {
    horizontal : boolean 
    num : number
}


export class ManyFlowersAPI {

    games : Game[]
    game : Game
    gameIndex : number
    targets : number
    goal : number[]

    arena : HTMLElement
    controls : HTMLElement
    showColumns : boolean 

    TOTAL_COLUMNS : number
    TOTAL_ROWS :  number

    filledRows : number
    filledColumns : number

    INPUT_X : number = 100;
    INPUT_Y : number = 100;
    FLOWER_DELTA : number  = 50;
    canEdit : boolean

    verticalDivPos : number
    horizontalDivPos : number

    inputElements : InputEl[][]

    rects : SVGRectElement[]

    selectedEl : string;
    borders : SVGRectElement[] //COMBINE WITH DIVIDERS??
    dividers : any[] //CHANGE
    

    constructor(setup, games) {
        this.games = this.createGames(games) 
        this.game = games[0]
        this.gameIndex = 0
        this.targets = this.game.targets
        this.goal = this.game.goal
        this.arena = setup.arena
        this.controls = setup.controls

        if (setup.mode == "columns") {
            this.showColumns = true 
        }
        else {
            this.showColumns = false 
        }

        this.TOTAL_COLUMNS = setup.columns
        this.TOTAL_ROWS = setup.rows
        this.canEdit = true
        this.verticalDivPos = 9
        this.horizontalDivPos = 3

        this.filledRows = 0
        this.filledColumns = 0

        this.rects = []
        this.borders = []
        this.dividers = []


        this.inputElements = [] //Array(this.TOTAL_ROWS).fill(Array(this.TOTAL_COLUMNS))

        this.init()
    }

    createGames(gIn) {

        var games  = []

        if (gIn.length > 0)
            var num = gIn[0].goal.length
        else 
            return []

        for(var i = 0; i < gIn.length; i++) {
            var g = {
                goal : gIn[i].goal.slice(0, num),
                targets : gIn[i].targets,
                attempts : 0,
                completed : false 
            } as Game

            games.push(g)
        }

        return games
    }

    setSelectedEl(s) {
        if (s == "flowers") {
            this.selectedEl = "flowers"
            gsap.set(this.borders, {opacity : 0})
        }
        else if (s == "horizontal-div") {
            this.selectedEl = "horizontal-div"
            gsap.set(this.borders[0], {opacity : 0})
        }
        else if (s == "vertical-div") {
            this.selectedEl = "vertical-div"
            gsap.set(this.borders[1], {opacity : 0})
        }
        else this.selectedEl = ""
    }


    init() {
        this.setupRects()
        this.setupInputFlowers()
        this.setupDividers()

        this.setupArrows()
        this.setupTargets()

    }

    setupArrows() {
        var self = this
        var x = 1000
        var y = 550

        var up = document.createElementNS(svgns,"use")
        this.controls.appendChild(up)
        up.setAttribute("href","#arrow-up")
        gsap.set(up, {x : x+62, y : y})

        up.onpointerdown = function(e) {
            if (self.selectedEl == "flowers")
                self.fill(self.filledRows + 1, self.filledColumns)
            else if (self.selectedEl == "horizontal-div") {
                self.setHorizontalDiv(self.horizontalDivPos + 1)
            }
        }

        var down = document.createElementNS(svgns,"use")
        this.controls.appendChild(down)
        down.setAttribute("href","#arrow-down")
        gsap.set(down, {x : x+62, y : y+100}) 

        down.onpointerdown = function(e) {
            if (self.selectedEl == "flowers") {
                self.fill(self.filledRows - 1, self.filledColumns) 
            }
            else if (self.selectedEl == "horizontal-div") {
                self.setHorizontalDiv(self.horizontalDivPos - 1)
            }
        }

        var left = document.createElementNS(svgns,"use")
        this.controls.appendChild(left)
        left.setAttribute("href","#arrow-left")
        gsap.set(left, {x : x, y : y+50})

        left.onpointerdown = function(e) {
            if (self.selectedEl == "flowers") {
                self.fill(self.filledRows, self.filledColumns - 1)  
            }
            else if (self.selectedEl == "vertical-div") {
                self.setVerticalDiv(self.verticalDivPos - 1)
            }
        }

        var right = document.createElementNS(svgns,"use")
        this.controls.appendChild(right)
        right.setAttribute("href","#arrow-right")
        gsap.set(right, {x : x+125, y : y+50})

        right.onpointerdown = function(e) {
            if (self.selectedEl == "flowers") {
                self.fill(self.filledRows, self.filledColumns + 1) 
            }
            else if (self.selectedEl == "vertical-div") {
                self.setVerticalDiv(self.verticalDivPos + 1)
            }
        }

    }

    setupRects() {
        if (this.showColumns) {
            for(var i = 0; i < this.TOTAL_COLUMNS; i++) {
                var rect = document.createElementNS(svgns, "rect")

                this.arena.appendChild(rect)
                gsap.set(rect, {x : this.INPUT_X + this.FLOWER_DELTA*i, y : this.INPUT_Y, 
                    height : this.FLOWER_DELTA * this.TOTAL_COLUMNS, width : this.FLOWER_DELTA - 5, rx : 16, fill : "#4F311C"})

                this.rects.push(rect)
            }
        }
    }

    setupInputFlowers() {
        var self = this
        // for(var i = 0; i < this.TOTAL_ROWS; i++) {
        for(var i = this.TOTAL_ROWS-1; i >= 0; i--) {
            this.inputElements.push([])
            for(var j = 0; j < this.TOTAL_COLUMNS; j++) {
                var r = this.TOTAL_ROWS - i - 1
                var el = Object.assign(document.createElementNS(svgns,"use"), {
                    row : this.TOTAL_ROWS - i, 
                    col : j+1,
                    on : false, 
                })
                this.arena.appendChild(el)
                el.setAttribute("href","#empty-input")
                gsap.set(el, {x : this.INPUT_X + j*this.FLOWER_DELTA + 10, y : this.INPUT_Y + i*this.FLOWER_DELTA + 10})
    
                //this.inputElements[i][j] = el
                // this.inputElements[i].push(el)
                this.inputElements[this.TOTAL_ROWS - 1 - i].push(el)
            }

            this.inputElements.forEach(list => {
                list.forEach(el => {
                    el.onpointerdown = function(e) {
                        self.setSelectedEl("flowers")
                        self.fill(el.row, el.col)
                    }
                });
            });
        }
    }

    fill(rows, cols) {
        if (!this.canEdit) return        

        if (rows < 0) rows = 0
        else if (rows > this.TOTAL_ROWS) rows = this.TOTAL_ROWS

        if (cols < 0) cols = 0
        else if (cols > this.TOTAL_COLUMNS) cols = this.TOTAL_COLUMNS

        for(var i = 0; i < this.TOTAL_ROWS; i++) {
            for(var j = 0; j < this.TOTAL_COLUMNS; j++) {
                var el = this.inputElements[i][j]
                if (i < rows && j < cols) {
                    //fill it in 
                    if (!el.on) {
                        // el.setAttribute("href", "#input-1")
                        this.setElType(el)
                        el.on = true
                    }
                }
                else {
                    //make it blank
                    if (el.on) {
                        el.setAttribute("href", "#empty-input")
                        el.on = false
                    }
                }
            }
        }

        this.filledColumns = cols
        this.filledRows = rows
    }

    //determine set el type function based on this.dividers
    setElType(el : InputEl) {
        //im not sure yet how to do 6 sections or smth like that 
        if (el.row > this.horizontalDivPos && el.col > this.verticalDivPos) {
            el.setAttribute("href", "#input-1")
        }
        else if (el.row > this.horizontalDivPos && el.col <= this.verticalDivPos) {
            el.setAttribute("href", "#input-2")
        }
        else if (el.row <= this.horizontalDivPos && el.col <= this.verticalDivPos) {
            el.setAttribute("href", "#input-3")
        }
        else {
            el.setAttribute("href", "#input-4")
        }

    }

    setupDividers() {
        //add for loop for multiple dividers 
        gsap.registerPlugin(Draggable)
        var self = this

        //vertical divider
        var div1 = Object.assign(document.createElementNS(svgns,"g"), {
                horizontal : false, 
                num : 0,
                pos : self.verticalDivPos
            })
            this.arena.appendChild(div1)
            //div1.setAttribute("href","#vertical-divider")
        
        var rect1 = document.createElementNS(svgns,"use")
        rect1.setAttribute("href","#vertical-divider")
        div1.appendChild(rect1)

        var border1 = document.createElementNS(svgns, "rect")
        gsap.set(border1, {height : this.FLOWER_DELTA * this.TOTAL_COLUMNS + 20, width : 20, rx : 16, fill : "#915d27", opacity : 0})
        div1.appendChild(border1)
        this.borders.push(border1)
        this.dividers.push(div1)

        gsap.set(div1, {x : this.INPUT_X + self.verticalDivPos * this.FLOWER_DELTA - 5, y : this.INPUT_Y})
        gsap.set(border1, {y :  "-= 10", x : "-= 6"})

        div1.onpointerdown = function() {
            gsap.set(border1, {opacity: 0.5})
            self.setSelectedEl("vertical-div")
        }

        
        //add draggable
        Draggable.create(div1, {type : "x", bounds : {left : this.INPUT_X - this.FLOWER_DELTA*2 - 1, width : this.FLOWER_DELTA*this.TOTAL_COLUMNS + 21},
            // onDragStart : function() {
            //     gsap.set(border1, {opacity: 0.5})
            // },
            onDragEnd : function() {
                var endVal = this.x
                var e = Math.round((endVal - (self.INPUT_X - 5)) / self.FLOWER_DELTA)

                self.setVerticalDiv(e)

                // self.verticalDivPos = e

                // var cols = self.filledColumns
                // var rows = self.filledRows
                // self.fill(0, 0)
                // self.fill(rows, cols)

                // gsap.set(div1, {x : e * self.FLOWER_DELTA + (self.INPUT_X - 5)})
            }
        })

        

        //horizontal divider
        var div2 = Object.assign(document.createElementNS(svgns,"g"), {
            horizontal : false, 
            num : 0,
            pos : self.verticalDivPos
        })
        this.arena.appendChild(div2)
        //div1.setAttribute("href","#vertical-divider")
    
        var rect2 = document.createElementNS(svgns,"use")
        rect2.setAttribute("href","#horizontal-divider")
        div2.appendChild(rect2)

        var border2 = document.createElementNS(svgns, "rect")
        gsap.set(border2, {height : 20, width : this.FLOWER_DELTA * this.TOTAL_ROWS + 20, rx : 16, fill : "#915d27", opacity : 0})
        div2.appendChild(border2)
        this.borders.push(border2)
        this.dividers.push(div2)

        gsap.set(div2, {x : this.INPUT_X, y : this.INPUT_Y + self.TOTAL_ROWS * this.FLOWER_DELTA - self.horizontalDivPos * this.FLOWER_DELTA - 2})
        gsap.set(border2, {x :  "-= 10", y : "-= 6"})


        div2.onpointerdown = function() {
            gsap.set(border2, {opacity: 0.5})
            self.setSelectedEl("horizontal-div")
        }
        
        //add draggable
        // bounds : self.rects, 
        Draggable.create(div2, {type : "y", bounds : {minY : self.INPUT_Y, maxY : self.INPUT_Y + self.TOTAL_ROWS * self.FLOWER_DELTA},
            // onDragStart : function() {
            //     gsap.set(border2, {opacity: 0.5})
            // },
            onDragEnd : function() {
                var endVal = this.y
                var e = Math.round((endVal - self.INPUT_Y) / self.FLOWER_DELTA)

                self.setHorizontalDiv(self.TOTAL_ROWS - e)

                // self.horizontalDivPos = self.TOTAL_ROWS - e

                // var cols = self.filledColumns
                // var rows = self.filledRows
                // self.fill(0, 0)
                // self.fill(rows, cols)

                // gsap.set(div2, {y : e * self.FLOWER_DELTA + (self.INPUT_Y)})
                // gsap.set(border2, {opacity: 0})
            }
        })
    }

    setHorizontalDiv(e) {
        if (e < 0 || e > this.TOTAL_ROWS ) return
        var self = this
        self.horizontalDivPos = e

        var cols = self.filledColumns
        var rows = self.filledRows
        self.fill(0, 0)
        self.fill(rows, cols)

        gsap.set(this.dividers[1], {y : (self.TOTAL_ROWS - e) * self.FLOWER_DELTA + (self.INPUT_Y)})
    }

    setVerticalDiv(e) {
        if (e < 0 || e > this.TOTAL_COLUMNS ) return
        var self = this
        self.verticalDivPos = e

        var cols = self.filledColumns
        var rows = self.filledRows
        self.fill(0, 0)
        self.fill(rows, cols)

        gsap.set(this.dividers[0], {x : e * self.FLOWER_DELTA + (self.INPUT_X - 5)})
    }

    setupTargets() {

        var x = 650
        var y = 100

        var delta = 150

        for(var i = 0; i < this.targets; i++) {

            var target = document.createElementNS(svgns,"use")
            target.setAttribute("href","#target")
            this.arena.appendChild(target)

            var xVal = x + delta*(i%4)
            var yVal = y + delta*(i - i%4)/4

            gsap.set(target, {x : xVal, y : yVal})


            var coords = this.gridCoords(xVal, yVal, 2, 5, 23)
            var count = 0
            for(var j = 0; j < this.goal.length; j++) {
                var str = "#output-" + (j+1).toString()
   
                for(var k = 0; k < this.goal[j]; k++) {
                    var flower = document.createElementNS(svgns,"use")
                    flower.setAttribute("href", str)
                    this.arena.appendChild(flower)

                    //gsap.set(flower, {x : xVal + k*23 + 2, y : yVal + j*30 + 10})
                    gsap.set(flower, {x : coords[count].x + 1, y : coords[count].y + (Math.floor(count/5))*10 + 10})
                    
                    count++;
                }

            }

        }

    }

    gridCoords(xVal, yVal, rows, cols, delta) {
        var coords = [];
          for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
              coords.push({x : xVal + j * delta, y : yVal + i * delta});
            }
          }
          return coords;
    }
}