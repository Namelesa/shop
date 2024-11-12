import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private successSubject = new Subject<string>();
  private errorSubject = new Subject<string>();

  success$ = this.successSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  showSuccess(message: string) {
    this.successSubject.next(message);
  }

  showError(message: string) {
    this.errorSubject.next(message);
  }
}
