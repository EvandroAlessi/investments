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
    this.snackBar.open(message, '', { duration: durationInSeconds * 1000 });
  }
}
