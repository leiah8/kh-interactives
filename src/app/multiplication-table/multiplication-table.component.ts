import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MultiplicationTableClass } from './multiplication-table'

@Component({
  selector: 'app-multiplication-table',
  templateUrl: './multiplication-table.component.html',
  styleUrls: ['./multiplication-table.component.css']
})
export class MultiplicationTableComponent implements AfterViewInit {
  @ViewChild("table") public table?: ElementRef<SVGSVGElement>;

  constructor() { }

  ngAfterViewInit(): void {
    const setup = {
      table : this.table.nativeElement
    }

    const interactive = new MultiplicationTableClass(setup)

  }

}
