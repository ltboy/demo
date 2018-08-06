import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { DatePickerProps } from '../picker-props';
import { DateFormat } from '../utils/format';

@Component({
  selector: 'app-date-picker',
  providers: [
    DateFormat
  ],
  templateUrl: './picker.html'
})
export class DataPickerComponent extends DatePickerProps
  implements OnInit, OnDestroy{
  showPanelPicker = false;
  value: number;
  model = '';
  fouce = false
  iconShowClose = false;

  constructor(private dateFormat: DateFormat, private renderer: Renderer2) {
    super();
  }

  iconClickHandle(e: Event): void {
    if (this.elDisabled) {
      return;
    }
    // use close action
    if (this.iconShowClose) {
      this.clearClick.emit(e);
      this.model = null;
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
  }
  // try update input value
  // always trigger emit
  tryUpdateText(): void {
    if (!this.value) {
      this.model = null;
      this.modelChange.emit(null);
      this.showPanelPicker = false;
      return;
    }
    const modelTime: number = new Date(this.model).getTime();
    const time: number = this.dateFormat.getTime(this.value);
    this.dateChangeHandle(time ? this.value : modelTime);
  }

  dateChangeHandle(time: number): void {
    this.model = DateFormat.moment(time, this.format);
    this.value = new Date(this.model).getTime();
    this.modelChange.emit(this.model);
    this.showPanelPicker = false;
  }

  focusHandle(): void {
    this.fouce = true
    this.showPanelPicker = true;
    this.globalKeydownListener && this.globalKeydownListener();
    this.globalKeydownListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        console.log(12312);
        if (event.keyCode === 9 || event.keyCode === 27) {
          this.showPanelPicker = false;
          this.globalKeydownListener && this.globalKeydownListener();
        }
        if (event.keyCode === 13) {
          this.tryUpdateText();
        }
      }
    );
  }
  blurHandle(): void {
    this.fouce = false;
  }
  // text to time
  ngOnInit(): void {
    this.globalClickListener = this.renderer.listen('document', 'click', () => {
      if (this.fouce) {
        return
      }
      if (!this.showPanelPicker) {
        return;
      }
      this.showPanelPicker = false;
    });
    // init value
    const time: number = this.dateFormat.getTime(this.model);
    if (!time) {
      return;
    }
    this.model = DateFormat.moment(time, this.format);
    this.value = time;
  }

  ngOnDestroy(): void {
    this.globalClickListener && this.globalClickListener();
    this.globalKeydownListener && this.globalKeydownListener();
  }
}
