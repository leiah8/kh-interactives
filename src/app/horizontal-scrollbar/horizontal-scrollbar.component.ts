import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { horizontalScrollAPI, scrollbarSetup} from "./horizontal-scrollbar";
import { gsap, Draggable } from "gsap/all";

@Component({
  selector: 'app-horizontal-scrollbar',
  //templateUrl: './horizontal-scrollbar.component.html',
  templateUrl: './hs.html',
  styleUrls: ['./horizontal-scrollbar.component.css']
})
export class HorizontalScrollbarComponent implements AfterViewInit {
  @ViewChild('renderEl') public renderEl?: ElementRef<SVGSVGElement>;

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
      rangeNum : this.rangeNum
    } as scrollbarSetup

    const els = null;
    //const interactive = horizontalScrollAPI(els, setup); 

    
    main2(setup)
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

//TO DO
//add boxes around numbers 
//make slider width adjust to ratio between line and numbers shown 
//make the range of numbers adjustable (change boxwidth)

function main2(setup) {
  let start_text = document.getElementById("start_text") as HTMLElement
  let end_text = document.getElementById("end_text") as HTMLElement
  let redCircle = document.getElementById("redCircle") as HTMLElement
  
  let minX = 0 
  let maxX = 78.75 
  gsap.set(redCircle, {scaleX : setup.rangeNum / 2, x : minX})
  

  let startBox = document.getElementById("startBox") as HTMLElement
  let startNum = document.getElementById("startNumText") as HTMLElement
  let numbers = document.getElementById("numbers") as HTMLElement

  let box = document.getElementById("box") as HTMLElement
  let layer = document.getElementById("layer1") as HTMLElement

  let boxWidth = 10 //change
  let diff = 5.85 //change 

  console.log((Number(setup.lineMax-setup.lineMin)+1)*boxWidth)
  
  //TO DO: FIX SPACING
  //let boxW = Math.round(startBox.getBoundingClientRect().width);
  //let boxX = Math.round(startBox.getBoundingClientRect().x);
  //let numX = Math.round(startNum.getBoundingClientRect().x);

  startNum.textContent = (setup.lineMin).toString()
  let currentNum = Number(setup.lineMin)+1
  for (var i = setup.lineMin+1; i <= Number(setup.lineMax); i++) {
    let nodeBox = startBox.cloneNode(true) as HTMLElement
    numbers.appendChild(nodeBox)
    gsap.set(nodeBox, {x : (i)*boxWidth })

    let node = startNum.cloneNode(true) as HTMLElement
    node.textContent = currentNum.toString()
    numbers.appendChild(node)
    gsap.set(node, {x : (i)*boxWidth })

    //let numW = node.getBoundingClientRect().width

    //gsap.set(node, {x : (numW/2 + numX - (boxW/2 + boxX)) + (i+2)*boxWidth })
    
    currentNum++;
  }

  layer.removeChild(box)
  layer.appendChild(box)


  gsap.registerPlugin(Draggable);

  start_text.textContent = setup.lineMin
  end_text.textContent = setup.lineMax
  Draggable.create(redCircle, {type: "x", bounds:{minX : minX, maxX : maxX}, 
    onDrag : function() {
      gsap.to(numbers, {x : diff*(-this.x)})
    }
  });

  let numbersMinX = -((Number(setup.lineMax-setup.lineMin))*(boxWidth-(diff/7.5))) // change

  Draggable.create(numbers, {type: "x", bounds : {minX : numbersMinX, maxX : 0}, 
    onDrag : function() {
      gsap.to(redCircle, {x : (-this.x)/diff})
    }, 
  });
}