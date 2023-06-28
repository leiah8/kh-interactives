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
    size : string;
}

interface Block extends SVGRectElement {
    num : number;
    size : string; 
    fit : boolean;
}

interface Space {
    num : number;
    size : string;
    xVal : number;
    yVal : number;
}


export class MaterialBridgeAPI {
    arena : HTMLElement

    game : Game
    gameIndex : number;
    orders : Order[];
    orderBtn : HTMLElement;

    input : HTMLElement;
    inputImg : HTMLElement;
    currentImg : SVGUseElement
    inputSize : HTMLSelectElement;
    inputPieces : HTMLInputElement;
    playBtn : HTMLElement;
    boat : HTMLElement;

    animationEls : any[] //change

    games : Game[]
    targets : any[] //change 

    spaces : Space[]
    blocks : Block[]

    tl : any

    constructor(setup, games) {
        this.arena = setup.arena
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
        this.orders = []
        this.playBtn = setup.playBtn
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

    setupTargets() {
        //add outlines

        var xVal = 140
        var yVal = 100

        var width = 1000
        var height = 100
        var delta = 150

        var count = 0

        for(var i = 0; i < this.game.bridgeArr.length; i++) {
            //draw outlining rect 
            var rect = document.createElementNS(svgns, "rect")

            this.arena.appendChild(rect)
            gsap.set(rect, {x : xVal, y : yVal + i*delta, height : height, width : width, rx : 2, fill : "#ffffff", fillOpacity : 0.01, stroke : "#000000", strokeWidth : 4})

            this.targets.push(rect)

            var l = this.game.bridgeArr[i].length

            for(var j = 0; j < l; j++) {
                var smallRect = document.createElementNS(svgns, "rect")

                this.arena.appendChild(smallRect)
                gsap.set(smallRect, {x : xVal + (width/l)*j, y : yVal + i*delta, height : height, width : width / l, rx : 2, stroke : "#000000", strokeWidth : 4})

                if (this.game.bridgeArr[i][j] > 0) 
                    gsap.set(smallRect, {fill : "#fe4818ff", fillOpacity : 1})
                
                else {
                    gsap.set(smallRect, {fill : "#ffffff", fillOpacity : 0.01})
                    var temp = {
                        num : count, 
                        size : l > 1 ? "1/"+l.toString() : "1", 
                        xVal : xVal + (width/l)*j,
                        yVal : yVal + i*delta

                    } as Space
                    this.spaces.push(temp)
                    count++;
                }

                this.targets.push(smallRect)



            }
        }

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

        var menu = document.createElementNS(svgns, "use")
        this.inputImg.appendChild(menu)
        menu.setAttribute("href", "#order-btn")
        gsap.set(menu, { x: "95vh", y: "0.5vh" })

        menu.onpointerdown = function(e) {
            //to do:some kind of pop up
        }

        this.orderBtn.onpointerdown = function(e) {
            var num = self.orders.length
            self.orders.push({num : num, size : self.inputSize.value, pieces : Number(self.inputPieces.value)})
        }
    }

    setupButtons() {
        var self = this

        this.playBtn.onpointerdown = function(e) {
            self.playAnimation()
        }

    }

    playAnimation() {
        var self = this
        // hide input
        
        gsap.set(this.input, {visibility : "hidden"}) //change

        //sort order by decreasing size 
        this.orders = this.sortBySize(this.orders)

        var wholeSize = 1000
        var height = 100

        var currentWidth = 0
        var currentRow = []

        var ogX = 140 //1300 //140

        var xVal = ogX
        var yVal = 600

        var count = 0

        //setup boards
        for(var i = 0; i < this.orders.length; i++) {
            var str = this.orders[i].size
            var width = 0
            if (str == "1") 
                width = wholeSize
            else if (str == "1/2")
                width = wholeSize/2
            else if (str == "1/3")
                width = wholeSize / 3
            else if (str == "1/4") 
                width = wholeSize / 4

            for(var j = 0; j < this.orders[i].pieces; j++) {

                if (Math.round(currentWidth + width) > wholeSize) {
                    // center the past elements 
                    var newX = ogX + wholeSize/2 - (currentWidth/2)
                    var w = 0

                    currentRow.forEach(rect => {
                        gsap.set(rect.el, {x : newX + w})
                        w += rect.w
                    });
                    
                    yVal -= height
                    currentWidth = 0
                    xVal = ogX
                    currentRow = []

                }
                
                var rect = document.createElementNS(svgns, "rect")
                this.boat.appendChild(rect)
                gsap.set(rect, {x : xVal, y : yVal, height : height, width : width, rx : 2, fill : "#fe4818ff", stroke : "#000000", strokeWidth : 4})
                this.animationEls.push(rect)

                xVal += width
                currentWidth += width
                currentRow.push({el : rect, w : width})
                this.blocks.push(Object.assign(rect, { size : str, num : count, fit : false}))
                count++;

            }

            
        }

        // center the past elements 
        var newX = ogX + wholeSize/2 - (currentWidth/2)
        var w = 0

        currentRow.forEach(rect => {
            gsap.set(rect.el, {x : newX + w})
            w += rect.w
        });

        //have boat come in 
        //put in a group and move
        gsap.set(this.boat, {x : 1300})
        this.tl.to(this.boat, {x : 0, duration : 2})


        var spacesTemp = this.sortBySize(this.spaces)

        //sort the spaces 

        
        //go in order of top to bottom 

        this.blocks.reverse()

        var space;

        console.log(this.blocks)
        console.log(spacesTemp)

        // TO DO!!!!!!
        for(var i = 0; i < this.blocks.length; i++) {
            //find a space with the corresponding size 
            var block = this.blocks[i]
            for(var j = 0; j < spacesTemp.length; j++) {
                space = spacesTemp[j]
                if (block.size >= space.size) {
                    spacesTemp.splice(j, 1)
                    break;
                }
            }

            if (spacesTemp.length <= 0) { break} 

            if (space != null) {
                //there is a match 

                //move the block 
                this.tl.to(block, {x : space.xVal, y : space.yVal, duration : 1})
                //if block does not fit 
            }

            space = null
        }

    }

    sortBySize(arr) {
        for (var i = 1; i < arr.length; i++) {
            var temp = arr[i]
            var j;
            for (j = i - 1; j >= 0 && arr[j].size < temp.size; j--) {
                arr[j + 1] = arr[j]
            }
            arr[j + 1] = temp
        }
        return arr
    }

}