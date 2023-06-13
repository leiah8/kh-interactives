import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ManyFlowersAPI } from './multiply-many-flowers';

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

    const interactive = new ManyFlowersAPI(setup)
  }

}
