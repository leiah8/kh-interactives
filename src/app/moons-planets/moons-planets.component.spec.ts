import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonsPlanetsComponent } from './moons-planets.component';

describe('MoonsPlanetsComponent', () => {
  let component: MoonsPlanetsComponent;
  let fixture: ComponentFixture<MoonsPlanetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoonsPlanetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoonsPlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
