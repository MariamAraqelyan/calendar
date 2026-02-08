import {
  Component,
  computed,
  contentChild,
  effect,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { CalendarStore } from '../services/calendar.store';
import { CalendarConfig, CalendarEvent, CalendarView } from '../models/calendar.models';
import { Monthly } from '../views/monthly/monthly';
import { Weekly } from '../views/weekly/weekly';
import { Daily } from '../views/daily/daily';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.html',
  imports: [
    Monthly,
    Daily,
    Weekly
  ],
  providers: [CalendarStore],
  styleUrl: './main.scss'
})
export class Main {
  protected readonly store = inject(CalendarStore);

  view = input<CalendarView>('month');
  events = input<readonly CalendarEvent[]>([]);
  config = input<Partial<CalendarConfig>>({});

  viewChanged = output<CalendarView>();
  dateClicked = output<Date>();
  eventClicked = output<CalendarEvent>();

  headerTemplate = contentChild<TemplateRef<unknown>>('headerTemplate');
  dayCellTemplate = contentChild<TemplateRef<unknown>>('dayCellTemplate');
  eventTemplate = contentChild<TemplateRef<unknown>>('eventTemplate');

  viewState = this.store.view;
  currentDate = this.store.currentDate;
  configState = this.store.config;

  //calendarTitle = signal('');

  calendarTitle = computed(() => {
    const date = this.currentDate();
    const locale = this.configState().locale || 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  });

  constructor() {
    // Sync inputs to the store. 
    // effects automatically track the signals used inside them.
    effect(() => this.store.setView(this.view()));
    effect(() => this.store.setEvents(this.events()));
    effect(() => this.store.updateConfig(this.config()));

    // Synchronize the viewChanged output if the store view changes internally
    effect(() => this.viewChanged.emit(this.viewState()));
  }

  onEventClick(event: CalendarEvent): void {
    this.eventClicked.emit(event);
  }

  onDateClick(date: Date): void {
    this.dateClicked.emit(date);
  }
}
