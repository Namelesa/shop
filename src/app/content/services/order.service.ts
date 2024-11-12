import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DishService {
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

  updateOrder(id: string, orderDto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateOrder?id=${id}`, orderDto);
  }
  updateDetailOrder(orderDetailId: number, dishId: number, quantity: number, orderDto:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateOrderDetail?orderDetailId=${orderDetailId}&dishId=${dishId}&quantity=${quantity}`, orderDto);
  }


  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteOrder?id=${id.toString()}`).pipe(
      tap(() => this.clearCache())
    );
  }
  deleteDetailOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteOrderDetail?id=${id.toString()}`).pipe(
      tap(() => this.clearCache())
    );
  }
  

  addOrder(orderDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddOrder`, orderDto);
  }
  addOrderDetail(orderDetailDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddOrderDetail`, orderDetailDto);
  }


}
