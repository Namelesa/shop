import { Component, importProvidersFrom, Input } from '@angular/core';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-dish',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.scss'
})
export class DishComponent {
  @Input() dish: any;

  buyDish(): void {
    console.log(`Buying ${this.dish.name}`);
  }
}
