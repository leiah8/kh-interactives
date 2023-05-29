import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Game, MoonsPlanetsAPI} from "./moons-planets";

@Component({
  selector: 'app-moons-planets',
  templateUrl: './moons-planets.component.html',
  styleUrls: ['./moons-planets.component.css']
})
export class MoonsPlanetsComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("controls") public controls?: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(): void {
    const setup = {
      arena : this.arena.nativeElement,
      controls : this.controls.nativeElement
    }

    const game1 = {
      p1Num : 8,
      p2Num : 2,
      p1Moons : 10,
      p2Moons : 3,
      attempts: 0, //must be initialized to 0
    } as Game

    const game2 = {
      p1Num : 4,
      p2Num : 3,
      p1Moons : 4,
      p2Moons : 3,
      attempts: 0, //must be initialized to 0
    } as Game

    //max 10 moons per planet
    //max 10 planets total
  
    const interactive = new MoonsPlanetsAPI(setup, [game1, game2])
  }

  

}
