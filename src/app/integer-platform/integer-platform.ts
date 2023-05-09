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
    goInput : SVGSVGElement, 
    cover : SVGSVGElement, 
  
    numbers : SVGSVGElement,
    item : SVGSVGElement,
}


export interface game {
  balloons : number;
  sandbags : number;
  leftHeight : number;
  rightHeight : number;
}

export class HorizontalScrollClass {
  setup : inputSetup;
  sum : number;
  constructor(setup) {   
    let self = this     
    this.setup = setup
    this.main(setup)

  }

  main(setup){
    var defaultStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 20px;font-family : 'Poppins'; color:#000"
    var selectedStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #23a3ff; border-radius: 8px; font-size : 20px;font-family : 'Poppins'; color:#fff"
    
    let numbers = setup.numbers
    let items = []
    var positive = null;
    var sum = 0
    var place = sum*13.3

    var tl = gsap.timeline();

  
    for(var i = Number(setup.lineMin); i < Number(setup.lineMax)+1; i++) {

      if (i != 0) {
        var n = document.createElement('li');
        n.appendChild(document.createTextNode(Math.abs(i).toString()));

        var s = document.createElement('img')
        if (i < 0) s.src = setup.balloonURL
        if (i > 0) s.src = setup.bagURL
        n.appendChild(s)

        n.setAttribute("style", defaultStyle)
        numbers.appendChild(n);

        var objects = []
 
        items.push({el : n, on : false, val : i, obj : []})
      }
  
    }
    
    const list = document.querySelectorAll('.hs'); 
  
    list.forEach(el => {
      const n = el.children.length;
      (el as HTMLElement).style.setProperty('--total', n.toString());
      (el as HTMLElement).style.setProperty('--boxSize', (60 * (5 / setup.rangeNum)).toString() +"px");
    });

    var startX = -400
    var startY = 50

    //CLICK ON NUMBERS 
    var selectedNode = null
    items.forEach(node => {
      (node.el).onpointerdown = function (e) {
        if (selectedNode != null && selectedNode != node) {
          selectedNode.el.setAttribute("style", defaultStyle )
          selectedNode.on = false
          if(positive) {
            sum -= selectedNode.val
          }
          else if (positive == false){
            sum += selectedNode.val
          }

          removeItems(selectedNode)
          selectedNode = null
        }

        if (node.on) {
            node.el.setAttribute("style", defaultStyle )
            node.on = false
            selectedNode = null
            
            if (positive) {
              sum -= node.val
            }
            else if (positive == false) {
              sum += node.val
            }
            removeItems(node)
        }
        else {
          node.el.setAttribute("style", selectedStyle)
          node.on = true
          selectedNode = node

          if (positive) {
            sum += node.val
            //add items
            addItems(node)
          }
          else if (positive == false) {
            sum -= node.val
            //TO DO what do we do???
          }
        }
        
        updatePos()
      }
    });

    //CLICK ON PLUS/MINUS
    setup.plusBtn.onpointerdown = function(e) {
      if (positive == null || positive == false) {
        gsap.set(setup.plusBtn, {stroke : "#fff"})
        if (positive == false) {
          gsap.set(setup.minusBtn, {stroke : "#23a3ff"})
          sum += selectedNode.val
        }
        positive = true

        if (selectedNode != null) {
          sum += selectedNode.val
          addItems(selectedNode)
          updatePos()
        }
      }
      else {
        positive = null
        gsap.set(setup.plusBtn, {stroke : "#23a3ff"})

        if (selectedNode != null) {
          sum -= selectedNode.val
          removeItems(selectedNode)
          updatePos()
        }
      }

    }

    /*

    setup.minusBtn.onpointerdown = function(e) {
      if (positive == null || positive) {
        gsap.set(setup.minusBtn, {stroke : "#fff"})
        if (positive) {
          gsap.set(setup.plusBtn, {stroke : "#23a3ff"})
          sum -= selectedNode.val
        }
        positive = false

        if (selectedNode != null) {
          sum -= selectedNode.val
          updatePos()
        }
      }
      else {
        positive = null
        gsap.set(setup.minusBtn, {stroke : "#23a3ff"})

        if (selectedNode != null) {
          sum += selectedNode.val
          updatePos()
        }
      }
    }

    */

    //MOVE SPRING AND PLATFORM 

    //TO DO: FIX diff and 0.163
    var diff = 450
    var start = 0.175
    // y at 0 means y is at 400px
    //13.3 is 50 px


    gsap.set(setup.spring, {transformOrigin: "bottom"})
    gsap.set(setup.spring, {scaleY : -place/diff + start})
    gsap.set(setup.platform, {y : place})
    gsap.registerPlugin(Draggable);
    
    
    Draggable.create(setup.platform, {type : "y", 
      onDrag : function() { 
        gsap.set(setup.spring, {scaleY : -this.y/diff + start})
      }, 
      onDragEnd : function () {
        gsap.to(setup.platform, {y : place, ease : "elastic", 
          onUpdate : function() {
            const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
            gsap.set(setup.spring, {scaleY : -yVal/diff + start })
          } 
        }) 
      }})


      //input 

      gsap.set(setup.inputBtns, {x : -100, y : 100, visibility : "hidden"})
      gsap.set(setup.inputNums, {x : -100, y : 100, visibility : "hidden"})

      var canInput = false;
      setup.goInput.onpointerdown = function(e) {
        if (canInput) {
          gsap.set(setup.cover, {visibility : "visible"})
          gsap.set(setup.inputBtns, {x : -40, visibility : "visible"})
          gsap.set(setup.inputNums, {x : -60, visibility : "visible"})

          canInput = false;
        }
        else {
          canInput = true;
          gsap.set(setup.cover, {visibility : "hidden"})
          gsap.set(setup.inputBtns, {x : -100, visibility : "hidden"})
          gsap.set(setup.inputNums, {x : -100, visibility : "hidden"})

        }
      }

      //move cart
      gsap.set(setup.backWheel, {transformOrigin:"50% 50%"})
      gsap.set(setup.frontWheel, {transformOrigin:"50% 50%"})
      var circumference = 2*Math.PI*((setup.backWheel as SVGGraphicsElement).getBBox().width / 2)

      tl.to(setup.cart, {duration : 1})
      tl.to(setup.cart, {x : 147, duration : 2, 
        onUpdate : function() {
          const xVal = Math.round(gsap.getProperty(this.targets()[0], "x"));
          gsap.set(setup.backWheel, {rotation : xVal/circumference*360})
          gsap.set(setup.frontWheel, {rotation : xVal/circumference*360})
        }})

      sum = 1
      place = sum*13.3
      tl.to(setup.platform, {y : place, ease : "elastic", 
        onUpdate : function() {
          const yVal = Math.round(gsap.getProperty(this.targets()[0], "y"));
          gsap.set(setup.spring, {scaleY : -yVal/diff + start })
        }
      , onComplete : function() {
        canInput = true
      }})
      

      function updatePos() {
        place = sum*13.3
        gsap.set(setup.spring, {scaleY : -place/diff + start})
        gsap.set(setup.platform, {y : place})
      }


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
            gsap.set(temp, {x : startX + i * 15, y : startY, visibility : "visible"})
          }
          else {
            temp = setup.sandbag.cloneNode(true)
            gsap.set(temp, {x : startX + i * 15, y : startY - 290, visibility : "visible"})
          }
         
          
          node.obj.push(temp)
          setup.platform.appendChild(temp)
        }
      }



    
    
    
  }
    
      
}


