import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { DishComponent } from './pages/dish/dish.component';
import { IngridientsComponent } from './pages/ingridients/ingridients.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { PrivacyPoliceComponent } from './pages/privacy-police/privacy-police.component';
import { DishDescriptionComponent } from './pages/dish-description/dish-description.component';
import { SizesComponent } from './pages/sizes/sizes.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'Orders'
  },
  {
    path: 'dish/:id',
    component: DishDescriptionComponent,
  },
  {
    path: 'ingridient',
    component: IngridientsComponent,
    title: 'Ingridients'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile'
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    title: 'Contacts'
  },
  {
    path: 'privacy',
    component: PrivacyPoliceComponent,
  },
  {
    path: 'sizes',
    component: SizesComponent,
    title: 'Size'
  },
  { 
    path: '**', 
    component: HomeComponent,
    redirectTo: '' 
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
