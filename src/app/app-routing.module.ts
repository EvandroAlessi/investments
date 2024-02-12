import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentsDistributionComponent } from './pages/investments-distribution/investments-distribution.component';

const routes: Routes = [{
  path: 'investments-distribution',
  component: InvestmentsDistributionComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
