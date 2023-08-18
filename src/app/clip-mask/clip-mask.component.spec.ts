import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipMaskComponent } from './clip-mask.component';

describe('ClipMaskComponent', () => {
  let component: ClipMaskComponent;
  let fixture: ComponentFixture<ClipMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClipMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
