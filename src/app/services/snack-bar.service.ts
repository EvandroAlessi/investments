import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  lastUpdateTableMessage: Date | undefined;
  private readonly defaultMessageDuration = 3;

  constructor(private snackBar: MatSnackBar) { }

  showSnackBarMessage(message: string, durationInSeconds = this.defaultMessageDuration) {
    this.snackBar.open(message, 'OK', { duration: durationInSeconds * 1000 });
  }

  tableUpdatedMessage() {
    const currentDate = new Date();

    if (!this.lastUpdateTableMessage || currentDate > this.lastUpdateTableMessage) {
      currentDate.setSeconds(currentDate.getSeconds() + this.defaultMessageDuration);
      this.lastUpdateTableMessage = currentDate;

      this.snackBar.open('Table Updated', 'OK', { duration: this.defaultMessageDuration * 1000 });
    }
  }
}
