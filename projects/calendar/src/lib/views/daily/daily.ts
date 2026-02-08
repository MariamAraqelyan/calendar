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
  private readonly PX_TO_REM = 0.0625;

  readonly eventClick = output<CalendarEvent>();
  readonly dateClick = output<Date>();

  hours = Array.from({ length: CALENDAR_CONSTANTS.HOURS_IN_DAY }, (_, i) => i);

  readonly dayInfo = computed(() => {
    const locale = this.store.config().locale || 'en-US';
    const date = this.store.currentDate();
    
    return {
      date,
      name: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
      isToday: DateUtils.isSameDay(date, new Date())
    };
  });

  readonly dayEvents = computed(() => {
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

  getEventTopRem(event: CalendarEvent): string {
  const pixels = (new Date(event.start).getHours() * 60) + new Date(event.start).getMinutes();
  return `${pixels * this.PX_TO_REM}rem`;
}

  getEventHeightRem(event: CalendarEvent): string {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const diffMinutes = (end.getTime() - start.getTime()) / 60000;
    const heightPx = Math.max(diffMinutes, 25); 
    
    return `${heightPx * this.PX_TO_REM}rem`;
  }

  onEventClick(event: CalendarEvent): void {
    this.eventClick.emit(event);
  }

  onDateClick(date: Date): void {
    this.dateClick.emit(date);
  }
}
