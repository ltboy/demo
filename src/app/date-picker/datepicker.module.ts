import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataPickerComponent } from './picker/picker';
import { DatePickerPanelComponent } from './picker-panel/picker-panel';
import { DateTableComponent } from './children/date-table/date-table';
import { YearTableComponent } from './children/year-table/year-table';
import { MonthTableComponent } from './children/month-table/month-table';

@NgModule({
  declarations: [
    DataPickerComponent,
    DatePickerPanelComponent,
    DateTableComponent,
    YearTableComponent,
    MonthTableComponent
  ],
  exports: [
    DataPickerComponent,
    DatePickerPanelComponent,
    DateTableComponent,
    YearTableComponent,
    MonthTableComponent
  ],
  imports: [CommonModule, FormsModule],
  entryComponents: [DateTableComponent, YearTableComponent, MonthTableComponent]
})
export class DatepickerModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: DatepickerModule, providers: [] };
  }
}
