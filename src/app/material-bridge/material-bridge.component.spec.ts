import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBridgeComponent } from './material-bridge.component';

describe('MaterialBridgeComponent', () => {
  let component: MaterialBridgeComponent;
  let fixture: ComponentFixture<MaterialBridgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialBridgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
