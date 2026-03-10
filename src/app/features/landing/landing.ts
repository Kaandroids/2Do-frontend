import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  mobileMenuOpen = signal(false);

  toggleMenu() {
    this.mobileMenuOpen.update(v => !v);
  }
}
