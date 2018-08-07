import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-month-table',
  templateUrl: './month-table.html'
})
export class MonthTableComponent implements OnInit, OnChanges {
  @Input() showWeekNumber = false;
  @Input() model: number;
  @Input() minTime: string;
  @Input() maxTime: string;
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>();

  currentMonth: number;
  date: Date;

  monthRows: any[] = [
    ['1月', '2月', '3月', '4月'],
    ['5月', '6月', '7月', '8月'],
    ['9月', '10月', '11月', '12月']
  ];

  clickHandle(i: number, k: number): void {
    if (this.isDisable(i, k)) {return; }
    const monthID = 4 * i + k;
    this.currentMonth = monthID;
    this.date.setMonth(monthID);
    this.modelChange.emit(this.date.getTime());
  }
  isCurrentMonth(i: number, k: number): boolean {
    if (this.isDisable(i, k)) {return false; }
    return this.currentMonth === 4 * i + k;
  }
  isDisable(i: number, k: number): boolean {
    if (!this.minTime && !this.maxTime) {
      return false;
    }
    const monthID = 4 * i + k;
    const year = this.date.getFullYear();

    if (this.minTime) {
      const min = new Date(this.minTime);
      if (min.getFullYear() > year || (min.getFullYear() === year && min.getMonth() > monthID)) {
        return true;
      }
    }
    if (this.maxTime) {
      const max = new Date(this.maxTime);
      if (max.getFullYear() > year || (max.getFullYear() === year && max.getMonth() > monthID)) {
        return true;
      }
    }
    return false;
  }
  ngOnInit(): void {
    this.date = new Date(this.model);
    this.currentMonth = this.date.getMonth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // not include model
    if (!changes || !changes.model) {
      return;
    }
    // first change
    if (changes.model.isFirstChange()) {
      return;
    }

    this.model = changes.model.currentValue;
    this.date = new Date(this.model);
    this.currentMonth = this.date.getMonth();
  }
}
