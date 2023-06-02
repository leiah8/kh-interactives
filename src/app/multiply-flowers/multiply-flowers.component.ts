/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiply-flowers',
  templateUrl: './multiply-flowers.component.html',
  styleUrls: ['./multiply-flowers.component.css']
})
export class MultiplyFlowersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
*/

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Game, MoonsPlanetsAPI} from "./multiply-flowers";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-multiply-flowers',
  templateUrl: './multiply-flowers.component.html',
  styleUrls: ['./multiply-flowers.component.css']
})
export class MultiplyFlowersComponent implements AfterViewInit {
  @ViewChild("arena") public arena?: ElementRef<HTMLElement>;
  @ViewChild("controls") public controls?: ElementRef<HTMLElement>;
  @ViewChild("retryBtn") public retryBtn?: ElementRef<HTMLElement>;
  @ViewChild("playBtn") public playBtn?: ElementRef<HTMLElement>;
  @ViewChild("nextBtn") public nextBtn?: ElementRef<HTMLElement>;


  groups : boolean

  constructor(private route: ActivatedRoute) {
    var p;
    this.route.params.subscribe( params => p = params);

    this.groups = (p.groups == "ones") ? false : true
  }

  ngAfterViewInit(): void {
    const setup = {
      arena : this.arena.nativeElement,
      controls : this.controls.nativeElement,
      retryBtn : this.retryBtn.nativeElement,
      nextBtn : this.nextBtn.nativeElement,
      playBtn : this.playBtn.nativeElement,
      groups : this.groups
    }

    const game1 = {
      p1Num : 5,
      p2Num : 2,
      p1Moons : 10,
      p2Moons : 2,
      attempts: 0, //must be initialized to 0
    } as Game

    const game2 = {
      p1Num : 4,
      p2Num : 3,
      p1Moons : 4,
      p2Moons : 3,
      attempts: 0, //must be initialized to 0
    } as Game

    //max 10 moons per planet
    //max 10 planets total
  
    const interactive = new MoonsPlanetsAPI(setup, [game1, game2])
  }

  

}

