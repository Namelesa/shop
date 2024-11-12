import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DishIngridientService } from '../../content/services/dish.ingridient.service';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../content/services/notification.service';

@Component({
  selector: 'app-ingridients',
  templateUrl: './ingridients.component.html',
  styleUrls: ['./ingridients.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
})
export class IngridientsComponent implements OnInit {
  ingredients: any[] = [];
  filteredIngredients: any[] = [];
  showDetails = false;
  showAddEditModal = false;
  selectedIngredient: any = {};
  dishesContainingIngredient: any[] = [];
  isEditMode = false;

  nameError = false;
  imageError = false;
  nameLengthError = false;
  nameMaxLengthError = false;

  constructor(private dishIngridientService: DishIngridientService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients() {
    this.dishIngridientService.getAllIngridients().subscribe(
      (data) => {
        this.ingredients = data;
        this.filteredIngredients = this.ingredients;
      },
      (error) => {
        this.notificationService.showError('Error in loading');
      }
    );
  }

  openIngredientDetails(ingredient: any) {
    this.selectedIngredient = ingredient;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.dishesContainingIngredient = [];
  }

  openAddIngredientModal() {
    this.selectedIngredient = {};
    this.isEditMode = false;
    this.showAddEditModal = true;
  }

  openEditIngredientModal(ingredient: any) {
    this.selectedIngredient = { ...ingredient };
    this.isEditMode = true;
    this.showAddEditModal = true;
    this.closeDetails();
  }

  saveIngredient() {
    if (this.isEditMode) {
      this.validateInputs();
      if(!this.nameError && !this.imageError && !this.nameLengthError && !this.nameMaxLengthError){
        this.dishIngridientService.updateIngridient(this.selectedIngredient).subscribe(
          () => {
            this.loadIngredients();
            this.closeAddEditModal();
            window.location.reload();
            this.notificationService.showSuccess('Changes successfully saved');
          },
          () => {
            this.notificationService.showError('Error updating ingredient:');
          }
        );
      }
    } else {
      this.validateInputs();
      if(!this.nameError && !this.imageError && !this.nameLengthError && !this.nameMaxLengthError){
        this.dishIngridientService.addIngridient(this.selectedIngredient).subscribe(
          () => {
            this.loadIngredients();
            this.closeAddEditModal();
            this.notificationService.showSuccess('Ingredient successfully saved');
          },
          () => {
            this.notificationService.showError('Error adding ingredient:');
          }
        );
      }
    }
  }

  deleteIngredient(ingredient: any) {
    this.dishIngridientService.deleteIngridient(ingredient.id).subscribe(
      () => {
        this.loadIngredients();
        this.closeDetails();
        window.location.reload();
        this.notificationService.showSuccess('Ingredient successfully deleted');
      },
      () => {
        this.notificationService.showError('Error deleting ingredient:');
      }
    );
  }

  closeAddEditModal() {
    this.showAddEditModal = false;
  }

  validateInputs() {
    this.nameError = !this.selectedIngredient.name;
    this.nameLengthError = this.selectedIngredient.name.length < 3;
    this.nameMaxLengthError = this.selectedIngredient.name.length > 50;
    this.imageError = !/^https?:\/\/.+/i.test(this.selectedIngredient.image);
  }
}
