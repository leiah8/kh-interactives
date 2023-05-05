import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegerPlatformComponent } from './integer-platform.component';

describe('IntegerPlatformComponent', () => {
  let component: IntegerPlatformComponent;
  let fixture: ComponentFixture<IntegerPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegerPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegerPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
