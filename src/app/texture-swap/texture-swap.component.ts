import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TextureSwapAPI } from './texture-swap'

@Component({
  selector: 'app-texture-swap',
  templateUrl: './texture-swap.component.html',
  styleUrls: ['./texture-swap.component.css']
})
export class TextureSwapComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(): void {



    var interactive = new TextureSwapAPI(this.arena.nativeElement)


  }

}
