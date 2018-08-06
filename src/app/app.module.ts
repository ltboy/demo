import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';

import { DatepickerModule } from './date-picker/datepicker.module';
import { TestComponent } from './test/test.component'
@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    TestComponent,

  ],
  imports: [
    BrowserModule,
    DatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
