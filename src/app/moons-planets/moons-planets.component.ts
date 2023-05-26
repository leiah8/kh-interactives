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

    var p1Moons = 8
    var p2Moons = 2
    var p1Num = 8
    var p2Num = 2

    //max 10 moons per planet
    //max 10 planets total
  
    const interactive = new MoonsPlanetsAPI(setup, p1Num, p1Moons, p2Num, p2Moons)
  }

  

}
