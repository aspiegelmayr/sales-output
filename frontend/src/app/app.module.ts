import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OutputListComponent } from './output-list/output-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { WeeklyAverageList } from './weekly-average-list/weekly-average-list.component';
import { OutputsViewComponent } from './outputs-view/outputs-view.component';
import { CalendarPeriodsComponent } from './calendar-periods/calendar-periods.component';

@NgModule({
  declarations: [
    AppComponent,
    OutputListComponent,
    EmployeeListComponent,
    WeeklyAverageList,
    OutputsViewComponent,
    CalendarPeriodsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule, 
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
