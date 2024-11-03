import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DishService } from '../../content/services/dish.service';
import { DishSizeService } from '../../content/services/dish.size.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Импортируем FormsModule

@Component({
  selector: 'app-dish-description',
  templateUrl: './dish-description.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule], // Добавляем FormsModule
  styleUrls: ['./dish-description.component.scss']
})
export class DishDescriptionComponent implements OnInit {
  dish: any;
  sizes: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedSize: any = null;
  selectedPrice: number = 0;
  isEditing: boolean = false; // Свойство для отслеживания режима редактирования

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private dishSizeService: DishSizeService
  ) {}

  ngOnInit() {
    const dishId = this.route.snapshot.paramMap.get('id');
    if (dishId) {
      this.fetchDishDetails(dishId);
      this.fetchDishSizes();
    }
  }

  private fetchDishDetails(dishId: string) {
    this.dishService.getDishById(dishId).subscribe(
      (data) => {
        this.dish = data;
        this.selectedPrice = this.dish.price;
        this.loading = false;
      },
      (error) => {
        this.error = 'Не удалось загрузить данные о блюде';
        this.loading = false;
      }
    );
  }

  private fetchDishSizes() {
    this.dishSizeService.getAllSizes().subscribe(
      (sizes) => {
        this.sizes = sizes;
        this.sizes.sort((a, b) => a.price - b.price);
      },
      (error) => {
        this.error = 'Не удалось загрузить размеры блюда';
      }
    );
  }

  selectSize(size: any) {
    this.selectedSize = size;
    this.selectedPrice = this.dish.price + size.price;
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  submitChanges() {
    this.isEditing = false;
  }
}
