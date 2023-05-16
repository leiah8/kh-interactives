import { gsap, Draggable, Power1, Elastic } from "gsap/all";
import {svgns} from "../api"

interface InputSetup {
    arena : SVGSVGElement,
    platform : SVGSVGElement,
    controls : SVGSVGElement,
}

interface Node extends HTMLElement{
    on : boolean;
    val : number 
}

interface Term extends HTMLElement{ 
    //el : HTMLElement;
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

}

export class IntegerPlatfromClass {
    game : Game
    arena : SVGSVGElement;
    platform : SVGSVGElement;
    controls : SVGSVGElement;
    inputNums : HTMLElement;
    inputBtns : HTMLElement;
    equation : HTMLElement;
    BALLOON_URL : string = "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-balloon_wmfqfh.svg";
    BAG_URL : string = "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-sandbag_zdtxyg.svg";
    
    numbers : HTMLElement;
    plusBtn : HTMLElement;
    minusBtn : HTMLElement;
    terms : HTMLElement;

    spring : SVGUseElement; 

    cover : SVGSVGElement;
    cart : SVGSVGElement;
    backWheel : SVGSVGElement;
    frontWheel : SVGSVGElement;
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

    balloons : SVGUseElement[]
    sandbags : SVGUseElement[]
    balloonX : number;
    sandbagX : number;
    ITEM_START_X : number = 450;
    ITEM_START_Y : number = 202;

    constructor(setup, game) {
        this.game = game
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


        //TO DO constants snake case
        //this.diff = 400
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
        this.termIndex = -1
        
        this.balloons = []
        this.sandbags = []

        this.setupEls()

    }

    setupEls() {
        var self = this

        //cart
        gsap.set(self.cart, {y : 300})
        
        //ground
        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)

        left.setAttribute("href","#ground")
        right.setAttribute("href","#ground")

        // TO DO: Make customizable based on game input
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
        gsap.set(spring, {x : 580, y : 420, height : 300})
        this.spring = spring

        //play button
        var playBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(playBtn)
        playBtn.setAttribute("href","#playBtn")
        gsap.set(playBtn, {x : 10, y : 10})

        playBtn.onpointerdown = function(e) {
            if(self.canPlay) {
              self.canEdit = false
              self.canReset = false
              self.canPlay = false
              self.playAnimation()
            }
        }

        //retry button
        var retryBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(retryBtn)
        retryBtn.setAttribute("href","#retryBtn")
        gsap.set(retryBtn, {x : 10, y : 100})

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

        gsap.set(self.backWheel, {transformOrigin:"50% 50%"})
        gsap.set(self.frontWheel, {transformOrigin:"50% 50%"})
        self.wheelCircumference = 2*Math.PI*(self.backWheel.getBBox().width / 2) 
        this.cartXPos = 640 - 74 //half of cart width
        //TO DO: find cart width ( = 148)
    

        //set up other stuff
        this.onResize(addBtn)
        this.setupInputScrollbar()
        this.setupPlusMinus()
        this.setupDraggablePlatform()

        //set event listeners
        addEventListener("resize", (e) => {self.onResize(addBtn)})

        gsap.set(self.inputBtns, {visibility : "hidden"})
        gsap.set(self.inputNums, {visibility : "hidden"})

        self.cover.onpointerdown = function(e) {
            self.closeInput()
        }

        this.tl.to(self.cart, {duration : 1})
        this.setupAnimation()
    }

    resetGame() {
      var self = this
      self.canEdit = false;
      self.sum = 0
      self.updatePlatformPos()

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
        self.terms.removeChild(term);
      })
      self.allTerms = []
    }
    
    playAnimation() {
      var self = this
      
      try {
        self.allTerms.forEach(term => {
          self.tl.to(term, {background : "#23a3ff", color : "white", duration : 0.3})
          var elements = []

          //add balloons or sandbags
          if(term.positive) {
            if (term.val < 0) {
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

            var additionalY = (term.val < 0 ? 0 : 160)
            self.tl.to(elements, {y : self.ITEM_START_Y + additionalY, visibility : "visible"})
            self.sum += term.val
            self.updatePlatformPos()
          }
          //remove balloons or sandbags
          else {
            if (term.val < 0) {
                if (Math.abs(term.val) <= self.balloons.length) {
                  var elements = []
                  for(var i = 0; i < Math.abs(term.val); i++) {
                    var temp = self.balloons.pop()
                    elements.push(temp)  
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
          //cart rolls off 
          self.tl.to(self.cart, {x : 1400, duration : 2, ease : "linear"})
          self.tl.to([self.backWheel, self.frontWheel], {rotation : 1400 / self.wheelCircumference * 360, duration : 2, ease: "linear"}, "<")  //458
        }
        else if (self.sum > self.game.goal) {
          //hit the ground 
          self.tl.to(self.cart, {x : 830 - 148 /*cart width*/, ease: Power1.easeIn, duration : 0.75})
          self.tl.to(self.cart, {x : self.cartXPos, ease: Power1.easeOut, duration : 1})
        }
        else {
          //TO DO wiggle the platform 
          self.tl.to(self.platform, {transformOrigin : "center", duration : 0})
          self.tl.to(self.platform,0.3,{rotation:5})
          self.tl.to(self.spring,0.3,{skewY:3}, "<")
          self.tl.to(self.platform,3,{rotation:0,ease:Elastic.easeOut.config(0.9,0.1)});
          self.tl.to(self.spring,3,{skewY:0, ease:Elastic.easeOut.config(0.9,0.1)}, "<");
        }
        self.tl.to(self.platform, {duration : 0, onComplete : function() {
          self.canEdit = false;
          self.canReset = true;
          self.finished = true;
        }})
      } catch {}
    }

    openInput() {
        var self = this
        this.canPlay = false
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
        
        //cannot select during play animation 
        self.selectedTerm.onpointerdown = function(e) {
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
  
        // const list = document.querySelectorAll('.term'); 
        // list.forEach(el => {
        //   const n = el.children.length;
        //   (el as HTMLElement).style.setProperty('--total', (n).toString());
        //   (el as HTMLElement).style.setProperty('--boxSize', (12).toString() +"vh");
        // });
      }

    onResize(addBtn) {
        var w = (this.arena as any as HTMLElement).getBoundingClientRect().width 
        var x = (addBtn as any as HTMLElement).getBoundingClientRect().x 
        var btnW = (addBtn as any as HTMLElement).getBoundingClientRect().width
        
        //input vertical scrollbar
        gsap.set(this.inputNums, {x : "20vh", y : "25vh"})
        gsap.set(this.inputBtns, {width : "20vh", height : "50vh", x : "-5vh", y : "25vh"})

        //equation
        var equationW = w*0.3
        gsap.set(this.equation, {width : equationW, x : x - equationW - btnW, y : "1.5vh"})
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
        for(var i = -5; i <=5; i++) {
          
          if (i != 0) {
            var n = document.createElement('li');
            n.appendChild(document.createTextNode(Math.abs(i).toString()));
    
            var s = document.createElement('img')
            if (i < 0) s.src = this.BALLOON_URL
            if (i > 0) s.src = this.BAG_URL
            n.appendChild(s)
    
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
            
              //TO DOselectedTerm.el -> selectedTerm 
              self.selectedTerm.node = node
              self.selectedTerm.val = node.val
              self.selectedTerm.removeChild(self.selectedTerm.txt);
              if (self.selectedTerm.img != null)
                self.selectedTerm.removeChild(self.selectedTerm.img);
    
              if (self.positive) {
                var str = "+" + Math.abs(self.selectedTerm.val).toString()
              }
              else  {
                var str = "-" + Math.abs(self.selectedTerm.val).toString()
              }
              self.selectedTerm.txt = document.createTextNode(str)
              self.selectedTerm.appendChild(self.selectedTerm.txt);
    
              
              var s = document.createElement('img')
              if (node.val < 0)  s.src = self.BALLOON_URL
              else  s.src = self.BAG_URL
              self.selectedTerm.img = s
              self.selectedTerm.appendChild(s)
            }
            else {
              node.setAttribute("style", self.DEFAULT_NODE_STYLE )
              node.on = false
    
              self.selectedNode = null
              self.selectedTerm.node = null
              self.selectedTerm.removeChild(self.selectedTerm.txt);
              self.selectedTerm.removeChild(self.selectedTerm.img);
    
              self.selectedTerm.img = null
              self.selectedTerm.val = 0
              
              /*
              if (self.selectedTerm.positive) {
                var str = "+" + self.selectedTerm.val.toString()
              }
              else  {
                var str = "-" + self.selectedTerm.val.toString()
              }
              */
              self.selectedTerm.txt = document.createTextNode("")
              self.selectedTerm.appendChild(self.selectedTerm.txt);
    
    
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

      updatePlatformPos() {
        var self = this
        self.pos = self.getPos()
        this.tl.to(self.platform, {y : self.pos, ease : "elastic", duration : 1,
          onUpdate : function() {
            const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
            gsap.set(self.spring, {scaleY : self.getScaleVal(yVal) })
          }
        })
      }

      setupAnimation() {
        var self = this
        //set wheel attributes
        gsap.set([self.backWheel, self.frontWheel], {rotation : 0})
        this.tl.to(self.cart, {x : self.cartXPos, duration : 2, ease: "linear"})
        this.tl.to([self.backWheel, self.frontWheel], {rotation : self.cartXPos / self.wheelCircumference * 360, duration : 2, ease: "linear"}, "<")  //458
          
        this.tl.to(self.cart, {duration : 0.1})
        
  
        //update platform position
        self.sum = 1
        this.updatePlatformPos()
  
        //add start balloons 
        
        for(var i = 0; i < self.game.startBalloons; i++) {
          var temp = document.createElementNS(svgns,"use")
          self.platform.appendChild(temp)
          temp.setAttribute("href","#balloon")

          gsap.set(temp, {x : self.ITEM_START_X + i * 50, y : self.ITEM_START_Y + 600, visibility : "visible"})
          self.balloons.push(temp)

          self.balloonX = self.ITEM_START_X + i*50
          
        }
  
        for(var i = 0; i < self.game.startSandbags; i++) {
          var temp = document.createElementNS(svgns,"use")
          self.platform.appendChild(temp)
          temp.setAttribute("href","#sandbag")

          gsap.set(temp, {x : self.ITEM_START_X + i * 50, y : self.ITEM_START_Y - 400, visibility : "visible"})
          self.sandbags.push(temp)

          self.sandbagX = self.ITEM_START_X + i*50
        }
  
        this.tl.to(self.balloons, {y : self.ITEM_START_Y, 
          onComplete : function() {
            self.sum -= self.game.startBalloons
            self.updatePlatformPos()
            
            self.tl.to(self.sandbags, {y : self.ITEM_START_Y + 160, 
              onComplete : function() {
                self.sum += self.game.startSandbags
                self.updatePlatformPos()
                self.canEdit = true
                self.canPlay = true
                self.canReset = true
                self.finished = false
              }})
          }})


      
        
      }

      adjustSpacing(str) {
        //str = .num OR .term ONLY
        var size;

        if (str == ".num") size = 8
        else if (str == ".term") size = 12
        else return

        const list = document.querySelectorAll(str); 
        list.forEach(el => {
          const n = el.children.length;
          (el as HTMLElement).style.setProperty('--total', n.toString());
          (el as HTMLElement).style.setProperty('--boxSize', (size).toString() +"vh");
        });
      }
    
}