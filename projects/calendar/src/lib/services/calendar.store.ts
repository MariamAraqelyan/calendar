import { Injectable, computed, signal } from '@angular/core';
import { CALENDAR_CONSTANTS, CalendarConfig, CalendarEvent, CalendarState, CalendarView, INITIAL_CALENDAR_STATE, WEEK_START } from '../models/calendar.models';


@Injectable()
export class CalendarStore {
    private readonly _state = signal<CalendarState>(INITIAL_CALENDAR_STATE);

    /** Current view mode (month, week, or day) */
    readonly view = computed(() => this._state().view);
    
    /** The active date being viewed */
    readonly currentDate = computed(() => this._state().currentDate);
    
    /** The list of calendar events */
    readonly events = computed(() => this._state().events);
    
    /** Global calendar configuration */
    readonly config = computed(() => this._state().config);

    /** Updates the current calendar view mode */
    setView(view: CalendarView): void {
      this._state.update(state => ({ ...state, view }));
    }
      
    /** Logic to find the start of the week based on config */
    readonly startOfWeek = computed(() => {
      const date = new Date(this.currentDate());
      const startDayConfig = this.config().weekStartsOn ?? WEEK_START.SUNDAY;
      const day = date.getDay();
      const diff = (day < startDayConfig ? CALENDAR_CONSTANTS.DAYS_IN_WEEK : 0) + day - startDayConfig;
      
      date.setDate(date.getDate() - diff);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    setCurrentDate(date: Date): void {
      this._state.update(state => ({ ...state, currentDate: new Date(date) }));
    }

    updateConfig(config: Partial<CalendarConfig>): void {
      this._state.update(state => ({
        ...state,
        config: { ...state.config, ...config }
      }));
    }

    next(): void {
      this._state.update(state => {
        const nextDate = new Date(state.currentDate);
        switch (state.view) {
          case 'month': nextDate.setMonth(nextDate.getMonth() + CALENDAR_CONSTANTS.MONTH_OFFSET); break;
          case 'week':  nextDate.setDate(nextDate.getDate() + CALENDAR_CONSTANTS.DAYS_IN_WEEK); break;
          case 'day':   nextDate.setDate(nextDate.getDate() + CALENDAR_CONSTANTS.DAY_OFFSET); break;
        }
        return { ...state, currentDate: nextDate };
      });
    }

    prev(): void {
      this._state.update(state => {
        const prevDate = new Date(state.currentDate);
        switch (state.view) {
          case 'month': prevDate.setMonth(prevDate.getMonth() - CALENDAR_CONSTANTS.MONTH_OFFSET); break;
          case 'week':  prevDate.setDate(prevDate.getDate() - CALENDAR_CONSTANTS.DAYS_IN_WEEK); break;
          case 'day':   prevDate.setDate(prevDate.getDate() - CALENDAR_CONSTANTS.DAY_OFFSET); break;
        }
        return { ...state, currentDate: prevDate };
      });
    }

    today(): void {
      this.setCurrentDate(new Date());
    }

    /** Get localized weekday names for the header */
    getWeekdayNames(format: 'long' | 'short' | 'narrow' = 'short'): string[] {
      const formatter = new Intl.DateTimeFormat(this.config().locale, { weekday: format });
      const start = this.startOfWeek();
      
      return Array.from({ length: CALENDAR_CONSTANTS.DAYS_IN_WEEK }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return formatter.format(d);
      });
    }

    setEvents(events: readonly CalendarEvent[]): void {
      this._state.update(state => ({ ...state, events }));
    }
}