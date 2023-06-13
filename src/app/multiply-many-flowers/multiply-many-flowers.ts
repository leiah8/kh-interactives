import { NumberFormatStyle } from "@angular/common";
import {svgns} from "../api"
import { gsap, Draggable } from "gsap/all";

export interface FlowersSetup {
    columns : number;
    rows : number;

    mode : string
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
    arena : HTMLElement
    controls : HTMLElement
    showColumns : boolean 
    // showRows : boolean

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
    

    constructor(setup) {
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


        this.inputElements = [] //Array(this.TOTAL_ROWS).fill(Array(this.TOTAL_COLUMNS))

        this.init()

    }


    init() {
        this.setupRects()
        this.setupInputFlowers()
        this.setupDividers()

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
        for(var i = 0; i < this.TOTAL_ROWS; i++) {
            this.inputElements.push([])
            for(var j = 0; j < this.TOTAL_COLUMNS; j++) {
                var el = Object.assign(document.createElementNS(svgns,"use"), {
                    row : i+1, 
                    col : j+1,
                    on : false, 
                })
                this.arena.appendChild(el)
                el.setAttribute("href","#empty-input")
                gsap.set(el, {x : this.INPUT_X + i*this.FLOWER_DELTA + 10, y : this.INPUT_Y + j*this.FLOWER_DELTA + 10})
    
                //this.inputElements[i][j] = el
                this.inputElements[i].push(el)
            }

            this.inputElements.forEach(list => {
                list.forEach(el => {
                    el.onpointerdown = function(e) {
                        self.fill(el.row, el.col)
                    }
                });
            });
        }
    }

    fill(rows, cols) {
        // console.log(rows, cols)
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

    setElType(el : InputEl) {
        //im not sure yet how to do 6 sections or smth like that 
        if (el.row > this.verticalDivPos && el.col > this.horizontalDivPos) {
            el.setAttribute("href", "#input-1")
        }
        else if (el.row > this.verticalDivPos && el.col <= this.horizontalDivPos) {
            el.setAttribute("href", "#input-2")
        }
        else if (el.row <= this.verticalDivPos && el.col <= this.horizontalDivPos) {
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
        var div1 = Object.assign(document.createElementNS(svgns,"use"), {
            horizontal : false, 
            num : 0,
            pos : self.verticalDivPos
        })
        this.arena.appendChild(div1)
        div1.setAttribute("href","#vertical-divider")
        gsap.set(div1, {x : this.INPUT_X + self.verticalDivPos * this.FLOWER_DELTA - 5, y : this.INPUT_Y
        })

        
        Draggable.create(div1, {type : "x", bounds : {left : this.INPUT_X - this.FLOWER_DELTA*2, width : this.FLOWER_DELTA*this.TOTAL_COLUMNS}, 
            onDragEnd : function() {
                var endVal = this.x
                var e = Math.round((endVal - (self.INPUT_X - 5)) / self.FLOWER_DELTA)
                //console.log(e)

                self.verticalDivPos = e

                var cols = self.filledColumns
                var rows = self.filledRows
                self.fill(0, 0)
                self.fill(rows, cols)

                gsap.set(div1, {x : e * self.FLOWER_DELTA + (self.INPUT_X - 5)})
            }
        })

        //horizontal divider
        var div2 = Object.assign(document.createElementNS(svgns,"use"), {
            horizontal : true, 
            num : 0,
            pos : self.horizontalDivPos
        })
        this.arena.appendChild(div2)
        div2.setAttribute("href","#horizontal-divider")
        gsap.set(div2, {x : this.INPUT_X, y : this.INPUT_Y + self.horizontalDivPos * this.FLOWER_DELTA - 2})

        Draggable.create(div2, {type : "y", bounds : self.rects, 
            onDragEnd : function() {
                var endVal = this.y
                var e = Math.round((endVal - self.INPUT_Y) / self.FLOWER_DELTA)

                console.log(e)
                self.horizontalDivPos = e

                var cols = self.filledColumns
                var rows = self.filledRows
                self.fill(0, 0)
                self.fill(rows, cols)

                gsap.set(div2, {y : e * self.FLOWER_DELTA + (self.INPUT_Y)})
            }
        })
        //bounds : {top : this.INPUT_Y, height : self.FLOWER_DELTA*self.TOTAL_ROWS} // not working

    }
}