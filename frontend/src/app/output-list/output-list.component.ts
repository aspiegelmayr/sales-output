import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import { Output } from '../models/output.model';
import { OutputService } from '../services/output.service';
import { Person } from '../models/employee.model';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import { PeopleService } from '../services/person.service';
import { Period } from '../models/period.model';

@Component({
  selector: 'app-output-list',
  templateUrl: './output-list.component.html',
  styleUrls: ['./output-list.component.scss']
})
export class OutputListComponent implements OnInit {

  @Input() outputs?: Output[] = [];
  @Input() people: Person[] = [];
  @Input() periods: Period[] = [];

  expectedNumber = 3;
  editingIndex = -1;

  weekToDisplay = 0;
  startDate = '';
  endDate = '';
  rangeEnd = 0;
  currentPeriod?: Period;

  outputsForMonth: Output[] = [];
  outputsForRange: Output[] = [];

  referenceDate = dayjs();

  showAverageOf: Person | null = null;

  async ngOnInit(): Promise<void> {
    dayjs.extend(weekOfYear);
    dayjs.extend(isoWeek);
    this.weekToDisplay = dayjs(new Date()).week();

    const now = dayjs();
    this.weekToDisplay = now.week();

    const startOfWeek = now.startOf('isoWeek');
    const endOfWeek = now.endOf('isoWeek');
    this.startDate = startOfWeek.format('DD.MM.YYYY');
    this.endDate = endOfWeek.format('DD.MM.YYYY');
    this.getEmployees();
    this.getOutputs();
    this.getOutputsForMonth();
  }

  getWeekStartAndEndDate(forward: boolean) {
    if (forward) {
      this.referenceDate = this.referenceDate.add(7, 'days');
    } else {
      this.referenceDate = this.referenceDate.subtract(7, 'days');
    }

    const startOfWeek = this.referenceDate.startOf('isoWeek');
    const endOfWeek = this.referenceDate.endOf('isoWeek');
    this.startDate = startOfWeek.format('DD.MM.YYYY');
    this.endDate = endOfWeek.format('DD.MM.YYYY');
  }

  getEmployees() {
    this.peopleService.getAllPeople().subscribe({
      next: (data) => {
        console.log('Received data:', data);
        this.people = data;
      },
      error: (err) => console.error('Error fetching people:', err),
    });
  }

  getOutputs() {
    this.outputService.getOutputsByWeek(this.weekToDisplay).subscribe({
      next: (data) => this.outputs = data,
      error: (err) => console.error(err),
    });
  }

  getOutputsForMonth() {
    if(!this.currentPeriod?.startWeek || !this.currentPeriod.endWeek){
      return;
    }
    this.outputService.getOutputsByWeekRange(this.currentPeriod?.startWeek, this.currentPeriod?.endWeek).subscribe({
      next: (data) => this.outputsForMonth = data,
      error: (err) => console.error(err),
    });
  }

  getOutputsForRange() {
    if(!this.currentPeriod?.startWeek || !this.currentPeriod?.endWeek ){
      return;
    }
    this.outputService.getOutputsByWeekRange(this.currentPeriod?.startWeek, this.currentPeriod?.endWeek).subscribe({
      next: (data) => this.outputsForRange = data,
      error: (err) => console.error(err),
    });
  }


  public setWeek(weekNr: number) {
    this.saveAllOutputs();
    this.getOutputsForMonth();
    if (this.weekToDisplay < weekNr) {
      this.getWeekStartAndEndDate(true);
    } else {
      this.getWeekStartAndEndDate(false);
    }
    this.weekToDisplay = weekNr;
    if (this.rangeEnd > 0 && this.rangeEnd > this.weekToDisplay) {
      this.outputService.getOutputsByWeekRange(this.weekToDisplay, this.rangeEnd).subscribe(updatedOutputs => {
        this.outputs = updatedOutputs;
      });
    } else {
      this.outputService.getOutputsByWeek(weekNr).subscribe(updatedOutputs => {
        this.outputs = updatedOutputs;
      });
    }

    this.getPeriodFromCalendarWeek(this.weekToDisplay);
    this.getOutputsForRange();
  }

  public setRangeEnd(endWeek: number) {
    this.rangeEnd = endWeek;
    this.outputService.getOutputsByWeekRange(this.weekToDisplay, endWeek).subscribe(updatedOutputs => {
      this.outputs = updatedOutputs;
    });
  }

  enableRange(event: Event) {
    if (this.rangeEnd === 0) {
      this.rangeEnd = this.weekToDisplay;
    } else {
      this.rangeEnd = 0;
      this.setWeek(this.weekToDisplay);
    }
  }

  getPersonNameFromId(id: string) {
    const person = this.people?.find(person => person?.id === Number(id));
    return person?.name ?? '--';
  }

  saveAllOutputs() {
    this.showAverageOf = null;
    this.outputs?.forEach((output, index) => {
      this.editRow(index);
    });
    this.getOutputsForMonth();
    this.getOutputsForRange();
  }

  getGoalClass(forProp: keyof Output, index: number): string {
    if (this.outputs) {
      const val = Number(this.outputs[index][forProp]);
      const threshold = this.expectedNumber * this.outputs[index].availability;

      if (val >= threshold) return 'goal-reached';
      if (val <= threshold * 0.5) return 'goal-not-reached';
    }
    return 'goal-almost-reached';
  }

  getTotalValues(forProp: keyof Output) {
    let total = 0;
    for (const output of Object.values(this.outputs || [])) {
      const value = output[forProp];

      if (typeof value === 'number') {
        total += value;
      }
    }

    return total;
  }

  getTotalValuesForMonth(forProp: keyof Output) {
    let total = 0;
    for (const output of Object.values(this.outputsForMonth || [])) {
      const value = output[forProp];

      if (typeof value === 'number') {
        total += value;
      }
    }

    return total;
  }

  getTotalValuesForMonthPerPerson(forProp: keyof Output, personId?: number) {
    let total = 0;
    for (const output of Object.values(this.outputsForMonth || [])) {
      console.log('out: ', output);
      if(output.name === String(personId)){
        const value = output[forProp];
        if (typeof value === 'number') {
          total += value;
        }
      }
    }

    return total;
  }

  getOutputForPerson(personId?: string | number): Output | undefined {
    if (personId === undefined) return undefined;
    return this.outputs?.find(o => o.name === personId.toString());
  }

  editRow(entryIndex: number, id?: number) {
    if (this.outputs && this.outputs[entryIndex].id) {
      this.outputService.patchOutput(this.outputs[entryIndex].id!, this.outputs[entryIndex])
        .subscribe({
          next: (updatedOutput) => {
            console.log('Output updated successfully:', updatedOutput);
            this.getOutputsForMonth();
          },
          error: (err) => {
            console.error('Failed to update output:', err);
          }
        });

    }
  }

  addNewData(p: Person) {
    const emptyOutput: Output = {
      name: String(p.id) || '',
      availability: p.availability,
      newOpps: 0,
      currentChances: 0,
      details: '',
      projectStarts: 0,
      newEntries: 0,
      contracts: 0,
      kvts: 0,
      note: '',
      weekOfTheYear: this.weekToDisplay,
      date: new Date()
    }
    this.outputService.postOutput(emptyOutput).subscribe({
      next: (updated) => {
        console.log(updated);
        this.getOutputs();
      },
      error: (err) => console.error('Failed to save outputs', err)
    });
  }

  showAvg(p: Person) {
    if (this.showAverageOf?.id === p.id) {
      this.showAverageOf = null;
    } else {
      this.showAverageOf = p;
    }
  }

  autoGrow(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  getPeriodFromCalendarWeek(week: number) {
    const curPeriod = this.periods.find(period =>
      period.startWeek <= week && period.endWeek >= week
    )
    this.currentPeriod = curPeriod;
  }

  showOutputForMonth(forKey: keyof Output, weekNr?: number, personId?: number): number | undefined {
    if (!weekNr) {
      return undefined;
    }
    this.getPeriodFromCalendarWeek(weekNr);

    if(!this.currentPeriod){
      return undefined;
    }

    if(!this.outputsForRange.length)
    this.getOutputsForRange();

    if(!this.outputsForRange){
      return undefined;
    }

    const outputsForPerson = this.outputsForRange.filter(o => {
      if (o.name === String(personId)) {
        return o;
      }
      return null;
    })

    const sum = outputsForPerson?.reduce((sum, o) => sum + (typeof o[forKey] === 'number' ? o[forKey] as number : 0), 0);

    return sum;
  }


  constructor(private readonly outputService: OutputService, private readonly peopleService: PeopleService) { }
}