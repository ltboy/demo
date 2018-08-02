import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detepick',
  templateUrl: './detepick.component.html',
  styleUrls: ['./detepick.component.scss']
})
export class DetepickComponent implements OnInit {

  constructor() { }
  today: Date
  ngOnInit() {
    this.today = new Date()
  }
  selectDate() {
    console.log(this.today)
  }
}
