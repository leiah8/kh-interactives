import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MaterialBridgeAPI, GameInput } from './material-bridge';


@Component({
  selector: 'app-material-bridge',
  templateUrl: './material-bridge.component.html',
  styleUrls: ['./material-bridge.component.css']
})
export class MaterialBridgeComponent implements AfterViewInit {
  // @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("input") public input?: ElementRef<HTMLElement>;
  @ViewChild("inputImg") public inputImg?: ElementRef<HTMLElement>;
  @ViewChild("inputSize") public inputSize?: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(): void {

    const setup = {
      // arena : this.arena.nativeElement,
      input : this.input.nativeElement,
      inputImg : this.inputImg.nativeElement,
      inputSize : this.inputSize.nativeElement,

    }

    const g0 = {

    } as GameInput


    const interactive = new MaterialBridgeAPI(setup, [g0])


  }

}
