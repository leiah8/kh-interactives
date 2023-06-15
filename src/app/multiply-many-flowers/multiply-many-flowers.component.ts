import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ManyFlowersAPI, GameInput } from './multiply-many-flowers';

@Component({
  selector: 'app-multiply-many-flowers',
  templateUrl: './multiply-many-flowers.component.html',
  styleUrls: ['./multiply-many-flowers.component.css']
})
export class MultiplyManyFlowersComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("controls") public controls?: ElementRef<HTMLElement>;
  // @ViewChild("retryBtn") public retryBtn?: ElementRef<HTMLElement>;
  // @ViewChild("playBtn") public playBtn?: ElementRef<HTMLElement>;
  // @ViewChild("nextBtn") public nextBtn?: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(): void {

    const setup = {
      arena : this.arena.nativeElement,
      controls : this.controls.nativeElement,
      mode : "columns",
      columns : 10,
      rows : 10

    }

    const g1 = {
      goal : [3, 5],
      targets : 12

    } as GameInput

    const interactive = new ManyFlowersAPI(setup, [g1])
  }

}
