import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ChartType
} from "ng-apexcharts";
import { INVESTMENT_TYPE_NAME } from '../consts/investment-name.const';
import { InvestmentType } from '../enums/investment-type.enum';
import { DistributedBy } from '../enums/distributed-by.enum';
import { InvestmentService } from '../services/investment.service';
import { InvestmentDistribution } from '../models/investment-distribution.model';
import { StateService } from '../services/state.service';
import { SynchronyService } from '../services/synchrony.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'investments-founds-distribution-chart',
  templateUrl: './founds-distribution-chart.component.html',
  styleUrls: ['./founds-distribution-chart.component.scss']
})
export class FoundsDistributionChartComponent implements OnInit, AfterContentInit {
  @ViewChild("chart") chart!: ChartComponent;

  chartOptions: ChartOptions | undefined;
  chartType: ChartType = 'bar';
  bySelected: DistributedBy = DistributedBy.Amount;

  constructor(private investmentService: InvestmentService,
    private stateService: StateService,
    private changeDetectorRef: ChangeDetectorRef,
    private synchronyService: SynchronyService) { }

  ngOnInit(): void {
    this.synchronyService
      .updateChartChannel()
      .subscribe(() => this.buildChart());
  }

  ngAfterContentInit(): void {
    this.buildChart();
  }

  bySelectedChanged(value: number) {
    this.bySelected = value;

    this.buildChart();
  }

  private buildChart(): void {
    const expectationData = this.buildChartData(true);
    const currentData = this.buildChartData(false);

    let maxValue = Math.max(...expectationData);
    const currentMax = Math.max(...currentData);

    if (currentMax > maxValue) {
      maxValue = currentMax;
    }

    const that = this;

    this.chartOptions = {
      series: [
        {
          name: "Current",
          data: currentData,
        },
        {
          name: "Expected",
          data: expectationData,
        }
      ],
      chart: {
        height: 350,
        type: this.chartType,
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: .5
        },
        animations: {
          enabled: true,
          animateGradually: {
            enabled: true,
            delay: 300
          }
        },
        toolbar: {
          show: true,
          offsetX: 12,
          tools: {
            zoom: false,
            zoomin: false,
            zoomout: false,
            selection: false,
            pan: false,
            reset: false,
            download: false,
            customIcons: [{
              icon: '<svg xmlns="http://www.w3.org/2000/svg" height="16" fill="white" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"/></svg>',
              index: 0,
              title: 'Bar Chart',
              class: 'bar-chart-icon',
              click: function (chart, options, e) {
                if (that.chartType == 'bar') {
                  return;
                }

                that.chartType = 'bar';
                that.buildChart();

                that.changeDetectorRef.detectChanges();
              }
            },
            {
              icon: '<svg xmlns="http://www.w3.org/2000/svg" height="16" fill="white" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>',
              index: 1,
              title: 'Line Chart',
              class: 'line-chart-icon',
              click: function (chart, options, e) {
                if (that.chartType == 'line') {
                  return;
                }

                that.chartType = 'line';
                that.buildChart();

                that.changeDetectorRef.detectChanges();
              }
            }]
          }
        }
      },
      colors: ["#c2185b", "#77B6EA"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Current Vs Expected",
        align: "center",
        style: {
          color: 'white'
        }
      },
      grid: {
        borderColor: "#212121bf",
        row: {
          colors: ["#212121bf", "transparent"],
          opacity: 0.5
        }
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [
          INVESTMENT_TYPE_NAME[InvestmentType.fixedIncome],
          INVESTMENT_TYPE_NAME[InvestmentType.realState],
          INVESTMENT_TYPE_NAME[InvestmentType.stockExchange],
          INVESTMENT_TYPE_NAME[InvestmentType.crypto],
          INVESTMENT_TYPE_NAME[InvestmentType.internacional]
        ],
        // title: {
        //   text: "Investment Type",
        //   style: {
        //     color: 'white'
        //   }
        // },
        labels: {
          style: {
            colors: 'white'
          }
        }
      },
      yaxis: {
        title: {
          text: DistributedBy[this.bySelected],
          style: {
            color: 'white'
          }
        },
        min: 0,
        max: this.getChartMaxValue(maxValue),
        labels: {
          style: {
            colors: 'white'
          },
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: ['white', 'white']
        }
      }
    };
  }

  private buildChartData(isExpected: boolean): number[] {
    const data: number[] = [];

    const investmentDistribution = this.investmentService.getInvestmentDistribution(isExpected);

    if (this.isSameDistributedBy(investmentDistribution)) {
      data.push(~~investmentDistribution.fixedIncome);
      data.push(~~investmentDistribution.realState);
      data.push(~~investmentDistribution.stockExchange);
      data.push(~~investmentDistribution.crypto);
      data.push(~~investmentDistribution.internacional);

      return data;
    }

    if (this.bySelected == DistributedBy.Amount) {
      data.push(this.investmentService.convertToAmout(investmentDistribution.fixedIncome));
      data.push(this.investmentService.convertToAmout(investmentDistribution.realState));
      data.push(this.investmentService.convertToAmout(investmentDistribution.stockExchange));
      data.push(this.investmentService.convertToAmout(investmentDistribution.crypto));
      data.push(this.investmentService.convertToAmout(investmentDistribution.internacional));

      return data;
    }

    data.push(this.investmentService.convertToPercentage(investmentDistribution.fixedIncome));
    data.push(this.investmentService.convertToPercentage(investmentDistribution.realState));
    data.push(this.investmentService.convertToPercentage(investmentDistribution.stockExchange));
    data.push(this.investmentService.convertToPercentage(investmentDistribution.crypto));
    data.push(this.investmentService.convertToPercentage(investmentDistribution.internacional));

    return data;
  }

  private isSameDistributedBy(investmentDistribution: InvestmentDistribution): boolean {
    if (this.bySelected == DistributedBy.Amount
      && investmentDistribution.distributedBy == DistributedBy.Amount) {
      return true;
    }

    return this.bySelected == DistributedBy.Percentage
      && investmentDistribution.distributedBy == DistributedBy.Percentage;
  }

  private getChartMaxValue(maxAmountValue: number): number {
    if (this.bySelected == DistributedBy.Percentage) {
      return 100;
    }

    return ~~(maxAmountValue * 110 / 100);
  }
}
