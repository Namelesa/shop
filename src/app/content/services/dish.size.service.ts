import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DishSizeService {
  private readonly apiUrl = 'http://localhost:5224';
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
}
