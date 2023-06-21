import { svgns } from "../api"
import { gsap, Draggable } from "gsap/all";

export interface FlowersSetup {
    columns: number;
    rows: number;
    dividers: number;
    mode: string
}

export interface GameInput {
    goal: number[]; // [1, 3] means you need 1 of type 1 and 3 of type 2 on each target
    targets: number
    mode: string
    horizontalDiv: boolean
    verticalDiv: boolean
}

interface Game extends GameInput {
    goal: number[]; // [1, 3] means you need 1 of type 1 and 3 of type 2 on each target
    targets: number;
    mode: string;
    attempts: number;
    completed: boolean
    horizontalDiv: boolean
    verticalDiv: boolean
}

interface InputEl extends SVGUseElement {
    row: number
    col: number
    on: boolean
}

interface AnimationEl extends SVGUseElement {
    row: number
    col: number
    type: number
}

interface DividerEl {
    border: SVGElement;
    group: SVGElement;
    draggable: any // change
}

interface Pos {
    x: number
    y: number
}

interface Arrows {
    back: SVGElement
    center: SVGUseElement
    up: SVGUseElement
    down: SVGUseElement
    left: SVGUseElement
    right: SVGUseElement
}


export class ManyFlowersAPI {

    games: Game[]
    game: Game
    gameIndex: number
    targets: number
    goal: number[]

    arena: HTMLElement
    input: HTMLElement
    anim: HTMLElement
    rectangles: HTMLElement
    playBtn: HTMLElement
    retryBtn: HTMLElement
    nextBtn: HTMLElement
    showColumns: boolean

    TOTAL_COLUMNS: number
    TOTAL_ROWS: number

    filledRows: number
    filledColumns: number

    INPUT_X: number = 100;
    INPUT_Y: number = 100;
    FLOWER_DELTA: number = 50;
    canEdit: boolean

    verticalDivPos: number
    horizontalDivPos: number

    inputElements: InputEl[][]

    rects: SVGRectElement[]
    arrows: Arrows
    selectedEl: string;

    horizontalDivEl: DividerEl | null
    verticalDivEl: DividerEl | null

    targetScaleVal: number = 0.8

    targetPos: Pos[][]
    targetEls: SVGUseElement[]
    targetPots: SVGUseElement[][]
    targetPotsPos: Pos[]
    animationEls: AnimationEl[][]

    tl: any


    constructor(setup, games) {
        this.games = this.createGames(games)
        this.game = games[0]
        this.gameIndex = 0
        this.targets = this.game.targets
        this.goal = this.game.goal

        this.arena = setup.arena
        this.input = setup.input
        this.anim = setup.anim
        this.playBtn = setup.playBtn
        this.retryBtn = setup.retryBtn
        this.nextBtn = setup.nextBtn
        this.rectangles = setup.rectangles

        this.TOTAL_COLUMNS = setup.columns
        this.TOTAL_ROWS = setup.rows

        this.canEdit = true
        this.verticalDivPos = 0
        this.horizontalDivPos = 0

        this.filledRows = 0
        this.filledColumns = 0

        this.rects = []

        this.inputElements = [] //Array(this.TOTAL_ROWS).fill(Array(this.TOTAL_COLUMNS))

        this.tl = gsap.timeline()


        this.targetEls = []
        this.targetPots = [[], []]
        this.targetPotsPos = this.gridCoords(650, 100, 3, 4, 150)
        this.targetPos = []

        for (var i = 0; i < 12; i++) {
            this.targetPos.push(this.gridCoords(this.targetPotsPos[i].x + 8, this.targetPotsPos[i].y + 15, 2, 5, 20))
        }
        //this.targetPos.push({x : coords[count].x + 8, y : coords[count].y + (Math.floor(count/5))*10 + 15})
        this.animationEls = []

        this.init()
    }

    createGames(gIn) {

        var games = []
        for (var i = 0; i < gIn.length; i++) {
            var g = {
                goal: gIn[i].goal,
                targets: gIn[i].targets,
                attempts: 0,
                mode: gIn[i].mode,
                completed: false,
                horizontalDiv: gIn[i].horizontalDiv,
                verticalDiv: gIn[i].verticalDiv
            } as Game

            games.push(g)
        }

        return games
    }

    setSelectedEl(s) {
        if (!this.canEdit) return
        if (s == "flowers") {
            this.selectedEl = "flowers"
            if (this.horizontalDivEl != null) gsap.set(this.horizontalDivEl.border, { opacity: 0 })
            if (this.verticalDivEl != null) gsap.set(this.verticalDivEl.border, { opacity: 0 })

            gsap.set(this.arrows.back, { visibility: "visible" })
            gsap.set([this.arrows.up, this.arrows.down, this.arrows.left, this.arrows.right], { visibility: "visible" })
            this.arrows.center.setAttribute("href", "#el-center")
        }
        else if (s == "horizontal-div") {
            this.selectedEl = "horizontal-div"

            if (this.horizontalDivEl != null) gsap.set(this.horizontalDivEl.border, { opacity: 0.5 })
            if (this.verticalDivEl != null) gsap.set(this.verticalDivEl.border, { opacity: 0 })

            gsap.set(this.arrows.back, { visibility: "visible" })
            gsap.set([this.arrows.up, this.arrows.down], { visibility: "visible" })
            gsap.set([this.arrows.left, this.arrows.right], { visibility: "hidden" })
            this.arrows.center.setAttribute("href", "#horizontal-div-center")
        }
        else if (s == "vertical-div") {
            this.selectedEl = "vertical-div"

            if (this.horizontalDivEl != null) gsap.set(this.horizontalDivEl.border, { opacity: 0 })
            if (this.verticalDivEl != null) gsap.set(this.verticalDivEl.border, { opacity: 0.5 })

            gsap.set(this.arrows.back, { visibility: "visible" })
            gsap.set([this.arrows.left, this.arrows.right], { visibility: "visible" })
            gsap.set([this.arrows.up, this.arrows.down], { visibility: "hidden" })
            this.arrows.center.setAttribute("href", "#vertical-div-center")
        }
        else {
            this.selectedEl = ""
            if (this.horizontalDivEl != null) gsap.set(this.horizontalDivEl.border, { opacity: 0 })
            if (this.verticalDivEl != null) gsap.set(this.verticalDivEl.border, { opacity: 0 })

            gsap.set([this.arrows.back, this.arrows.up, this.arrows.down, this.arrows.left, this.arrows.right], { visibility: "hidden" })
            this.arrows.center.setAttribute("href", "")
        }
    }


    init() {
        if (this.game.mode == "columns")  this.showColumns = true 
        else this.showColumns = false
        
        this.setupRects()
        this.setupInputFlowers()
        this.setupDividers()

        this.setupArrows()
        this.setupTargets()

        var self = this

        self.setSelectedEl("")
        this.arena.onpointerdown = function () {
            self.setSelectedEl("")
        }

        this.setupButtons()

    }

    reset() {

        this.tl.clear()

        gsap.set(this.inputElements, { scale: 1 })
        this.setSelectedEl("")
        this.canEdit = true

        if (this.game.horizontalDiv)
            this.setHorizontalDiv(0)
        if (this.game.verticalDiv)
            this.setVerticalDiv(0)

        this.fill(0, 0)

        this.animationEls.forEach(l => {
            l.forEach(el => {
                this.anim.removeChild(el)
            })
        });
        this.animationEls = [] // remove all elements 

        gsap.set(this.targetEls, {visibility : "visible"})
        
        this.targetPots[0].forEach(el => {
            el.setAttribute("href", "#pot-sign")
        });

        gsap.set(this.retryBtn, { scale: 0 })
        gsap.set(this.playBtn, { scale: 1 })

        if (this.game.completed || this.game.attempts >= 3) 
            gsap.set(this.nextBtn, { scale: 1 })
        else
            gsap.set(this.nextBtn, { scale: 0 })

    }

    nextGame() {
        this.reset()

        this.gameIndex = (this.gameIndex + 1) % this.games.length;
        this.game = this.games[this.gameIndex]
        this.targets = this.game.targets
        this.goal = this.game.goal

        if (this.game.completed || this.game.attempts >= 3) 
            gsap.set(this.nextBtn, { scale: 1 })
        else
            gsap.set(this.nextBtn, { scale: 0 })

        this.targetEls.forEach(el => {
            this.arena.removeChild(el)
        });
        this.targetEls = []


        this.targetPots.forEach(l => {
            l.forEach(el => {
                this.arena.removeChild(el)
            });
        });
        this.targetPots = [[], []]


        this.rects.forEach(el => {
            this.rectangles.removeChild(el)
        });
        this.rects = []


        this.setupTargets()

        if (this.horizontalDivEl != null) {
            this.input.removeChild(this.horizontalDivEl.group)
            this.horizontalDivEl = null
        }
        if (this.verticalDivEl != null) {
            this.input.removeChild(this.verticalDivEl.group)
            this.verticalDivEl = null
        }


        this.setupDividers()

        if (this.game.mode == "columns") 
            this.showColumns = true
        else 
            this.showColumns = false

        this.setupRects()

    }

    setupButtons() {
        var self = this
        this.playBtn.onpointerdown = function () {
            self.setSelectedEl("")
            self.canEdit = false

            if (self.horizontalDivEl != null) self.horizontalDivEl.draggable[0].disable()
            if (self.verticalDivEl != null) self.verticalDivEl.draggable[0].disable()

            self.playAnimation()
        }

        this.retryBtn.onpointerdown = function () {
            self.reset()

            if (self.horizontalDivEl != null) self.horizontalDivEl.draggable[0].enable()
            if (self.verticalDivEl != null) self.verticalDivEl.draggable[0].enable()
        }

        gsap.set(this.retryBtn, { scale: 0 })

        this.nextBtn.onpointerdown = function () {
            self.nextGame()
        }
        gsap.set(this.nextBtn, { scale: 0 })
    }

    setupArrows() {
        var self = this
        var x = 695
        var y = 550

        var back = document.createElementNS(svgns, "g")
        this.input.appendChild(back)
        var circ = document.createElementNS(svgns, "ellipse")
        gsap.set(circ, { x: x + 87, y: y + 75, rx: 100, ry: 90, fill: "#276923" })
        back.appendChild(circ)

        var center = document.createElementNS(svgns, "use")
        back.appendChild(center)
        center.setAttribute("href", "#el-center")
        gsap.set(center, { x: x + 87 - 20, y: y + 75 - 20 })
        //width = height = 40px

        var up = document.createElementNS(svgns, "use")
        this.input.appendChild(up)
        up.setAttribute("href", "#arrow-up")
        gsap.set(up, { x: x + 62, y: y })

        up.onpointerdown = function (e) {
            if (self.selectedEl == "flowers")
                self.fill(self.filledRows + 1, self.filledColumns)
            else if (self.selectedEl == "horizontal-div") {
                self.setHorizontalDiv(self.horizontalDivPos + 1)
            }
        }

        var down = document.createElementNS(svgns, "use")
        this.input.appendChild(down)
        down.setAttribute("href", "#arrow-down")
        gsap.set(down, { x: x + 62, y: y + 100 })

        down.onpointerdown = function (e) {
            if (self.selectedEl == "flowers") {
                self.fill(self.filledRows - 1, self.filledColumns)
            }
            else if (self.selectedEl == "horizontal-div") {
                self.setHorizontalDiv(self.horizontalDivPos - 1)
            }
        }

        var left = document.createElementNS(svgns, "use")
        this.input.appendChild(left)
        left.setAttribute("href", "#arrow-left")
        gsap.set(left, { x: x, y: y + 50 })

        left.onpointerdown = function (e) {
            if (self.selectedEl == "flowers") {
                self.fill(self.filledRows, self.filledColumns - 1)
            }
            else if (self.selectedEl == "vertical-div") {
                self.setVerticalDiv(self.verticalDivPos - 1)
            }
        }

        var right = document.createElementNS(svgns, "use")
        this.input.appendChild(right)
        right.setAttribute("href", "#arrow-right")
        gsap.set(right, { x: x + 125, y: y + 50 })

        right.onpointerdown = function (e) {
            if (self.selectedEl == "flowers") {
                self.fill(self.filledRows, self.filledColumns + 1)
            }
            else if (self.selectedEl == "vertical-div") {
                self.setVerticalDiv(self.verticalDivPos + 1)
            }
        }


        this.arrows = {
            back: back,
            center: center,
            up: up,
            left: left,
            right: right,
            down: down
        }

    }

    setupRects() {
        if (this.showColumns) {
            for (var i = 0; i < this.TOTAL_COLUMNS; i++) {
                var rect = document.createElementNS(svgns, "rect")

                this.rectangles.appendChild(rect)
                gsap.set(rect, {
                    x: this.INPUT_X + this.FLOWER_DELTA * i, y: this.INPUT_Y,
                    height: this.FLOWER_DELTA * this.TOTAL_COLUMNS, width: this.FLOWER_DELTA - 5, rx: 16, fill: "#4F311C"
                })

                this.rects.push(rect)
            }
        }
        //show rows
        else {
            for (var i = 0; i < this.TOTAL_ROWS; i++) {
                var rect = document.createElementNS(svgns, "rect")

                this.rectangles.appendChild(rect)
                gsap.set(rect, {
                    x: this.INPUT_X, y: this.INPUT_Y + this.FLOWER_DELTA * i + 4,
                    width: this.FLOWER_DELTA * this.TOTAL_COLUMNS, height: this.FLOWER_DELTA - 5, rx: 16, fill: "#4F311C"
                })

                this.rects.push(rect)
            }

        }
    }

    setupInputFlowers() {
        var self = this
        for (var i = this.TOTAL_ROWS - 1; i >= 0; i--) {
            this.inputElements.push([])
            for (var j = 0; j < this.TOTAL_COLUMNS; j++) {
                var r = this.TOTAL_ROWS - i - 1
                var el = Object.assign(document.createElementNS(svgns, "use"), {
                    row: this.TOTAL_ROWS - i,
                    col: j + 1,
                    on: false,
                })
                this.input.appendChild(el)
                el.setAttribute("href", "#empty-input")
                gsap.set(el, { x: this.INPUT_X + j * this.FLOWER_DELTA + 10, y: this.INPUT_Y + i * this.FLOWER_DELTA + 10 })

                this.inputElements[this.TOTAL_ROWS - 1 - i].push(el)
            }
        }

        this.inputElements.forEach(list => {
            list.forEach(el => {
                el.onpointerdown = function (e) {
                    self.setSelectedEl("flowers")
                    self.fill(el.row, el.col)
                }
            });
        });
    }

    fill(rows, cols) {
        if (!this.canEdit) return

        if (rows < 0) rows = 0
        else if (rows > this.TOTAL_ROWS) rows = this.TOTAL_ROWS

        if (cols < 0) cols = 0
        else if (cols > this.TOTAL_COLUMNS) cols = this.TOTAL_COLUMNS

        for (var i = 0; i < this.TOTAL_ROWS; i++) {
            for (var j = 0; j < this.TOTAL_COLUMNS; j++) {
                var el = this.inputElements[i][j]
                if (i < rows && j < cols) {
                    if (!el.on) {
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
    setElType(el: InputEl | AnimationEl) {
        if (el.row > this.horizontalDivPos && el.col > this.verticalDivPos) {
            el.setAttribute("href", "#input-2")
            return 2
        }
        else if (el.row > this.horizontalDivPos && el.col <= this.verticalDivPos) {
            el.setAttribute("href", "#input-1")
            return 1
        }
        else if (el.row <= this.horizontalDivPos && el.col <= this.verticalDivPos) {
            el.setAttribute("href", "#input-3")
            return 3
        }
        else {
            el.setAttribute("href", "#input-4")
            return 4
        }

    }

    setupDividers() {
        //add for loop for multiple dividers 
        gsap.registerPlugin(Draggable)
        var self = this

        if (this.game.verticalDiv) {
            //vertical divider
            var div1 = Object.assign(document.createElementNS(svgns, "g"), {
                horizontal: false,
                num: 0,
                pos: self.verticalDivPos
            })
            this.input.appendChild(div1)

            var rect1 = document.createElementNS(svgns, "use")
            rect1.setAttribute("href", "#vertical-divider")
            div1.appendChild(rect1)

            var border1 = document.createElementNS(svgns, "rect")
            gsap.set(border1, { height: this.FLOWER_DELTA * this.TOTAL_COLUMNS + 20, width: 20, rx: 16, fill: "#915d27", opacity: 0 })
            div1.appendChild(border1)
           
            gsap.set(div1, { x: this.INPUT_X + self.verticalDivPos * this.FLOWER_DELTA - 5, y: this.INPUT_Y })
            gsap.set(border1, { y: "-= 10", x: "-= 6" })

            div1.onpointerdown = function () {
                self.setSelectedEl("vertical-div")
            }


            //add draggable
            var d1 = Draggable.create(div1, {
                type: "x", bounds: { left: this.INPUT_X - this.FLOWER_DELTA * 2 - 1, width: this.FLOWER_DELTA * this.TOTAL_COLUMNS + 21 },
                onDragEnd: function () {
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

            this.verticalDivEl = {
                border: border1,
                group: div1,
                draggable: d1
            }
        }
        else this.verticalDivEl = null


        if (this.game.horizontalDiv) {
            //horizontal divider
            var div2 = Object.assign(document.createElementNS(svgns, "g"), {
                horizontal: false,
                num: 0,
                pos: self.verticalDivPos
            })
            this.input.appendChild(div2)

            var rect2 = document.createElementNS(svgns, "use")
            rect2.setAttribute("href", "#horizontal-divider")
            div2.appendChild(rect2)

            var border2 = document.createElementNS(svgns, "rect")
            gsap.set(border2, { height: 20, width: this.FLOWER_DELTA * this.TOTAL_ROWS + 20, rx: 16, fill: "#915d27", opacity: 0 })
            div2.appendChild(border2)

            gsap.set(div2, { x: this.INPUT_X, y: this.INPUT_Y + self.TOTAL_ROWS * this.FLOWER_DELTA - self.horizontalDivPos * this.FLOWER_DELTA - 2 })
            gsap.set(border2, { x: "-= 10", y: "-= 6" })


            div2.onpointerdown = function () {
                self.setSelectedEl("horizontal-div")
            }

            //add draggable
            var d2 = Draggable.create(div2, {
                type: "y", bounds: { minY: self.INPUT_Y, maxY: self.INPUT_Y + self.TOTAL_ROWS * self.FLOWER_DELTA },
                onDragEnd: function () {
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

            this.horizontalDivEl = {
                border: border2,
                group: div2,
                draggable: d2
            }
        }
    }

    setHorizontalDiv(e) {
        if (!this.canEdit) return
        if (e < 0 || e > this.TOTAL_ROWS) return
        var self = this
        self.horizontalDivPos = e

        var cols = self.filledColumns
        var rows = self.filledRows
        self.fill(0, 0)
        self.fill(rows, cols)

        gsap.set(this.horizontalDivEl.group, { y: (self.TOTAL_ROWS - e) * self.FLOWER_DELTA + (self.INPUT_Y) })
    }

    setVerticalDiv(e) {
        if (!this.canEdit) return
        if (e < 0 || e > this.TOTAL_COLUMNS) return
        var self = this
        self.verticalDivPos = e

        var cols = self.filledColumns
        var rows = self.filledRows
        self.fill(0, 0)
        self.fill(rows, cols)

        gsap.set(this.verticalDivEl.group, { x: e * self.FLOWER_DELTA + (self.INPUT_X - 5) })
    }

    setupTargets() {
        var self = this

        for (var i = 0; i < this.targets; i++) {

            var targetBottom = document.createElementNS(svgns, "use")
            targetBottom.setAttribute("href", "#pot")
            this.arena.appendChild(targetBottom)
            this.targetPots[1].push(targetBottom)

            var targetTop = document.createElementNS(svgns, "use")
            targetTop.setAttribute("href", "#pot-sign")
            this.arena.appendChild(targetTop)
            this.targetPots[0].push(targetTop)

            var xVal = this.targetPotsPos[i].x
            var yVal = this.targetPotsPos[i].y

            gsap.set(targetTop, { x: xVal, y: yVal })
            gsap.set(targetBottom, { x: xVal + 21, y: yVal + 84})

            var count = 0
            for (var j = 0; j < this.goal.length; j++) {
                var str = "#output-" + (j + 1).toString()

                for (var k = 0; k < this.goal[j]; k++) {
                    var flower = document.createElementNS(svgns, "use")
                    flower.setAttribute("href", str)
                    this.arena.appendChild(flower)

                    gsap.set(flower, { scale: self.targetScaleVal, x: self.targetPos[i][count].x, y: self.targetPos[i][count].y })
                    this.targetEls.push(flower)

                    count++;
                }
            }
        }
    }

    gridCoords(xVal, yVal, rows, cols, delta) {
        var coords = [];
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                coords.push({ x: xVal + j * delta, y: yVal + i * delta });
            }
        }
        return coords;
    }

    playAnimation() {
        var self = this

        this.game.attempts++;
        self.tl.to(this.playBtn, { scale: 0 })

        //replace input elements with animation elements
        var count = Array(this.goal.length).fill(0)
        for (var i = 0; i < this.filledRows; i++) {
            this.animationEls.push([])
            for (var j = 0; j < this.filledColumns; j++) {
                var inputEl = this.inputElements[i][j]
                inputEl.setAttribute("href", "#empty-input")
                inputEl.on = false


                var el = Object.assign(document.createElementNS(svgns, "use"), {
                    row: inputEl.row,
                    col: inputEl.col,
                    type: 0
                })

                this.anim.appendChild(el)
                el.type = this.setElType(el)
                count[el.type - 1]++;

                gsap.set(el, { x: this.INPUT_X + j * this.FLOWER_DELTA + 10, y: this.INPUT_Y + (this.TOTAL_ROWS - inputEl.row) * this.FLOWER_DELTA + 10 })

                this.animationEls[i].push(el)
            }
        }


        //grouping animation
        this.animationEls.reverse()

        var growTime = 1

        //shrink animation
        self.tl.to(this.playBtn, { duration: growTime })
        
        gsap.set(this.inputElements, { transformOrigin: "bottom center" })
        self.tl.to(this.inputElements, { scale: 0, duration: growTime }, "<")
        gsap.set(this.animationEls, { transformOrigin: "bottom center" })
        self.tl.to(this.animationEls, { scale: 0, duration: growTime }, "<")


        //grow animation
        self.tl.to(this.playBtn, { duration: growTime * 2 })
        this.animationEls.forEach(l => {
            l.forEach(el => {
                self.tl.to(el, {
                    scale: 1, duration: growTime, ease: "elastic",
                    onStart: function () {
                        el.setAttribute("href", "#output-" + (el.type).toString())
                    }
                }, "<")
            })

        });

        //change targets 
        self.tl.to(this.targetEls, { opacity: 0.2 })


        //CHECK IF CORRECT and DETERMINE ANIMATION 

        self.tl.to(this.animationEls, { transformOrigin: "top left", duration: 0 })

        var totalPerTarget = 0
        this.goal.forEach(num => {
            totalPerTarget += num
        });

        var completed = true

        // for(var i = 0; i < count.length; i++) {
        //     if (count[i] != this.goal[i]*this.targets) completed = false 
        // }

        if (this.filledRows * this.filledColumns != this.targets * totalPerTarget) {
            completed = false
        }


        //FEEDBACK ANIM (FOR 1 TYPE RN)
        if (completed) {
            this.game.completed = true

            if (this.filledRows == this.targets) {
                //ANIMATE OVER BY ROWS 
                var index = 0

                for (var i = 0; i < this.animationEls.length; i++) {
                    self.tl.to(self.playBtn, { duration: 1 })
                    for (var j = 0; j < this.animationEls[i].length; j++) {
                        el = this.animationEls[i][j]
                        self.tl.to(el, { scale: self.targetScaleVal, duration: 1, x: self.targetPos[i][j].x, y: self.targetPos[i][j].y }, "<")
                        index++;

                    }

                }
            }
            else { //this.columns == this.targets
                //deal cards anim (go by column)
                var index = 0

                for (var j = 0; j < totalPerTarget; j++) {
                    for (var i = 0; i < this.targets; i++) {
                        el = this.animationEls[Math.floor(index / this.filledColumns)][index % this.filledColumns]
                        self.tl.to(el, { scale: self.targetScaleVal, duration: 0.5, x: self.targetPos[i][j].x, y: self.targetPos[i][j].y })

                        index++;
                    }
                }

                //regroup animation elements by column (transform matrix)
                var temp = []
                for(var j = 0; j < this.animationEls[0].length; j++) {
                    temp.push([])
                    for(var i = 0; i < this.animationEls.length; i++) {
                        temp[j].push(this.animationEls[i][j])
                    }
                }
                console.log(temp)
                this.animationEls = temp

            }
        }
        else if (this.filledRows <= this.targets && this.filledColumns <= totalPerTarget) {
            //leave targets empty 

            for (var i = 0; i < this.filledRows; i++) {
                self.tl.to(self.playBtn, { duration: 1 })
                for (var j = 0; j < this.filledColumns; j++) {
                    el = this.animationEls[i][j]
                    self.tl.to(el, { scale: self.targetScaleVal, duration: 0.5, x: self.targetPos[i][j].x, y: self.targetPos[i][j].y }, "<")
                }
            }
        }
        else if (this.filledRows <= this.targets && this.filledColumns > totalPerTarget) {
            //add extras to the bottom corner 
            for (var i = 0; i < this.filledRows; i++) {
                self.tl.to(self.playBtn, { duration: 1 })
                var extraPos = { x: this.targetPotsPos[i].x, y: this.targetPotsPos[i].y }
                for (var j = 0; j < this.filledColumns; j++) {
                    el = this.animationEls[i][j]
                    if (j < totalPerTarget)
                        self.tl.to(el, { scale: self.targetScaleVal, duration: 0.5, x: self.targetPos[i][j].x, y: self.targetPos[i][j].y }, "<")
                    else
                        self.tl.to(el, { scale: self.targetScaleVal, duration: 0.5, x: extraPos.x + 100 - (j - totalPerTarget) * 7, y: extraPos.y + 60 }, "<")
                }
            }
        }
        else if (this.filledRows > this.targets && this.filledColumns <= totalPerTarget) {
            //add extra rows 
            for (var i = 0; i < this.filledRows; i++) {
                self.tl.to(self.playBtn, { duration: 1 })
                for (var j = 0; j < this.filledColumns; j++) {
                    el = this.animationEls[i][j]
                    self.tl.to(el, { scale: self.targetScaleVal, duration: 0.5, x: self.targetPos[i][j].x, y: self.targetPos[i][j].y }, "<")
                }
            }

        }
        else if (this.filledRows > this.targets && this.filledColumns > totalPerTarget) {
            //add extra rows and extras to the bottom corner
            for (var i = 0; i < this.filledRows; i++) {
                self.tl.to(self.playBtn, { duration: 1 })
                var extraPos = { x: this.targetPotsPos[i].x, y: this.targetPotsPos[i].y }
                for (var j = 0; j < this.filledColumns; j++) {
                    el = this.animationEls[i][j]
                    if (j < totalPerTarget || i >= this.targets)
                        self.tl.to(el, { scale: self.targetScaleVal, duration: 0.5, x: self.targetPos[i][j].x, y: self.targetPos[i][j].y }, "<")
                    else
                        self.tl.to(el, { scale: self.targetScaleVal, duration: 0.5, x: extraPos.x + 100 - (j - totalPerTarget) * 7, y: extraPos.y + 60 }, "<")
                }
            }
        }

        //feedback animation
        
        //success animation
        //TO DO: error message is in here ?? 
        if (completed) {
            //remove targets 
            this.tl.to(this.targetEls, {visibility : "hidden", duration : 0})

            gsap.set(this.targetPots[0], {transformOrigin : "bottom center"})
            this.tl.to(this.targetPots[0], {scale : 0, duration : 1, onComplete : function() {
                for(var i = 0; i < self.targets; i++) {
                    self.targetPots[0][i].setAttribute("href", "#stem")
                }
            }})

            this.tl.to(this.targetPots[0], {scale : 1, duration : 0.5})

            for(var i = 0; i < this.targets; i++) {
                var coords = this.bouquetCoords(this.targetPotsPos[i].x, this.targetPotsPos[i].y, this.animationEls[i].length, 17)
                var w = this.bouquetWidth(this.animationEls[i].length, 17)
                for(var j = 0; j < this.animationEls[i].length;j++) {
                    var moveX = Math.random() * (Math.round(Math.random()) == 0 ? 1 : -1)
                    var moveY = Math.random() * (Math.round(Math.random()) == 0 ? 1 : -1)
                    self.tl.to(this.animationEls[i][j], {x : coords[j].x + 70 - w/2 + moveX, y : coords[j].y + 25 + moveY}, "<")
                }
            }
        }

        else {
            //feedback animation
        }


        //show buttons
        if (completed || this.game.attempts >= 3) {
            self.tl.to(self.retryBtn, { scale: 0, x: "2vh", y: "2vh", rotation: 0, duration: 0 })
            self.tl.to([this.retryBtn, this.nextBtn], { scale: 1 })
        }
        else {

            //show rotating retry button in the middle
            gsap.set(self.retryBtn, { scale: 0, x: "90vh", y: "40vh", rotation: 0 })
            this.tl.to(self.retryBtn, { scale: 3, duration: 1 })
            this.tl.to(self.retryBtn, { repeat: -1, duration: 4, rotation: 360, ease: "bounce" })

        }
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
            return delta*4
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
        else return []
        
    }
}