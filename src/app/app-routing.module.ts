import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentsDistributionComponent } from './pages/investments-distribution/investments-distribution.component';
import { GoalsComponent } from './pages/goals/goals.component';

const routes: Routes = [
  {
    path: 'investments-distribution',
    component: InvestmentsDistributionComponent
  },
  {
    path: 'goals',
    component: GoalsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
