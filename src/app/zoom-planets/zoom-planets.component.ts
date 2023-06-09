import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ZoomAPI } from './zoom-planets'

@Component({
  selector: 'app-zoom-planets',
  templateUrl: './zoom-planets.component.html',
  styleUrls: ['./zoom-planets.component.css']
})
export class ZoomPlanetsComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("thesvg") public thesvg?: ElementRef<HTMLElement>;
  @ViewChild("plus") public plus?: ElementRef<HTMLElement>;
  @ViewChild("minus") public minus?: ElementRef<HTMLElement>;
  @ViewChild("inputBtns") public inputBtns?: ElementRef<HTMLElement>;

  constructor() { }

 ngAfterViewInit(): void {

  const setup = {
    arena : this.arena.nativeElement,
    svg : this.thesvg.nativeElement, 
    plusBtn : this.plus.nativeElement, 
    minusBtn : this.minus.nativeElement, 
    inputBtns : this.inputBtns.nativeElement
  }

    var x = new ZoomAPI(setup)


  }

}
