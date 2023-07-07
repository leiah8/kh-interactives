import { svgns } from "../api"
import { gsap, Draggable } from "gsap/all";


export interface GameInput {
    bridgeArr : number[][];
    outOfStock : number[];
    limit : number
}

interface Game extends GameInput {
    bridgeArr : number[][];
    outOfStock : number[];
    limit : number;

    attempts : number;
    complete : boolean
}

interface Order {
    num : number;
    pieces : number;
    size : number;
}

// interface Block extends SVGRectElement {
//     num : number;
//     size : string; 
//     fit : boolean;
// }

// interface Space {
//     num : number;
//     size : string;
//     board : number;
//     xVal : number;
//     yVal : number;
// }

interface Block extends SVGRectElement {
    num : number;
    size : number;
}

interface Space { //extends SVGRectElement{
    num : number;
    size : number; //0 - 1
    board : number;
    xVal : number;
    yVal : number; 
}


export class MaterialBridgeAPI {
    arena : HTMLElement
    svg : HTMLElement

    game : Game
    gameIndex : number;
    order : Order;
    orderBtn : HTMLElement;

    input : HTMLElement;
    inputImg : HTMLElement;
    currentImg : SVGUseElement
    inputSize : HTMLSelectElement;
    inputPieces : HTMLInputElement;
    retryBtn : HTMLElement;
    nextBtn : HTMLElement;
    boat : HTMLElement;

    wholeSize : number = 1000; 
    height : number = 100;

    animationEls : any[] //change

    games : Game[]
    targets : any[] //change 

    spaces : Space[]
    originalSpaces : Space[]
    blocks : Block[]

    tl : any

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

        this.targets = []
        this.retryBtn = setup.retryBtn
        this.nextBtn = setup.nextBtn
        this.animationEls = []

        this.spaces = []
        this.blocks = []

        this.tl = gsap.timeline()

        this.init()

        
    }
    init() {
        this.setupInput()
        this.setupTargets()
        this.setupButtons()
    }

    createGames(gIns) {
        var gs = []

        gIns.forEach(gIn => {
            var g = {
                bridgeArr : gIn.bridgeArr,
                outOfStock : gIn.outOfStock,
                limit : gIn.limit,
                attempts : 0,
                complete : false
            } as Game

            gs.push(g)
        });
        return gs
    }

    setupSpaces() {

        this.spaces = []
        var self = this
        var xVal = 140
        var yVal = 100

        var height = this.height
        var delta = 150

        var count = 0

        //rotate between the different bridges
        for(var i = 0; i < this.game.bridgeArr.length; i++) {
            //rotate between the different spaces 
            
            var l = this.game.bridgeArr[i].length
            for(var j = 0; j < this.game.bridgeArr[i].length; j++) {

                
                if (this.game.bridgeArr[i][j] <= 0) {
                    //space 
                    // gsap.set(smallRect, {fill : "#ffffff", fillOpacity : 0.01})

                    // var temp = Object.assign(smallRect, {
                    //     num : count,
                    //     size : 1/l,
                    //     board : i,
                    //     xVal : xVal + (self.wholeSize/l)*j,
                    //     yVal : yVal + i*delta,

                    // }) as Space
                    
                    var temp = {
                        num : count,
                        size : 1/l,
                        board : i,
                        xVal : xVal + (self.wholeSize/l)*j,
                        yVal : yVal + i*delta,

                    }  
                    this.spaces.push(temp)
                }

                count++;

            }
        }


        //combine the spaces
        if (this.spaces.length > 0) {
            var spacesTemp = [this.spaces[0]]
            var index = 0
            for(var i = 1; i < this.spaces.length;i++) {
                if (this.spaces[i].num - 1 == this.spaces[i-1].num && this.spaces[i].board == this.spaces[i-1].board) {
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

    setupTargets() {
        var self = this
        var xVal = 140
        var yVal = 100

        var height = this.height
        var delta = 150

        var count = 0

        //rotate between the different bridges
        for(var i = 0; i < this.game.bridgeArr.length; i++) {
            //rotate between the different spaces 
            var rect = document.createElementNS(svgns, "rect")
            this.arena.appendChild(rect)
            gsap.set(rect, {x : xVal, y : yVal + i*delta, height : height, width : this.wholeSize, rx : 2, fill : "#ffffff", fillOpacity : 0.01, stroke : "#000000", strokeWidth : 4})

            this.targets.push(rect)

            var l = this.game.bridgeArr[i].length
            for(var j = 0; j < this.game.bridgeArr[i].length; j++) {
                var smallRect = document.createElementNS(svgns, "rect")
                this.arena.appendChild(smallRect)
                gsap.set(smallRect, {x : xVal + (this.wholeSize/l)*j, y : yVal + i*delta, height : height, width : this.wholeSize / l, rx : 2, stroke : "#000000", strokeWidth : 4})
                
                this.targets.push(smallRect)
                
                if (this.game.bridgeArr[i][j] > 0) {
                    gsap.set(smallRect, {fill : "#fe4818ff", fillOpacity : 1})
                }
                else {
                    //space 
                    gsap.set(smallRect, {fill : "#ffffff", fillOpacity : 0.01})

                    // var temp = Object.assign(smallRect, {
                    //     num : count,
                    //     size : 1/l,
                    //     board : i,
                    //     xVal : xVal + (self.wholeSize/l)*j,
                    //     yVal : yVal + i*delta,

                    // }) as Space
                    var temp = {
                        num : count,
                        size : 1/l,
                        board : i,
                        xVal : xVal + (self.wholeSize/l)*j,
                        yVal : yVal + i*delta,

                    }
                    this.spaces.push(temp)
                }

                count++;

            }
        }


        //combine the spaces
        if (this.spaces.length > 0) {
            var spacesTemp = [this.spaces[0]]
            var index = 0
            for(var i = 1; i < this.spaces.length;i++) {
                if (this.spaces[i].num - 1 == this.spaces[i-1].num && this.spaces[i].board == this.spaces[i-1].board) {
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
        // this.originalSpaces = this.deepCopy(this.spaces)
    }


    setupInput() {
        var self = this
        gsap.set(this.input, {x : "32vh", y : "70vh"})

        this.currentImg = document.createElementNS(svgns, "use")
        this.inputImg.appendChild(this.currentImg)
        this.currentImg.setAttribute("href", "#one")
        gsap.set(this.currentImg, { x: 0, y: "1vh" })
        
        this.inputSize.onchange = function(e) {
            var val = self.inputSize.value
            if (val == "1")
                self.currentImg.setAttribute("href", "#one")
            else if (val == "1/2")
                self.currentImg.setAttribute("href", "#half")
            else if (val == "1/3")
                self.currentImg.setAttribute("href", "#third")
            else if (val == "1/4")
                self.currentImg.setAttribute("href", "#fourth")

        }

        

        this.orderBtn.onpointerdown = function(e) {
            //var num = self.orders.length
            //self.orders.push({num : num, size : Number(self.inputSize.value), pieces : Number(self.inputPieces.value)})
            self.order = {num : 0, size : Number(self.inputSize.value), pieces : Number(self.inputPieces.value)}
            self.playAnimation()

        }
    }

    playAnimation() {
        var self = this

        this.game.attempts++;

        gsap.set(this.input, {visibility : "hidden"})

        var size = this.order.size
        var num = this.order.pieces 

        var ogX = 140 //140
        var xVal = ogX
        var yVal = 650

        var blocks = []

        for (var i = 0; i < num; i++) {
            //make the block

            if (xVal + this.wholeSize*size > ogX + this.wholeSize + 1) {
                xVal = ogX 
                yVal -= this.height
                //ceneter the past row (TO DO)
            }

            var rect = document.createElementNS(svgns, "rect")
            this.boat.appendChild(rect)
            gsap.set(rect, {x : xVal, y : yVal, height : this.height, width : this.wholeSize*size, rx : 2, fill : "#fe4818ff", stroke : "#000000", strokeWidth : 4})
            this.animationEls.push(rect)

            blocks.push({el : rect, size : size, used : false})

            xVal += this.wholeSize*size
        }

        gsap.set(this.boat, {x : "+="+ (1300)})
        this.tl.to(this.boat, {x : "-="+ 1300, duration : 2})
        this.tl.to(this.boat, {duration : 1})


        //put in from left to right 

        if (this.spaces.length > 0) {

            var finalBlock = blocks.length-1
            var complete = false
            var space = this.spaces[0]
            var spaceIndex = 0;

            var moveSpeed = 1

            for(var i = blocks.length-1; i >= 0; i--) {
                if (space.size > blocks[i].size && Math.abs(space.size - blocks[i].size) > 0.001) {
                    //move to 
                    this.tl.to(blocks[i].el, {x : space.xVal, y : space.yVal, duration : moveSpeed})
                    //update the size 
                    space.size -= blocks[i].size
                    space.xVal += this.wholeSize*blocks[i].size

                    blocks[i].used = true

                    complete = false
                }

                else if (Math.abs(space.size - blocks[i].size) <= 0.001) {
                    //equal 

                    //fill and move on to next space
                    this.tl.to(blocks[i].el, {x : space.xVal, y : space.yVal, duration : moveSpeed})
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
                    this.tl.to(blocks[i].el, {x : space.xVal, y : space.yVal, duration : moveSpeed})
                    this.tl.to(blocks[i].el, {rotation : 30, ease : "linear"})
                    this.tl.to(blocks[i].el, {rotation : 50, y : 900, ease : "linear"})

                }
                
            }

            this.tl.to(this.boat, {duration : 1})


            //check if all blocks have been used 
            //check if all spaces have been filled (spaceIndex == this.spaces.length)

            var check = true
            blocks.forEach(element => {
                if (element.used == false) check = false
            });
            if (check && spaceIndex == this.spaces.length) {
                console.log("yay")
                this.game.complete = true
                this.showEndGameButtons()
            }
            // if(complete && finalBlock == 0 || spaceIndex == this.spaces.length && finalBlock == 0) {
            //     console.log("yay")
            //     this.game.complete = true
            //     this.showEndGameButtons()
            // }
            else if (spaceIndex < this.spaces.length) {
                //zoom in on gaps and have them flash red
                console.log("boo")

                var minX = this.spaces[spaceIndex].xVal
                var minY = this.spaces[spaceIndex].yVal
                var maxX = minX + this.spaces[spaceIndex].size*this.wholeSize
                var maxY = minY + this.height

                for(var i = spaceIndex+1; i < this.spaces.length; i++) {
                    if (this.spaces[i].xVal < minX)
                        minX = this.spaces[i].xVal
                    
                    if (this.spaces[i].xVal + this.spaces[i].size*this.wholeSize > maxX) 
                        maxX = this.spaces[i].xVal + this.spaces[i].size*this.wholeSize
                    

                    if (this.spaces[i].yVal < minY) 
                        minY = this.spaces[i].yVal
                    
                    if (this.spaces[i].yVal + this.height > maxY) 
                        maxY = this.spaces[i].yVal + this.height
                    

                }
                //find the smallest x, smallest y 

                // find farthest x and farthest y 

                var vb = (minX - 10).toString() + " " + (minY - 10).toString() + " " +(maxX - minX + 20).toString() + " " + (maxY-minY + 20).toString()

                var highlights = []
                this.tl.to(this.svg, {attr:{viewBox: vb}, duration : 1, onComplete : function() {
                    //draw new rectangles to highlight

                    for(var i = spaceIndex; i < self.spaces.length; i++) {
                        
                        var space = self.spaces[i]
                        var highlightRect = document.createElementNS(svgns, 'rect')
                        self.boat.appendChild(highlightRect)
                        self.animationEls.push(highlightRect)
                        gsap.set(highlightRect, {x : space.xVal, y : space.yVal, height : self.height, width : self.wholeSize*space.size, rx : 2, stroke : "#000000", fillOpacity : 0.01, strokeWidth : 4})
                        
                        highlights.push(highlightRect)

                    }

                    // this.tl.to(this.svg, {duration : 2})
                    self.tl.to(highlights, {stroke : "red",  duration : 1})
                    self.tl.to(highlights, {stroke : "black",  duration : 1})
                    self.tl.to(self.svg, {attr:{viewBox: "0 0 1280 720"}, duration : 1 })

                    self.showEndGameButtons()
                }})

                
                
            }
            else {
                this.showEndGameButtons()
            }
        }
        else {
            this.showEndGameButtons()
        }

        
    }

    showEndGameButtons() {
        //show buttons
        if (this.game.complete || this.game.attempts >= 3) {
            this.tl.to(this.retryBtn, { scale: 0, x: "1vh", y: "1vh", rotation: 0, duration: 0 })
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
        gsap.set(this.retryBtn, {scale : 0})

        this.retryBtn.onpointerdown = function() {
            self.reset()
        }
        gsap.set(this.nextBtn, {scale : 0})
        this.nextBtn.onpointerdown = function() {
            self.nextGame()
        }
    }

    reset() {
        this.tl.clear()
        // this.spaces = this.deepCopy(this.originalSpaces)
        gsap.set(this.input, {visibility : "visible"})


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

    }

    nextGame() {

        //TO DO 

    }


    

}