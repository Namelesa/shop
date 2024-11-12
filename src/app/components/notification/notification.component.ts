import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../content/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NotificationComponent implements OnInit {
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.success$.subscribe((message) => {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = null), 3000);
    });

    this.notificationService.error$.subscribe((message) => {
      this.errorMessage = message;
      setTimeout(() => (this.errorMessage = null), 3000);
    });
  }
}
