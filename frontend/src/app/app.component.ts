import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OutputService } from './services/output.service';
import { Output } from './models/output.model';
import { Person } from './models/employee.model';
import { PeopleService } from './services/person.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'employee-manager';
  output: Array<Output> = [];
  persons: Array<Person> = [];

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
  }

  constructor(private readonly outputService: OutputService, private readonly personService: PeopleService, private http: HttpClient){}
}