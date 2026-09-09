import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { EventsComponent } from './events.component';
import { AuthService } from '../../Auth/auth.service';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('userData', JSON.stringify({ id: 1, username: 'testuser', role: 'User' }));
    TestBed.configureTestingModule({
      imports: [EventsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    const authService = TestBed.inject(AuthService);
    authService.login('test-token', { id: 1, username: 'testuser', role: 'User' });

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Flush initial load requests from ngOnInit
    const initialReqs = httpTesting.match(req => req.url.includes('/event'));
    initialReqs.forEach(r => {
      if (r.request.url.endsWith('/my-joined')) {
        r.flush({ success: true, data: [] });
      } else {
        r.flush({ success: true, data: [] });
      }
    });

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
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('joins an event once and persists the joined state', () => {
    const event = component.events[0];

    component.joinEvent(event);

    const req = httpTesting.expectOne(r => r.url.endsWith('/event/janmashtami/join'));
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, message: 'Joined', data: { joined: true, attendees: 251 } });

    expect(event.joined).toBeTrue();
    expect(event.attendees).toBe(251);

    // Duplicate call should be ignored
    component.joinEvent(event);
    httpTesting.expectNone(r => r.url.endsWith('/event/janmashtami/join'));
  });

  it('shows joined events and removes them when leaving', () => {
    const event = component.events[0];
    component.joinEvent(event);

    const joinReq = httpTesting.expectOne(r => r.url.endsWith('/event/janmashtami/join'));
    joinReq.flush({ success: true, message: 'Joined', data: { joined: true, attendees: 251 } });

    expect(component.joinedEvents).toEqual([event]);

    component.leaveEvent(event);

    const leaveReq = httpTesting.expectOne(r => r.url.endsWith('/event/janmashtami/leave'));
    expect(leaveReq.request.method).toBe('POST');
    leaveReq.flush({ success: true, message: 'Left', data: { joined: false, attendees: 250 } });

    expect(component.joinedEvents).toEqual([]);
    expect(event.attendees).toBe(250);
  });
});

