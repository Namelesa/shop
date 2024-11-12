import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DishSizeService {
  private readonly apiUrl = 'http://localhost:5224/api/Dish';
  private dishesSizeCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getAllSizes(): Observable<any[]> {
    if (this.dishesSizeCache) {
      return of(this.dishesSizeCache);
    } else {
      return this.http.get<any[]>(`${this.apiUrl}/GetAllDishSize`).pipe(
        tap(data => this.dishesSizeCache = data)
      );
    }
  }

  clearCache() {
    this.dishesSizeCache = null;
  }

  addSize(dishSize: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddDishSize`, dishSize).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteSize(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteDishShize?id=${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  updateSize(id: number, size: any) {
    return this.http.put<any>(`${this.apiUrl}/UpdateDishSize?name=${size.size}&price=${size.price}&id=${id}&image=${size.image}`, size);
  }
  
}
