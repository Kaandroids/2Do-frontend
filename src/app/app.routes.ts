import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login'
import {Dashboard} from './features/dashboard/dashboard/dashboard';
import {Register} from './features/auth/register/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'register', component: Register },
  { path: '**', redirectTo: 'login' }
];
