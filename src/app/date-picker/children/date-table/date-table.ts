import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DateFormat } from '../../utils/format';

export interface DateRowItem {
  day: number; // day value
  monthOffset: number; // current: 0, nextMonth: 1, lastMonth: -1
  status:boolean
}
export type DateRow = DateRowItem[];

@Component({
  selector: 'app-date-table',
  providers: [DateFormat],
  templateUrl: './date-table.html'
})
export class DateTableComponent implements OnInit, OnChanges {
  @Input() model: number;
  @Input()
  set minTime(val: string) {
    if (val) {
      this.selfMinTime = new Date(val);
    }
  }
  @Input()
  set maxTime(val: string) {
    if (val) {
      this.selfMaxTime = new Date(val);
    }
  }
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  weeks: string[] = ['日', '一', '二', '三', '四', '五', '六'];
  tableRows: DateRow[] = [[], [], [], [], [], []];
  targetDay: number;
  selfMinTime: Date;
  selfMaxTime: Date;
  targetMonthOffset = 0; // default: current month, offset = 0
  date: Date;
  today: number;
  currentMonthOffset: number;

  private BuildMonthStartRow(first: number, lastCount: number): DateRowItem[] {
    let lastday: number = 7 - first;
    // first loop
    lastCount++;
    lastday++;
    return [0, 1, 2, 3, 4, 5, 6]
      .map(() => {
        lastday--;
        if (lastday > 0) {
          return { day: lastday, monthOffset: 0,status:this.isDisable({day: lastday, monthOffset: 0})};
        }
        lastCount--;
        return { day: lastCount, monthOffset: -1,status:this.isDisable({day: lastCount, monthOffset: -1}) };
      })
      .reverse();
  }

  isToday(item: DateRowItem): boolean {
    if (this.currentMonthOffset === null) {
      return false;
    }
    return (
      item.monthOffset === this.currentMonthOffset && this.today === item.day
    );
  }

  isTargetDay(item: DateRowItem): boolean {
    return (
      item.monthOffset === this.targetMonthOffset && item.day === this.targetDay
    );
  }
  isDisable(item): boolean {

    const date = this.getDate(item)
    const time = date.getTime();
    // console.log('date', new Date(time).toLocaleString())
    return this.compareDate(time)
  }
  compareDate(time){
    if (this.selfMaxTime && this.selfMaxTime.getTime() < time) {
      return true;
    }

    if(this.selfMinTime){

    }
    if (this.selfMinTime && this.selfMinTime.getTime() > time ) {
     
      return true;
    }
    return false;
  }
  getDate(item){
    const date = new Date(this.date);
    const currentMonth = date.getMonth() + 1;
    const targetMonth = currentMonth + item.monthOffset;

    // get time and emit a number
    date.setMonth(targetMonth - 1);
    date.setDate(item.day);

    return date
  }
  clickHandle(item: DateRowItem): void {
    const date = this.getDate(item)
    const time = date.getTime()
    if(item.status){
      return
    }
     // update target and update view
     this.targetDay = item.day;
     this.targetMonthOffset = item.monthOffset;

    this.modelChange.emit(time);
  }

  getRows(): void {
    const date = this.date;
    this.targetDay = date.getDate();
    this.today = new Date().getDate();
    this.currentMonthOffset = DateFormat.getCurrentMonthOffset(date);

    const lastMonth: number = date.getMonth() - 1;
    const lastYear: number =
      lastMonth < 0 ? date.getFullYear() - 1 : date.getFullYear();
    const currentMonthdayCount: number = DateFormat.getDayCountOfMonth(
      date.getFullYear(),
      date.getMonth()
    );
    const lastMonthDayCount: number = DateFormat.getDayCountOfMonth(
      lastYear,
      lastMonth < 0 ? 12 : lastMonth
    );
    const firstDay: number = DateFormat.getFirstDayOfMonth(date);

    let nextMonthDay = 0;
    let rowItem;
    this.tableRows = this.tableRows.map((row, index) => {
      if (index === 0) {
        return this.BuildMonthStartRow(
          firstDay,
          lastMonthDayCount
        );
      }
      const thisWeekFirstDay = 7 - firstDay + 7 * (index - 1);
      return new Array(7).fill(0).map((v, i) => {
        const start = thisWeekFirstDay + i + 1;
        if (start <= currentMonthdayCount) {
          return { day: start, monthOffset: 0,status:this.isDisable({day: start, monthOffset: 0}) };
        }
        nextMonthDay++;
        return { day: nextMonthDay, monthOffset: 1,status:this.isDisable({day: start, monthOffset: 1}) };
      });
    });
  }

  ngOnInit(): void {
    this.date = new Date(this.model);
    this.getRows();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.date = new Date(this.model)||new Date();
    this.getRows();
  }
}
