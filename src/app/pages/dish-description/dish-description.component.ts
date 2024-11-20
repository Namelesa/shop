import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DishService } from '../../content/services/dish.service';
import { DishSizeService } from '../../content/services/dish.size.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../content/services/notification.service';
import { encryptCartData, decryptCartData } from '../../content/services/cart.unit.service';

@Component({
  selector: 'app-dish-description',
  templateUrl: './dish-description.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  styleUrls: ['./dish-description.component.scss'],
})
export class DishDescriptionComponent implements OnInit {
  dish: any;
  sizes: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedSize: any = null;
  selectedPrice: number = 0;
  isEditing: boolean = false;
  newprice: number = 0;
  addprice: number = 0;
  nameError = false;
  imageError = false;
  priceError = false;
  nameLengthError = false;
  nameMaxLengthError = false;

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private dishSizeService: DishSizeService,
    private router: Router,
    private notificationService: NotificationService
    
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
        this.error = 'Failed to load dish data';
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
        this.error = 'Failed to load dish dimensions';
      }
    );
  }

  selectSize(size: any) {
    this.selectedSize = size;

    this.selectedPrice = this.dish.price + size.price;
    this.addprice = size.price;
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.selectedSize = null;
      this.selectedPrice = this.dish.price;
    }
  }

  validateInputs() {
    this.nameError = !this.dish.name;
    this.nameLengthError = this.dish.name.length < 3;
    this.nameMaxLengthError = this.dish.name.length > 50;
    this.imageError = !/^https?:\/\/.+/i.test(this.dish.image);
    this.priceError = !(this.newprice > 0);
  }

  submitChanges() {
    this.validateInputs();
    if (!this.nameError && !this.imageError && !this.priceError) {
      const dishDto: any = {
        name: this.dish.name,
        image: this.dish.image,
        dishIngridientsNames: this.dish.ingridients.map((i: any) => i.name),
        size: this.selectedSize?.size || this.dish.dishSize.size,
        price: this.newprice > 0 ? this.newprice + this.addprice : this.dish.price,
      };

      this.dishService.updateDish(this.dish.id, dishDto).subscribe(
        () => {
          this.notificationService.showSuccess('Changes successfully saved');
          this.isEditing = false;
          this.fetchDishDetails(this.dish.id);
        },
        (error) => {
          this.notificationService.showError('Error saving changes');
          this.error = 'Error saving changes';
        }
      );
    } else {
      this.error = 'Please fix the errors before submitting.';
    }
  }

  deleteDish(id: number) {
    if (confirm('Are you sure you want to remove this dish?')) {
      this.dishService.deleteDish(id).subscribe(
        () => {
          this.notificationService.showSuccess('Dish successfully deleted');
          this.dishService.clearCache();
          this.router.navigate(['/home']);
        },
        (error) => {
          this.notificationService.showError('Error deleting dish');
          console.error('Error details:', error);
        }
      );
    }
  }


  buyDish(): void {
    let cart = decryptCartData(localStorage.getItem('cart') || '');
  
    if (!Array.isArray(cart)) {
      cart = [];
    }
  
    const newDish = {
      productId: this.dish.id,
      title: this.dish.name,
      price: this.selectedPrice,
      quantity: 1,
      size: this.selectedSize?.size || 'S',
      image: this.dish.image
    };
  
    const existingDish = cart.find((item: any) => item.productId === newDish.productId && item.size === newDish.size);
  
    if (existingDish) {
      existingDish.quantity += 1;
      this.notificationService.showSuccess('Quantity of this dish updated in the cart');
    } else {
      cart.push(newDish); 
      this.notificationService.showSuccess('Dish successfully added to the cart');
    }

    const encryptedCart = encryptCartData(cart);
    localStorage.setItem('cart', encryptedCart);
    this.router.navigate(['/home']);
  }
  
}
