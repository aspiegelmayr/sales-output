import { Component, Input } from '@angular/core';
import { Period } from '../models/period.model';
import { PeriodsService } from '../services/periods.service';

@Component({
  selector: 'app-calendar-periods',
  templateUrl: './calendar-periods.component.html',
  styleUrls: ['./calendar-periods.component.scss']
})
export class CalendarPeriodsComponent {
@Input() periods: Period[] = [];
editingIndex: number = -1;

  ngOnInit(): void {
    this.periodsService.getAllPeriods()
      .subscribe({
        next: (data) => {
          this.periods = data;
        },
        error: (err) => {
          console.error('Failed to fetch periods:', err);
        }
      });
  }


  public addNewPeriod() {
    this.periods.push({name: '', startWeek: -1, endWeek: -1 });
  }

    public postValues() {
    this.periodsService.postPeriods(this.periods).subscribe(updatedPeriods => {
      this.periods = updatedPeriods;
    })
  }

  deletePeriod(id?: number): void {
    if(id)
    this.periodsService.deletePeriod(id).subscribe(updatedPeriods => {
      this.periods = updatedPeriods;
    });
  }

  public editValues(index: number) {
    if(this.editingIndex === index){
      const id = this.periods[index].id;
      if(id){
        this.patchValue(id, this.periods[index])
      } else {
        this.postValue(this.periods[index]);
      }
      this.editingIndex = -1;
    } else {
      this.editingIndex = index;
    }
  }

  public postPeriods() {
    this.periodsService.postPeriods(this.periods).subscribe(updatedPeriods => {
      this.periods = updatedPeriods;
    })
  }

  public postValue(val: Period) {
    this.periodsService.postPeriod(val).subscribe(updatedVals => {
      console.log(updatedVals);
    })
  }

  public patchValue(id: number, updatedVal: Period) {
    this.periodsService.patchPeriod(id, updatedVal).subscribe(updatedPeriods => {
      this.periods = updatedPeriods;
    });
  }

  constructor(private readonly periodsService: PeriodsService){}
}