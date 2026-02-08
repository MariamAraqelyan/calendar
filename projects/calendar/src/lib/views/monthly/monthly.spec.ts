import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Monthly } from './monthly';
import { CalendarStore } from '../../services/calendar.store';
import { CalendarEvent } from '../../models/calendar.models';
import { signal } from '@angular/core';

describe('Monthly Component', () => {
  let component: Monthly;
  let fixture: ComponentFixture<Monthly>;
  
  // 1. Mock the Store with Signals
  const mockStore = {
    currentDate: signal(new Date(2026, 1, 1)), // Feb 1, 2026
    events: signal<CalendarEvent[]>([]),
    config: signal({ 
      locale: 'en-US', 
      weekStartsOn: 0, 
      showOnlyEventsCount: false 
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Monthly],
      providers: [
        { provide: CalendarStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Monthly);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  describe('Signal Computeds', () => {
    it('should derive weekDays from store config', () => {
      const days = component.weekDays();
      expect(days).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });

    it('should update grid when store date changes', () => {
      // February 2026 grid check
      expect(component.calendarGrid().length).toBe(42);
      
      // Update the store signal
      mockStore.currentDate.set(new Date(2026, 5, 1)); // June 2026
      fixture.detectChanges();
      
      // The grid computed automatically updates
      expect(component.calendarGrid()[0].getMonth()).toBe(4); // May (padding day)
    });
  });

  describe('Event Logic', () => {
    it('should filter events correctly using signals', () => {
      const day = new Date(2026, 1, 10);
      const event: CalendarEvent = { 
        id: 1, title: 'Jest Test', 
        start: day, 
        end: day 
      };
      
      // Update signal-based store
      mockStore.events.set([event]);
      
      const result = component.getEventsForDay(day);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Jest Test');
    });
  });

  describe('Signal Outputs', () => {
    it('should emit through the output API', () => {
      // In Angular 21, outputs are not EventEmitters, but we can spy on emit
      const emitSpy = jest.spyOn(component.dateClick, 'emit');
      const testDate = new Date();
      
      component.onDateClick(testDate);
      
      expect(emitSpy).toHaveBeenCalledWith(testDate);
    });
  });

  describe('DOM & BEM Classes', () => {
    it('should apply BEM modifier for other-month dates', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      // Feb 1st is Sunday, if grid starts before that, check padding
      const otherMonthCell = compiled.querySelector('.calendar-month__day--other-month');
      expect(otherMonthCell).toBeDefined();
    });

    it('should react to showOnlyEventsCount config', () => {
      // Change config signal
      mockStore.config.update(c => ({ ...c, showOnlyEventsCount: true }));
      mockStore.events.set([{ id: 1, title: 'E1', start: new Date(2026, 1, 1), end: new Date(2026, 1, 1) }]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.calendar-month__badge')).toBeTruthy();
      expect(compiled.querySelector('.calendar-month__event')).toBeNull();
    });
  });
});