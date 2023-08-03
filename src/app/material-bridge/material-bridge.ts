import { gsap } from "gsap/all";
import { Power2, Power1 } from "gsap";
import { svgns } from "../api"


export interface GameInput {
    bridgeArr: number[][];
    outOfStock: number[];
    limit: number
}

interface Game extends GameInput {
    bridgeArr: number[][];
    outOfStock: number[];
    limit: number;

    attempts: number;
    complete: boolean
}

interface Order {
    num: number;
    pieces: number;
    size: number;
}

interface Block extends SVGRectElement {
    num: number;
    size: number;
}

interface Space { //extends SVGRectElement{
    num: number;
    size: number; //0 - 1
    board: number;
    xVal: number;
    yVal: number;
}


export class MaterialBridgeAPI {
    arena: HTMLElement
    svg: HTMLElement

    game: Game
    gameIndex: number;
    order: Order;
    orderBtn: HTMLElement;

    input: HTMLElement;
    inputImg: HTMLElement;
    currentImg: SVGUseElement
    inputSize: HTMLSelectElement;
    inputPieces: HTMLInputElement;
    retryBtn: HTMLElement;
    nextBtn: HTMLElement;
    boat: HTMLElement;

    usability : HTMLElement;

    frontWater: HTMLElement;
    lightning: HTMLElement;

    bigBoat: SVGUseElement;
    smallBoat: SVGUseElement;

    background: SVGUseElement;
    bridge: SVGUseElement
    boatY: number = 375;

    wholeSize: number = 1028;
    height: number = 45;
    xVal: number = 125
    yVal: number //= 209
    delta: number = 115

    animationEls: (SVGUseElement | SVGRectElement)[]

    games: Game[]
    targets: SVGRectElement[];

    spaces: Space[]
    ogSpaces: Space[]
    originalSpaces: Space[]
    blocks: Block[]

    finishedAttempt: boolean;

    fallingBlocks: SVGRectElement[]

    tl: any
    tl2: any[]
    pointer: SVGUseElement;
    helpBtn : HTMLElement;
    help : boolean

    constructor(setup, games) {
        this.arena = setup.arena
        this.svg = setup.svg
        this.games = this.createGames(games)
        this.game = this.games[0]
        this.gameIndex = 0
        this.input = setup.input
        this.inputImg = setup.inputImg
        this.inputSize = setup.inputSize
        this.inputPieces = setup.inputPieces
        this.orderBtn = setup.orderBtn
        this.boat = setup.boat
        this.frontWater = setup.frontWater
        this.lightning = setup.lightning

        this.targets = []
        this.retryBtn = setup.retryBtn
        this.nextBtn = setup.nextBtn
        this.animationEls = []

        this.spaces = []
        this.blocks = []
        this.ogSpaces;

        this.tl = gsap.timeline()
        this.tl2 = []

        this.finishedAttempt = false;

        this.fallingBlocks = []

        this.usability = setup.usability
        this.helpBtn = setup.helpBtn
        this.help = setup.help


        this.init()

    }

    //initial setup (create elements)
    init() {

        this.background = document.createElementNS(svgns, "use")
        this.arena.appendChild(this.background)
        gsap.set(this.background, { x: 0, y: 0 })

        this.bridge = document.createElementNS(svgns, "use")
        this.arena.appendChild(this.bridge)

        //small boat 
        this.smallBoat = document.createElementNS(svgns, "use")
        this.smallBoat.setAttribute("href", "#smallBoat")
        this.arena.appendChild(this.smallBoat)
        gsap.set(this.smallBoat, { x: -400, y: this.boatY + 78 })

        //create boat
        this.bigBoat = document.createElementNS(svgns, "use")
        this.arena.appendChild(this.bigBoat)
        this.bigBoat.setAttribute("href", "#boat")
        gsap.set(this.bigBoat, { x: 10 - 1300, y: this.boatY })

        //add water 
        var water = document.createElementNS(svgns, "use")
        this.frontWater.appendChild(water)
        water.setAttribute("href", "#waterNight")
        gsap.set(water, { x: -5, y: 697 })

        this.setBackground()
        this.setBridge()
        this.setupInput()
        this.setupTargets()
        this.setupButtons()

        // this.setupUsability() //to do: here
        if(this.help)
            this.setupUsability()
        else
            gsap.set([this.usability, this.helpBtn], {visibility : "hidden"})

        this.startAnimation();
    }

    setBackground() {
        this.background.setAttribute("href", "#backNight")
    }

    setBridge() {
        //to do : light up bridge as small boat comes in
        if (this.game.bridgeArr.length == 1) {
            this.bridge.setAttribute("href", "#bridge1")
            gsap.set(this.bridge, { x: -1, y: 100 })
            this.yVal = 247
        }
        else if (this.game.bridgeArr.length == 2) {
            this.bridge.setAttribute("href", "#bridge2")
            gsap.set(this.bridge, { x: -1, y: 50 })
            this.yVal = 197
        }
    }

    //take game input and create games array
    createGames(gIns: GameInput[]) {
        var gs = []

        gIns.forEach(gIn => {
            var arr = gIn.bridgeArr;

            if (arr.length > 2) {
                arr = gIn.bridgeArr.splice(0, 2)
            }
            else if (arr.length == 0) {
                arr = [[0]]
            }
            if (arr[0].length == 0) arr[0] = [0]
            if (arr.length > 1 && arr[1].length == 0) arr[1] = [0]

            var g = {
                bridgeArr: arr,
                outOfStock: gIn.outOfStock,
                limit: gIn.limit,
                attempts: 0,
                complete: false
            } as Game

            gs.push(g)
        });
        return gs
    }

    //setup the spaces array based on the input 
    setupSpaces() {

        this.spaces = []
        var self = this
        var xVal = this.xVal
        var yVal = this.yVal
        var delta = this.delta
        var count = 0

        //iterate over the different bridges
        for (var i = 0; i < this.game.bridgeArr.length; i++) {
            //iterate over the different spaces 
            var l = this.game.bridgeArr[i].length
            for (var j = 0; j < this.game.bridgeArr[i].length; j++) {
                if (this.game.bridgeArr[i][j] <= 0) {
                    //space
                    var temp = {
                        num: count,
                        size: 1 / l,
                        board: i,
                        xVal: xVal + (self.wholeSize / l) * j,
                        yVal: yVal + i * delta,
                    }
                    this.spaces.push(temp)
                }
                count++;
            }
        }

        this.ogSpaces = JSON.parse(JSON.stringify(this.spaces));


        //combine the spaces (side-by-side spaces considered as a single space)
        if (this.spaces.length > 0) {
            var spacesTemp = [this.spaces[0]]
            var index = 0
            for (var i = 1; i < this.spaces.length; i++) {
                if (this.spaces[i].num - 1 == this.spaces[i - 1].num && this.spaces[i].board == this.spaces[i - 1].board) {
                    spacesTemp[index].num += 1
                    spacesTemp[index].size += this.spaces[i].size
                }
                else {
                    spacesTemp.push(this.spaces[i])
                    index++;
                }
            }
        }

        this.spaces = spacesTemp

    }

    //according to the input fill in spaces in the bridge
    setupTargets() {
        var self = this
        var xVal = this.xVal
        var yVal = this.yVal

        var height = this.height
        var delta = this.delta

        // var count = 0

        //rotate between the different bridges
        for (var i = 0; i < this.game.bridgeArr.length; i++) {
            //rotate between the different spaces 
            var rect = document.createElementNS(svgns, "rect")
            this.arena.appendChild(rect)
            gsap.set(rect, { x: xVal, y: yVal + i * delta, height: height, width: this.wholeSize, rx: 2, fill: "#ffffff", fillOpacity: 0.01, stroke: "#f71e00ff", strokeWidth: 4 })

            this.targets.push(rect)

            var l = this.game.bridgeArr[i].length
            for (var j = 0; j < this.game.bridgeArr[i].length; j++) {
                var smallRect = document.createElementNS(svgns, "rect")
                this.arena.appendChild(smallRect)
                gsap.set(smallRect, { x: xVal + (this.wholeSize / l) * j, y: yVal + i * delta, height: height, width: this.wholeSize / l, rx: 2, stroke: "#f71e00ff", strokeWidth: 4 })

                this.targets.push(smallRect)

                if (this.game.bridgeArr[i][j] > 0) {
                    gsap.set(smallRect, { fill: "#f75c00ff", fillOpacity: 1 })
                }
                else {
                    //space 
                    gsap.set(smallRect, { fill: "#ffffff", fillOpacity: 0.01 })

                    // var temp = {
                    //     num : count,
                    //     size : 1/l,
                    //     board : i,
                    //     xVal : xVal + (self.wholeSize/l)*j,
                    //     yVal : yVal + i*delta,
                    // }
                    // this.spaces.push(temp)
                }

                // count++;

            }
        }

        this.setupSpaces()


        // //combine the spaces
        // if (this.spaces.length > 0) {
        //     var spacesTemp = [this.spaces[0]]
        //     var index = 0
        //     for(var i = 1; i < this.spaces.length;i++) {
        //         if (this.spaces[i].num - 1 == this.spaces[i-1].num && this.spaces[i].board == this.spaces[i-1].board) {
        //             spacesTemp[index].num += 1
        //             spacesTemp[index].size += this.spaces[i].size
        //         }
        //         else {
        //             spacesTemp.push(this.spaces[i])
        //             index++;
        //         }
        //     }
        // }

        // this.spaces = spacesTemp
        // this.originalSpaces = this.deepCopy(this.spaces)
    }


    //setup the input 
    setupInput() {
        var self = this
        gsap.set(this.input, { x: "32vh", y: "70vh" }) //to do??

        this.currentImg = document.createElementNS(svgns, "use")
        this.inputImg.appendChild(this.currentImg)
        this.currentImg.setAttribute("href", "#one")
        gsap.set(this.currentImg, { x: 0, y: "1vh" })

        this.inputSize.onchange = function (e) {
            var val = Number(self.inputSize.value)
            if (val == 1)
                self.currentImg.setAttribute("href", "#one")
            else if (val == 0.5)
                self.currentImg.setAttribute("href", "#half")
            else if (val == 0.333)
                self.currentImg.setAttribute("href", "#third")
            else if (val == 0.25)
                self.currentImg.setAttribute("href", "#fourth")
            else if (val == 0.2)
                self.currentImg.setAttribute("href", "#fifth")
            else if (val == 0.1666)
                self.currentImg.setAttribute("href", "#sixth")
            else if (val == 0.14286)
                self.currentImg.setAttribute("href", "#seventh")
            else if (val == 0.125)
                self.currentImg.setAttribute("href", "#eighth")
        }


        this.orderBtn.onpointerdown = function (e) {
            if (!self.finishedAttempt) {
                self.order = { num: 0, size: Number(self.inputSize.value), pieces: Number(self.inputPieces.value) }
                self.playAnimation()
            }

        }
    }


    playAnimation() {
        var self = this

        this.game.attempts++;
        this.finishedAttempt = true

        //remove fallen blocks 
        this.fallingBlocks.forEach(b => {
            self.boat.removeChild(b)
        });
        this.fallingBlocks = []

        //reset fallen block timelines
        this.tl2.forEach(el => {
            el.t.clear()
        });
        this.tl2 = []

        gsap.set(this.input, { visibility: "hidden" })


        //setup input blocks 
        var size = this.order.size
        var num = this.order.pieces

        var ogX = 150 //this.xVal
        var xVal = ogX
        var yVal = this.boatY + 220


        var startScale = 1 //0.5
        var endScale = 1

        var blocks = []

        for (var i = 0; i < num; i++) {
            //make the block

            if (xVal + this.wholeSize * size * startScale > ogX + this.wholeSize * startScale + 1) {
                xVal = ogX
                yVal -= this.height * startScale
                //ceneter the past row (TO DO)
            }

            var rect = document.createElementNS(svgns, "rect")
            this.boat.appendChild(rect)
            gsap.set(rect, { x: xVal, y: yVal, height: this.height, width: this.wholeSize * size, rx: 2, fill: "#f75c00ff", stroke: "#f71e00ff", strokeWidth: 4, scale: startScale })
            this.animationEls.push(rect)

            blocks.push({ el: rect, size: size, used: false })

            xVal += this.wholeSize * size * startScale
        }

        //add front of boat
        var front = document.createElementNS(svgns, "use")
        front.setAttribute("href", "#front")
        this.boat.appendChild(front)
        gsap.set(front, { x: 10, y: this.boatY })
        this.animationEls.push(front)


        gsap.set(this.boat, { x: "-=" + (1300) })
        this.tl.to(this.smallBoat, { x: "+= " + 1300, duration: 3, ease: "linear" })
        this.tl.to([this.boat, this.bigBoat], { x: "+=" + 1300, duration: 3, ease: "linear" }, "<1")
        this.tl.to(this.boat, { duration: 1 })


        //put in from left to right (TO DO)
        if (this.spaces.length > 0) {
            var finalBlock = blocks.length - 1
            var complete = false
            var space = this.spaces[0]
            var spaceIndex = 0;

            var moveSpeed = 1

            var fallenX = 0

            var notFilledExtras = false

            for (var i = blocks.length - 1; i >= 0; i--) {
                if (space.size > blocks[i].size && Math.abs(space.size - blocks[i].size) > 0.001) {
                    //move to 
                    this.tl.to(blocks[i].el, { x: space.xVal, y: space.yVal, duration: moveSpeed, scale: endScale })
                    //update the size 
                    space.size -= blocks[i].size
                    space.xVal += this.wholeSize * blocks[i].size

                    blocks[i].used = true

                    complete = false
                }

                else if (Math.abs(space.size - blocks[i].size) <= 0.001) {
                    //equal 

                    //fill and move on to next space
                    this.tl.to(blocks[i].el, { x: space.xVal, y: space.yVal, duration: moveSpeed, scale: endScale })
                    blocks[i].used = true
                    spaceIndex++;
                    if (spaceIndex < this.spaces.length)
                        space = this.spaces[spaceIndex]
                    else {
                        complete = true
                        finalBlock = i
                        break;
                    }
                }

                else if (space.size > 0) {
                    complete = false
                    //space is smaller than the block
                    //move block and let it fall 

                    this.tl.to(blocks[i].el, {
                        x: space.xVal, y: space.yVal, duration: moveSpeed, scale: endScale, onComplete: function () {
                            //move block to front 
                            self.boat.removeChild(this.targets()[0])
                            self.boat.appendChild(this.targets()[0])
                        }
                    })
                    this.tl.to(blocks[i].el, { rotation: 30, ease: "linear" })
                    this.tl.to(blocks[i].el, { rotation: 90, x: "+=" + fallenX, y: 700, ease: "linear" })

                    fallenX += this.height * 1.6

                    this.tl.to(blocks[i].el, {
                        y: "-=" + 50, duration: 1, ease: "linear", onComplete: function () {
                            self.bobBlock(this.targets()[0])
                        }
                    })

                    notFilledExtras = true

                    break; //to do: change feedback anim here
                }
            }

            this.tl.to(this.boat, { duration: 1 })


            //check if all blocks have been used 
            //check if all spaces have been filled (spaceIndex == this.spaces.length)

            var check = true
            blocks.forEach(element => {
                if (element.used == false) check = false
            });


            if (check && spaceIndex == this.spaces.length) {
                this.game.complete = true
                //cars driving accross for success animation
                this.tl.to(this.boat, {
                    duration: 0, onComplete: function () {
                        self.boat.removeChild(front)
                        self.animationEls.splice(self.animationEls.length - 1, 1)
                        self.successAnimation()
                        self.showEndGameButtons()
                    }
                })
            }

            else if (spaceIndex < this.spaces.length) {
                //zoom in on gaps and have them flash red

                var minX = this.spaces[spaceIndex].xVal
                var minY = this.spaces[spaceIndex].yVal
                var maxX = minX + this.spaces[spaceIndex].size * this.wholeSize
                var maxY = minY + this.height

                for (var i = spaceIndex + 1; i < this.spaces.length; i++) {
                    if (this.spaces[i].xVal < minX)
                        minX = this.spaces[i].xVal

                    if (this.spaces[i].xVal + this.spaces[i].size * this.wholeSize > maxX)
                        maxX = this.spaces[i].xVal + this.spaces[i].size * this.wholeSize

                    if (this.spaces[i].yVal < minY)
                        minY = this.spaces[i].yVal

                    if (this.spaces[i].yVal + this.height > maxY)
                        maxY = this.spaces[i].yVal + this.height


                }
                //find the smallest x, smallest y 
                // find farthest x and farthest y 

                var vb = (minX - 10).toString() + " " + (minY - 10).toString() + " " + (maxX - minX + 20).toString() + " " + ((maxY - minY + 20)).toString()
                var highlights = []
                this.tl.to(this.svg, {
                    attr: { viewBox: vb }, duration: 1, onComplete: function () {
                        //draw new rectangles to highlight

                        for (var i = spaceIndex; i < self.spaces.length; i++) {

                            var space = self.spaces[i]
                            var highlightRect = document.createElementNS(svgns, 'rect')
                            self.boat.appendChild(highlightRect)
                            self.animationEls.push(highlightRect)
                            gsap.set(highlightRect, { x: space.xVal, y: space.yVal, height: self.height, width: self.wholeSize * space.size, rx: 2, stroke: "#f71e00ff", fillOpacity: 0.01, strokeWidth: 4 })

                            highlights.push(highlightRect)

                        }

                        self.tl.to(highlights, { strokeWidth: "+=4", duration: 1 })
                        self.tl.to(highlights, { stroke: "#ae002bff", duration: 1 }, "<")
                        self.tl.to(highlights, { strokeWidth: "-=4", duration: 1 })
                        self.tl.to(highlights, { stroke: "#f71e00ff", duration: 1 }, "<")
                        // self.tl.to(highlights, { stroke: "#ae002bff", duration: 1, onUpdate : function() {
                        //     gsap.set(highlights, {strokeWidth : "+="+ 0.5})
                        // } })
                        // self.tl.to(highlights, { stroke: "#f71e00ff", duration: 1 })
                        self.tl.to(self.svg, { attr: { viewBox: "0 0 1280 720" }, duration: 1 })

                        //big boat drives off
                        if(!notFilledExtras)
                            self.tl.to([self.bigBoat, front], { x: "+= 2000", duration: 3, ease: "linear" })

                        self.showEndGameButtons()
                    }
                })

            }
            else {
                // have cars bump into them

                var car = document.createElementNS(svgns, "use")
                var yDiff = this.boatY + 220 - (this.yVal - this.height)
                var xDiff = ogX - this.xVal

                this.tl.to(blocks[0].el, {
                    duration: moveSpeed, onStart: function () {
                        for (var i = finalBlock - 1; i >= 0; i--) {
                            //re-add blocks to the front 
                            self.boat.removeChild(blocks[i].el)
                            self.boat.appendChild(blocks[i].el)
                        }
                    },
                    onComplete : function() {

                        //create a single car 
                        var carYVal = self.yVal - 52
                        var carsTop = []

                        car.setAttribute("href", "#car")
                        self.boat.appendChild(car)
                        self.animationEls.push(car)
                        carsTop.push(car)
                        gsap.set(car, { x: -200, y: carYVal })

                        var rails = document.createElementNS(svgns, "use")
                        rails.setAttribute("href", "#rails")
                        self.boat.appendChild(rails)
                        self.animationEls.push(rails)
                        gsap.set(rails, { x: 45, y: self.yVal - 12 })
                    }
                })

                for (var i = finalBlock - 1; i >= 0; i--) {
                    this.tl.to(blocks[i].el, { y: "-=" + (yDiff + 20), x: "-=" + xDiff, duration: moveSpeed }, "<")
                }

                this.tl.to(blocks[0].el, { duration : moveSpeed / 2})
                for (var i = finalBlock - 1; i >= 0; i--) {
                    this.tl.to(blocks[i].el, { y: "+=" + 20, duration: moveSpeed /2 }, "<")
                }

                //big boat drives off
                self.tl.to([self.bigBoat, front], { x: "+= 2000", duration: 3, ease: "linear" })


                this.tl.to(car, { x: this.xVal - 118, duration: 1.5, ease: Power1.easeIn })
                this.tl.to(car, { x: "-=" + 50, duration: 1, ease: Power1.easeOut })
                //118 = car width???

                this.showEndGameButtons()

            }
        }
        else {
            this.showEndGameButtons()
        }
    }

    //add a timeline to bob the blocks that fall
    bobBlock(b) {
        var self = this
        this.tl2.push({ t: gsap.timeline(), bobVal: 35 })

        var index = this.tl2.length - 1
        this.tl2[index].t.to(b, { y: "+=" + this.tl2[index].bobVal, ease: Power2.easeInOut, duration: 1 })
        this.tl2[index].t.to(b, {
            y: "-=" + this.tl2[index].bobVal, ease: Power2.easeInOut, duration: 1.2, onComplete: function () {
                if (self.tl2[index].bobVal > 10)
                    self.tl2[index].bobVal -= 10
                else if (self.tl2[index].bobVal > 5)
                    self.tl2[index].bobVal -= 5
            }
        })

        this.tl2[index].t.repeat(-1)
    }

    successAnimation() {

        //create 6 cars 
        var yVal = this.yVal - 52
        var carsTop = []
        for (var i = 0; i < 3; i++) {
            var car = document.createElementNS(svgns, "use")
            car.setAttribute("href", "#car")
            this.boat.appendChild(car)
            this.animationEls.push(car)
            carsTop.push(car)
            gsap.set(car, { x: 300 + i * 300 - 1200, y: yVal })
        }

        var carsBottom = []

        if (this.game.bridgeArr.length > 1) {
            for (var i = 0; i < 3; i++) {
                var car = document.createElementNS(svgns, "use")
                car.setAttribute("href", "#car")
                this.boat.appendChild(car)
                this.animationEls.push(car)
                carsBottom.push(car)
                gsap.set(car, { scaleX: -1, x: 300 + i * 300 + 1200, y: yVal + (this.delta + 2) })
            }
        }

        // create rocks on side if double bridge
        if (this.game.bridgeArr.length == 2) {
            var blocks = document.createElementNS(svgns, "use")
            blocks.setAttribute("href", "#blocks")
            this.boat.appendChild(blocks)
            this.animationEls.push(blocks)
            gsap.set(blocks, { x: -1, y: 50 + 146 })

        }

        //create rails 
        for (var i = 0; i < this.game.bridgeArr.length; i++) {
            var rails = document.createElementNS(svgns, "use")
            rails.setAttribute("href", "#rails")
            this.boat.appendChild(rails)
            this.animationEls.push(rails)
            gsap.set(rails, { x: 45, y: this.yVal - 12 + (this.delta - 1) * i })
        }


        //big boat drives off
        this.tl.to(this.bigBoat, { x: "+= 2000", duration: 3, ease: "linear" })

        //fade to day 
        this.tl.to([this.background, this.frontWater], { opacity: 0, duration: 2 })

        //move cars 
        this.tl.to(carsTop, { x: "+= 2400", duration: 5, ease: "linear" })
        this.tl.to(carsBottom, { x: "-= 2400", duration: 5, ease: "linear" }, "<")
    }

    showEndGameButtons() {
        //show buttons
        if (this.game.complete || this.game.attempts >= 3) {
            this.tl.to(this.retryBtn, { scale: 0, x: "0vh", y: "0vh", rotation: 0, duration: 0 })
            this.tl.to([this.retryBtn, this.nextBtn], { scale: 1 })
        }
        else {
            //show rotating retry button in the middle
            gsap.set(this.retryBtn, { scale: 0, x: "80vh", y: "50vh", rotation: 0 })
            this.tl.to(this.retryBtn, { scale: 3, duration: 1 })
            this.tl.to(this.retryBtn, { repeat: -1, duration: 4, rotation: 360, ease: "bounce" })
        }
    }

    setupButtons() {
        var self = this
        gsap.set(this.retryBtn, { scale: 0 })

        this.retryBtn.onpointerdown = function () {
            self.reset()
        }
        gsap.set(this.nextBtn, { scale: 0 })
        this.nextBtn.onpointerdown = function () {
            self.nextGame()
        }

        this.smallBoat.onpointerdown = function () {
            if (!self.finishedAttempt)
                gsap.set(self.input, { visibility: "visible" })
        }
    }

    startAnimation() {
        var self = this

        gsap.set(this.input, { visibility: "hidden" })

        // lightning bolt
        var allPathInfo = []
        var allPaths = this.lightning.childNodes

        allPaths.forEach(p => {
            allPathInfo.push({ path: p, length: (p as SVGPathElement).getTotalLength() })
        });
        allPathInfo.forEach(el => {
            gsap.set(el.path, { opacity: 1, strokeDasharray: el.length, strokeDashoffset: el.length })
        });

        this.tl.to(allPaths, { duration: 1 })
        this.tl.to(allPaths, { duration: 0.3 })
        allPathInfo.forEach(el => {
            this.tl.to(el.path, { strokeDashoffset: 0, duration: 0.2 }, "<")
        });
        this.tl.to(allPaths, { opacity: 0, duration: 0.8 })

        //blocks fall
        for (var i = 0; i < this.ogSpaces.length; i++) {

            var space = this.ogSpaces[i]
            var fallBlock = document.createElementNS(svgns, 'rect')
            this.boat.appendChild(fallBlock)
            gsap.set(fallBlock, { x: space.xVal, y: space.yVal, height: this.height, width: this.wholeSize * space.size, fill: "#e74c00ff", rx: 2, stroke: "#f71e00ff", strokeWidth: 4 })

            this.fallingBlocks.push(fallBlock)

        }

        this.tl.to(this.fallingBlocks, { y: 700, ease: Power2.easeInOut, duration: 1.2 }, "<")
        this.tl.to(this.fallingBlocks, {
            y: "-=" + 50, duration: 1, ease: "linear", onComplete: function () {
                self.bobBlock(self.fallingBlocks)
            }
        })

        this.tl.to(this.fallingBlocks, { x: "+=" + 1300, duration: 8, ease: "linear" })

        //move in little boat 
        this.tl.to(this.smallBoat, { x: 30, duration: 2, ease: "linear"}, "<4")

    }

    reset() {
        this.tl.clear()

        this.finishedAttempt = false

        gsap.set(this.bigBoat, { x: 10 - 1300 })
        gsap.set(this.smallBoat, { x: -400 })

        //fade to day 
        gsap.set([this.background, this.frontWater], { opacity: 1 })

        this.animationEls.forEach(el => {
            this.boat.removeChild(el)
        });
        this.animationEls = [] // remove all elements 

        gsap.set(this.retryBtn, { scale: 0 })

        if (this.game.complete || this.game.attempts >= 3)
            gsap.set(this.nextBtn, { scale: 1 })
        else
            gsap.set(this.nextBtn, { scale: 0 })

        this.setupSpaces();

        this.startAnimation();

    }

    nextGame() {
        var self = this
        this.gameIndex = (this.gameIndex + 1) % this.games.length
        this.game = this.games[this.gameIndex]

        this.targets.forEach(element => {
            self.arena.removeChild(element)
        });
        this.targets = []

        this.setBridge()

        this.setupTargets()

        this.reset()

    }

    //usability functions 

    setupUsability() {
        var self = this
        //add pointer 

        this.pointer = document.createElementNS(svgns, "use")
        this.pointer.setAttribute("href", "#pointer")
        this.usability.appendChild(this.pointer)

        gsap.set(this.usability, {visibility : "hidden"})
        gsap.set(this.pointer, {transformOrigin : "0% 100%", x : 0, y : 0})

        //setup btn 

        this.helpBtn.onpointerdown = function() {
            if (!self.tl.isActive())
                self.pointTo(90,493, self.smallBoat)
        }

    }

    pointTo(x, y, el) {
        var self = this
        gsap.set(this.usability, {visibility : "visible"})

        this.tl.pause()
        var tempT = gsap.timeline() 

        var w = 80
        var dist = Math.sqrt(x**2 + y**2)

        if(el != null) {
            const clone = el.cloneNode(true)
            this.usability.appendChild(clone)
        }


        var c = document.createElementNS(svgns, "circle")
        this.usability.appendChild(c)
        gsap.set(c, {attr : {cx : x, cy : y, r : 0}, stroke : "#fff", fillOpacity : 0})

        this.usability.appendChild(this.pointer)

        tempT.to(this.pointer, {duration : dist*(1.2/500), x : x - 0.24*w, y : y+ 0.02*w, ease : "bounce"})
        tempT.to(this.pointer, {duration : 0.15, scaleY : 1.1, ease : "bounce"})
        tempT.to(this.pointer, {duration : 0.15, scaleX : 0.8, ease : "bounce"}, "<")
        //start circles
        tempT.to(c, {attr : {r : 50}, alpha : 0}) 
        tempT.to(this.pointer, {duration : 1.2, scaleX : 1, ease : "elastic"})
        tempT.to(this.pointer, {duration : 1.2, scaleY : 1, ease : "elastic"}, "<")

        tempT.to(this.pointer, {duration : 0.5, onComplete : function() {
            //end 
            gsap.set(self.usability, {visibility : "hidden"})
            gsap.set(self.pointer, {x : 0, y : 0})
            self.usability.removeChild(c)
            self.tl.play()
        }})


    }
}