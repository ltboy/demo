import { Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core'
import { ElDataPicker } from '../picker/picker'

export type DateModelItem = {
  month: number,
  year: number,
  yearRange: number[],
}

@Component({
  selector: 'el-data-picker-panel',
  templateUrl: './picker-panel.html'
})
export class ElDatePickerPanel implements OnInit, OnChanges {

  @Input() show: boolean = false
  @Input() width: number
  @Input() model: number
  @Input('hidden-day') hiddenDay: boolean = false
  @Input('panel-absolute') panelAbsolute: boolean = true
  @Input('panel-index') panelIndex: number = 200
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>()

  shortcuts: boolean = false
  showTime: boolean = false
  currentView: string = 'date'
  dateShowModels: DateModelItem

  constructor(
    @Optional() public root: ElDataPicker,
  ) {
  }

  showPicker(pickPath: string): void {
    this.currentView = pickPath
  }

  updateDate(): void {
    const date: Date = new Date(this.model)
    const startYear: number = ~~(date.getFullYear() / 10) * 10
    this.dateShowModels = {
      month: date.getMonth(),
      year: date.getFullYear(),
      yearRange: [startYear, startYear + 10],
    }
  }

  datePickChangeHandle(time: number): void {
    this.model = time
    console.log(time)
    this.modelChange.emit(time)
    this.updateDate()
  }

  monthPickChangeHandle(time: number): void {
    this.model = time
    // hidden day, only show month
    if (this.hiddenDay) {
      this.modelChange.emit(time)
    } else {
      this.currentView = 'date'
    }
    this.updateDate()
  }

  yearPickChangeHandle(time: number): void {
    this.model = time
    this.currentView = 'month'
    this.updateDate()
  }

  nextYear(step: number): void {
    // year table component opened, edit year range
    if (this.currentView === 'year') {
      step = step * 10
    }
    const date = new Date(this.model)
    date.setFullYear(this.dateShowModels.year + step)
    this.model = date.getTime()
    this.updateDate()
  }

  nextMonth(step: number): void {
    const date = new Date(this.model)
    date.setMonth(this.dateShowModels.month + step)
    this.model = date.getTime()
    this.updateDate()
  }

  ngOnInit(): void {
    // hidden day
    this.currentView = this.hiddenDay ? 'month' : 'date'
    this.model = this.model || Date.now()
    this.updateDate()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // not include model
    if (!changes || !changes.model) return
    // first change
    if (changes.model.isFirstChange()) return

    this.model = changes.model.currentValue
    this.model = this.model || Date.now()
    this.updateDate()
  }

}
