import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ZoomAPI } from './zoom-planets'

@Component({
  selector: 'app-zoom-planets',
  templateUrl: './zoom-planets.component.html',
  styleUrls: ['./zoom-planets.component.css']
})
export class ZoomPlanetsComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;

  constructor() { }

 ngAfterViewInit(): void {

  const setup = {
    arena : this.arena.nativeElement
  }

    var x = new ZoomAPI(setup)


  }

}
