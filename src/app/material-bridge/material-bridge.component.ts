import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MaterialBridgeAPI, GameInput } from './material-bridge';
import { ActivatedRoute } from '@angular/router';


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

  @ViewChild("usability") public usability?: ElementRef<HTMLElement>;
  @ViewChild("helpBtn") public helpBtn?: ElementRef<HTMLElement>;

  help : boolean
  
  // constructor() { }

  constructor(private route: ActivatedRoute) {
    var p;
    this.route.params.subscribe( params => p = params);

    this.help = (p.help == "help") ? true : false
  }

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
      lightning : this.lightning.nativeElement,

      usability : this.usability.nativeElement,
      helpBtn : this.helpBtn.nativeElement,

      help : this.help

    }

    const g0 = {
      bridgeArr : [[1,1,1,0]],
      limitedFractions : [1,4,5,6],
      limits : [3,4,4,8],

    } as GameInput

    const g1 = {
      bridgeArr : [[0,0,1,0]]

    } as GameInput

    const g2 = {
      bridgeArr : [[0,0,0,1,1,1]]

    } as GameInput

    const g3 = {
      bridgeArr : [[1,1,0], [1,0,1]]

    } as GameInput

    const g4 = {
      bridgeArr : [[1,1,0,0], [1,0]]

    } as GameInput

    const g5 = {
      bridgeArr : [[1,1,0], [1,0]]

    } as GameInput
    
    const g6 = {
      bridgeArr : [[1,1,0,1,0,0], [1,0]]

    } as GameInput



    const interactive = new MaterialBridgeAPI(setup, [g0, g1, g2, g3, g4, g5, g6])


  }

}
