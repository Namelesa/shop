import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DishIngridientService {
  private readonly apiUrl = 'http://localhost:5224/api/Ingridient';
  private dishesIngridientsCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getAllIngridients(): Observable<any[]> {
    if (this.dishesIngridientsCache) {
      return of(this.dishesIngridientsCache);
    } else {
      return this.http.get<any[]>(`${this.apiUrl}/GetAllIngridient`).pipe(
        tap(data => this.dishesIngridientsCache = data)
      );
    }
  }

  clearCache() {
    this.dishesIngridientsCache = null;
  }

  getIngridientsByName(name: string): Observable<any[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<any[]>(`${this.apiUrl}/GetAllIngridientByName`, { params });
  }

  getIngridientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetIngridientById?id=${id}`);
  }

  addIngridient(ingridient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddIngridient?name=${ingridient.name}&image=${ingridient.image}`, ingridient).pipe(tap(() => this.clearCache()));
  }

  addIngridientToDish(dishId: number, ingridientId: number): Observable<any> {
    const params = new HttpParams()
      .set('dishId', dishId.toString())
      .set('ingridientId', ingridientId.toString());
    return this.http.post(`${this.apiUrl}/AddIngridientToDish`, null, { params });
  }

  updateIngridient(ingridient: any): Observable<any> {
    const params = new HttpParams()
      .set('id', ingridient.id.toString())
      .set('name', ingridient.name)
      .set('image', ingridient.image);
    return this.http.put(`${this.apiUrl}/UpdateIngridient`, null, { params });
  }

  deleteIngridient(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.apiUrl}/DeleteIngridient`, { params });
  }
}
