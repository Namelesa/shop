import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:5224/api/Order';
  private orderCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetOrderById?id=${id}`);
  }

  getAllOrders(): Observable<any[]> {
    if (this.orderCache) {
      return of(this.orderCache);
    } else {
      return this.http.get<any[]>(`${this.apiUrl}/GetAllOrders`).pipe(
        tap((data) => (this.orderCache = data))
      );
    }
  }

  clearCache() {
    this.orderCache = null;
  }

  updateDetailOrder(orderDetailId: number, dishId: number, quantity: number, size: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateOrderDetail?orderDetailId=${orderDetailId}&dishId=${dishId}&quantity=${quantity}&size=${size}`, {}).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteOrder?id=${id}`).pipe(
      tap(() => {
        this.clearCache(); 
      })
    );
  }  

  deleteDetailOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteOrderDetail?detailId=${id.toString()}`).pipe(
      tap(() => this.clearCache()) 
    );
  }

  addOrder(orderDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddOrder`, orderDto).pipe(
      tap(() => this.clearCache()) 
    );
  }

  addOrderDetails(orderDetails: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddOrderDetails`, orderDetails).pipe(
      tap(() => this.clearCache())
    );
  }
  
  addDishToOrder(orderId: number, dishId: number, quantity: number, size: string): Observable<any> {
    const url = `${this.apiUrl}/AddDishToOrder`;
    const body = { orderId, dishId, quantity, size };
    
    return this.http.put(url, null, { params: body });
  }
  

}
