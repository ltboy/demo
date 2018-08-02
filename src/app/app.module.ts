import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { DetepickComponent } from './detepick/detepick.component';
import { ElDateModule } from './date-picker/module'
@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    DetepickComponent
  ],
  imports: [
    BrowserModule,
    ElDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
