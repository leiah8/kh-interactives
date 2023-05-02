import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TstDotConnectComponent } from './tst-dot-connect.component';

describe('TstDotConnectComponent', () => {
  let component: TstDotConnectComponent;
  let fixture: ComponentFixture<TstDotConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TstDotConnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TstDotConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
