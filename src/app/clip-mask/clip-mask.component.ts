import { Component, OnInit, AfterViewInit } from '@angular/core';
import { gsap } from "gsap/all";

@Component({
  selector: 'app-clip-mask',
  templateUrl: './clip-mask.component.html',
  styleUrls: ['./clip-mask.component.css']
})
export class ClipMaskComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {

    // https://css-tricks.com/clipping-masking-css/ 
    // https://greensock.com/forums/topic/13615-clip-path-or-mask-animation/
    var r = document.getElementById("useRect")
    var tl = gsap.timeline()

    tl.to(r, {duration : 2})

    //not smooth
    tl.to(r, {clipPath: "circle(40px at center)", duration : 2})
    tl.to(r, {clipPath: "circle(30px at center)", duration : 2})

    //circle to circle is smooth

    // tl.to(r, {clipPath: "inset(10px 20px 30px 40px", duration : 2})
    //not smooth 

    tl.to(r, {clipPath: "polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)", duration : 2});

    tl.to(r, {clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", duration : 2});
  
    tl.to(r, {clipPath: "polygon(50% 0%, 0% 100%, 100% 100%, 100% 100%)", duration : 2});
    tl.to(r, {clipPath: "polygon(50% 0%, 0% 100%, 100% 100%, 100% 50%)", duration : 2});
    //last transition is smooth (look at last point)

    //polygon to polygon is not smooth (reverts back to corner)
    //points need to able to morph positions 
    //if there is not the same number of points, points go to 0,0
  }

}
