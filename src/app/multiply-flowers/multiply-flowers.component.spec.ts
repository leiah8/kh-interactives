import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplyFlowersComponent } from './multiply-flowers.component';

describe('MultiplyFlowersComponent', () => {
  let component: MultiplyFlowersComponent;
  let fixture: ComponentFixture<MultiplyFlowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiplyFlowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplyFlowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
