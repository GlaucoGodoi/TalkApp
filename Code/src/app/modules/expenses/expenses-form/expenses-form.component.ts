import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SpeechSupportService, RecognitionResult } from '../../speech-support/speech-support.service';


@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.css']
})
export class ExpensesFormComponent implements OnInit {


  private targetElementName: string;

  public readonly reasonFieldName = 'reason';
  public readonly amountFieldName = 'amount';
  public readonly selectedLanguageFieldName = 'selectedLanguage';

  public expenseForm: FormGroup

  public get Reason(): AbstractControl {
    return this.expenseForm.get(this.reasonFieldName);
  }

  public get Amount(): AbstractControl {
    return this.expenseForm.get(this.amountFieldName);
  }

  public get SelectedLanguage(): AbstractControl{
    return this.expenseForm.get(this.selectedLanguageFieldName);
  }

  public get ListeningReason(): boolean {
    return this.speech.IsListening && this.targetElementName === this.reasonFieldName;
  }

  public get ListeningAmount(): boolean {
    return this.speech.IsListening && this.targetElementName === this.amountFieldName;
  }

  constructor(private fb: FormBuilder, public speech: SpeechSupportService) { }

  public ngOnInit(): void {
    this.expenseForm = this.fb.group({
      reason: [null, [Validators.required, Validators.maxLength(200)]],
      amount: [null, [Validators.required, Validators.min(0)]],
      selectedLanguage:['en-US']
    });

    this.speech.Result.subscribe((result: RecognitionResult) => {
      console.log('Result event on the controller.');
      console.log(result);
      window.document.getElementById(this.targetElementName).focus();
      if(!result){
        this.targetElementName=null;
        return;
      }
      if (this.targetElementName === this.reasonFieldName) {
        this.Reason.setValue(result.transcript);
      } else if (this.targetElementName === this.amountFieldName) {
        this.Amount.setValue(result.transcript);
      }
      
      this.targetElementName = null;
    });
  }

  public toggleListening(fieldSelected: string): void {
    this.targetElementName = fieldSelected;

    if (this.speech.IsListening) {
      this.speech.stopListening();
    } else {
      this.speech.requestListening(this.SelectedLanguage.value);
    }
  }

  public clearCard(): void {
    const languageValueBefore=this.SelectedLanguage.value;
    this.expenseForm.reset();
    this.SelectedLanguage.setValue(languageValueBefore);
  }

  public saveExpense(): void {
    var rawData = this.expenseForm.getRawValue();

    // send the data to you backend service and handle the answer.
    console.log(rawData);
  }
}
