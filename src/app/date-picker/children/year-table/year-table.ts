import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

interface YearRows {
  value: number;
  status: boolean;
}
@Component({
  selector: 'app-year-table',
  templateUrl: './year-table.html'
})
export class YearTableComponent implements OnInit, OnChanges {
  @Input() showWeekNumber = false;
  @Input() model: number;
  @Input() minTime: string;
  @Input() maxTime: string;
  @Input() disabledDate: string;
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>();

  date: Date;
  yearRows: YearRows[][];
  currentYear: number;

  clickHandle(year: number, isDisable: boolean): void {
    if (isDisable) {
      return;
    }
    this.currentYear = year;
    this.date.setFullYear(year);
    this.modelChange.emit(this.date.getTime());
  }

  isDisable(year): boolean {
    if (this.minTime && new Date(this.minTime).getFullYear() > year) {
      return true;
    }
    if (this.maxTime && new Date(this.maxTime).getFullYear() < year) {
      return true;
    }
    return false;
  }

  updateYearRow(currentYear: number): YearRows[][] {
    console.log(this.currentYear);
    const startYear: number = Math.floor(Math.abs(currentYear));
    return [[], [], []].map((v, index) =>
      [0, 1, 2, 3].map(num => {
        const year = startYear + index * 4 + num;
        return { value: year, status: this.isDisable(year) };
      })
    );
  }

  ngOnInit(): void {
    this.date = new Date(this.model);
    console.log('year',this.date)
    this.currentYear = this.date.getFullYear();
    this.yearRows = this.updateYearRow(this.currentYear);
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
    this.currentYear = this.date.getFullYear();
    this.yearRows = this.updateYearRow(this.currentYear);
  }
}
