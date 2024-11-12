import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from "./components/footer/footer.component";
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './components/notification/notification.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FontAwesomeModule, FooterComponent, HttpClientModule, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'shop';
}
