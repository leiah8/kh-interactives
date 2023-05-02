import { Component, OnInit, ViewChild,ElementRef, Input} from '@angular/core';
import * as pixiApp from "./pixiApp";
declare var PIXI


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild('renderEl') public renderEl?: ElementRef<SVGSVGElement>

  public app: any

  @Input()
  private test: string = ''

  constructor(private elementRef: ElementRef) {
    console.log("element ref in constructor",elementRef.nativeElement)
  }

  ngOnInit(): void {
    console.log("test?",this.test)

    this.app = new PIXI.Application();
   
    pixiApp.init(this.app,{feature: 'someFeature'})

    this.app.renderer.resize(window.innerWidth,window.innerHeight)
    this.app.renderer.backgroundColor = 0x000000

    console.log("element ref",this.elementRef)

    this.elementRef.nativeElement.appendChild(this.app.view);
  }
  
}
