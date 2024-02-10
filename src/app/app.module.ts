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
import { FoundsComponent } from './components/founds/founds.component';
import { FoundsAllocationComponent } from './components/founds-allocation/founds-allocation.component';
import { FoundsDistributionComponent } from './components/founds-distribution/founds-distribution.component';
import { FoundsStepperComponent } from './components/founds-stepper/founds-stepper.component';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSelectModule } from '@angular/material/select';
import { FormFieldBuilderComponent } from './components/form-field-builder/form-field-builder.component';
import { FoundsDistributionChartComponent } from './components/founds-distribution-chart/founds-distribution-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StepperNavegationComponent } from './components/stepper-navegation/stepper-navegation.component';

@NgModule({
  declarations: [
    AppComponent,
    FoundsComponent,
    FoundsAllocationComponent,
    FoundsDistributionComponent,
    FoundsStepperComponent,
    FormFieldBuilderComponent,
    FoundsDistributionChartComponent,
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
    NgApexchartsModule
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