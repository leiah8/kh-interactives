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
  @ViewChild("inputText") public inputText?: ElementRef<HTMLElement>;
  @ViewChild("orderBtn") public orderBtn?: ElementRef<HTMLElement>;
  @ViewChild("retryBtn") public retryBtn?: ElementRef<HTMLElement>;
  @ViewChild("nextBtn") public nextBtn?: ElementRef<HTMLElement>;
  @ViewChild("boat") public boat?: ElementRef<HTMLElement>;
  @ViewChild("frontWater") public frontWater?: ElementRef<HTMLElement>;
  @ViewChild("lightning") public lightning?: ElementRef<HTMLElement>;

  @ViewChild("usability") public usability?: ElementRef<HTMLElement>;
  @ViewChild("helpBtn") public helpBtn?: ElementRef<HTMLElement>;

  @ViewChild('bridgeOverlay') public bridgeOverlay: ElementRef<HTMLElement>;

  help : boolean
  games : GameInput[]

  g1 : GameInput = {
    upperBridge : null,
    lowerBridge : [0,1],
    fractionRange : [2,8],
    limits : [[2,0],[8,3]],
  }

  g2 : GameInput = {
    upperBridge : null,
    lowerBridge : [0,1,1],
    fractionRange : [4,9],
    limits : [[9,2]],
  }

  g3 : GameInput = {
    upperBridge : [0,1],
    lowerBridge : [0,1,1],
    fractionRange : [1,8],
    limits : [],
  }

  g4 : GameInput = {
    upperBridge : [0,1,1],
    lowerBridge : [0,0,1],
    fractionRange : [1,8],
    limits : [],
  }

  g5 : GameInput = {
    upperBridge : [1,0],
    lowerBridge : [0,1,0],
    fractionRange : [1,8],
    limits : [],
  }

  //a2

  g6 : GameInput = {
    upperBridge : null,
    lowerBridge : [0,0,1,1],
    fractionRange : [1,5],
    limits : [[4,0]],
  }

  g7 : GameInput = {
    upperBridge : null,
    lowerBridge : [0,1],
    fractionRange : [1,5],
    limits : [[2,0]],
  }

  g8 : GameInput = {
    upperBridge : [0,1],
    lowerBridge : [0,1,1,1],
    fractionRange : [1,6],
    limits : [],
  }

  g9 : GameInput = {
    upperBridge : [0,1],
    lowerBridge : [1,0,0,1],
    fractionRange : [1,6],
    limits : [],
  }

  g10 : GameInput = {
    upperBridge : null,
    lowerBridge : [0,0,1,1],
    fractionRange : [1,6],
    limits : [[4,0], [2,0]],
  }

  g11 : GameInput = {
    upperBridge : null,
    lowerBridge : [1,0],
    fractionRange : [1,9],
    limits : [],
  }

  g12 : GameInput = {
    upperBridge : null,
    lowerBridge : [1,1, 1, 0],
    fractionRange : [1,9],
    limits : [],
  }

  g13 : GameInput = {
    upperBridge : null,
    lowerBridge : [0,1,1,1,1,1],
    fractionRange : [1,9],
    limits : [],
  }

  g14 : GameInput = {
    upperBridge : null,
    lowerBridge : [0,0,1],
    fractionRange : [1,9],
    limits : [],
  }

  g15 : GameInput = {
    upperBridge : null,
    lowerBridge : [1,1,1,1,0,1,1,1],
    fractionRange : [1,9],
    limits : [],
  }

  g16 : GameInput = {
    upperBridge : [0,1],
    lowerBridge : [0,0,1,1],
    fractionRange : [1,9],
    limits : [[2,0]],
  }

  g17 : GameInput = {
    upperBridge : [1,0,1],
    lowerBridge : [1,1,0,0,1,1],
    fractionRange : [1,9],
    limits : [[3,0]],
  }

  g18 : GameInput = {
    upperBridge : [1,0,1,0],
    lowerBridge : [1,1,0,0,1,1,0,0],
    fractionRange : [1,9],
    limits : [[4,0]],
  }

  g19 : GameInput = {
    upperBridge : [0,1,1],
    lowerBridge : [1,1,0,0,1,1],
    fractionRange : [1,9],
    limits : [[3,0]],
  }

  g20 : GameInput = {
    upperBridge : [1,1,0],
    lowerBridge : [1,0,0,0,1,1,1,1,1],
    fractionRange : [1,9],
    limits : [[3,0]],
  }
  
  // constructor() { }

  constructor(private route: ActivatedRoute) {
    var p;
    this.route.params.subscribe( params => p = params);

    this.help = (p.help == "help") ? true : false

    if(p.game == "g1") this.games = [this.g1]
    else if (p.game == "g2") this.games = [this.g2]
    else if (p.game == "g3") this.games = [this.g3]
    else if (p.game == "g4") this.games = [this.g4]
    else if (p.game == "g5") this.games = [this.g5]
    else if (p.game == "g6") this.games = [this.g6]
    else if (p.game == "g7") this.games = [this.g7]
    else if (p.game == "g8") this.games = [this.g8]
    else if (p.game == "g9") this.games = [this.g9]
    else if (p.game == "g10") this.games = [this.g10]
    else if (p.game == "g11") this.games = [this.g11]
    else if (p.game == "g12") this.games = [this.g12]
    else if (p.game == "g13") this.games = [this.g13]
    else if (p.game == "g14") this.games = [this.g14]
    else if (p.game == "g15") this.games = [this.g15]
    else if (p.game == "g16") this.games = [this.g16]
    else if (p.game == "g17") this.games = [this.g17]
    else if (p.game == "g18") this.games = [this.g18]
    else if (p.game == "g19") this.games = [this.g19]
    else if (p.game == "g20") this.games = [this.g20]

    else if (p.game == "a2") this.games = [this.g6, this.g7, this.g8, this.g9, this.g10]
    else if (p.game == "a3") this.games = [this.g11, this.g12, this.g13, this.g14, this.g15]
    else if (p.game == "a4") this.games = [this.g16, this.g17, this.g18, this.g19, this.g20]
    else this.games = [this.g1, this.g2, this.g3, this.g4, this.g5]
  }

  ngAfterViewInit(): void {

    const setup = {
      svg : this.svg.nativeElement,
      arena : this.arena.nativeElement,
      input : this.input.nativeElement,
      inputImg : this.inputImg.nativeElement,
      inputSize : this.inputSize.nativeElement,
      inputPieces : this.inputPieces.nativeElement,
      inputText : this.inputText.nativeElement,
      orderBtn : this.orderBtn.nativeElement,
      retryBtn : this.retryBtn.nativeElement,
      nextBtn : this.nextBtn.nativeElement,
      boat : this.boat.nativeElement,
      frontWater : this.frontWater.nativeElement,
      lightning : this.lightning.nativeElement,

      usability : this.usability.nativeElement,
      helpBtn : this.helpBtn.nativeElement,

      help : this.help,

      overlay: this.bridgeOverlay?.nativeElement


    }

    // const g0 = {
    //   bridgeArr : [[1,1,1,0]],
    //   limitedFractions : [1,4,5,6],
    //   limits : [3,4,4,8],

    // } as GameInput

    // const g1 = {
    //   bridgeArr : [[0,0,1,0]]

    // } as GameInput

    // const g2 = {
    //   bridgeArr : [[0,0,0,1,1,1]]

    // } as GameInput

    // const g3 = {
    //   bridgeArr : [[1,1,0], [1,0,1]]

    // } as GameInput

    // const g4 = {
    //   bridgeArr : [[1,1,0,0], [1,0]]

    // } as GameInput

    // const g5 = {
    //   bridgeArr : [[1,1,0], [1,0]]

    // } as GameInput
    
    // const g6 = {
    //   bridgeArr : [[1,1,0,1,0,0], [1,0]]

    // } as GameInput




    const interactive = new MaterialBridgeAPI(setup, this.games)


  }

}
