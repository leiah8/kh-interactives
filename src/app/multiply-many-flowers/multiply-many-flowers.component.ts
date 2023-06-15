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
  @ViewChild("anim") public anim?: ElementRef<HTMLElement>;
  // @ViewChild("retryBtn") public retryBtn?: ElementRef<HTMLElement>;
  // @ViewChild("playBtn") public playBtn?: ElementRef<HTMLElement>;
  // @ViewChild("nextBtn") public nextBtn?: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(): void {

    const setup = {
      arena : this.arena.nativeElement,
      input : this.input.nativeElement,
      playBtn : this.playBtn.nativeElement,
      anim : this.anim.nativeElement,
      mode : "columns",
      columns : 10,
      rows : 10

    }

    const g1 = {
      goal : [3, 5, 0, 0],
      targets : 10

    } as GameInput

    const interactive = new ManyFlowersAPI(setup, [g1])
  }

}
