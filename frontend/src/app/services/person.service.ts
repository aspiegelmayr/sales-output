import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Person } from "../models/employee.model";

@Injectable({
    providedIn: 'root',
  })
  export class PeopleService {
    private apiUrl = 'http://localhost:4000/api/people';
  
    constructor(private http: HttpClient) {}

    getAllPeople(): Observable<Person[]> {
      return this.http.get<Person[]>(this.apiUrl);
    }

    postPerson(person: Person): Observable<Person[]> {
        return this.http.post<Person[]>(this.apiUrl, person).pipe(
          map(response => response)
          );
    }

    postPersons(persons: Person[]): Observable<Person[]> {
      return this.http.post<Person[]>(this.apiUrl, persons).pipe(
        map(response => response)
        );
  }

  deletePerson(id: number): Observable<Person[]> {
    return this.http.delete<{ updatedPeople: Person[] }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.updatedPeople)
    );
}

patchPerson(id: number, fields: Partial<Person>): Observable<Person[]> {
  return this.http.patch<{ updatedPeople: Person[] }>(`${this.apiUrl}/${id}`, fields)
    .pipe(map(response => response.updatedPeople));
}
  }