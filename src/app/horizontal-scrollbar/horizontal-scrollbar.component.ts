import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { scrollbarSetup, HorizontalScrollClass} from "./horizontal-scrollbar";

@Component({
  selector: 'app-horizontal-scrollbar',
  templateUrl: './hs3.html',
  styleUrls: ['./horizontal-scrollbar.component.css']
})
export class HorizontalScrollbarComponent implements AfterViewInit {
  @ViewChild("numbers") public numbers?: ElementRef<SVGSVGElement>;
  @ViewChild("startText") public startText?: ElementRef<SVGSVGElement>;
  @ViewChild("endText") public endText?: ElementRef<SVGSVGElement>;
  @ViewChild("handle") public handle?: ElementRef<SVGSVGElement>;
  @ViewChild("line") public line?: ElementRef<SVGSVGElement>;
  @ViewChild("clickArea") public clickArea?: ElementRef<SVGSVGElement>;

  @ViewChild("scrollbar") public svg?: ElementRef<HTMLElement>;


  //positions of the target sun, planets, and moons 
  @Input()
  private lineMin : number = 0;

  @Input()
  private lineMax : number = 50;

  @Input()
  private rangeNum : number = 5;

  constructor() { }

  ngAfterViewInit(): void {

    const setup = {
      lineMin : this.lineMin,
      lineMax : this.lineMax,
      rangeNum : this.rangeNum,

      svg : this.svg.nativeElement,
      
      numbers : this.numbers.nativeElement,
      
      startText : this.startText.nativeElement,
      endText : this.endText.nativeElement,
      handle : this.handle.nativeElement, 
      clickArea : this.clickArea.nativeElement, 
      line : this.line.nativeElement

    } as scrollbarSetup

    const els = null;
    const interactive = new HorizontalScrollClass(setup)

    
  }

}
