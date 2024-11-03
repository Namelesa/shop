import { Component, OnInit } from '@angular/core';
import { DishComponent } from "../dish/dish.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DishService } from '../../content/services/dish.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DishComponent, CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dishes: any[] = [];

  constructor(private dishService: DishService) {}

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    this.dishService.getAllDishes().subscribe(
      (data: any[]) => {
        this.dishes = data;
      },
      (error: any) => {
        console.error('Error fetching dishes:', error);
      }
    );
  }
}
