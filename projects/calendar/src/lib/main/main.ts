import {
  ChangeDetectionStrategy,
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
import { CALENDAR_CONSTANTS, CalendarConfig, CalendarEvent, CalendarView } from '../models/calendar.models';
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
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Main {
  protected readonly store = inject(CalendarStore);
  protected readonly VIEWS = CALENDAR_CONSTANTS.VIEWS;

  readonly view = input<CalendarView>('month');
  readonly events = input<readonly CalendarEvent[]>([]);
  readonly config = input<Partial<CalendarConfig>>({});

  readonly viewChanged = output<CalendarView>();
  readonly dateClicked = output<Date>();
  readonly eventClicked = output<CalendarEvent>();

  readonly headerTemplate = contentChild<TemplateRef<unknown>>('headerTemplate');
  readonly dayCellTemplate = contentChild<TemplateRef<unknown>>('dayCellTemplate');
  readonly eventTemplate = contentChild<TemplateRef<unknown>>('eventTemplate');

  viewState = this.store.view;
  currentDate = this.store.currentDate;
  configState = this.store.config;

  readonly calendarTitle = computed(() => {
    const date = this.currentDate();
    const locale = this.configState().locale || 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  });

  constructor() {
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
