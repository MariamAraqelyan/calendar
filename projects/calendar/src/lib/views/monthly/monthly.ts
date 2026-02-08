import { ChangeDetectionStrategy, Component, computed, inject, input, output, TemplateRef } from '@angular/core';
import { CalendarStore } from '../../services/calendar.store';
import { CALENDAR_CONSTANTS, CalendarEvent } from '../../models/calendar.models';
import { DateUtils } from '../../utils/date-utils';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-monthly',
  imports: [
    NgTemplateOutlet,
  ],
  standalone: true,
  templateUrl: './monthly.html',
  styleUrl: './monthly.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Monthly {
  protected readonly store = inject(CalendarStore);

  readonly dayCellTemplate = input<TemplateRef<unknown> | null>(null);
  readonly eventTemplate = input<TemplateRef<unknown> | null>(null);

  readonly eventClick = output<CalendarEvent>();
  readonly dateClick = output<Date>();

  readonly calendarGrid = computed(() => {
    return DateUtils.getMonthGrid(
      this.store.currentDate(),
      this.store.config().weekStartsOn
    );
  });

  readonly weekDays = computed(() => {
    const locale = this.store.config().locale || 'en-US';
    const weekStartsOn = this.store.config().weekStartsOn;
    const baseDate = DateUtils.startOfWeek(new Date(), weekStartsOn);

    return Array.from({ length: CALENDAR_CONSTANTS.DAYS_IN_WEEK }).map((_, i) => {
      const date = DateUtils.addDays(baseDate, i);
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
    });
  });

  isToday(date: Date): boolean {
    return DateUtils.isSameDay(date, new Date());
  }

  isSameMonth(date: Date): boolean {
    // Ensuring we compare year and month to avoid issues with same months in different years
    const current = this.store.currentDate();
    return date.getMonth() === current.getMonth() && 
           date.getFullYear() === current.getFullYear();
  }

  /** Filter events for a specific day. */
  getEventsForDay(date: Date): readonly CalendarEvent[] {
    return this.store.events().filter(event =>
      DateUtils.isSameDay(new Date(event.start), date)
    );
  }

  onDateClick(date: Date): void {
    this.dateClick.emit(date);
  }

  onEventClick(event: CalendarEvent): void {
    this.eventClick.emit(event);
  }
}
