import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPeriodsComponent } from './calendar-periods.component';

describe('CalendarPeriodsComponent', () => {
  let component: CalendarPeriodsComponent;
  let fixture: ComponentFixture<CalendarPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarPeriodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
