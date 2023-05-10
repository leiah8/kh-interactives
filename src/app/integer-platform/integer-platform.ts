import { gsap, Draggable } from "gsap/all";

export interface inputSetup {
    lineMin : number,
    lineMax : number,
    rangeNum : number,

    balloonURL : string,
    bagURL : string,

    plusBtn : SVGSVGElement, 
    minusBtn : SVGSVGElement, 
    platform : SVGSVGElement, 
    spring : SVGSVGElement, 

    balloon : SVGSVGElement, 
    sandbag : SVGSVGElement, 
    cart : SVGSVGElement, 
    backWheel : SVGSVGElement, 
    frontWheel : SVGSVGElement, 

    inputNums : HTMLElement,
    inputBtns : HTMLElement,

    playBtn : SVGSVGElement, 
    cover : SVGSVGElement, 

    equation : HTMLElement,
    terms : HTMLElement,
    addTerm : HTMLElement,
  
    numbers : SVGSVGElement,
}


export interface game {
  startBalloons : number;
  startSandbags : number;
  leftHeight : number;
  rightHeight : number;
}

interface node {
  el : HTMLElement;
  on : boolean;
  val : number 
  obj : HTMLElement[];
}

interface term  {
  el : HTMLElement;
  node : node;
  positive : boolean;
  val : number;
  txt : HTMLElement;
  img : HTMLElement,
}


export function integerPlatfromAPI(setup, game) {
  let self;

  class IntegerPlatformClass {
    setup : inputSetup
    game : game 
    sum : number
    pos : number
    items : node[]

    defaultNodeStyle : string
    selectedNodeStyle : string 
    positive : boolean

    tl : any

    selectedNode : node
    selectedTerm : term 
    termIndex : number
    allTerms : term[]

    canOpenInput : boolean
    diff : number
    springStart : number

    wheelCircumference : number

    constructor() {
      self = this
      this.setup = setup
      this.game = game
      this.sum = game.startBalloons*(-1) + game.startSandbags
      this.pos = this.sum*13.3
      this.items = []

      this.defaultNodeStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 20px;font-family : 'Poppins'; color:#000"
      this.selectedNodeStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #23a3ff; border-radius: 8px; font-size : 20px;font-family : 'Poppins'; color:#fff"
      this.positive = true

      this.tl = gsap.timeline();

      //this.itemStartX = -400
      //this.itemStartY = 50

      this.selectedNode = null
      this.selectedTerm = null 
      this.termIndex = -1
      this.allTerms = []

      this.canOpenInput = false

      //TO DO: FIX diff and 0.163
      this.diff = 450
      this.springStart = 0.175

      this.main()
    }

    openInput() {
      this.setPlusBtn()
      gsap.set(setup.cover, {visibility : "visible"})
      gsap.set(setup.inputBtns, {visibility : "visible"})
      gsap.set(setup.inputNums, {visibility : "visible"})

      self.canOpenInput = false;
    }

    closeInput() {
      gsap.set(setup.cover, {visibility : "hidden"})
      gsap.set(setup.inputBtns, {visibility : "hidden"})
      gsap.set(setup.inputNums, {visibility : "hidden"})

      //remove empty terms 
      if (self.selectedTerm != null && self.selectedTerm.val == 0) {
        setup.terms.removeChild(self.selectedTerm.el)
        self.allTerms.pop(self.termIndex)
        self.selectedTerm = null
        self.termIndex = -1
      }

      //reset to no term selected 
      if (self.selectedNode != null)
        self.selectedNode.el.setAttribute("style", self.defaultNodeStyle)
      self.selectedNode = null
      self.canOpenInput = true;
    }

    addNewTerm() {
      self.selectedTerm = {
        el : document.createElement('li'), 
        node : null,
        positive : true,
        val : 0,
        txt : document.createTextNode("+0"),
        img : null,
      }

      self.selectedTerm.el.appendChild(self.selectedTerm.txt);
      self.selectedTerm.el.setAttribute("style", self.defaultNodeStyle)
      setup.terms.appendChild(self.selectedTerm.el);

      self.termIndex = self.allTerms.length
      self.allTerms.push(self.selectedTerm)

      self.selectedTerm.el.onpointerdown = function(e) {
        if(self.canOpenInput) {
          self.openInput()
        }

        //set selected term
        for(var i = 0; i < self.allTerms.length; i++) {
          if (self.allTerms[i].el == this) {
            self.termIndex = i
          }
        }
        self.selectedTerm = self.allTerms[self.termIndex]

        //change plus/minus
        if (self.selectedTerm.positive) 
          self.setPlusBtn()
        else self.setMinusBtn()

        //change selected node
        self.selectedNode.el.setAttribute("style", self.defaultNodeStyle )
        self.selectedNode.on = false
        self.selectedNode = self.selectedTerm.node 
        self.selectedNode.el.setAttribute("style", self.selectedNodeStyle )
        self.selectedNode.on = true

      }

      const list = document.querySelectorAll('.term'); 
      list.forEach(el => {
        const n = el.children.length;
        (el as HTMLElement).style.setProperty('--total', (n).toString());
        (el as HTMLElement).style.setProperty('--boxSize', (120).toString() +"px");
      });
    }

    main() {
      this.setupInputScrollbar()
      this.setupPlusMinus()
      this.setupDraggablePlatform()

      //input 
      gsap.set(setup.inputBtns, {x : -40, y : 100, visibility : "hidden"})
      gsap.set(setup.inputNums, {x : -80, y : 100, visibility : "hidden"})

      setup.addTerm.onpointerdown = function(e) {
        if (self.canOpenInput) {
          self.openInput()
          self.addNewTerm()
        }
        else {
          self.closeInput()
        }
      }

      setup.cover.onpointerdown = function(e) {
        self.closeInput()
      }

      //set up equation descriptor
      gsap.set(setup.equation, {y : 10})
      gsap.set(setup.addTerm, {x : 180, y : 20})

      //play buttn 
      setup.playBtn.onpointerdown = function(e) {
        self.allTerms.forEach(x => {
          console.log(x)
          //TO DO: ANIMATE BALLOONS AND SANDBAGS          
        })
      }

      this.setupAnimation()

      /*
      function removeItems(node) {
        node.obj.forEach(el => {
          try {
          setup.platform.removeChild(el)
          }
          catch {

          }
        })
      }
      
      
      function addItems(node) {
        for(var i = 0; i < Math.abs(node.val); i++) {
          var temp;
          if (Number(node.val) < 0) {
            temp = setup.balloon.cloneNode(true);
            gsap.set(temp, {x : itemStartX + i * 15, y : itemStartY, visibility : "visible"})
          }
          else {
            temp = setup.sandbag.cloneNode(true)
            gsap.set(temp, {x : itemStartX + i * 15, y : itemStartY - 290, visibility : "visible"})
          }
         
          
          node.obj.push(temp)
          setup.platform.appendChild(temp)
        }
      }
      */
    }

    setupAnimation() {
      //set wheel attributes
      gsap.set(setup.backWheel, {transformOrigin:"50% 50%"})
      gsap.set(setup.frontWheel, {transformOrigin:"50% 50%"})
      self.wheelCircumference = 2*Math.PI*((setup.backWheel as HTMLElement).getBoundingClientRect().width / 2) //TO DO FIX SPEED

      //move cart to center
      this.tl.to(setup.cart, {duration : 1})
      this.tl.to(setup.cart, {x : 147, duration : 2, ease: "linear", 
        onUpdate : function() {
          const xVal = Math.round(gsap.getProperty(this.targets()[0], "x"));
          gsap.set(setup.backWheel, {rotation : xVal/self.wheelCircumference*360})
          gsap.set(setup.frontWheel, {rotation : xVal/self.wheelCircumference*360})
        }})
        this.tl.to(setup.cart, {duration : 0.1})
      
      //update platform position
      self.sum = 1
      self.pos = self.sum*13.3
      this.tl.to(setup.platform, {y : self.pos, ease : "elastic", duration : 1,
        onUpdate : function() {
          const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
          gsap.set(setup.spring, {scaleY : -yVal/self.diff + self.springStart })
        }
      , onComplete : function() {
        self.canOpenInput = true
      }})
      
    }

    updatePlatformPos() {
      self.pos = self.sum*13.3
      gsap.set(setup.spring, {scaleY : -self.pos/self.diff + self.springStart})
      gsap.set(setup.platform, {y : self.pos})
    }

    setupInputScrollbar() {
      for(var i = Number(setup.lineMin); i < Number(setup.lineMax)+1; i++) {

        if (i != 0) {
          var n = document.createElement('li');
          n.appendChild(document.createTextNode(Math.abs(i).toString()));
  
          var s = document.createElement('img')
          if (i < 0) s.src = setup.balloonURL
          if (i > 0) s.src = setup.bagURL
          n.appendChild(s)
  
          n.setAttribute("style", self.defaultNodeStyle)
          setup.numbers.appendChild(n);
   
          (this.items).push({el : n, on : false, val : i, obj : []})
        }
    
      }
      
      const list = document.querySelectorAll('.num'); 
      list.forEach(el => {
        const n = el.children.length;
        (el as HTMLElement).style.setProperty('--total', n.toString());
        (el as HTMLElement).style.setProperty('--boxSize', (60 * (5 / setup.rangeNum)).toString() +"px");
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
            if (node.val < 0)  s.src = setup.balloonURL
            else  s.src = setup.bagURL
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

    setupPlusMinus() {
      //INITIALIZE TO POSITIVE
      gsap.set(setup.plusBtn, {stroke : "#fff"})

      setup.plusBtn.onpointerdown = function(e) {
        if (self.positive == false) {
          self.setPlusBtn()
        }
      }

      setup.minusBtn.onpointerdown = function(e) {
        if (self.positive) {
          self.setMinusBtn()
        }
      }
    }

    setPlusBtn() {
      gsap.set(setup.plusBtn, {stroke : "#fff"})
      gsap.set(setup.minusBtn, {stroke : "#23a3ff"})

      if(self.selectedTerm != null) {
        self.selectedTerm.positive = true
        self.selectedTerm.txt.textContent = "+"+Math.abs(self.selectedTerm.val).toString()
      }
      self.positive = true
    }

    setMinusBtn() {
      gsap.set(setup.minusBtn, {stroke : "#fff"})
      gsap.set(setup.plusBtn, {stroke : "#23a3ff"})        

      self.selectedTerm.positive = false
      self.selectedTerm.txt.textContent = "-"+Math.abs(self.selectedTerm.val).toString()
      self.positive = false
    }

    setupDraggablePlatform() {
      //MOVE SPRING AND PLATFORM
      gsap.set(setup.spring, {transformOrigin: "bottom"})
      gsap.set(setup.spring, {scaleY : -self.pos/self.diff + self.springStart})
      gsap.set(setup.platform, {y : self.pos})
      gsap.registerPlugin(Draggable);
      
      Draggable.create(setup.platform, {type : "y", 
        onDrag : function() { 
          gsap.set(setup.spring, {scaleY : -this.y/self.diff + self.springStart})
        }, 
        onDragEnd : function () {
          gsap.to(setup.platform, {y : self.pos, ease : "elastic", duration : 1, 
            onUpdate : function() {
              const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
              gsap.set(setup.spring, {scaleY : -yVal/self.diff + self.springStart })
            } 
          }) 
        }})

    }
  }
  
  self  = new IntegerPlatformClass

}
    
    


