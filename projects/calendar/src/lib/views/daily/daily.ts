import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { CALENDAR_CONSTANTS, CalendarEvent } from '../../models/calendar.models';
import { CalendarStore } from '../../services/calendar.store';
import { DateUtils } from '../../utils/date-utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daily',
  imports: [
    DatePipe
  ],
  standalone: true,
  templateUrl: './daily.html',
  styleUrl: './daily.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Daily {
  private readonly store = inject(CalendarStore);

  eventClick = output<CalendarEvent>();
  dateClick = output<Date>();

  hours = Array.from({ length: CALENDAR_CONSTANTS.HOURS_IN_DAY }, (_, i) => i);

  dayInfo = computed(() => {
    const locale = this.store.config().locale || 'en-US';
    const date = this.store.currentDate();
    
    return {
      date,
      name: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
      isToday: DateUtils.isSameDay(date, new Date())
    };
  });

  dayEvents = computed(() => {
    const current = this.store.currentDate();
    return this.store.events().filter(event =>
      DateUtils.isSameDay(new Date(event.start), current) && !event.allDay
    );
  });

  getEventTop(event: CalendarEvent): number {
    const start = new Date(event.start);
    return (start.getHours() * CALENDAR_CONSTANTS.MINUTES_IN_HOUR + start.getMinutes());
  }

  getEventHeight(event: CalendarEvent): number {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const diffMinutes = (end.getTime() - start.getTime()) / 60000;
    
    return Math.max(diffMinutes, 25);
  }

  onEventClick(event: CalendarEvent) {
    this.eventClick.emit(event);
  }

  onDateClick(date: Date) {
    this.dateClick.emit(date);
  }
}
