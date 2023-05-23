import { gsap, Draggable, Power1, Elastic } from "gsap/all";
import { CustomEase } from "gsap/CustomEase.js";
import {svgns} from "../api"

//TO DO 
export interface InputSetup {
  arena : HTMLElement,
  platform : SVGSVGElement,
  controls : HTMLElement,
  inputNums : HTMLElement, 
  inputBtns : HTMLElement, 
  equation : HTMLElement, 
  terms : HTMLElement, 
  numbers : SVGSVGElement, 
  plusBtn : SVGSVGElement,
  minusBtn : SVGSVGElement,
  cover : SVGSVGElement,
  cart : SVGSVGElement,
  backWheel : SVGSVGElement,
  frontWheel : SVGSVGElement,
  plusTxt : SVGSVGElement,
  minusTxt : SVGSVGElement,

  addRemove : boolean,
  useImgs : boolean,
}

interface Node extends HTMLElement{
    on : boolean;
    val : number 
}

interface Term extends HTMLElement{ 
    node : Node;
    positive : boolean;
    val : number;
    txt : HTMLElement | Text;
    img : HTMLElement,
}

export interface Game {
  startBalloons : number;
  startSandbags : number;
  goal : number;
  start : number;
  attempts : number;
}

export class IntegerPlatfromClass {
    games : Game[]
    game : Game
    gameIndex : number
    arena : SVGSVGElement;
    platform : SVGSVGElement;
    controls : SVGSVGElement;
    inputNums : HTMLElement;
    inputBtns : HTMLElement;
    equation : HTMLElement;
    balloonURL : string = "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-balloon_wmfqfh.svg";
    sandbagURL : string = "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-sandbag_zdtxyg.svg";
    
    numbers : HTMLElement;
    plusBtn : HTMLElement;
    addBtn : SVGUseElement;
    minusBtn : HTMLElement;
    terms : HTMLElement;
    nextBtn : SVGUseElement;
    retryBtn : SVGUseElement;
    playBtn : SVGUseElement;

    dragEl : any;
    spring : SVGUseElement; 
    left : SVGUseElement; 
    right : SVGUseElement; 
    surface : SVGUseElement; 
    levelEls : SVGUseElement[]; 

    sandbagBounce : any;

    cover : SVGSVGElement;
    cart : SVGSVGElement;
    backWheel : SVGSVGElement;
    frontWheel : SVGSVGElement;
    plusTxt : SVGSVGElement;
    minusTxt : SVGSVGElement;
    wheelCircumference : number;
    cartXPos : number;
    
    DEFAULT_NODE_STYLE : string = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 20px; font-family : 'Poppins'; color:#000"
    SELECTED_NODE_STYLE : string = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #23a3ff; border-radius: 8px; font-size : 20px; font-family : 'Poppins'; color:#fff"
    DEFAULT_TERM_STYLE : string = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8vh; font-size : 20px; font-family : 'Poppins'; color:#000"
    SELECTED_TERM_STYLE : string = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #23a3ff; border-radius: 8vh; font-size : 20px; font-family : 'Poppins'; color:#fff"

    selectedTerm : Term;
    allTerms : Term[]
    termIndex : number
    selectedNode: Node;
    items : Node[];
    
    positive : boolean;
    sum : number;
    pos : number;
    DIFF : number = 300;

    tl : any
    canEdit : boolean;
    finished : boolean;
    canPlay : boolean;
    canReset : boolean;
    cartOnPlatform : boolean;

    addRemove : boolean;
    useImgs : boolean;

    balloons : SVGUseElement[]
    balloonVal : number = 1;
    sandbagVal : number = -1;
    sandbags : SVGUseElement[]
    balloonX : number;
    sandbagX : number;
    ITEM_START_X : number = 450;
    ITEM_START_Y : number = 202;

    constructor(setup, games) {
        this.games = games
        this.gameIndex = 0
        this.game = games[0]
        this.arena = setup.arena
        this.terms = setup.terms
        this.platform = setup.platform
        this.controls = setup.controls
        this.inputNums = setup.inputNums
        this.inputBtns = setup.inputBtns
        this.equation = setup.equation
        this.plusBtn = setup.plusBtn
        this.minusBtn = setup.minusBtn
        this.cart = setup.cart
        this.backWheel = setup.backWheel
        this.frontWheel = setup.frontWheel
        this.numbers = setup.numbers
        this.cover = setup.cover
        this.plusTxt = setup.plusTxt
        this.minusTxt = setup.minusTxt

        this.sum = 0
        this.pos = this.sum*50 
        this.positive = true

        this.selectedNode = null
        this.selectedTerm = null
        this.allTerms = []
        this.items = []

        this.tl = gsap.timeline()
        this.canEdit = false
        this.finished = false
        this.canPlay = false
        this.canReset = false
        this.cartOnPlatform = false;
        this.termIndex = -1
        
        this.balloons = []
        this.sandbags = []
        this.levelEls = []

        this.addRemove = setup.addRemove
        this.useImgs = setup.useImgs

        gsap.registerPlugin(CustomEase);
        this.sandbagBounce = CustomEase.create("sandbagBounce", "M0,0 C0,0 0.014,0.001 0.022,0.003 0.031,0.006 0.037,0.01 0.045,0.015 0.054,0.021 0.06,0.027 0.068,0.035 0.077,0.044 0.083,0.05 0.09,0.061 0.108,0.089 0.12,0.107 0.135,0.137 0.155,0.179 0.165,0.205 0.181,0.249 0.201,0.305 0.211,0.336 0.228,0.394 0.247,0.46 0.256,0.497 0.273,0.565 0.292,0.644 0.301,0.686 0.318,0.766 0.337,0.858 0.359,0.98 0.363,0.998 0.367,0.989 0.39,0.949 0.411,0.907 0.426,0.877 0.438,0.859 0.456,0.831 0.464,0.82 0.47,0.813 0.48,0.804 0.487,0.796 0.492,0.792 0.501,0.786 0.509,0.781 0.515,0.778 0.524,0.775 0.531,0.772 0.538,0.771 0.546,0.772 0.554,0.772 0.561,0.773 0.569,0.776 0.578,0.779 0.584,0.783 0.592,0.788 0.601,0.794 0.606,0.799 0.614,0.807 0.623,0.817 0.629,0.824 0.637,0.836 0.655,0.864 0.667,0.882 0.682,0.914 0.701,0.953 0.72,0.982 0.726,0.998 0.73,0.994 0.743,0.979 0.754,0.968 0.761,0.961 0.766,0.957 0.774,0.952 0.782,0.947 0.788,0.943 0.796,0.941 0.804,0.938 0.811,0.937 0.819,0.937 0.827,0.937 0.833,0.938 0.841,0.941 0.85,0.944 0.855,0.947 0.863,0.952 0.872,0.958 0.877,0.963 0.885,0.971 0.894,0.981 0.902,0.992 0.908,0.998 0.914,0.996 1,1 1,1 ")
        
        this.setupEls()

    }

    setLevels() {
      var self = this

      //next btn
      gsap.set(self.retryBtn, {scale: 0})
      if (self.game.attempts > 2) {
        self.tl.to(self.nextBtn,{duration: 1,scale: 1,ease: "elastic"})
        //self.tl.to(self.retryBtn, {duration: 1,scale: 1,ease: "elastic"}, "<")
      }
      else {
        gsap.set(self.nextBtn,{scale: 0})
        //self.tl.to(self.retryBtn, {duration: 1,scale: 1,ease: "elastic"}, "<")
      }

      //ground
      gsap.set(self.left, {y : 400 + -self.game.start*50})
      gsap.set(self.right, {x : 830, y : 400 + -self.game.start*50})
      //gsap.set(right, {x : 830, y : 400 + -self.game.goal*50})

      if (self.game.goal < 0) {
        var tunnel = document.createElementNS(svgns,"use")
        this.arena.appendChild(tunnel)
        tunnel.setAttribute("href","#tunnel")
        gsap.set(tunnel, {x : 830, y : 400 + -self.game.goal*50 - 125})
        this.levelEls.push(tunnel)
      }
      else if (self.game.goal > 0) {
        var bridge = document.createElementNS(svgns,"use")
        this.arena.appendChild(bridge)
        bridge.setAttribute("href","#bridge")
        gsap.set(bridge, {x : 830, y : 400 + -self.game.goal*50})
        this.levelEls.push(bridge)

        for (var i = 1; i < self.game.goal; i++) {
          var extension = document.createElementNS(svgns, "use")
          this.arena.appendChild(extension)
          extension.setAttribute("href","#bridge-extension")
          gsap.set(extension, {x : 830, y : 400 + -self.game.goal*50 + i*50})
          this.levelEls.push(extension)
        }
      }

      gsap.set(self.surface, {x : 450, y : 400 - self.game.start*50})
      gsap.set(self.spring, {x : 580, y : 420 - self.game.start*50, height : 300 - self.game.start*50})

      //cart
      gsap.set(self.cart, {x : -200, y : 300 + self.game.start*50})
      this.cartXPos = 640 - 74
    }

    setupEls() {
        var self = this
        
        //ground
        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)
        this.left = left

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)
        this.right = right

        left.setAttribute("href","#ground")
        right.setAttribute("href","#ground")

        //platform surface
        var surface = document.createElementNS(svgns,"use")
        this.platform.appendChild(surface)
        surface.setAttribute("href","#surface")
        this.surface = surface

        //spring
        var spring = document.createElementNS(svgns,"use")
        this.arena.appendChild(spring)
        spring.setAttribute("href","#spring")
        this.spring = spring

        //inputs
        gsap.set(self.inputBtns, {visibility : "hidden"})
        gsap.set(self.inputNums, {visibility : "hidden"})

        //play button
        var playBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(playBtn)
        playBtn.setAttribute("href","#playBtn")
        gsap.set(playBtn, {x : 10, y : 10, transformOrigin : "center"})
        this.playBtn = playBtn

        playBtn.onpointerdown = function(e) {
            if(self.canPlay) {
              self.canEdit = false
              self.canReset = false
              self.canPlay = false
              self.tl.to(self.playBtn, {duration : 0.2, scale : 0})
              self.closeInput()
              self.playAnimation()
            }
        }

        //retry button
        var retryBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(retryBtn)
        retryBtn.setAttribute("href","#retryBtn")
        gsap.set(retryBtn, {x : 10, y : 10, transformOrigin : "center", scale : 0})
        this.retryBtn = retryBtn

        retryBtn.onpointerdown = function() {
          if(self.canReset) {
            self.resetGame()
            self.setupAnimation()
          }

        }

        //add button
        var addBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(addBtn)
        addBtn.setAttribute("href","#addBtn")
        gsap.set(addBtn, {x : 840, y : 10})
        this.addBtn = addBtn

        addBtn.onpointerdown = function(e) {
          if(!self.finished) {
            if (self.canEdit) {
              self.openInput()
              self.addNewTerm()
            }
            else if (!self.tl.isActive()){
              self.closeInput()
              self.openInput()
              self.addNewTerm()
            }
          }
        }

        //next button
        var nextBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(nextBtn)
        nextBtn.setAttribute("href","#nextBtn")
        gsap.set(nextBtn, {x : 1180, y : 10})
        this.nextBtn = nextBtn

        nextBtn.onpointerdown = function(e) {
          self.nextGame()
        }

        //other event listeners
        addEventListener("resize", (e) => {self.onResize(addBtn)})
        this.cover.onpointerdown = function(e) {self.closeInput()}

        //set wheels
        gsap.set(self.backWheel, {transformOrigin:"50% 50%"})
        gsap.set(self.frontWheel, {transformOrigin:"50% 50%"})
        self.wheelCircumference = 2*Math.PI*(self.backWheel.getBBox().width / 2) 
        //this.cartXPos = 640 - 74 //half of cart width
        //TO DO: find cart width ( = 148)

        //flags
        if (this.addRemove) {
          this.plusTxt.textContent = "add"
          this.minusTxt.textContent = "remove"
          gsap.set(self.minusTxt, {fontSize : 2.5, y : "-=2.3", x : "+=2.5"})
          gsap.set(self.plusTxt, {fontSize : 2.5, y : "-=0.25", x : "+=1.8"})
          //opposite axis??
        }

        //useImgs
        if (!self.useImgs) {
          self.balloonURL = ""
          self.sandbagURL = ""
        }

        //set up other stuff
        this.setLevels()
        this.setupInputScrollbar()
        this.setupPlusMinus()
        this.setupDraggablePlatform()

        this.tl.to(self.cart, {duration : 1})
        this.onResize(addBtn)
        this.setupAnimation()
    }

    nextGame() {
      var self = this
      this.gameIndex += 1
      this.gameIndex = self.gameIndex % self.games.length
      this.game = self.games[self.gameIndex]

      this.levelEls.forEach(el => {
        self.arena.removeChild(el)
      }) 
      this.levelEls = []

      

      this.setLevels()

      this.resetGame()
      this.setupAnimation()
    }

    resetGame() {
      var self = this
      this.finished = false;
      this.cartOnPlatform = false;
      this.canEdit = false;
      this.canPlay = false;
      this.canReset = false;

      gsap.set(self.retryBtn, {scale: 0})
      gsap.set(self.playBtn, {scale : 1})
      
      this.sum = 0
      this.tl.clear()
      this.updatePlatformPos()

      gsap.set(self.cart, {x : -200, y : 300 + self.game.start*50})

      //reset balloons and sandbags 
      self.balloons.forEach(el => {
        self.platform.removeChild(el)
      })
      self.balloons = []

      self.sandbags.forEach(el => {
        self.platform.removeChild(el)
      })
      self.sandbags = []

      //reset cart  (to outside of screen TO DO)
      gsap.set(self.cart, {x : -200, y : 300 + self.game.start*50})
      gsap.set([self.backWheel, self.frontWheel], {rotation : 0})

      //reset terms 
      self.allTerms.forEach(term => {
        self.terms.removeChild(term);
      })
      self.allTerms = []
    }
    
    playAnimation() {
      var self = this
      this.game.attempts += 1
      this.dragEl[0].disable()
      
      try {
        self.allTerms.forEach(term => {
          self.tl.to(term, {background : "#23a3ff", color : "white", duration : 0.3})
          var elements = []

          //add balloons or sandbags
          if(term.positive) {
            if (term.val > 0) {
              for(var i = 0; i < Math.abs(term.val); i++) {
                var temp = document.createElementNS(svgns,"use")
                self.platform.appendChild(temp)
                temp.setAttribute("href","#balloon")

                self.balloonX += 50
                gsap.set(temp, {x : self.balloonX, y : self.ITEM_START_Y + 600, visibility : "hidden"})
                elements.push(temp)
                self.balloons.push(temp)
              }
            }
            else {
              for(var i = 0; i < Math.abs(term.val); i++) {
                var temp = document.createElementNS(svgns,"use")
                self.platform.appendChild(temp)
                temp.setAttribute("href","#sandbag")

                self.sandbagX += 50
                gsap.set(temp, {x : self.sandbagX, y : self.ITEM_START_Y - 400, visibility : "hidden"})
                elements.push(temp)
                self.sandbags.push(temp)
              }
            }
            
            if (term.val > 0) {
              self.tl.to(elements, {y : self.ITEM_START_Y, visibility : "visible"})
            }
            else {
              var additionalY = 160
              self.tl.to(elements, {y : self.ITEM_START_Y + additionalY, ease : "sandbagBounce", visibility : "visible"})
            }
            //TO DO: fix sandbag bounce
            self.sum += term.val
            self.updatePlatformPos()
            // if (term.val < 0 ) {
            //   //bounce sandbags 
            //   var n = elements.length
            //   //self.tl.to(elements, {y : self.ITEM_START_Y + additionalY - 10, ease : Power1.easeOut, duration : 0.2}, "-="+(0.8+n/10))
            //   //self.tl.to(elements, {y : self.ITEM_START_Y + additionalY, ease : Power1.easeIn, duration : 0.2}, "-="+(0.8+n/10 -(n/10 + (n%2 - 1)/10)))
            // }
          }
          //remove balloons or sandbags
          else {
            if (term.val > 0) {
                if (Math.abs(term.val) <= self.balloons.length) {
                  var elements = []
                  for(var i = 0; i < Math.abs(term.val); i++) {
                    var temp = self.balloons.pop()
                    elements.push(temp)  
                    self.balloonX -= 50
                  }
                  self.tl.to(elements, {y : self.ITEM_START_Y - 600}) 
                  self.sum -= term.val
                  self.tl.to(elements, {visibility : "hidden", duration : 0}) 
                  self.updatePlatformPos() 
                }
                else {
                  self.tl.to(term, {background : "red"})
                  throw new Error("Break the loop.")
                }
            }
            else {
              if (Math.abs(term.val) <= self.sandbags.length) {
                var elements = []
                for(var i = 0; i < Math.abs(term.val); i++) {
                  var temp = self.sandbags.pop()
                  elements.push(temp)
                  self.sandbagX -= 50  
                }
                self.tl.to(elements, {y : self.ITEM_START_Y + 600}) 
                self.tl.to(elements, {visibility : "hidden", duration : 0}) 
                self.sum -= term.val
                self.updatePlatformPos() 
              }
              else {
                self.tl.to(term, {background : "red"})
                throw new Error("Break the loop.")
              }
            }
          }
          self.tl.to(term, {background : "white", color : "black", duration : 0.3})
        });

        //feedback animation
        if(self.sum == self.game.goal) {
          self.game.attempts = 3
          //cart rolls off 
          self.tl.to(self.cart, {x : 1400, duration : 2, ease : "linear", 
          onComplete : function() {
            self.cartOnPlatform = false
          }})
          self.tl.to([self.backWheel, self.frontWheel], {rotation : "+=" + (1400 - self.cartXPos) / self.wheelCircumference * 360, duration : 2, ease: "linear"}, "<")  //458
        }
        else if (self.sum < 0 || self.sum < self.game.goal) { //(self.sum < self.game.goal) {
          //hit the ground TO DO fix wheels
          self.tl.to(self.cart, {x : 830 - 148 /*cart width*/, ease: Power1.easeIn, duration : 0.75})
          self.tl.to([self.backWheel, self.frontWheel], {rotation : "+=" + ((830 - 148 - self.cartXPos) / self.wheelCircumference * 360), duration : 0.75, ease: Power1.easeIn}, "<")
          self.tl.to(self.cart, {x : self.cartXPos, ease: Power1.easeOut, duration : 1})
          self.tl.to([self.backWheel, self.frontWheel], {rotation : "-=" + ((830 - 148 - self.cartXPos) / self.wheelCircumference * 360), duration : 1, ease: Power1.easeOut}, "<")
        }
        else {
          //wiggle platform
          self.tl.to([self.platform, self.cart], {transformOrigin : "center", duration : 0})
          self.tl.to([self.platform, self.cart],0.3,{rotation:5})
          self.tl.to(self.spring,0.3,{skewY:3}, "<")
          self.tl.to([self.platform, self.cart],3,{rotation:0,ease:Elastic.easeOut.config(0.9,0.1)});
          self.tl.to(self.spring,3,{skewY:0, ease:Elastic.easeOut.config(0.9,0.1)}, "<");
          self.tl.to([self.platform, self.cart], {transformOrigin : "top left", duration : 0})
        }
      } catch {}
      self.tl.to(self.platform, {duration : 0, onComplete : function() {
        self.canEdit = false;
        self.canReset = true;
        self.finished = true;
        //next btn
        if (self.game.attempts > 2) {
          self.tl.to(self.nextBtn,{duration: 1,scale: 1,ease: "elastic"})
          gsap.set(self.retryBtn, {x : 10, y : 10, scale : 0, rotation : 0})
          self.tl.to(self.retryBtn, {duration: 1,scale: 1,ease: "elastic"}, "<")
        }
        else {
          self.tl.to(self.nextBtn,{duration: 0,scale: 0})
          //add in rotating retry button
          self.tl.to(self.retryBtn, {duration : 0, scale : 0, x : 605, y : 300, transformOrigin : "center"})
          self.tl.to(self.retryBtn, {duration: 1, scale: 3}) 
          self.tl.to(self.retryBtn, {repeat : -1, duration : 4, rotation : 360, ease: "bounce"}) 
          //self.tl.to(self.retryBtn, {duration: 1,scale: 1,ease: "elastic"}, "<") 
        }
        self.dragEl[0].enable()
      }})
    }

    openInput() {
        var self = this
        //this.canPlay = false
        this.canReset = false
        this.setPlusBtn()
        gsap.set(self.cover, {visibility : "visible"})
        gsap.set(self.inputBtns, {visibility : "visible"})
        gsap.set(self.inputNums, {visibility : "visible"})
  
        self.canEdit = false;
    }
    closeInput() {
        var self = this
        this.canPlay = true
        this.canReset = true
        gsap.set(self.cover, {visibility : "hidden"})
        gsap.set(self.inputBtns, {visibility : "hidden"})
        gsap.set(self.inputNums, {visibility : "hidden"})
  
        
        //remove empty terms (for some reason needs to run twice)
        for(var j = 0; j < 2; j++) {
          for(var i = 0; i < self.allTerms.length; i++) {
            if (self.allTerms[i].val == 0) {
                self.terms.removeChild(self.allTerms[i])
                self.allTerms.splice(i, 1)
            }
          }
        }

        self.adjustSpacing(".term")
        this.adjustEquationWidth()
  
        if (self.selectedTerm != null) {
          self.selectedTerm.setAttribute("style", self.DEFAULT_TERM_STYLE)
        }
  
        self.selectedTerm = null
        self.termIndex = -1
  
        //reset to no term selected 
        if (self.selectedNode != null) {
          self.selectedNode.setAttribute("style", self.DEFAULT_NODE_STYLE)
          self.selectedNode.on = false;
        }
        self.selectedNode = null
        self.canEdit = true;
      }

      addNewTerm() {
        var self = this
        // self.selectedTerm = {
        //   el : document.createElement('li'), 
        //   node : null,
        //   positive : true,
        //   val : 0,
        //   txt : document.createTextNode(""),
        //   img : null,
        // }

        self.selectedTerm =  Object.assign(document.createElement('li'), {
          node : null,
           positive : true,
           val : 0,
           txt : document.createTextNode(""),
           img : null
        })
  
        self.selectedTerm.appendChild(self.selectedTerm.txt);
        self.selectedTerm.setAttribute("style", self.SELECTED_TERM_STYLE)
        self.terms.appendChild(self.selectedTerm);
  
        self.termIndex = self.allTerms.length
        self.allTerms.push(self.selectedTerm)
        
        self.selectedTerm.onpointerdown = function(e) {
          if (self.tl.isActive()) {
            return
          }

          if(self.canEdit) {
            self.openInput()
          }
          var oldIndex = self.termIndex
  
          //set selected term
          for(var i = 0; i < self.allTerms.length; i++) {
            if (self.allTerms[i] == this) {
              self.termIndex = i
            }
          }
  
          if (oldIndex != self.termIndex) {
            if (self.selectedTerm != null) {
              self.selectedTerm.setAttribute("style", self.DEFAULT_TERM_STYLE)
            }
          }
          self.selectedTerm = self.allTerms[self.termIndex]
          self.selectedTerm.setAttribute("style", self.SELECTED_TERM_STYLE)
  
  
          //change plus/minus
          if (self.selectedTerm.positive) 
            self.setPlusBtn()
          else self.setMinusBtn()
  
          //change selected node
          if (self.selectedNode != null ) {
            self.selectedNode.setAttribute("style", self.DEFAULT_NODE_STYLE )
            self.selectedNode.on = false
          }
          if (self.selectedTerm.node  != null ) {
            self.selectedNode = self.selectedTerm.node 
            self.selectedNode.setAttribute("style", self.SELECTED_NODE_STYLE )
            self.selectedNode.on = true
          }
          else {
            self.selectedNode = null
          }
  
        }

        self.adjustSpacing(".term")
        this.adjustEquationWidth()
  
        // const list = document.querySelectorAll('.term'); 
        // list.forEach(el => {
        //   const n = el.children.length;
        //   (el as HTMLElement).style.setProperty('--total', (n).toString());
        //   (el as HTMLElement).style.setProperty('--boxSize', (12).toString() +"vh");
        // });
      }

    adjustEquationWidth() {
      var self = this
      var w = (this.arena as any as HTMLElement).getBoundingClientRect().width 
      var h = (this.arena as any as HTMLElement).getBoundingClientRect().height 
      var x = (this.addBtn as any as HTMLElement).getBoundingClientRect().x 
      var btnW = w * (70 / 1280) //(addBtn as any as HTMLElement).getBoundingClientRect().width
        

      var equationW = Math.max((0.18*h + 10), self.allTerms.length*(0.18*h + 10))
      gsap.set(this.equation, {width : equationW, x : x - equationW - btnW, y : "1.5vh"})
    }

    onResize(addBtn) {
        
      this.adjustEquationWidth()

        //input vertical scrollbar
        gsap.set(this.inputNums, {x : "20vh", y : "25vh"})
        gsap.set(this.inputBtns, {width : "20vh", height : "50vh", x : "-5vh", y : "25vh"})


        // var w = (this.arena as any as HTMLElement).getBoundingClientRect().width 
        // var x = (addBtn as any as HTMLElement).getBoundingClientRect().x 
        // var btnW = w * (70 / 1280) //(addBtn as any as HTMLElement).getBoundingClientRect().width

        // //equation
        // var equationW = w*0.3
        // //TO DO : make width depend on number of terms 
        // gsap.set(this.equation, {width : equationW, x : x - equationW - btnW, y : "1.5vh"})
    }

    setupPlusMinus() {
        var self = this
        //INITIALIZE TO POSITIVE
        gsap.set(self.plusBtn, {stroke : "#fff"})
  
        this.plusBtn.onpointerdown = function(e) {
          if (self.positive == false) {
            self.setPlusBtn()
          }
        }
  
        this.minusBtn.onpointerdown = function(e) {
          if (self.positive) {
            self.setMinusBtn()
          }
        }
      }
  
      setPlusBtn() {
        var self = this
        gsap.set(self.plusBtn, {stroke : "#fff"})
        gsap.set(self.minusBtn, {stroke : "#23a3ff"})
  
        if(self.selectedTerm != null && this.selectedTerm.val != 0) {
          self.selectedTerm.positive = true
          self.selectedTerm.txt.textContent = "+"+Math.abs(self.selectedTerm.val).toString()
        }
        self.positive = true
      }
  
      setMinusBtn() {
        var self = this
        gsap.set(self.minusBtn, {stroke : "#fff"})
        gsap.set(self.plusBtn, {stroke : "#23a3ff"})        
  
        self.selectedTerm.positive = false
        if (this.selectedTerm.val != 0)
          self.selectedTerm.txt.textContent = "-"+Math.abs(self.selectedTerm.val).toString()
        self.positive = false
      }

      setupInputScrollbar() {
        var self = this
        for(var i = 5; i >= -5; i--) {
          if (i != 0) {
            var n = document.createElement('li');
            if (self.useImgs) {
              n.appendChild(document.createTextNode(Math.abs(i).toString()));
              var s = document.createElement('img')
              if (i > 0) s.src = this.balloonURL
              if (i < 0) s.src = this.sandbagURL
              n.appendChild(s)
            }
            else 
              n.appendChild(document.createTextNode((i).toString()));
    
            n.setAttribute("style", self.DEFAULT_NODE_STYLE)
            this.numbers.appendChild(n);
            
            (this.items).push(Object.assign(n, {on : false, val : i}))
          }
          else {
            var n = document.createElement('li');
            var s = document.createElement('img')
            s.src = "https://res.cloudinary.com/dxltpgop9/image/upload/v1684182170/delete-button_rtn4rv.svg"
            n.appendChild(s)

            n.setAttribute("style", self.DEFAULT_NODE_STYLE)
            this.numbers.appendChild(n);
     
            n.onpointerdown = function() {
              self.selectedTerm.val = 0
              self.closeInput();
            }
          }
      
        }
        
        self.adjustSpacing(".num")

        // const list = document.querySelectorAll('.num'); 
        // list.forEach(el => {
        //   const n = el.children.length;
        //   (el as HTMLElement).style.setProperty('--total', n.toString());
        //   (el as HTMLElement).style.setProperty('--boxSize', (8).toString() +"vh");
        // });
    
        //CLICK ON NUMBERS 
        
        this.items.forEach(node => {
          (node).onpointerdown = function (e) {
            if (self.selectedNode != null && self.selectedNode != node) {
              self.selectedNode.setAttribute("style", self.DEFAULT_NODE_STYLE )
              self.selectedNode.on = false
            }
    
            if(!node.on) {
              node.setAttribute("style", self.SELECTED_NODE_STYLE )
              node.on = true
    
              self.selectedNode = node
            
              self.selectedTerm.node = node
              self.selectedTerm.val = node.val

              self.selectedTerm.removeChild(self.selectedTerm.txt);
              if (self.selectedTerm.img != null)
                self.selectedTerm.removeChild(self.selectedTerm.img);
              
              var str;
              if (self.positive && self.addRemove) str = "add "
              else if (!self.positive && self.addRemove) str = "remove "
              else if (self.positive && !self.addRemove) str = "+ "
              else  str = "- "

              if (self.useImgs) {
                str += Math.abs(self.selectedTerm.val).toString()
                
                self.selectedTerm.txt = document.createTextNode(str)
                self.selectedTerm.appendChild(self.selectedTerm.txt);
                
                var s = document.createElement('img')
                if (node.val > 0)  s.src = self.balloonURL
                else  s.src = self.sandbagURL
                self.selectedTerm.img = s
                self.selectedTerm.appendChild(s)
              }
              else {
                str += (self.selectedTerm.val).toString()
                
                self.selectedTerm.txt = document.createTextNode(str)
                self.selectedTerm.appendChild(self.selectedTerm.txt);

              }
            }
            else {
              node.setAttribute("style", self.DEFAULT_NODE_STYLE )
              node.on = false
    
              self.selectedNode = null
              self.selectedTerm.node = null
              self.selectedTerm.removeChild(self.selectedTerm.txt);
              if(self.selectedTerm.img != null)
                self.selectedTerm.removeChild(self.selectedTerm.img);
    
              self.selectedTerm.img = null
              self.selectedTerm.val = 0
              
              self.selectedTerm.txt = document.createTextNode("")
              self.selectedTerm.appendChild(self.selectedTerm.txt);
            }
          
          }
        }); 
      } 

      onUpdateDrag(self) {
        const yVal = Math.round(gsap.getProperty(self.platform, "y"));
        gsap.set(self.spring, {scaleY : self.getScaleVal(yVal)})
        if (self.cartOnPlatform) {  //self.cartOnPlatform
          gsap.set(self.cart, {y : 300 + yVal})
        }
      }

      setupDraggablePlatform() {
        var self = this
        //MOVE SPRING AND PLATFORM

        gsap.registerPlugin(Draggable);
        
        this.dragEl = Draggable.create(self.platform, {type : "y", 
          onDrag : self.onUpdateDrag, onDragParams : [self],  
          onDragEnd : function () {
            gsap.to(self.platform, {y : self.pos, ease : "elastic", duration : 1, 
                onUpdate : self.onUpdateDrag, onUpdateParams : [self] }) 
          }
        }) 
  
      }

      getScaleVal(y) {
        return -y/300 + 1
      }

      getPos() {
        return -this.sum*50
      }

      updatePlatformPos() {
        var self = this
        self.pos = self.getPos()
        this.tl.to(self.platform, {y : self.pos, ease : "elastic", duration : 1,
          onUpdate : function() {
            const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
            gsap.set(self.spring, {scaleY : self.getScaleVal(yVal) })
            if (self.cartOnPlatform) { 
               gsap.set(self.cart, {y : 300 + yVal})
            }
          }
        })
      }

      checkCart(cartX, boundary) {
        //var cartX = gsap.getProperty(self.cart, "x")
        if(cartX >= boundary)
          this.cartOnPlatform = true
      }

      setupAnimation() {
        var self = this

        this.dragEl[0].disable()

        self.onResize(self.addBtn)

        //gsap.set(self.spring, {transformOrigin: "bottom"})
        this.tl.to(self.spring, {transformOrigin: "bottom"})

        //set wheel attributes
        gsap.set([self.backWheel, self.frontWheel], {rotation : 0})
        this.tl.to(self.cart, {x : self.cartXPos, duration : 2, ease: "linear", 
        onComplete : function() {
          self.cartOnPlatform = true;
        }})
        this.tl.to([self.backWheel, self.frontWheel], {rotation : (self.cartXPos + 200) / self.wheelCircumference * 360, duration : 2, ease: "linear"}, "<")  //458
          
        this.tl.to(self.cart, {duration : 0.1})
        
        //update platform position
        self.sum = -1
        this.updatePlatformPos()
  
        //create start balloons and sandbags
        for(var i = 0; i < self.game.startBalloons; i++) {
          var temp = document.createElementNS(svgns,"use")
          this.platform.appendChild(temp)
          temp.setAttribute("href","#balloon")

          gsap.set(temp, {x : self.ITEM_START_X + i * 50, y : self.ITEM_START_Y + 600, visibility : "hidden"})
          this.balloons.push(temp) 
        }
        this.balloonX = self.ITEM_START_X + (self.game.startBalloons - 1)*50
  
        for(var i = 0; i < self.game.startSandbags; i++) {
          var temp = document.createElementNS(svgns,"use")
          this.platform.appendChild(temp)
          temp.setAttribute("href","#sandbag")

          gsap.set(temp, {x : self.ITEM_START_X + i * 50, y : self.ITEM_START_Y - 400, visibility : "hidden"})
          this.sandbags.push(temp)
        }
        this.sandbagX = self.ITEM_START_X + (self.game.startSandbags - 1)*50
        
        //add balloons and sandbags
        this.tl.to(self.balloons, {visibility : "visible", duration : 0})
        this.tl.to(self.sandbags, {visibility : "visible", duration : 0})

        this.tl.to(self.balloons, {y : self.ITEM_START_Y, 
          
          onComplete : function() {
            self.sum += self.game.startBalloons
            self.updatePlatformPos()
            
            self.tl.to(self.sandbags, {y : self.ITEM_START_Y + 160, ease : "sandbagBounce", 
              onComplete : function() {
                self.sum -= self.game.startSandbags
                self.updatePlatformPos()

                //bounce sandbags 
                // var n = self.sandbags.length
                // self.tl.to(self.sandbags, {y : "-=10", ease : Power1.easeOut, duration : 0.2}, "-="+ (0.8+n/10))
                // self.tl.to(self.sandbags, {y : "+=10", ease : Power1.easeIn, duration : 0.2}, "-="+(0.8+n/10 -(n/10 + (n%2 - 1)/10)))

                self.canEdit = true
                self.canPlay = true
                self.canReset = true
                self.finished = false
                self.dragEl[0].enable()
              }}, "-=0.3")
          }})


      
        
      }

      adjustSpacing(str) {
        //str = .num OR .term ONLY
        var size;

        if (str == ".num") size = 8
        else if (str == ".term") size = 18
        else return

        const list = document.querySelectorAll(str); 
        list.forEach(el => {
          const n = el.children.length;
          (el as HTMLElement).style.setProperty('--total', n.toString());
          (el as HTMLElement).style.setProperty('--boxSize', (size).toString() +"vh");
        });
      }
    
}