import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { Output } from "src/app/models/output.model";

@Injectable({
  providedIn: 'root',
})
export class OutputService {
  private testApiUrl = 'http://localhost:4000/api';
  private apiUrl = 'http://localhost:4000/api/outputs';

  constructor(private http: HttpClient) { }

  getMockOutputsFromBackend(): Observable<Output[]> {
    return this.http.get<Output[]>(this.testApiUrl);
  }

  getOutputs(): Observable<Output[]> {
    return this.http.get<Output[]>(this.apiUrl);
  }

  getOutputsByWeek(weekNr: number): Observable<Output[]> {
    return this.http.get<Output[]>(`${this.apiUrl}?week=${weekNr}`);
  }

  getOutputsByWeekRange(startWeek: number, endWeek: number): Observable<Output[]> {
    return this.http.get<Output[]>(`${this.apiUrl}?startWeek=${startWeek}&endWeek=${endWeek}`);
  }

  postOutputs(outputs: Output[]): Observable<Output[]> {
    return this.http.post<Output[]>(this.apiUrl, outputs).pipe(
      map(response => response)
    );
  }

  postOutput(output: Output): Observable<Output[]> {
    return this.http.post<Output[]>(this.apiUrl, output).pipe(
      map(response => response)
    );
  }

  deleteOutput(id: number): Observable<Output[]> {
    return this.http.delete<{ outputs: Output[] }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.outputs)
    );
  }

  patchOutput(id: number, fields: Partial<Output>): Observable<Output[]> {
    return this.http.patch<{ updatedOutputs: Output[] }>(`${this.apiUrl}/${id}`, fields)
      .pipe(map(response => response.updatedOutputs));
  }
}