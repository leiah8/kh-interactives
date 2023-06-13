import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplyManyFlowersComponent } from './multiply-many-flowers.component';

describe('MultiplyManyFlowersComponent', () => {
  let component: MultiplyManyFlowersComponent;
  let fixture: ComponentFixture<MultiplyManyFlowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiplyManyFlowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplyManyFlowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
