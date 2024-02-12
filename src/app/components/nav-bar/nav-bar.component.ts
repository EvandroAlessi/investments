import { ChangeDetectorRef, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'investments-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  fillerNav = Array.from([
    {
      link: 'investments-distribution',
      text: 'Investment Distribution'
    },
    {
      link: '.',
      text: 'Logout'
    },
  ]);

  constructor(changeDetectorRef: ChangeDetectorRef) {
  }
}
