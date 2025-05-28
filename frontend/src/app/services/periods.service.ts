import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Person } from "../models/employee.model";
import { Period } from "../models/period.model";

@Injectable({
    providedIn: 'root',
  })
  export class PeriodsService {
    private apiUrl = 'http://localhost:4000/api/periods';
  
    constructor(private http: HttpClient) {}

    getAllPeriods(): Observable<Period[]> {
      return this.http.get<Period[]>(this.apiUrl);
    }

    postPeriod(period: Period): Observable<Period[]> {
        return this.http.post<Period[]>(this.apiUrl, period).pipe(
          map(response => response)
          );
    }

    postPeriods(periods: Period[]): Observable<Period[]> {
      return this.http.post<Period[]>(this.apiUrl, periods).pipe(
        map(response => response)
        );
  }

  deletePeriod(id: number): Observable<Period[]> {
    return this.http.delete<{ updatedPeriods: Period[] }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.updatedPeriods)
    );
}

patchPeriod(id: number, fields: Partial<Period>): Observable<Period[]> {
  return this.http.patch<{ updatedPeriod: Period[] }>(`${this.apiUrl}/${id}`, fields)
    .pipe(map(response => response.updatedPeriod));
}
  }