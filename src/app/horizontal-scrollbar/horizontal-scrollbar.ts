import { gsap, Draggable } from "gsap/all";

interface Node {
  el: HTMLElement,
  on: boolean
}

export interface scrollbarSetup {
  lineMin: number,
  lineMax: number,
  rangeNum: number,

  svg: HTMLElement,

  numbers: SVGSVGElement,
  item: SVGSVGElement,
  startText: SVGSVGElement,
  endText: SVGSVGElement,
  handle: SVGSVGElement,
  clickArea: SVGSVGElement,
  line: SVGSVGElement
}

export class HorizontalScrollClass {
  setup: scrollbarSetup;
  constructor(setup) {
    this.setup = setup
    this.main(setup)
  }

  main(setup) {
    this.setupScrollbar(setup)

    //TO DO FIX
    let diff = (setup.numbers.scrollWidth) / 580

    //add scroll response
    setup.numbers.addEventListener("scroll", (e) => {
      gsap.to(setup.handle, { x: setup.numbers.scrollLeft / diff })
    })

    //set width of handle relative to line and range
    let size = (Number(gsap.getProperty(setup.line, "width")) / (Number(setup.lineMax) - Number(setup.lineMin))) * Number(setup.rangeNum) 
    gsap.set(setup.handle, {width : size, x : 0})

    //set text
    setup.startText.textContent = setup.lineMin
    setup.endText.textContent = setup.lineMax

    /*
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
    */

    //clicking on line
    let minX = Number(gsap.getProperty(setup.clickArea, "x"))
    let maxX = minX + (Number(gsap.getProperty(setup.clickArea, "width")))

    let clickAreaX = (setup.clickArea as any as SVGGraphicsElement).getBoundingClientRect().x
    let clickAreaW = (setup.clickArea as any as SVGGraphicsElement).getBoundingClientRect().width

    let screenSVGDiff = clickAreaW / (maxX - minX)

    setup.clickArea.onpointerdown = function clickHandle(e) {

      let xVal = (e.clientX - clickAreaX) / screenSVGDiff
      
      if (xVal > 580-size/2) xVal = 580 - size/2
      else if (xVal < size/2) xVal = size/2
       
      gsap.set(setup.handle, { x: xVal - size/2})
      setup.numbers.scrollLeft = (xVal-size/2) * diff
    }


  }

  setupScrollbar(setup) {
    let numbers = setup.numbers
    let items: Node[] = []
    var nodeStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 14px;font-family : 'Poppins';"

    for (var i = Number(setup.lineMin); i <= Number(setup.lineMax); i++) {
      var n = document.createElement('li');
      n.appendChild(document.createTextNode(i.toString()));
      n.setAttribute("style", nodeStyle)
      numbers.appendChild(n);

      items.push({ el: n, on: false })

    }

    //fix spacing 
    const l = numbers.children.length;
    (numbers as HTMLElement).style.setProperty('--total', l.toString());
    (numbers as HTMLElement).style.setProperty('--boxSize', (86 * (5 / setup.rangeNum)).toString() + "px");

    //CLICKS ON BUTTONS 
    items.forEach(node => {
      (node.el).onpointerdown = function (e) {
        if (node.on) {
          gsap.set(node.el, { color: "#000000" })
          node.on = false
        }
        else {
          gsap.set(node.el, { color: "#43c0d6" })
          node.on = true
        }
      }
    });
  }


}

