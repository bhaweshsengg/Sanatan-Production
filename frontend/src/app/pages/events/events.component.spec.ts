import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EventsComponent } from './events.component';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(() => {
    localStorage.setItem('authToken', 'test-token');
    TestBed.configureTestingModule({
      imports: [EventsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    component.events = [{
      id: 'janmashtami',
      title: 'Janmashtami Celebration',
      venue: 'ISKCON Auckland',
      category: 'Festival',
      categoryClass: 'bg-orange-100 text-orange-800',
      date: '2099-08-26',
      time: '18:00',
      attendees: 250,
      joined: false,
    }];
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('sanatan-joined-events');
    localStorage.removeItem('authToken');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('joins an event once and persists the joined state', () => {
    const event = component.events[0];

    component.joinEvent(event);
    component.joinEvent(event);

    expect(event.joined).toBeTrue();
    expect(event.attendees).toBe(251);
    expect(JSON.parse(localStorage.getItem('sanatan-joined-events') ?? '[]'))
      .toEqual(['janmashtami']);
  });

  it('shows joined events and removes them when leaving', () => {
    const event = component.events[0];
    component.joinEvent(event);

    expect(component.joinedEvents).toEqual([event]);

    component.leaveEvent(event);

    expect(component.joinedEvents).toEqual([]);
    expect(event.attendees).toBe(250);
    expect(JSON.parse(localStorage.getItem('sanatan-joined-events') ?? '[]')).toEqual([]);
  });
});
