import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlingshotInputComponent } from './slingshot-input.component';

describe('SlingshotInputComponent', () => {
  let component: SlingshotInputComponent;
  let fixture: ComponentFixture<SlingshotInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlingshotInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlingshotInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
