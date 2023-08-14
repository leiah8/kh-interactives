import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TileZoomAPI } from "./tile-zoom"
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tile-zoom',
  templateUrl: './tile-zoom.component.html',
  styleUrls: ['./tile-zoom.component.css']
})
export class TileZoomComponent implements AfterViewInit {
  @ViewChild("main") public main?: ElementRef<HTMLElement>;
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;

  num : number;

  constructor(private route: ActivatedRoute) {
    var p;
    this.route.params.subscribe( params => p = params);

    this.num = parseInt(p.num)

  }

  ngAfterViewInit(): void {
    const setup = {
      arena : this.arena.nativeElement,
      svg : this.main.nativeElement,
      num : this.num

    }

    const interactive = new TileZoomAPI(setup)
  }

}
