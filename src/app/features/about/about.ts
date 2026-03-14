import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
