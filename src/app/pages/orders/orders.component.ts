import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../content/services/order.service';
import { NotificationService } from '../../content/services/notification.service';
import { DishSizeService } from '../../content/services/dish.size.service';
import { DishService } from '../../content/services/dish.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  standalone: true
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  isModalOpen: boolean = false;
  sizes: any[] = [];
  selectedSize: string = '';

  newDishId: number = 0; 
  newDishSize: string = '';        
  newDishQuantity: number = 1;     
  dishes: any[] = [];

  constructor(
    private order: OrderService,
    private notificationService: NotificationService,
    private dishSizeService: DishSizeService,
    private dishService: DishService
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.loadDishSizes();
    this.loadDishes();
  }

  loadOrders() {
    this.order.getAllOrders().subscribe((data) => {
      this.orders = data;
    });
  }

  loadDishSizes() {
    this.dishSizeService.getAllSizes().subscribe((sizes) => {
      this.sizes = sizes;
    });
  }

  loadDishes() {
    this.dishService.getAllDishes().subscribe((dishes) => {
      this.dishes = dishes;
    });
  }
  onOrderClick(orderId: string) {
    this.order.getOrderById(orderId).subscribe((data) => {
      this.selectedOrder = {
        ...data,
        items: data.orderDetails.map((detail: any) => ({
          ...detail,
          dishName: detail.dish.name,
          price: detail.price,
          sizes: detail.dish.sizes,
          orderDetailId: detail.id  
        }))
      };
      this.isModalOpen = true;
    });
  }

  onUpdateOrderDetail(orderDetailId: number, dishId: number, quantity: number, size: string) {
    this.order.updateDetailOrder(orderDetailId, dishId, quantity, size).subscribe(
      () => {
        this.notificationService.showSuccess('Order updated');
        this.loadOrders();
        this.closeModal();
        window.location.reload();
      },
    );
  }
  
  onDeleteOrder(orderId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this order?')) {
      this.order.deleteOrder(Number(orderId)).subscribe(
        () => {
          this.orders = this.orders.filter(order => order.id !== orderId);
          this.notificationService.showSuccess('Order deleted');
          this.loadOrders(); 
          this.closeModal();  
          window.location.reload();
        },
        (error) => {
          this.notificationService.showError('Error deleting order');
        }
      );
    }
  }
  
  onDeleteOrderItem(orderDetailId: string, event: Event): void {
    event.stopPropagation();
  
    if (confirm('Are you sure you want to delete this item from the order?')) {
      if (this.selectedOrder) {
        const orderDetailIds: string[] = this.selectedOrder.items.map((item: any) => item.orderDetailId);
  
        this.selectedOrder.items = this.selectedOrder.items.filter(
          (item: any) => item.orderDetailId !== orderDetailId
        );
  
        this.order.deleteDetailOrder(Number(orderDetailId)).subscribe(
          async () => {
            const remainingOrderDetailIds: string[] = this.selectedOrder.items.map((item: any) => item.orderDetailId);

            if (remainingOrderDetailIds.length === 0) {
              try {
                await this.order.deleteOrder(Number(this.selectedOrder.id)).toPromise();
                this.orders = this.orders.filter(order => order.id !== this.selectedOrder.id);
                this.notificationService.showSuccess('Order and its items deleted');
                this.closeModal();
              } catch (error) {
                this.notificationService.showError('Error deleting order');
                console.error('Error deleting order:', error);
              }
            } else {
              const idToUpdate = remainingOrderDetailIds[0];
              const itemToUpdate = this.selectedOrder.items.find((item: any) => item.orderDetailId === idToUpdate);
              
              if (itemToUpdate) {
                await this.onUpdateOrderDetail(
                  itemToUpdate.orderDetailId,
                  itemToUpdate.dish.id,          
                  itemToUpdate.quantity,         
                  itemToUpdate.size              
                )
              }
            }
            this.loadOrders();
          },
          (error) => {
            this.notificationService.showError('Error deleting order item');
            console.error('Error deleting order item:', error);
          }
        );
      }
    }
  }

  onAddDishToOrder(orderId: number, dishId: number, quantity: number, size: string): void {
    this.order.getOrderById(orderId.toString()).subscribe(
      (order: any) => {
        const existingOrderDetailIds = order?.orderDetails?.map((detail: any) => detail.id) || [];
        
        this.order.addDishToOrder(orderId, dishId, quantity, size).subscribe(
          (response: any) => {
            this.notificationService.showSuccess(response.message || 'Dish added to order successfully');
            this.loadOrders();
            
            if (existingOrderDetailIds.length > 0) {
              const firstOrderDetailId = existingOrderDetailIds[0];
              this.onUpdateOrderDetail(firstOrderDetailId, dishId, quantity, size);
            }
            window.location.reload();
          },
          (error) => {
            this.notificationService.showError(error?.error?.message || 'Failed to add dish to order');
            console.error('Error adding dish to order:', error);
          }
        );
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || 'Failed to fetch order details');
        console.error('Error fetching order details:', error);
      }
    );
  }

  

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }
}
