import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Person } from '../models/employee.model';
import { OutputService } from '../services/output.service';
import { PeopleService } from '../services/person.service';
import { Output } from '../models/output.model';
import { PeriodsService } from '../services/periods.service';
import { Period } from '../models/period.model';

@Component({
  selector: 'app-outputs-view',
  templateUrl: './outputs-view.component.html',
  styleUrls: ['./outputs-view.component.scss']
})
export class OutputsViewComponent {
  output: Array<Output> = [];
  persons: Array<Person> = [];
  periods: Array<Period> = [];

  ngOnInit() {
    this.outputService.getOutputs()
      .subscribe({
        next: (data) => {
          this.output = data;
        },
        error: (err) => {
          console.error('Failed to fetch outputs:', err);
        }
      });

    this.personService.getAllPeople()
      .subscribe({
        next: (data) => {
          this.persons = data;
        },
        error: (err) => {
          console.error('Failed to fetch persons:', err);
        }
      });

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

  constructor(private readonly outputService: OutputService, private readonly personService: PeopleService, private readonly periodsService: PeriodsService, private http: HttpClient) { }
}
