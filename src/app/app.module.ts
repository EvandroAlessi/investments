import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FundComponent } from './pages/investments-distribution/fund/fund.component';
import { FundDistributionComponent } from './pages/investments-distribution/fund-distribution/fund-distribution.component';
import { FundsDistributionTableComponent } from './pages/investments-distribution/fund-distribution-table/fund-distribution-table.component';
import { InvestmentsDistributionComponent } from './pages/investments-distribution/investments-distribution.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSelectModule } from '@angular/material/select';
import { FormFieldComponent } from './pages/investments-distribution/form-field/form-field.component';
import { FundsDistributionChartComponent } from './pages/investments-distribution/fund-distribution-chart/fund-distribution-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StepperNavegationComponent } from './components/stepper-navegation/stepper-navegation.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    FundComponent,
    FundDistributionComponent,
    FundsDistributionTableComponent,
    InvestmentsDistributionComponent,
    FormFieldComponent,
    FundsDistributionChartComponent,
    StepperNavegationComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    CurrencyMaskModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSelectModule,
    NgApexchartsModule,
    NavBarComponent
  ],
  providers: [
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
