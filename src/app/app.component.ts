import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DishComponent } from "./pages/dish/dish.component";
import { HeaderComponent } from "./components/header/header.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from "./components/footer/footer.component";
import { PrivacyPoliceComponent } from "./pages/privacy-police/privacy-police.component";
import { ContactsComponent } from "./pages/contacts/contacts.component";
import { TermsComponent } from "./pages/terms/terms.component";
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DishComponent, HeaderComponent, FontAwesomeModule, FooterComponent, PrivacyPoliceComponent, ContactsComponent, TermsComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'shop';
}
