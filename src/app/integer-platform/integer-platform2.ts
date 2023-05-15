import { gsap, Draggable } from "gsap/all";
import {svgns} from "../api"

interface InputSetup {
    arena : SVGSVGElement,
    platform : SVGSVGElement,
    controls : SVGSVGElement,
}

interface Node {
    el : HTMLElement;
    on : boolean;
    val : number 
}

interface Term { // extends HTMLElement (TO DO)
    el : HTMLElement;
    node : Node;
    positive : boolean;
    val : number;
    txt : HTMLElement | Text;
    img : HTMLElement,
}

export interface Game {
  startBalloons : number;
  startSandbags : number;
  leftHeight : number;
  rightHeight : number;
}

export class IntegerPlatfromClass {
    game : Game
    arena : SVGSVGElement;
    platform : SVGSVGElement;
    controls : SVGSVGElement;
    inputNums : HTMLElement;
    inputBtns : HTMLElement;
    equation : HTMLElement;
    balloonURL : string;
    bagURL : string;
    numbers : HTMLElement;
    plusBtn : HTMLElement;
    minusBtn : HTMLElement;
    terms : HTMLElement;

    cover : SVGSVGElement;
    cart : SVGSVGElement;
    backWheel : SVGSVGElement;
    frontWheel : SVGSVGElement;
    
    defaultNodeStyle : string;
    selectedNodeStyle : string;
    defaultTermStyle : string;
    selectedTermStyle : string;

    selectedTerm : Term;
    selectedNode: Node;
    items : Node[];

    positive : boolean;

    wheelCircumference : number;
    sum : number;
    pos : number;
    diff : number = 300;
    springStart : number;

    tl : any

    spring : SVGUseElement; 

    canOpenInput : boolean;
    termIndex : number
    allTerms : Term[]

    balloons : SVGUseElement[]
    sandbags : SVGUseElement[]

    itemStartX : number;
    balloonX : number;
    sandbagX : number;
    itemStartY : number;
      
    

    constructor(setup, game) {
        this.arena = setup.arena
        this.game = game
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
        this.balloonURL = "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-balloon_wmfqfh.svg",
        this.bagURL = "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-sandbag_zdtxyg.svg",
        
        this.numbers = setup.numbers
        this.defaultNodeStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 20px; font-family : 'Poppins'; color:#000"
        this.selectedNodeStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #23a3ff; border-radius: 8px; font-size : 20px; font-family : 'Poppins'; color:#fff"
        this.defaultTermStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 30px; font-size : 20px; font-family : 'Poppins'; color:#000"
        this.selectedTermStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #23a3ff; border-radius: 30px; font-size : 20px; font-family : 'Poppins'; color:#fff"
        
        this.positive = true

        this.cover = setup.cover

        //constants snake case
        //this.diff = 400
        this.springStart = 0.175
        this.sum = 0
        this.pos = this.sum*50 

        this.selectedNode = null
        this.selectedTerm = null

        this.tl = gsap.timeline()
        this.canOpenInput = false
        this.termIndex = -1
        this.allTerms = []
        this.items = []
        this.balloons = []
        this.sandbags = []

        this.itemStartX = 500
        this.itemStartY = 202
        

        this.setupEls()

    }

    setupEls() {
        var self = this
        //ground
        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)

        left.setAttribute("href","#ground")
        right.setAttribute("href","#ground")

        gsap.set(left, {y : 400})
        gsap.set(right, {x : 830, y : 400})

        //platform surface
        var surface = document.createElementNS(svgns,"use")
        this.platform.appendChild(surface)
        surface.setAttribute("href","#surface")
        gsap.set(surface, {x : 450, y : 400})

        //spring
        var spring = document.createElementNS(svgns,"use")
        this.arena.appendChild(spring)
        spring.setAttribute("href","#spring")
        gsap.set(spring, {x : 580, y : 420})
        this.spring = spring

        //play button
        var playBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(playBtn)
        playBtn.setAttribute("href","#playBtn")
        gsap.set(playBtn, {x : 10, y : 10})

        playBtn.onpointerdown = function(e) {
            //TO DO
            if(!self.canOpenInput) {
              return
            }
            else {
              self.playAnimation(spring)
            }
        }

        //retry button
        var retryBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(retryBtn)
        retryBtn.setAttribute("href","#retryBtn")
        gsap.set(retryBtn, {x : 10, y : 100})

        retryBtn.onpointerdown = function() {
          self.resetGame(spring)
          self.setupAnimation(spring)
        }

        //add button
        var addBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(addBtn)
        addBtn.setAttribute("href","#addBtn")
        gsap.set(addBtn, {x : 840, y : 10})

        addBtn.onpointerdown = function(e) {
            if (self.canOpenInput) {
              self.openInput()
              self.addNewTerm()
            }
            else if (!self.tl.isActive()){
              self.closeInput()
              self.openInput()
              self.addNewTerm()
            }
          }
    

        //set up other stuff
        this.onResize()
        this.setupInputScrollbar()
        this.setupPlusMinus()
        this.setupDraggablePlatform()

        //set event listeners
        addEventListener("resize", (e) => {self.onResize()})

        gsap.set(self.inputBtns, {visibility : "hidden"})
        gsap.set(self.inputNums, {visibility : "hidden"})

        self.cover.onpointerdown = function(e) {
            self.closeInput()
        }
        this.setupAnimation(spring)
    }

    resetGame(spring) {
      var self = this
      //reset sum
      self.sum = 0
      self.updatePlatformPos(spring)

      //reset balloons and sandbags 
      self.balloons.forEach(el => {
        self.platform.removeChild(el)
      })
      self.balloons = []
      self.sandbags.forEach(el => {
        self.platform.removeChild(el)
      })
      self.sandbags = []

      //reset cart 
      gsap.set(self.cart, {x : 0 })

      //reset terms 
      self.allTerms.forEach(term => {
        self.terms.removeChild(term.el);
      })
      self.allTerms = []
    }
    
    playAnimation(spring) {
      var self = this
      try {
      self.allTerms.forEach(term => {
        var elements = []
        if(term.positive) {
          if (term.val < 0) {
            for(var i = 0; i < Math.abs(term.val); i++) {
              var temp = document.createElementNS(svgns,"use")
              self.platform.appendChild(temp)
              temp.setAttribute("href","#balloon")

              self.balloonX += 50
              gsap.set(temp, {x : self.balloonX, y : self.itemStartY + 600, visibility : "hidden"})
              
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
              gsap.set(temp, {x : self.sandbagX, y : self.itemStartY - 400, visibility : "hidden"})
              elements.push(temp)
              self.sandbags.push(temp)
            }

          }

          var additionalY = (term.val < 0 ? 0 : 160)

          self.tl.to(elements, {y : self.itemStartY + additionalY, visibility : "visible"})
          self.sum += term.val
          self.updatePlatformPos(spring)
        }
        else {
          if (term.val < 0) {
              if (Math.abs(term.val) <= self.balloons.length) {
                var elements = []
                for(var i = 0; i < Math.abs(term.val); i++) {
                  var temp = self.balloons.pop()
                  elements.push(temp)  
                }
                self.tl.to(elements, {y : self.itemStartY - 600}) 
                self.sum -= term.val
                self.tl.to(elements, {visibility : "hidden", duration : 0}) 
                self.updatePlatformPos(spring) 
              }
              else {
                self.tl.to(term.el, {background : "red"})
                throw new Error("Break the loop.")
                return
              }
          }
          else {
            if (Math.abs(term.val) <= self.sandbags.length) {
              var elements = []
              for(var i = 0; i < Math.abs(term.val); i++) {
                var temp = self.sandbags.pop()
                elements.push(temp)  
              }
              self.tl.to(elements, {y : self.itemStartY + 600}) 
              self.tl.to(elements, {visibility : "hidden", duration : 0}) 
              self.sum -= term.val
              self.updatePlatformPos(spring) 
            }
            else {
              self.tl.to(term.el, {background : "red"})
              throw new Error("Break the loop.")
              return
            }

          }
        }
      });
    }
    catch {

    }
    }

    openInput() {
        var self = this
        this.setPlusBtn()
        gsap.set(self.cover, {visibility : "visible"})
        gsap.set(self.inputBtns, {visibility : "visible"})
        gsap.set(self.inputNums, {visibility : "visible"})
  
        self.canOpenInput = false;
    }
    closeInput() {
        var self = this
        gsap.set(self.cover, {visibility : "hidden"})
        gsap.set(self.inputBtns, {visibility : "hidden"})
        gsap.set(self.inputNums, {visibility : "hidden"})
  
        
        //remove empty terms and space (for some reason needs to run twice)
        for(var j = 0; j < 2; j++) {
          for(var i = 0; i < self.allTerms.length; i++) {
            if (self.allTerms[i].val == 0) {
                self.terms.removeChild(self.allTerms[i].el)
                self.allTerms.splice(i, 1)
            }
          }
        }
  
        if (self.selectedTerm != null) {
          self.selectedTerm.el.setAttribute("style", self.defaultTermStyle)
        }
        
  
        self.selectedTerm = null
        self.termIndex = -1
  
        //reset to no term selected 
        if (self.selectedNode != null) {
          self.selectedNode.el.setAttribute("style", self.defaultNodeStyle)
          self.selectedNode.on = false;
        }
        self.selectedNode = null
        self.canOpenInput = true;
      }
      addNewTerm() {
        var self = this
        self.selectedTerm = {
          el : document.createElement('li'), 
          node : null,
          positive : true,
          val : 0,
          txt : document.createTextNode(""),
          img : null,
        }
  
        self.selectedTerm.el.appendChild(self.selectedTerm.txt);
        self.selectedTerm.el.setAttribute("style", self.selectedTermStyle)
        self.terms.appendChild(self.selectedTerm.el);
  
        self.termIndex = self.allTerms.length
        self.allTerms.push(self.selectedTerm)
  
        self.selectedTerm.el.onpointerdown = function(e) {
          if(self.canOpenInput) {
            self.openInput()
          }
          var oldIndex = self.termIndex
  
          //set selected term
          for(var i = 0; i < self.allTerms.length; i++) {
            if (self.allTerms[i].el == this) {
              self.termIndex = i
            }
          }
  
          if (oldIndex != self.termIndex) {
            if (self.selectedTerm != null) {
              self.selectedTerm.el.setAttribute("style", self.defaultTermStyle)
            }
          }
          self.selectedTerm = self.allTerms[self.termIndex]
          self.selectedTerm.el.setAttribute("style", self.selectedTermStyle)
  
  
          //change plus/minus
          if (self.selectedTerm.positive) 
            self.setPlusBtn()
          else self.setMinusBtn()
  
          //change selected node
          
          if (self.selectedNode != null ) {
            self.selectedNode.el.setAttribute("style", self.defaultNodeStyle )
            self.selectedNode.on = false
          }
          if (self.selectedTerm.node  != null ) {
            self.selectedNode = self.selectedTerm.node 
            self.selectedNode.el.setAttribute("style", self.selectedNodeStyle )
            self.selectedNode.on = true
          }
          else {
            self.selectedNode = null
          }
  
        }
  
        const list = document.querySelectorAll('.term'); 
        list.forEach(el => {
          const n = el.children.length;
          (el as HTMLElement).style.setProperty('--total', (n).toString());
          (el as HTMLElement).style.setProperty('--boxSize', (12).toString() +"vh");
        });
      }

    onResize() {
        var w = (this.arena as any as HTMLElement).getBoundingClientRect().width 
        
        //input vertical scrollbar
        gsap.set(this.inputNums, {x : "20vh", y : "25vh"})
        gsap.set(this.inputBtns, {width : "20vh", height : "50vh", x : "-5vh", y : "25vh"})

        //equation
        var equationW = w*0.4
        gsap.set(this.equation, {width : equationW, x : w  - equationW*2, y : "1.5vh"})
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
  
        if(self.selectedTerm != null) {
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
        self.selectedTerm.txt.textContent = "-"+Math.abs(self.selectedTerm.val).toString()
        self.positive = false
      }


      setupInputScrollbar() {
        var self = this
        for(var i = -5; i <=5; i++) {
  
          if (i != 0) {
            var n = document.createElement('li');
            n.appendChild(document.createTextNode(Math.abs(i).toString()));
    
            var s = document.createElement('img')
            if (i < 0) s.src = this.balloonURL
            if (i > 0) s.src = this.bagURL
            n.appendChild(s)
    
            n.setAttribute("style", self.defaultNodeStyle)
            this.numbers.appendChild(n);
     
            (this.items).push({el : n, on : false, val : i})
          }
      
        }
        
        const list = document.querySelectorAll('.num'); 
        list.forEach(el => {
          const n = el.children.length;
          (el as HTMLElement).style.setProperty('--total', n.toString());
          (el as HTMLElement).style.setProperty('--boxSize', (8).toString() +"vh");
        });
    
        //CLICK ON NUMBERS 
        
        this.items.forEach(node => {
          (node.el).onpointerdown = function (e) {
            if (self.selectedNode != null && self.selectedNode != node) {
              self.selectedNode.el.setAttribute("style", self.defaultNodeStyle )
              self.selectedNode.on = false
            }
    
            if(!node.on) {
              node.el.setAttribute("style", self.selectedNodeStyle )
              node.on = true
    
              self.selectedNode = node
            
              //TO DOselectedTerm.el -> selectedTerm 
              self.selectedTerm.node = node
              self.selectedTerm.val = node.val
              self.selectedTerm.el.removeChild(self.selectedTerm.txt);
              if (self.selectedTerm.img != null)
                self.selectedTerm.el.removeChild(self.selectedTerm.img);
    
              if (self.positive) {
                var str = "+" + Math.abs(self.selectedTerm.val).toString()
              }
              else  {
                var str = "-" + Math.abs(self.selectedTerm.val).toString()
              }
              self.selectedTerm.txt = document.createTextNode(str)
              self.selectedTerm.el.appendChild(self.selectedTerm.txt);
    
              
              var s = document.createElement('img')
              if (node.val < 0)  s.src = self.balloonURL
              else  s.src = self.bagURL
              self.selectedTerm.img = s
              self.selectedTerm.el.appendChild(s)
            }
            else {
              node.el.setAttribute("style", self.defaultNodeStyle )
              node.on = false
    
              self.selectedNode = null
              self.selectedTerm.node = null
              self.selectedTerm.el.removeChild(self.selectedTerm.txt);
              self.selectedTerm.el.removeChild(self.selectedTerm.img);
    
              self.selectedTerm.img = null
              self.selectedTerm.val = 0
    
              if (self.selectedTerm.positive) {
                var str = "+" + self.selectedTerm.val.toString()
              }
              else  {
                var str = "-" + self.selectedTerm.val.toString()
              }
              self.selectedTerm.txt = document.createTextNode(str)
              self.selectedTerm.el.appendChild(self.selectedTerm.txt);
    
    
            }
          
          }
        }); 
      } 

      setupDraggablePlatform() {
        var self = this
        //MOVE SPRING AND PLATFORM
        gsap.set(self.spring, {transformOrigin: "bottom"})

        gsap.registerPlugin(Draggable);
        
        Draggable.create(self.platform, {type : "y", 
          onDrag : function() { 
            gsap.set(self.spring, {scaleY : self.getScaleVal(this.y)})
          }, 
          onDragEnd : function () {
            gsap.to(self.platform, {y : self.pos, ease : "elastic", duration : 1, 
                onUpdate : function() {
                const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
                gsap.set(self.spring, {scaleY : self.getScaleVal(yVal) })
              }  
              
            }) 
          }
          }) 
  
      }

      getScaleVal(y) {
        return -y/300 + 1
      }

      getPos() {
        return this.sum*50
      }

      updatePlatformPos(spring) {
        var self = this
        self.pos = self.getPos()
        this.tl.to(self.platform, {y : self.pos, ease : "elastic", duration : 1,
          onUpdate : function() {
            const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
            gsap.set(spring, {scaleY : self.getScaleVal(yVal) })
          }
        })
      }

      setupAnimation(spring) {
        var self = this
        //set wheel attributes
        gsap.set(self.backWheel, {transformOrigin:"50% 50%"})
        gsap.set(self.frontWheel, {transformOrigin:"50% 50%"})
        gsap.set([self.backWheel, self.frontWheel], {rotation : 0})
        self.wheelCircumference = 2*Math.PI*(self.backWheel.getBBox().width / 2) 
        
        this.tl.to(self.cart, {duration : 1})
        this.tl.to(self.cart, {x : 550, duration : 2, ease: "linear"})
        this.tl.to([self.backWheel, self.frontWheel], {rotation : 550 / self.wheelCircumference * 360, duration : 2, ease: "linear"}, "<")  //458
          
        this.tl.to(self.cart, {duration : 0.1})
        
  
        //update platform position
        self.sum = 1
        this.updatePlatformPos(spring)
  
        //add start balloons 
        
        for(var i = 0; i < self.game.startBalloons; i++) {
          var temp = document.createElementNS(svgns,"use")
          self.platform.appendChild(temp)
          temp.setAttribute("href","#balloon")

          gsap.set(temp, {x : self.itemStartX + i * 50, y : self.itemStartY + 600, visibility : "visible"})
          self.balloons.push(temp)

          self.balloonX = self.itemStartX + i*50
          
        }
  
        for(var i = 0; i < self.game.startSandbags; i++) {
          var temp = document.createElementNS(svgns,"use")
          self.platform.appendChild(temp)
          temp.setAttribute("href","#sandbag")

          gsap.set(temp, {x : self.itemStartX + i * 50, y : self.itemStartY - 400, visibility : "visible"})
          self.sandbags.push(temp)

          self.sandbagX = self.itemStartX + i*50
        }
  
        this.tl.to(self.balloons, {y : self.itemStartY, 
          onComplete : function() {
            self.sum -= self.game.startBalloons
            self.updatePlatformPos(spring)
            
            self.tl.to(self.sandbags, {y : self.itemStartY + 160, 
              onComplete : function() {
                self.sum += self.game.startSandbags
                self.updatePlatformPos(spring)
                self.canOpenInput = true
              }})
          }})
      
        
      }
    
}