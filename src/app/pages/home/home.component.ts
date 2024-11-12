import { Component, OnInit, OnDestroy } from '@angular/core';
import { DishComponent } from "../dish/dish.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DishService } from '../../content/services/dish.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../content/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DishComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  dishes: any[] = [];
  private destroy$ = new Subject<void>();
  showForm: boolean = false;
  newDish: any = {
    name: '',
    price: null,
    image: '',
    ingredients: ''
  };
  dishDto: any;
  nameError = false;
  imageError = false;
  priceError = false;
  nameLengthError = false;
  nameMaxLengthError = false;

  constructor(
    private dishService: DishService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadDishes();

    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.loadDishes();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDishes() {
    this.dishService.getAllDishes().subscribe(
      (data: any[]) => {
        this.dishes = data;
      },
      (error: any) => {
        console.error('Error fetching dishes:', error);
        this.notificationService.showError('Error fetching dishes');
      }
    );
  }

  toggleAddDishForm() {
    this.showForm = !this.showForm;
  }

  addDish() {
    if (this.validateInputs()) {
      const dishIngridientsNames = this.newDish.ingredients
        .split(',')
        .map((ingredient: string) => ingredient.trim())
        .filter((ingredient: string) => ingredient !== '');

      this.dishDto = {
        name: this.newDish.name,
        price: this.newDish.price,
        image: this.newDish.image,
        dishIngridientsNames: dishIngridientsNames.length ? dishIngridientsNames : null
      };

      this.dishService.addDish(this.dishDto).subscribe(
        response => {
          this.notificationService.showSuccess('Dish added successfully');
          this.showForm = false;
          this.loadDishes();
          window.location.reload();
        },
        error => {
          this.notificationService.showError('Error adding dish');
          console.error('Error adding dish:', error);
        }
      );
    } else {
      this.notificationService.showError('Please correct the errors before submitting.');
    }
  }

  validateInputs(): boolean {
    this.nameError = !this.newDish.name;
    this.nameLengthError = this.newDish.name.length < 3;
    this.nameMaxLengthError = this.newDish.name.length > 50;
    this.imageError = !/^https?:\/\/.+/i.test(this.newDish.image);
    this.priceError = !(this.newDish.price > 0);
    return !this.nameError && !this.imageError && !this.priceError && !this.nameLengthError && !this.nameMaxLengthError;
  }
}
