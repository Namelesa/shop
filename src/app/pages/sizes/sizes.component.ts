import { Component, OnInit } from '@angular/core';
import { DishSizeService } from '../../content/services/dish.size.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../content/services/notification.service';

@Component({
  selector: 'app-sizes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss'],
})
export class SizesComponent implements OnInit {
  sizes: any[] = [];
  filteredSizes: any[] = [];
  showForm = false;
  showDetails = false;
  isEditMode = false;
  selectedSize: any = { name: '', price: 0 };
  photoPreview: string | undefined;

  nameError = false;
  nameLengthError = false;
  nameMaxLengthError = false;
  priceError = false;
  imageError = false;

  constructor(private dishSizeService: DishSizeService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadSizes();
  }

  loadSizes() {
    this.dishSizeService.getAllSizes().subscribe(
      (data) => {
        this.sizes = data;
        this.sortSizes();
      },
      (error) => {
        console.error('Error when getting a size:', error);
      }
    );
  }

  sortSizes() {
    this.filteredSizes = this.sizes.sort((a, b) => a.price - b.price);
  }

  toggleAddSizeForm() {
    this.showForm = !this.showForm;
    this.isEditMode = false;
    this.selectedSize = { name: '', price: 0 };
    this.photoPreview = undefined;
  }

  openEditSizeModal(size: any) {
    this.closeDetails();
    this.showForm = true;
    this.isEditMode = true;
    this.selectedSize = { ...size };
    this.photoPreview = size.photo;
  }

  closeDetails() {
    this.showDetails = false;
  }

  validateInputs() {
    this.nameError = !this.selectedSize.size;
    this.nameLengthError = this.selectedSize.size && this.selectedSize.size.length < 1;
    this.nameMaxLengthError = this.selectedSize.size && this.selectedSize.size.length > 4;
    this.priceError = !(this.selectedSize.price > 0);
    this.imageError = !/^https?:\/\/.+/i.test(this.selectedSize.image);
  }

  addSize() {
    this.validateInputs();

    if (this.nameError && this.nameLengthError && this.nameMaxLengthError && this.priceError && this.imageError) {
      this.notificationService.showError('Please correct errors before submitting.');
      return;
    }

    this.dishSizeService.addSize(this.selectedSize).subscribe(
      (newSize) => {
        this.sizes.push(newSize);
        this.sortSizes();
        this.toggleAddSizeForm();
        window.location.reload();
        this.notificationService.showSuccess('Size successfully created');
      },
      () => {
        this.notificationService.showError('Error creating size');
      }
    );
  }
  
  editSize() {
    this.validateInputs();

    if (this.nameError && this.nameLengthError && this.nameMaxLengthError && this.priceError && this.imageError) {
      this.notificationService.showError('Please correct errors before submitting.');
      return;
    }

    if (this.selectedSize.id) {
      this.dishSizeService.updateSize(this.selectedSize.id, this.selectedSize).subscribe(
        (updatedSize) => {
          const index = this.sizes.findIndex(size => size.id === updatedSize.id);
          if (index !== -1) {
            this.sizes[index] = updatedSize;
            this.sortSizes();
            this.toggleAddSizeForm();
          }
          this.notificationService.showSuccess('Changes successfully saved');
          window.location.reload();
        },
        () => {
          this.notificationService.showError('Error saving changes');
        }
      );
    }
  }
  
  deleteSize(sizeId: number) {
    this.dishSizeService.deleteSize(sizeId).subscribe(
      () => {
        this.sizes = this.sizes.filter((size) => size.id !== sizeId);
        this.notificationService.showSuccess('Size successfully deleted');
        this.sortSizes();
        this.closeDetails();
      },
      () => {
        this.notificationService.showError('Error deleting dish');
      }
    );
  }

  openSizeDetails(size: any) {
    this.selectedSize = size;
    this.showDetails = true;
  }
}
