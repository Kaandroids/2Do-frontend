import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, Navbar, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
