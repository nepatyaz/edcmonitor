import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDirectionComponent } from './map-direction.component';

describe('MapDirectionComponent', () => {
  let component: MapDirectionComponent;
  let fixture: ComponentFixture<MapDirectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDirectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
