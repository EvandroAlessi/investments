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
import { INVESTMENT_TYPE_NAME } from '../../consts/investment-name.const';
import { InvestmentType } from '../../enums/investment-type.enum';
import { DistributedBy } from '../../enums/distributed-by.enum';
import { InvestmentService } from '../../services/investment.service';
import { Investment } from '../../models/investment.model';
import { SynchronyService } from '../../services/synchrony.service';

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
  selector: 'investments-fund-distribution-chart',
  templateUrl: './fund-distribution-chart.component.html',
  styleUrls: ['./fund-distribution-chart.component.scss']
})
export class FoundsDistributionChartComponent implements OnInit, AfterContentInit {
  @ViewChild("chart") chart!: ChartComponent;

  chartOptions: ChartOptions | undefined;
  chartType: ChartType = 'bar';
  distributedBy: DistributedBy = DistributedBy.Amount;

  constructor(private investmentService: InvestmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private synchronyService: SynchronyService) { }

  ngOnInit(): void {
    this.synchronyService
      .updateChartChannel()
      .subscribe(async () => await this.buildChart());
  }

  async ngAfterContentInit(): Promise<void> {
    await this.buildChart();
  }

  async distributedByChanged(value: number): Promise<void> {
    this.distributedBy = value;

    await this.buildChart();
  }

  private async buildChart(): Promise<void> {
    const projectedData = await this.buildChartData(true);
    const currentData = await this.buildChartData(false);

    let maxValue = Math.max(...projectedData);
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
          data: projectedData,
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
              click: async function (chart, options, e) {
                if (that.chartType == 'bar') {
                  return;
                }

                that.chartType = 'bar';
                await that.buildChart();

                that.changeDetectorRef.detectChanges();
              }
            },
            {
              icon: '<svg xmlns="http://www.w3.org/2000/svg" height="16" fill="white" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>',
              index: 1,
              title: 'Line Chart',
              class: 'line-chart-icon',
              click: async function (chart, options, e) {
                if (that.chartType == 'line') {
                  return;
                }

                that.chartType = 'line';
                await that.buildChart();

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
          INVESTMENT_TYPE_NAME[InvestmentType.internacional],
          INVESTMENT_TYPE_NAME[InvestmentType.crypto]
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
          text: DistributedBy[this.distributedBy],
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

  private async buildChartData(isInvestmentProjection: boolean): Promise<number[]> {
    const data: number[] = [];

    var investment = await this.investmentService.getInvestment(isInvestmentProjection);

    if (!this.isSameDistributedBy(investment)) {
      investment = await this.convertInvestment(investment, isInvestmentProjection);
    }

    data.push(~~investment.fixedIncome);
    data.push(~~investment.realState);
    data.push(~~investment.stockExchange);
    data.push(~~investment.internacional);
    data.push(~~investment.crypto);

    return data;
  }

  private async convertInvestment(investment: Investment, isInvestmentProjection: boolean): Promise<Investment> {
    if (this.distributedBy == DistributedBy.Amount) {
      return {
        id: investment.id,
        fixedIncome: await this.investmentService.convertAvailableFundToAmout(investment.fixedIncome, true),
        realState: await this.investmentService.convertAvailableFundToAmout(investment.realState, true),
        stockExchange: await this.investmentService.convertAvailableFundToAmout(investment.stockExchange, true),
        internacional: await this.investmentService.convertAvailableFundToAmout(investment.internacional, true),
        crypto: await this.investmentService.convertAvailableFundToAmout(investment.crypto, true),
        distributedBy: DistributedBy.Amount,
        isProjection: isInvestmentProjection
      };
    }

    return {
      id: investment.id,
      fixedIncome: await this.investmentService.convertAvailableToPercentage(investment.fixedIncome,),
      realState: await this.investmentService.convertAvailableToPercentage(investment.realState),
      stockExchange: await this.investmentService.convertAvailableToPercentage(investment.stockExchange),
      internacional: await this.investmentService.convertAvailableToPercentage(investment.internacional),
      crypto: await this.investmentService.convertAvailableToPercentage(investment.crypto),
      distributedBy: DistributedBy.Amount,
      isProjection: isInvestmentProjection
    };
  }

  private isSameDistributedBy(investment: Investment): boolean {
    if (this.distributedBy == DistributedBy.Amount
      && investment.distributedBy == DistributedBy.Amount) {
      return true;
    }

    return this.distributedBy == DistributedBy.Percentage
      && investment.distributedBy == DistributedBy.Percentage;
  }

  private getChartMaxValue(maxAmountValue: number): number {
    if (this.distributedBy == DistributedBy.Percentage) {
      return 100;
    }

    return ~~(maxAmountValue * 110 / 100);
  }
}
