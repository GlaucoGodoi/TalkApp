import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesFormComponent } from './expenses-form/expenses-form.component';
import { MaterialConfigModule } from '../../material-config.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpeechSupportModule } from '../speech-support/speech-support.module';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialConfigModule,
    ReactiveFormsModule,
    SpeechSupportModule
  ],
  exports: [ExpensesFormComponent],
  declarations: [ExpensesFormComponent],
  
})
export class ExpensesModule { }
