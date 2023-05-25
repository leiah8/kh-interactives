import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MoonsPlanetsAPI} from "./moons-planets";

@Component({
  selector: 'app-moons-planets',
  templateUrl: './moons-planets.component.html',
  styleUrls: ['./moons-planets.component.css']
})
export class MoonsPlanetsComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(): void {
    const setup = {
      arena : this.arena.nativeElement,
    }

    var p1Moons = 2
    var p2Moons = 3
  
    const interactive = new MoonsPlanetsAPI(setup, p1Moons, p2Moons)
  }

  

}
