import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { CalendarStore } from '../../services/calendar.store';
import { CALENDAR_CONSTANTS, CalendarEvent, WEEK_START } from '../../models/calendar.models';
import { DateUtils } from '../../utils/date-utils';

@Component({
  selector: 'app-weekly',
  imports: [],
  standalone: true,
  templateUrl: './weekly.html',
  styleUrl: './weekly.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Weekly {
  private readonly store = inject(CalendarStore);

  readonly eventClick = output<CalendarEvent>();
  readonly dateClick = output<Date>();

  hours = Array.from({ length: CALENDAR_CONSTANTS.HOURS_IN_DAY }, (_, i) => i);

  readonly weekDays = computed(() => {
    const config = this.store.config();
    const locale = config.locale || 'en-US';
    
    const weekStartsOn = config.weekStartsOn ?? WEEK_START.SUNDAY;
    
    const start = DateUtils.startOfWeek(this.store.currentDate(), weekStartsOn);

    return Array.from({ length: CALENDAR_CONSTANTS.DAYS_IN_WEEK }).map((_, i) => {
      const date = DateUtils.addDays(start, i);
      return {
        date,
        name: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
        isToday: DateUtils.isSameDay(date, new Date())
      };
    });
  });

  getEventsForDay(date: Date): readonly CalendarEvent[] {
    return this.store.events().filter(event =>
      DateUtils.isSameDay(new Date(event.start), date) && !event.allDay
    );
  }

  getEventTop(event: CalendarEvent): number {
    const start = new Date(event.start);
    
    return (
      start.getHours() * CALENDAR_CONSTANTS.MINUTES_IN_HOUR + 
      start.getMinutes()
    );
  }

  getEventHeight(event: CalendarEvent): number {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const diffMs = end.getTime() - start.getTime();
    const height = (diffMs / (1000 * 60));

    return Math.max(height, 25); 
  }

  onEventClick(event: CalendarEvent): void {
    this.eventClick.emit(event);
  }

  onDateClick(date: Date): void {
    this.dateClick.emit(date);
  }
}
