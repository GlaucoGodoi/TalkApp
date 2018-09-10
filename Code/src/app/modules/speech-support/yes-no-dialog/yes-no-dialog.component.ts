import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { YesNo } from './yes-no.enum';
import { RecognitionResult } from '../speech-support.service';



@Component({
  selector: 'app-yes-no-dialog',
  template: `
    <h1 mat-dialog-title>Voice recognition</h1>
    <mat-dialog-content>
      Did you said
      
      <div style="margin-top:10px;"><strong>{{this.data.transcript}}</strong></div>
      <div style="margin-top:15px;" class="confidence-theme">
        <mat-progress-bar color="{{colorToShow}}" mode="determinate" value="{{confidence}}"></mat-progress-bar>
        <div fxLayout="row nowrap" fxLayoutAlign="space-between center" >
        <span class="mat mat-caption">confidence</span>
        <span class="mat mat-caption">{{confidence|number: '2.1-2'}}%</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="chooseNo()">No</button>
      <button mat-raised-button color="primary" (click)="chooseYes()">Yes</button>
    </mat-dialog-actions>
  `
})
export class YesNoDialogComponent implements OnInit {

  public confidence: number;
  public colorToShow: string;

  constructor(public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecognitionResult) { }

  ngOnInit() {
    this.confidence = this.data.confidence * 100;
    if(this.confidence<=40){
      this.colorToShow="warn";
    }else if(this.confidence>=85){
      this.colorToShow="primary"
    }else{
      this.colorToShow="accent"
    }
  }

  public chooseYes(){
    console.log('click on yes.');
    this.dialogRef.close({choice:YesNo.yes, response:this.data})
  }

  public chooseNo(){
    console.log('click on no.');
    this.dialogRef.close({choice:YesNo.no, response:this.data});
  }
}
