import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalScrollbarComponent } from './horizontal-scrollbar.component';

describe('HorizontalScrollbarComponent', () => {
  let component: HorizontalScrollbarComponent;
  let fixture: ComponentFixture<HorizontalScrollbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalScrollbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalScrollbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
