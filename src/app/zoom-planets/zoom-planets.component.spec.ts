import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomPlanetsComponent } from './zoom-planets.component';

describe('ZoomPlanetsComponent', () => {
  let component: ZoomPlanetsComponent;
  let fixture: ComponentFixture<ZoomPlanetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomPlanetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomPlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
