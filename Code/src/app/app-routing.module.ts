import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensesFormComponent } from './modules/expenses/expenses-form/expenses-form.component';

const routes: Routes = [
  {path:'expenseform', component:ExpensesFormComponent},
  { path: '**', pathMatch: 'full', component: ExpensesFormComponent }
  // {path:'', redirectTo:'expenseform', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
