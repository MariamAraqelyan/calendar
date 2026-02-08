import { Injectable, computed, signal } from '@angular/core';
import { CalendarState, INITIAL_CALENDAR_STATE } from '../models/calendar.models';

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
}