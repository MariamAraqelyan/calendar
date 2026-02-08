/**
 * Represents the available calendar display modes.
 */
export type CalendarView = 'month' | 'week' | 'day';

export const CALENDAR_CONSTANTS = {
  DAYS_IN_WEEK: 7,
  MONTH_OFFSET: 1,
  DAY_OFFSET: 1,
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
} as const;

export const WEEK_START = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

/**
 * Modernized Calendar Event.
 */
export interface CalendarEvent<T = unknown> {
  readonly id: string | number;
  readonly title: string;
  readonly start: Date;
  readonly end: Date;
  readonly allDay?: boolean;
  readonly color?: string;
  readonly backgroundColor?: string;
  readonly textColor?: string;
  readonly borderColor?: string;
  readonly className?: string | string[];
  readonly meta?: T;
}

/**
 * Configuration options for the Calendar instance.
 */
export interface CalendarConfig {
  readonly locale?: string;
  /** 0 = Sunday, 1 = Monday, etc. */
  readonly weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  readonly showHeader?: boolean;
  readonly theme?: 'light' | 'dark' | 'system';
  readonly showOnlyEventsCount?: boolean;
}

/**
 * Represents the global state of the Calendar.
 */
export interface CalendarState {
  readonly view: CalendarView;
  readonly currentDate: Date;
  readonly events: readonly CalendarEvent[];
  readonly config: CalendarConfig;
}


/**
 * Initial state.
 */
export const INITIAL_CALENDAR_STATE: CalendarState = {
    view: 'month',
    currentDate: new Date(),
    events: [],
    config: {
        locale: 'en-US',
        weekStartsOn: 0,
        showHeader: true,
        theme: 'light',
        showOnlyEventsCount: false
    }
};