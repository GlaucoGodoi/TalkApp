import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { YesNo } from './yes-no-dialog/yes-no.enum';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';

export interface AppWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
  msSpeechRecognition: any;
}

const { webkitSpeechRecognition }: AppWindow = <AppWindow>window;
const { SpeechRecognition }: AppWindow = <AppWindow>window;
const { msSpeechRecognition }: AppWindow = <AppWindow>window;


@Injectable({
  providedIn: 'root'
})
export class SpeechSupportService {

  private _isListening: boolean;
  private _supportRecognition: boolean;
  private _speech: any;
  private _lastResult: RecognitionResult = null;
  private _snackOpened: MatSnackBarRef<SimpleSnackBar>;

  public get IsListening(): boolean {
    return this._isListening;
  }

  public get SupportRecognition(): boolean {
    return this._supportRecognition;
  }

  public Result: EventEmitter<RecognitionResult> = new EventEmitter<RecognitionResult>();



  constructor(public dialog: MatDialog, private zone: NgZone, private snackBar: MatSnackBar) {
    this.init();
  }

  private init(): void {
    this._supportRecognition = true;
    console.log(window['SpeechRecognition']);
    if (window['SpeechRecognition']) {
      this._speech = new SpeechRecognition();
    } else if (window['webkitSpeechRecognition']) {
      this._speech = new webkitSpeechRecognition();
    } else if(window['msSpeechRecognition']){
      this._speech = new msSpeechRecognition();
    } else {
      this._supportRecognition = false;
    }
    console.log(`Speech supported: ${this._supportRecognition}`);
  }

  private setupListener(selectedLanguage: string): void {
    this._speech.lang = selectedLanguage; //'en-US' 'pt-BR' 'it-IT' 
    this._speech.interimResults = false; // We don't want partial results
    this._speech.maxAlternatives = 1; // By now we are interested only on the most accurate alternative

    if (!this._speech.onstart) {
      this._speech.onspeechstart = (event) => { this.handleSpeechStart(event) };
    }

    if (!this._speech.onresult) {
      // VERY IMPORTANT: To preserve the lexical scoping of 'this' across closures in TypeScript, you use Arrow Function Expressions
      this._speech.onresult = (event) => { this.handleResultevent(event) };
    }

    if (!this._speech.onend) {
      // VERY IMPORTANT: To preserve the lexical scoping of 'this' across closures in TypeScript, you use Arrow Function Expressions
      this._speech.onend = (event) => { this.handleEndEvent(event) };
    }

    if (!this._speech.onspeechend) {
      // VERY IMPORTANT: To preserve the lexical scoping of 'this' across closures in TypeScript, you use Arrow Function Expressions
      this._speech.onspeechend = (event) => { this.handleSpeechEndEvent(event) };
    }

    if (!this._speech.nomatch) {
      // VERY IMPORTANT: To preserve the lexical scoping of 'this' across closures in TypeScript, you use Arrow Function Expressions
      this._speech.nomatch = (event) => { this.handleNoRecognitionAvaliable(event) };
    }

  }
  handleSpeechStart(event: any): void {
    this._lastResult = null;
    console.log('Listening...');
    this._snackOpened = this.snackBar.open('Listening...');
  }

  handleNoRecognitionAvaliable(event: any): any {
    console.log('no recognition');
  }

  private handleResultevent(event: any): void {
    console.log('Handling recognition event.')
    const result = event.results[0][0];
    this._lastResult = { confidence: result.confidence, transcript: result.transcript };

    console.log(this._lastResult);
  }

  private handleEndEvent(event: any): void {
    console.log('Handling end event.')
    console.log(event);
    this._isListening = false;
    if (this._lastResult) {
      (() => { this.showDialog(this._lastResult) })();
    } else {
      this.Result.emit(null);
    }
    this._lastResult = null;
    if (this._snackOpened) {
      this._snackOpened.dismiss();
    }
  }

  private handleSpeechEndEvent(event: any): void {
    console.log('Handling speech end event.')
    console.log(event);
    this._isListening = false;
  }

  public requestListening(selectedLanguage: string): void {
    this._isListening = true;
    this.setupListener(selectedLanguage);
    this._speech.start();
    console.log('Request listening');
  }

  public stopListening(): void {
    this._isListening = false;
    this._speech.stop();
    console.log('Listening stopped');
  }

  private showDialog(recognitionResult: RecognitionResult): void {

    this.zone.run(() => {
      const dialogRef = this.dialog.open(YesNoDialogComponent, {
        width: '250px',
        data: recognitionResult,
        id: "yesnodlg"
      });

      dialogRef.afterClosed().subscribe(result => {

        console.log(result);
        if (result.choice === YesNo.yes) {
          this.Result.emit(result.response);
        }
      });

    });
  }

}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
}