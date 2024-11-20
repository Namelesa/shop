import { Component, importProvidersFrom, Input } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { NotificationService } from '../../content/services/notification.service';
import { encryptCartData, decryptCartData } from '../../content/services/cart.unit.service';

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
    let cart = decryptCartData(localStorage.getItem('cart') || '');

    if (!Array.isArray(cart)) {
      cart = [];
    }

    const newDish = {
      productId: this.dish.id,
      title: this.dish.name,
      price: this.dish.price,
      quantity: 1,
      size: this.dish?.size || 'S',
      image: this.dish.image,
    };

    const existingDish = cart.find((item: any) => item.productId === newDish.productId && item.size === newDish.size);

    if (existingDish) {
      existingDish.quantity += 1;
      this.notificationService.showSuccess('The quantity of the dish has been updated in the cart');
    } else {
      cart.push(newDish);
      this.notificationService.showSuccess('The dish has been successfully added to your cart');
    }

    const encryptedCart = encryptCartData(cart);
    localStorage.setItem('cart', encryptedCart);
  }
}
