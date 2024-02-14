import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EventType, Router, RouterModule } from '@angular/router';
import { NavItem } from 'src/app/models/nav-item.model';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SynchronyService } from 'src/app/services/synchrony.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'investments-nav-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    CommonModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  breadcrumbIcon = '&nbsp;&nbsp;';
  currentNavegationTitle: string | undefined;
  $isLoadingContent = this.synchronyService.isLoadingContent();

  navItems = Array.from<NavItem>([
    {
      link: 'investments-distribution',
      title: 'Investment Distribution',
      icon: 'show_chart',
      selected: false,
    },
    {
      link: 'goals',
      title: 'Goals',
      icon: 'rocket',
      selected: false,
    },
    { // last
      link: '.',
      title: 'Logout',
      icon: 'logout',
      selected: false,
    },
  ]);

  constructor(private router: Router,
    private synchronyService: SynchronyService) {
    this.subscribeToRouteEvents();
  }

  private subscribeToRouteEvents(): void {
    this.router.events.subscribe(routerEvent => {
      if (routerEvent.type == EventType.NavigationStart) {
        this.synchronyService.setIsLoadingContent(true);

        const navegations = routerEvent.url
          .toString()
          .split('/')
          .filter(str => str);

        this.currentNavegationTitle = undefined;

        for (const navegation of navegations) {
          const title = this.breadcrumbIcon + this.getNavegationTitle(navegation);

          if (!this.currentNavegationTitle) {
            this.currentNavegationTitle = title;

            continue;
          }

          this.currentNavegationTitle += title;
        }
      }
    });
  }

  private getNavegationTitle(link: string): string {
    var title = '';

    for (const item of this.navItems) {
      item.selected = false;

      if (item.link === link) {
        item.selected = true;

        title = item.title;
      }
    }

    return title;
  }
}
