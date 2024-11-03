import { Component } from '@angular/core';

@Component({
  selector: 'app-ingridients',
  standalone: true,
  imports: [],
  templateUrl: './ingridients.component.html',
  styleUrl: './ingridients.component.scss'
})
export class IngridientsComponent {
  ingridients = [
    { name: 'Спагетти Болоньезе', price: 12.99, dishSizeId: 1 , SizeName : 'M', ingridients: ['1', '2', '3']},
    { name: 'Пицца Маргарита', price: 9.99, dishSizeId: 2 , SizeName : 'S', ingridients: ['1', '2', '3']},
    { name: 'Салат Цезарь', price: 7.99, dishSizeId: 1 , SizeName : 'L', ingridients: ['1', '2', '3']},
    { name: 'Салат Цезарь', price: 7.99, dishSizeId: 1 , SizeName : 'XL', ingridients: ['1', '2', '3']},
    { name: 'Салат Цезарь', price: 7.99, dishSizeId: 1 , SizeName : 'S', ingridients: ['1', '2', '3']},
    { name: 'Салат Цезарь', price: 7.99, dishSizeId: 1 , SizeName : 'M', ingridients: ['1', '2', '3']},
  ];
}
