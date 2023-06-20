import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextureSwapComponent } from './texture-swap.component';

describe('TextureSwapComponent', () => {
  let component: TextureSwapComponent;
  let fixture: ComponentFixture<TextureSwapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextureSwapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextureSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
