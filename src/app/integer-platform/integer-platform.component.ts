import { Component, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { GameInput, InputSetup, IntegerPlatfromClass} from "./integer-platform2";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-integer-platform',
  templateUrl: './integer-platform.component.html',
  styleUrls: ['./integer-platform.component.css']
})
export class IntegerPlatformComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("platform") public platform?: ElementRef<SVGSVGElement>;
  @ViewChild("controls") public controls?: ElementRef<HTMLElement>;
  @ViewChild("inputNums") public inputNums?: ElementRef<HTMLElement>;
  @ViewChild("inputBtns") public inputBtns?: ElementRef<HTMLElement>;
  @ViewChild("equation") public equation?: ElementRef<HTMLElement>;
  @ViewChild("terms") public terms?: ElementRef<HTMLElement>;
  @ViewChild("numbers") public numbers?: ElementRef<SVGSVGElement>;
  @ViewChild("plus") public plusBtn?: ElementRef<SVGSVGElement>;
  @ViewChild("minus") public minusBtn?: ElementRef<SVGSVGElement>;
  @ViewChild("plusTxt") public plusTxt?: ElementRef<SVGSVGElement>;
  @ViewChild("minusTxt") public minusTxt?: ElementRef<SVGSVGElement>;
  @ViewChild("cover") public cover?: ElementRef<SVGSVGElement>;
  @ViewChild("cart") public cart?: ElementRef<SVGSVGElement>;
  @ViewChild("backwheel") public backWheel?: ElementRef<SVGSVGElement>;
  @ViewChild("frontwheel") public frontWheel?: ElementRef<SVGSVGElement>;

  addRemove : boolean;
  useImgs : boolean;

  g : GameInput;

  game1 : GameInput = {
    startBalloons : 2,
    startSandbags : 3,
    goal : 1,
    
  } as GameInput

  game2 : GameInput = {
    startBalloons : 2,
    startSandbags : 0,
    goal : -5,
    
  } as GameInput

  game3 : GameInput  = {
    startBalloons : 1,
    startSandbags : 2,
    goal : 2,
    
  } as GameInput

  game4 : GameInput = {
    startBalloons : 0,
    startSandbags : 0,
    goal : 4,
    
  } as GameInput

  game5 : GameInput = {
    startBalloons : 4,
    startSandbags : 1,
    goal : -3,
    
  } as GameInput

  constructor(private route: ActivatedRoute) {
    var p;
    this.route.params.subscribe( params => p = params);

    this.addRemove = (p.addRemove == "addRemove") ? true : false
    this.useImgs = (p.useImgs == "imgs" || p.useImgs ==  null) ? true : false

    if(p.gameNum == "g1") this.g = this.game1
    else if(p.gameNum == "g2") this.g = this.game2
    else if(p.gameNum == "g3") this.g = this.game3
    else if(p.gameNum == "g4") this.g = this.game4
    else if(p.gameNum == "g5") this.g = this.game5
    else this.g = null
  }

  ngAfterViewInit(): void {
    
    // const game1 = {
    //   startBalloons : 2,
    //   startSandbags : 3,
    //   goal : 1,
      
    // } as GameInput

    // const game2 = {
    //   startBalloons : 2,
    //   startSandbags : 0,
    //   goal : -5,
      
    // } as GameInput

    // const game3 = {
    //   startBalloons : 1,
    //   startSandbags : 2,
    //   goal : 2,
      
    // } as GameInput

    // const game4 = {
    //   startBalloons : 0,
    //   startSandbags : 0,
    //   goal : 4,
      
    // } as GameInput

    // const game5 = {
    //   startBalloons : 4,
    //   startSandbags : 1,
    //   goal : -3,
      
    // } as GameInput
    
    const setup = {
      arena : this.arena.nativeElement, 
      platform : this.platform.nativeElement,
      controls : this.controls.nativeElement,
      inputNums : this.inputNums.nativeElement,
      inputBtns : this.inputBtns.nativeElement,
      equation : this.equation.nativeElement,
      terms : this.terms.nativeElement,
      numbers : this.numbers.nativeElement,
      plusBtn : this.plusBtn.nativeElement, 
      minusBtn : this.minusBtn.nativeElement, 
      plusTxt : this.plusTxt.nativeElement,
      minusTxt : this.minusTxt.nativeElement,
      cover : this.cover.nativeElement, 
      cart : this.cart.nativeElement, 
      backWheel : this.backWheel.nativeElement,
      frontWheel : this.frontWheel.nativeElement,
      

      addRemove : this.addRemove,
      useImgs : this.useImgs,
      scrollbarRangeMax : 5,
      scrollbarRangeMin : -5,

    } as InputSetup

    var gs;
    
    if (this.g == null) gs = [this.game1, this.game2, this.game3, this.game4, this.game5]
    else gs = [this.g]

    const interactive = new IntegerPlatfromClass(setup, gs)
  }

}
