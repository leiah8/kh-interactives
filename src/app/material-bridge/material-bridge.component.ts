import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MaterialBridgeAPI, GameInput } from './material-bridge';


@Component({
  selector: 'app-material-bridge',
  templateUrl: './material-bridge.component.html',
  styleUrls: ['./material-bridge.component.css']
})
export class MaterialBridgeComponent implements AfterViewInit {
  @ViewChild("svg") public svg?: ElementRef<HTMLElement>;
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("input") public input?: ElementRef<HTMLElement>;
  @ViewChild("inputImg") public inputImg?: ElementRef<HTMLElement>;
  @ViewChild("inputSize") public inputSize?: ElementRef<HTMLElement>;
  @ViewChild("inputPieces") public inputPieces?: ElementRef<HTMLElement>;
  @ViewChild("orderBtn") public orderBtn?: ElementRef<HTMLElement>;
  @ViewChild("retryBtn") public retryBtn?: ElementRef<HTMLElement>;
  @ViewChild("nextBtn") public nextBtn?: ElementRef<HTMLElement>;
  @ViewChild("boat") public boat?: ElementRef<HTMLElement>;
  @ViewChild("frontWater") public frontWater?: ElementRef<HTMLElement>;
  @ViewChild("lightning") public lightning?: ElementRef<HTMLElement>;
  
  constructor() { }

  ngAfterViewInit(): void {

    const setup = {
      svg : this.svg.nativeElement,
      arena : this.arena.nativeElement,
      input : this.input.nativeElement,
      inputImg : this.inputImg.nativeElement,
      inputSize : this.inputSize.nativeElement,
      inputPieces : this.inputPieces.nativeElement,
      orderBtn : this.orderBtn.nativeElement,
      retryBtn : this.retryBtn.nativeElement,
      nextBtn : this.nextBtn.nativeElement,
      boat : this.boat.nativeElement,
      frontWater : this.frontWater.nativeElement,
      lightning : this.lightning.nativeElement

    }

    const g0 = {
      bridgeArr : [[1,0,0,1], [1, 0]]

    } as GameInput

    const g1 = {
      bridgeArr : [[1, 0, 1, 0]]

    } as GameInput

    const g2 = {
      bridgeArr : [[0,0,0,1], [1, 0, 0, 0]]

    } as GameInput

    const g3 = {
      bridgeArr : [[0,1], []]

    } as GameInput



    const interactive = new MaterialBridgeAPI(setup, [g3, g0, g2])


  }

}
