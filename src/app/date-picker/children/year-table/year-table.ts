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
  selector: 'app-year-table',
  templateUrl: './year-table.html'
})
export class YearTableComponent implements OnInit, OnChanges {
  @Input() showWeekNumber = false;
  @Input() model: number;
  @Input() 'disabled-date': any;
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>();

  date: Date;
  yearRows: number[][];
  currentYear: number;

  clickHandle(year: number): void {
    this.currentYear = year;
    this.date.setFullYear(year);
    this.modelChange.emit(this.date.getTime());
  }

  updateYearRow(currentYear: number): number[][] {
    const startYear: number = Math.floor(Math.abs(currentYear));
    return [[], [], []].map((v, index) =>
      [0, 1, 2, 3].map(num => startYear + index * 4 + num)
    );
  }

  ngOnInit(): void {
    this.date = new Date(this.model);
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
