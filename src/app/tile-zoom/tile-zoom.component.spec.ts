import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileZoomComponent } from './tile-zoom.component';

describe('TileZoomComponent', () => {
  let component: TileZoomComponent;
  let fixture: ComponentFixture<TileZoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileZoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
