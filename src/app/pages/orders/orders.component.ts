import { Component, OnInit } from '@angular/core';
import { DishService } from '../../content/services/order.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  imports: [CommonModule, DatePipe, CurrencyPipe],
  standalone: true
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;

  constructor(private dishService: DishService) {}

  ngOnInit() {
    this.dishService.getAllOrders().subscribe((data) => {
      this.orders = data;
    });
  }

  onOrderClick(orderId: string) {
    this.dishService.getOrderById(orderId).subscribe((data) => {
      this.selectedOrder = {
        ...data,
        orderDetails: data.orderDetails.map((detail: any) => ({
          ...detail,
          dishName: detail.dish.name,
          price: detail.dish.price
        }))
      };
    });
  }
    
  onEditOrder(orderId: number) {
    console.log('Edit order with ID:', orderId);
  }
  
  onDeleteOrder(orderId: number) {
    console.log('Delete order with ID:', orderId);
  }
  
}
