import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { OutputsViewComponent } from './outputs-view/outputs-view.component';
import { CalendarPeriodsComponent } from './calendar-periods/calendar-periods.component';

const routes: Routes = [
  { path: '', component: OutputsViewComponent },
  { path: 'add-employee', component: EmployeeListComponent },
  { path: 'periods', component: CalendarPeriodsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
