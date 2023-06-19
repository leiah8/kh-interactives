import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ManyFlowersAPI, GameInput } from './multiply-many-flowers';

@Component({
  selector: 'app-multiply-many-flowers',
  templateUrl: './multiply-many-flowers.component.html',
  styleUrls: ['./multiply-many-flowers.component.css']
})
export class MultiplyManyFlowersComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("input") public input?: ElementRef<HTMLElement>;
  @ViewChild("playBtn") public playBtn?: ElementRef<HTMLElement>;
  @ViewChild("retryBtn") public retryBtn?: ElementRef<HTMLElement>;
  @ViewChild("nextBtn") public nextBtn?: ElementRef<HTMLElement>;
  @ViewChild("anim") public anim?: ElementRef<HTMLElement>;
  @ViewChild("rectangles") public rectangles?: ElementRef<HTMLElement>;
  // @ViewChild("retryBtn") public retryBtn?: ElementRef<HTMLElement>;
  // @ViewChild("playBtn") public playBtn?: ElementRef<HTMLElement>;
  // @ViewChild("nextBtn") public nextBtn?: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(): void {

    const setup = {
      arena : this.arena.nativeElement,
      input : this.input.nativeElement,
      playBtn : this.playBtn.nativeElement,
      retryBtn : this.retryBtn.nativeElement,
      nextBtn : this.nextBtn.nativeElement,
      anim : this.anim.nativeElement,
      rectangles : this.rectangles.nativeElement,
      
      columns : 10,
      rows : 10

    }

    // const config = {
    // }

    const g0 = {
      goal : [4, 3, 0, 0],
      targets : 8,
      mode : "rows",
      horizontalDiv : false,
      verticalDiv : true,

    } as GameInput

    const g2 = {
      goal : [0, 0, 0, 4],
      targets : 5,
      mode : "rows",
      horizontalDiv : true,
      verticalDiv : false,

    } as GameInput

    const g1 = {
      goal : [0, 6, 0, ],
      targets : 2,
      mode : "rows",
      horizontalDiv : false,
      verticalDiv : false,

    } as GameInput

    const interactive = new ManyFlowersAPI(setup, [g0, g1, g2])
  }

}
