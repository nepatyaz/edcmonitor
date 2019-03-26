import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableByStatusComponent } from './table-by-status.component';

describe('TableByStatusComponent', () => {
  let component: TableByStatusComponent;
  let fixture: ComponentFixture<TableByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
