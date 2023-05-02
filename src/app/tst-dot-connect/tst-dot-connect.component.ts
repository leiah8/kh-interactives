import { Component, OnInit,Input,ElementRef } from '@angular/core';

@Component({
  selector: 'app-tst-dot-connect',
  templateUrl: './tst-dot-connect.component.html',
  styleUrls: ['./tst-dot-connect.component.css']
})
export class TstDotConnectComponent implements OnInit {

  @Input()
  private target: number = 0

  constructor(private elementRef: ElementRef) {
    console.log("element ref in constructor",elementRef.nativeElement)
  }

  ngOnInit(): void {
    
  }

}
