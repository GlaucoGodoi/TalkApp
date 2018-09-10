import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatInputModule, MatIconModule, MatRadioModule, 
  MatDialogModule, MatSnackBarModule, MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatInputModule, MatIconModule, 
    MatRadioModule, MatDialogModule, MatSnackBarModule, MatProgressBarModule
  ],
  exports:[ MatCardModule, MatButtonModule, MatInputModule, MatIconModule, MatRadioModule, 
    MatDialogModule, MatSnackBarModule, MatProgressBarModule],
  declarations: []
})
export class MaterialConfigModule { }
