import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeviceComponent } from './user-device.component';

describe('UserDeviceComponent', () => {
  let component: UserDeviceComponent;
  let fixture: ComponentFixture<UserDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
