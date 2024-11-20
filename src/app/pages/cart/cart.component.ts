import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../content/services/order.service';
import {decryptCartData, encryptCartData} from '../../content/services/cart.unit.service';
import { NotificationService } from '../../content/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  cart: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;

  constructor(private router: Router, private order: OrderService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart = decryptCartData(savedCart);
        this.calculateTotals();
      } catch (error) {
        this.cart = [];
      }
    }
  }  

  calculateTotals(): void {
    this.totalItems = this.cart.reduce((acc, item) => acc + item.quantity, 0);
    this.totalPrice = this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  increaseQuantity(item: any): void {
    item.quantity += 1;
    this.saveCart();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeItem(item);
    }
    this.saveCart();
  }

  removeItem(item: any): void {
    this.cart = this.cart.filter(
      cartItem => 
        cartItem.productId !== item.productId || cartItem.size !== item.size
    );
    this.saveCart();
  }

  saveCart(): void {
    const encryptedCart = encryptCartData(this.cart);
    localStorage.setItem('cart', encryptedCart);
    this.calculateTotals();
  }

  async checkout(): Promise<void> {
    const orderData = {
        total: this.totalPrice,
    };

    try {
        const orderResponse = await this.order.addOrder(orderData).toPromise();
        const orderId = orderResponse.id; 

        const orderDetails = this.cart.map(item => ({
            orderId: orderId, 
            dishId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size, 
        }));

        const response = await this.order.addOrderDetails(orderDetails).toPromise();

        this.notificationService.showSuccess('Order and details submitted successfully');

        this.cart = [];
        localStorage.removeItem('cart');
        this.calculateTotals();
        this.router.navigate(['/orders']);
    } catch (error) {
        this.notificationService.showError('Error submitting order or details:');
    }
}
}