import { Component, importProvidersFrom, Input } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { NotificationService } from '../../content/services/notification.service';

@Component({
  selector: 'app-dish',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.scss'
})
export class DishComponent {
  @Input() dish: any;

  constructor(
    private notificationService : NotificationService,
  ){}

  buyDish(): void {
    this.notificationService.showSuccess('Dish successfully added into cart');
    console.log(`Buying ${this.dish.name}`);
  }
}
