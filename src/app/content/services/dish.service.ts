import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private readonly apiUrl = 'http://localhost:5224/api/Dish';
  private dishesCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getDishById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetDishById?id=${id}`);
  }

  getAllDishes(): Observable<any[]> {
    if (this.dishesCache) {
      return of(this.dishesCache);
    } else {
      return this.http.get<any[]>(`${this.apiUrl}/GetAllDish`).pipe(
        tap((data) => (this.dishesCache = data))
      );
    }
  }

  clearCache() {
    this.dishesCache = null;
  }

  updateDish(id: string, dishDto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateDish?id=${id}`, dishDto);
  }

  deleteDish(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteDish?id=${id.toString()}`).pipe(
      tap(() => this.clearCache())
    );
  }
  
  addDish(dishDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddDish`, dishDto);
  }
    
}
