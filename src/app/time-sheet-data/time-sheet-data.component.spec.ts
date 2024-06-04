import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetDataComponent } from './time-sheet-data.component';

describe('TimeSheetDataComponent', () => {
  let component: TimeSheetDataComponent;
  let fixture: ComponentFixture<TimeSheetDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSheetDataComponent]
    });
    fixture = TestBed.createComponent(TimeSheetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
