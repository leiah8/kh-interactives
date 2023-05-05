import { gsap, Draggable } from "gsap/all";

export interface inputSetup {
    lineMin : number,
    lineMax : number,
    rangeNum : number,
      
    numbers : SVGSVGElement,
    item : SVGSVGElement,
}

export class HorizontalScrollClass {
  setup : inputSetup;
  constructor(setup) {        
    this.setup = setup
    this.main(setup)
  }

  main(setup){
    
    /*
    //set up the numbers
    var first = setup.item
    first.textContent = Number(setup.lineMin).toString();
  
    let numbers = setup.numbers
    let items = [{el : first, on : false}]
  
    for(var i = Number(setup.lineMin)+1; i < Number(setup.lineMax)+1; i++) {
      var n = document.createElement('li');
      var s = document.createElement('img')
      n.appendChild(s)
      n.appendChild(document.createTextNode(i.toString()));
      n.setAttribute("style", "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 20px;font-family : 'Poppins';")
      numbers.appendChild(n);

      items.push({el : n, on : false})
  
    }
    */
    const list = document.querySelectorAll('.hs'); 
  
    list.forEach(el => {
      const n = el.children.length;
      (el as HTMLElement).style.setProperty('--total', n.toString());
      (el as HTMLElement).style.setProperty('--boxSize', (67 * (5 / setup.rangeNum)).toString() +"px");
    });
    
    /*
    
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

    */
    
    }
    
      
}

