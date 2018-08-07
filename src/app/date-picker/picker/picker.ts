import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { DateFormat } from '../utils/format';

@Component({
  selector: 'app-date-picker',
  providers: [DateFormat],
  templateUrl: './picker.html'
})
export class DataPickerComponent implements OnInit, OnDestroy {
  showPanelPicker = false;
  value = new Date().getTime();
  _model = '';
  globalClickListener: Function;
  globalKeydownListener: Function;
  iconShowClose = false;
  fouce = false;
  @Input() readonly = false;
  @Input() editable = true;
  @Input() clearable = true;

  @Input() minTime: string;
  @Input() maxTime: string;
  @Input() type = 'date'; // enum: year/month/date/week/datetime/datetimerange/daterange
  @Input() placeholder = '选择日期';
  @Input() format = 'yyyy-MM-dd';
  @Input() hiddenDay = false;
  @Input() disabledDate;
  // @Input() disabledDateFilter: Function

  @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() clearClick: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() iconClick: EventEmitter<Event> = new EventEmitter<Event>();

  @Input()
  set model(val: any) {
    if (val !== 0 && !val) {
      return;
    }
    this._model = val;
  }
  @Input() elDisabled = false;

  constructor(private dateFormat: DateFormat, private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {}

  iconClickHandle(e: Event): void {
    if (this.elDisabled) {
      return;
    }
    // use close action
    if (this.iconShowClose) {
      this.clearClick.emit(e);
      this._model = null;
      this.value = Date.now();
      this.showPanelPicker = false;
      this.iconShowClose = false;
      return;
    }
    // toggle action
    this.showPanelPicker = !this.showPanelPicker;
  }

  propagationHandle(event: Event): void {
    event.stopPropagation();
  }
  // text to time
  changeHandle(input: any): void {
    const time: number = this.dateFormat.getTime(input.target.value);
    // if (!time) {return}
    this.value = time;
    this._model = input.target.value;
  }
  // try update input value
  // always trigger emit
  tryUpdateText(): void {
    if (!this.value) {
      this._model = '';
      this.modelChange.emit(null);
      this.showPanelPicker = false;
      return;
    }
    const modelTime: number = new Date(this._model).getTime();
    const time: number = this.dateFormat.getTime(this.value);
    this.dateChangeHandle(time ? this.value : modelTime);
  }

  dateChangeHandle(time: number): void {
    this._model = DateFormat.moment(time, this.format);
    this.value = new Date(this._model).getTime();
    if (this.value < new Date(this.minTime).getTime() && this.value > new Date(this.maxTime).getTime()) {
      this.value = null;
      this._model = '';
      // this.changeDetectorRef.detectChanges()
      this.showPanelPicker = false;
      return;
    }
    this.modelChange.emit(this._model);
    this.showPanelPicker = false;
  }

  focusHandle(): void {
    this.showPanelPicker = true;
    this.fouce = true;
    this.globalKeydownListener && this.globalKeydownListener();
    this.globalKeydownListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (event.keyCode === 9 || event.keyCode === 27) {
          this.showPanelPicker = false;
          this.globalKeydownListener && this.globalKeydownListener();
        }
        if (event.keyCode === 13) {
          this.tryUpdateText();
        }
        this.showPanelPicker = true;

      }
    );
  }
  blurHandle(event): void {
    this.fouce = false;
  }
  // text to time
  ngOnInit(): void {
    this.globalClickListener = this.renderer.listen('document', 'click', () => {
      if (this.fouce) {
        return;
      }
      if (!this.showPanelPicker) {
        return;
      }
      this.showPanelPicker = false;
      this.tryUpdateText();
    });
    // init value
    const time: number = this.dateFormat.getTime(this._model);
    if (!time) {
      return;
    }
    this._model = DateFormat.moment(time, this.format);
    this.value = time;
  }

  ngOnDestroy(): void {
    this.globalClickListener && this.globalClickListener();
    this.globalKeydownListener && this.globalKeydownListener();
  }

  writeValue(value: any): void {
    this._model = value;
  }
}
