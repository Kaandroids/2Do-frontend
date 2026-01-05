import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login'
import {Dashboard} from './features/dashboard/dashboard/dashboard';
import {Register} from './features/auth/register/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, title: '2Do | Welcome' },
  { path: 'dashboard', component: Dashboard, title: '2Do | My Dashboard' },
  { path: 'register', component: Register, title: '2Do | Register' },
  { path: '**', redirectTo: 'login' }
];
