import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InvestmentType } from '../../enums/investment-type.enum';
import { INVESTMENT_TYPE_NAME } from '../../consts/investment-name.const';
import { InvestmentService } from '../../services/investment.service';
import { DistributedBy } from '../../enums/distributed-by.enum';
import { Subject } from 'rxjs'

@Component({
  selector: 'investments-founds-allocation',
  templateUrl: './founds-allocation.component.html',
  styleUrls: ['./founds-allocation.component.scss']
})
export class FoundsAllocationComponent implements OnInit {
  investmentType = InvestmentType;
  INVESTMENT_NAME = INVESTMENT_TYPE_NAME;
  bySelected = DistributedBy.Amount;
  updateMessages =  new Subject<boolean>();

  @Input()
  isExpected: boolean = false;

  @Output()
  hasChanges = new EventEmitter<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private investmentService: InvestmentService) { }

  ngOnInit(): void {
    if (this.isExpected) {
      this.bySelected = DistributedBy.Percentage;
    }
  }

  emitChanges() {
    this.hasChanges.emit();

    this.updateMessages.next(true);
  }

  async bySelectedChanged(value: number) {
    this.bySelected = value;

    await this.investmentService.clearInvestmentDistribution(this.isExpected, this.bySelected);

    this.hasChanges.emit();
    this.changeDetectorRef.detectChanges();
  }
}
