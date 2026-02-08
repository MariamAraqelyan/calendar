import {
  Component,
  inject,
} from '@angular/core';
import { CalendarStore } from '../services/calendar.store';



@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.html',
  imports: [],
  providers: [CalendarStore],
  styleUrl: './main.scss'
})
export class Main {
  readonly store = inject(CalendarStore);

  viewState = this.store.view;
  currentDate = this.store.currentDate;
  configState = this.store.config;
}
