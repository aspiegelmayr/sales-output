import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import { Output } from '../models/output.model';
import { OutputService } from '../services/output.service';
import { Person } from '../models/employee.model';
import * as isoWeek from 'dayjs/plugin/isoWeek';

@Component({
  selector: 'app-weekly-average-list',
  templateUrl: './weekly-average-list.component.html',
  styleUrls: ['./weekly-average-list.component.scss']
})
export class WeeklyAverageList implements OnInit {

  @Input() outputs: Output[] = [];
  @Input() forPerson!: Person;

  fourWeekOutput: Output[] = [];
  eightWeekOutput: Output[] = [];
  twelveWeekOutput: Output[] = [];

  currentWeek: number = 0;

  ngOnInit(): void {
    dayjs.extend(weekOfYear);
    dayjs.extend(isoWeek);

    const now = dayjs();
    this.currentWeek = now.week();

    this.getValuesFromDatabase();
  }

  getEmployeeName(): string {
    return this.forPerson?.name ?? 'Unknown';
}

getValuesFromDatabase(){
    this.outputService.getOutputsByWeekRange(this.currentWeek-3, this.currentWeek).subscribe(updatedOutputs => {
        this.fourWeekOutput = updatedOutputs;
      });

      this.outputService.getOutputsByWeekRange(this.currentWeek-7, this.currentWeek).subscribe(updatedOutputs => {
        this.eightWeekOutput = updatedOutputs;
        console.log(this.eightWeekOutput);
      });

      this.outputService.getOutputsByWeekRange(this.currentWeek-11, this.currentWeek).subscribe(updatedOutputs => {
        this.twelveWeekOutput = updatedOutputs;
      });
}

getTotalForEmployee(empId: number, forVal: keyof Output, numberOfWeeks: 4 | 8 | 12): number{
    let valuesToUse = this.fourWeekOutput;
    
    switch(numberOfWeeks){
        case 8: valuesToUse = this.eightWeekOutput; break;
        case 12: valuesToUse = this.twelveWeekOutput; break;
    }

    console.log(valuesToUse);

    valuesToUse = valuesToUse.filter(entry => entry.name === String(empId));

    return valuesToUse.reduce((sum, output) => sum + Number(output[forVal]), 0);
}

getAverageForEmployee(empId: number, forVal: keyof Output, numberOfWeeks: 4 | 8 | 12): number{
    const total = this.getTotalForEmployee(empId, forVal, numberOfWeeks);
    return total / numberOfWeeks;
}


  constructor(private readonly outputService: OutputService) { }
}