import { Component, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { inputSetup, integerPlatfromAPI} from "./integer-platform";


@Component({
  selector: 'app-integer-platform',
  //templateUrl: './integer-platform.component.html',
  templateUrl: './ip.html',
  styleUrls: ['./integer-platform.component.css']
})
export class IntegerPlatformComponent implements AfterViewInit {
  @ViewChild("numbers") public numbers?: ElementRef<SVGSVGElement>;
  @ViewChild("plus") public plusBtn?: ElementRef<SVGSVGElement>;
  @ViewChild("minus") public minusBtn?: ElementRef<SVGSVGElement>;
  @ViewChild("platform") public platform?: ElementRef<SVGSVGElement>;
  @ViewChild("spring") public spring?: ElementRef<SVGSVGElement>;
  @ViewChild("balloon") public balloon?: ElementRef<SVGSVGElement>;
  @ViewChild("sandbag") public sandbag?: ElementRef<SVGSVGElement>;
  @ViewChild("cart") public cart?: ElementRef<SVGSVGElement>;
  @ViewChild("backWheel") public backWheel?: ElementRef<SVGSVGElement>;
  @ViewChild("frontWheel") public frontWheel?: ElementRef<SVGSVGElement>;
  @ViewChild("inputNums") public inputNums?: ElementRef<HTMLElement>;
  @ViewChild("inputBtns") public inputBtns?: ElementRef<HTMLElement>;
  @ViewChild("playBtn") public playBtn?: ElementRef<SVGSVGElement>;
  @ViewChild("cover") public cover?: ElementRef<SVGSVGElement>;
  @ViewChild("equation") public equation?: ElementRef<HTMLElement>;
  @ViewChild("terms") public terms?: ElementRef<HTMLElement>;
  @ViewChild("addTerm") public addTerm?: ElementRef<HTMLElement>;

  constructor() {}

  ngAfterViewInit(): void {
    const setup = {
      lineMin : -5,
      lineMax : 5,
      rangeNum : 5,

      balloonURL : "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-balloon_wmfqfh.svg",
      bagURL : "https://res.cloudinary.com/dxltpgop9/image/upload/v1683303439/integer-platform-sandbag_zdtxyg.svg",
      
      plusBtn : this.plusBtn.nativeElement, 
      minusBtn : this.minusBtn.nativeElement, 

      platform : this.platform.nativeElement, 
      spring : this.spring.nativeElement, 
      balloon : this.balloon.nativeElement,
      sandbag : this.sandbag.nativeElement,
      cart : this.cart.nativeElement,
      backWheel : this.backWheel.nativeElement,
      frontWheel : this.frontWheel.nativeElement,

      inputNums : this.inputNums.nativeElement,
      inputBtns : this.inputBtns.nativeElement,

      playBtn : this.playBtn.nativeElement,
      cover : this.cover.nativeElement,

      numbers : this.numbers.nativeElement,
      equation : this.equation.nativeElement,
      terms : this.terms.nativeElement,
      addTerm : this.addTerm.nativeElement,
    } as inputSetup

    const game = {
      startBalloons : 0,
      startSandbags : 0,
      leftHeight : 0,
      rightHeight : 0
    }

    //const interactive = new HorizontalScrollClass(setup, game)
    const interactive = integerPlatfromAPI(setup, game)
  }

}
