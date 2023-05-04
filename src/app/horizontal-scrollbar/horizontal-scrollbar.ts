import { gsap, Draggable } from "gsap/all";

interface Node {
    el : HTMLElement, 
    on : boolean
}

export interface scrollbarSetup {
    lineMin : number,
    lineMax : number,
    rangeNum : number,
      
    numbers : SVGSVGElement,
    item : SVGSVGElement,
    startText : SVGSVGElement,
    endText : SVGSVGElement,
    handle : SVGSVGElement, 
    clickArea : SVGSVGElement, 
    line : SVGSVGElement
}

export class HorizontalScrollClass {
    setup : scrollbarSetup;
    constructor(setup) {        
        this.setup = setup
        
        this.main(setup)
    }

    main(setup){
        //set up the numbers
        var first = setup.item
        first.textContent = Number(setup.lineMin).toString();
      
        let numbers = setup.numbers
        let items = [{el : first, on : false}]
      
        for(var i = Number(setup.lineMin)+1; i < Number(setup.lineMax)+1; i++) {
          var n = document.createElement('li');
          n.appendChild(document.createTextNode(i.toString()));
          n.setAttribute("style", "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 20px;font-family : 'Poppins';")
          numbers.appendChild(n);

          items.push({el : n, on : false})
      
        }
      
        const list = document.querySelectorAll('.hs'); 
      
        list.forEach(el => {
          const n = el.children.length;
          (el as HTMLElement).style.setProperty('--total', n.toString());
          (el as HTMLElement).style.setProperty('--boxSize', (67 * (5 / setup.rangeNum)).toString() +"px");
        });
        
      
        
        //set up the draggables and scroll
        let start_text = setup.startText
        let end_text = setup.endText
      
        let redCircle = setup.handle
        let line = setup.line
        
        gsap.set(redCircle, {scaleX : setup.rangeNum / 2, x : 0})
      
        //TO DO FIX
        let diff = (numbers.scrollWidth) / ((line as any as SVGGraphicsElement).getBBox().width + 3)
        
        start_text.textContent = setup.lineMin
        end_text.textContent = setup.lineMax
      
        gsap.registerPlugin(Draggable);
      
        //drag is glitchy
        numbers.scrollLeft = 0
        Draggable.create(redCircle, {
          type: "x",
          bounds: line,
          
          onDrag: function() {
            numbers.scrollLeft = diff*this.x 
            //numbers.scrollTo(diff*this.x, 0)
          }
        });
      
        numbers.addEventListener("scroll", (e) => {
          gsap.to(redCircle, {x : numbers.scrollLeft/diff})
        
        })
      
        let clickArea = setup.clickArea
        let minX = (clickArea as any as SVGGraphicsElement).getBoundingClientRect().x
        let maxX = minX + (clickArea as any as SVGGraphicsElement).getBoundingClientRect().width
        let lineMin = (line as any as SVGGraphicsElement).getBoundingClientRect().x
        let lineMax = lineMin + (line as any as SVGGraphicsElement).getBoundingClientRect().width
        
        clickArea.onpointerdown = clickHandle
        function clickHandle(e) {
        let ratio = (lineMax - lineMin) / (line as any as SVGGraphicsElement).getBBox().width
          let xVal = (e.clientX - minX - (redCircle as any as SVGGraphicsElement).getBoundingClientRect().width / 2)/ratio
      
          if (e.clientX >= minX && e.clientX <= maxX) {
            gsap.set(redCircle, {x : xVal})
            numbers.scrollLeft = diff*(xVal)
          }
       }
        
        //CLICKS ON BUTTONS 
        items.forEach(node => {
            (node.el).onpointerdown = function (e) {
                if (node.on) {
                    gsap.set(node.el, {color : "#000000"})
                    node.on = false
                }
                else {
                    gsap.set(node.el, {color : "#43c0d6"})
                    node.on = true
                }
        
              }
                    
            
        });

        
      
      }

      
}

