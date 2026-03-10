import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Register } from './features/auth/register/register/register';
import { Landing } from './features/landing/landing';

export const routes: Routes = [
  { path: '', component: Landing, title: '2Do | AI-Powered Task Manager' },
  { path: 'login', component: Login, title: '2Do | Welcome' },
  { path: 'dashboard', component: Dashboard, title: '2Do | My Dashboard' },
  { path: 'register', component: Register, title: '2Do | Register' },
  { path: '**', redirectTo: '' }
];
