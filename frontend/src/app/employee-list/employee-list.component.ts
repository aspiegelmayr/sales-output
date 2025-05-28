import { Component, Input, OnInit } from '@angular/core';
import { PeopleService } from '../services/person.service';
import { Person } from '../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  @Input() persons: Person[] = [];
  expectedNumber = 3;

  editingIndex = -1;

  weekToDisplay = 0;

  ngOnInit(): void {
    this.peopleService.getAllPeople()
      .subscribe({
        next: (data) => {
          this.persons = data;
        },
        error: (err) => {
          console.error('Failed to fetch persons:', err);
        }
      });
  }


  public addNewPerson() {
    this.persons.push({ name: '', availability: 1 });
    this.editingIndex = this.persons.length - 1;
  }

  public postValues() {
    this.peopleService.postPersons(this.persons).subscribe(updatedOutputs => {
      this.persons = updatedOutputs;
    })
  }

  deletePerson(id?: number): void {
    if (id)
      this.peopleService.deletePerson(id).subscribe(updatedEmployees => {
        this.persons = updatedEmployees;
      });
  }

  public editValues(index: number) {
    if (this.editingIndex === index) {
      const id = this.persons[index].id;
      if (id) {
        this.patchValue(id, this.persons[index])
      } else {
        this.postValue(this.persons[index]);
      }
      this.editingIndex = -1;
    } else {
      this.editingIndex = index;
    }
  }

  public postPersons() {
    this.peopleService.postPersons(this.persons).subscribe(updatedOutputs => {
      this.persons = updatedOutputs;
    })
  }

  public postValue(val: Person) {
    this.peopleService.postPerson(val).subscribe(updatedVals => {
      console.log(updatedVals);
    })
  }

  public patchValue(id: number, updatedVal: Person) {
    this.peopleService.patchPerson(id, updatedVal).subscribe(updatedOutputs => {
      this.persons = updatedOutputs;
    });
  }

  public goToOutputList() {

  }

  constructor(private readonly peopleService: PeopleService) { }
}