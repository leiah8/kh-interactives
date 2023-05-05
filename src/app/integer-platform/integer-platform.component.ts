import { Component, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { inputSetup, HorizontalScrollClass} from "./integer-platform";


@Component({
  selector: 'app-integer-platform',
  templateUrl: './integer-platform.component.html',
  styleUrls: ['./integer-platform.component.css']
})
export class IntegerPlatformComponent implements AfterViewInit {
  @ViewChild("numbers") public numbers?: ElementRef<SVGSVGElement>;
  @ViewChild("item") public item?: ElementRef<SVGSVGElement>;

  constructor() {}

  ngAfterViewInit(): void {
    const setup = {
      lineMin : -5,
      lineMax : 5,
      rangeNum : 5,
      
      numbers : this.numbers.nativeElement,
      item : this.item.nativeElement,
    } as inputSetup

    const interactive = new HorizontalScrollClass(setup)
  }

}
