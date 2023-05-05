import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { scrollbarSetup, HorizontalScrollClass} from "./horizontal-scrollbar";
//import { gsap, Draggable } from "gsap/all";

@Component({
  selector: 'app-horizontal-scrollbar',
  templateUrl: './hs3.html',
  styleUrls: ['./horizontal-scrollbar.component.css']
})
export class HorizontalScrollbarComponent implements AfterViewInit {
  @ViewChild("numbers") public numbers?: ElementRef<SVGSVGElement>;
  @ViewChild("item") public item?: ElementRef<SVGSVGElement>;
  @ViewChild("startText") public startText?: ElementRef<SVGSVGElement>;
  @ViewChild("endText") public endText?: ElementRef<SVGSVGElement>;
  @ViewChild("handle") public handle?: ElementRef<SVGSVGElement>;
  @ViewChild("line") public line?: ElementRef<SVGSVGElement>;
  @ViewChild("clickArea") public clickArea?: ElementRef<SVGSVGElement>;

  @ViewChild("scrollbar") public svg?: ElementRef<HTMLElement>;


  //positions of the target sun, planets, and moons 
  @Input()
  private lineMin : number = 0;

  @Input()
  private lineMax : number = 50;

  @Input()
  private rangeNum : number = 5;

  constructor() { }

  ngAfterViewInit(): void {

    const setup = {
      lineMin : this.lineMin,
      lineMax : this.lineMax,
      rangeNum : this.rangeNum,

      svg : this.svg.nativeElement,
      
      numbers : this.numbers.nativeElement,
      item : this.item.nativeElement,
      startText : this.startText.nativeElement,
      endText : this.endText.nativeElement,
      handle : this.handle.nativeElement, 
      clickArea : this.clickArea.nativeElement, 
      line : this.line.nativeElement
    } as scrollbarSetup

    const els = null;
    const interactive = new HorizontalScrollClass(setup)

    
  }

}
/*
function main(setup) {
  let start_text = document.getElementById("start_text") as HTMLElement
  let end_text = document.getElementById("end_text") as HTMLElement
  let redCircle = document.getElementById("redCircle") as HTMLElement
  let dragEl = document.getElementById("dragEl") as HTMLElement
  let box = document.getElementById("nums") as HTMLElement

  let middle = 4
  let numbers = []
  for (var i = 1; i <= setup.rangeNum+2; i++)
    numbers.push(document.getElementById("num" + i + "text") as HTMLElement)

  let length = setup.lineMax - setup.lineMin

  let currentNum = Math.floor((setup.lineMax - setup.lineMin) / 2)
  let maxX = 41
  let minX = -42
  console.log(currentNum)


  let tl = gsap.timeline()
  gsap.registerPlugin(Draggable);

  start_text.textContent = setup.lineMin
  end_text.textContent = setup.lineMax
  Draggable.create(dragEl, {type: "x", bounds:{minX : minX, maxX : maxX}, 
    //onDragStart:function(){
      //gsap.set(box, {visibility : "hidden"})
    //}, 
    onDragEnd:function(){
      currentNum = Math.floor((-(minX) + this.x) / (-(minX) + maxX) * length + Number(setup.lineMin))
      if (currentNum > setup.lineMax) currentNum = Number(setup.lineMax)
      if (currentNum < setup.lineMin) currentNum = Number(setup.lineMin)
      console.log(currentNum)

      for(var i = 1; i <= setup.rangeNum+2; i++) {
        let offset = i - middle
        numbers[i-1].textContent = currentNum + offset
      }

    }, 
    onDrag : function() {
      currentNum = Math.floor((-(minX) + this.x) / (-(minX) + maxX) * length + Number(setup.lineMin))
      if (currentNum > setup.lineMax) currentNum = Number(setup.lineMax)
      if (currentNum < setup.lineMin) currentNum = Number(setup.lineMin)
      console.log(currentNum)

      for(var i = 1; i <= Number(setup.rangeNum)+2; i++) {
        let offset = i - middle
        numbers[i-1].textContent = currentNum + offset
      }
    }
  });
} */

/*
function main2(setup) {
  let start_text = document.getElementById("start_text") as HTMLElement
  let end_text = document.getElementById("end_text") as HTMLElement
  let redCircle = document.getElementById("redCircle") as HTMLElement
  let line = document.getElementById("line") as HTMLElement
  
  gsap.set(redCircle, {scaleX : setup.rangeNum / 2, x : 0})

  //TO DO
  let over = (redCircle as any as SVGGraphicsElement).getBBox().width * (setup.rangeNum / 2)  / 3.5 //change with app
  let minX = 0 
  let maxX = (line as any as SVGGraphicsElement).getBBox().width - (redCircle as any as SVGGraphicsElement).getBBox().width * (setup.rangeNum / 2) + over

  console.log(maxX)

  let startBox = document.getElementById("startBox");
  let startNum = document.getElementById("startNumText");
  let numbers = document.getElementById("numbers") as HTMLElement


  let box = document.getElementById("box") as HTMLElement
  let layer = document.getElementById("layer1") as HTMLElement

  //MAX: 5 nums with boxwidth 10
  let boxWidth = 50 / Number(setup.rangeNum) 

  let boxW = Math.round((startBox as any as SVGGraphicsElement).getBBox().width * (boxWidth/10));
  let boxX = Math.round((startBox as any as SVGGraphicsElement).getBBox().x);
  let numX = Math.round((startNum as any as SVGGraphicsElement).getBBox().x);

  gsap.set(startBox, {scaleX : boxWidth / 10});
  startNum.textContent = (setup.lineMin).toString()
  let numW = (startNum as any as SVGGraphicsElement).getBBox().width
  gsap.set(startNum, {x : -(numW/2 + numX - (boxW/2 + boxX))-0.5 })


  let currentNum = Number(setup.lineMin)+1
  for (var i = setup.lineMin+1; i <= Number(setup.lineMax); i++) {
    let nodeBox = startBox.cloneNode(true)
    numbers.appendChild(nodeBox)
    gsap.set(nodeBox, {x : (i)*boxWidth })

    let node = startNum.cloneNode(true) as SVGGraphicsElement
    node.textContent = currentNum.toString()
    numbers.appendChild(node)
    gsap.set(node, {x : (i)*boxWidth })

    let numW = node.getBBox().width

    gsap.set(node, {x : -(numW/2 + numX - (boxW/2 + boxX))-0.5 + i*boxWidth })
    
    currentNum++;
  }

  layer.removeChild(box)
  layer.appendChild(box)

  let diff = (numbers as any as SVGGraphicsElement).getBBox().width / (line as any as SVGGraphicsElement).getBBox().width

  gsap.registerPlugin(Draggable);

  start_text.textContent = setup.lineMin
  end_text.textContent = setup.lineMax
  Draggable.create(redCircle, {type: "x", bounds:{minX : minX, maxX : maxX}, 
    onDrag : function() {
      gsap.to(numbers, {x : diff*(-this.x)})
    }
  });
  
  let numbersMinX = -((numbers as any as SVGGraphicsElement).getBBox().width - (setup.rangeNum - 0.25)*boxWidth) // change with app

  Draggable.create(numbers, {type: "x", bounds : {minX : numbersMinX, maxX : 0}, 
    onDrag : function() {
      gsap.to(redCircle, {x : (-this.x)/diff})
    }, 
  });
}
*/