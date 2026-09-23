import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AddEventComponent } from './add-event.component';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;
  let router: jasmine.SpyObj<Router>;
  let http: HttpTestingController;

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [AddEventComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    const templeReq = http.expectOne(req => req.url.includes('/temple') && req.method === 'GET');
    templeReq.flush({ data: [] });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a valid event and navigates back to the events page when terms accepted', () => {
    component.event = {
      title: 'Community Gita Study',
      category: 'Educational',
      description: 'A welcoming study session for the Bhagavad Gita and its practical wisdom for daily community life.',
      imageUrl: '', status: 'Published', date: '2026-09-20', startTime: '10:00', endTime: '12:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeId: null, templeName: 'Sanatan Community Temple', hallName: 'Main Hall', address: 'Auckland', mapsLink: '', onlineLink: '',
    };
    component.termsAccepted = true;

    component.createEvent();

    const request = http.expectOne(request => request.url.endsWith('/event') && request.method === 'POST');
    expect(request.request.body.title).toBe('Community Gita Study');
    expect(request.request.body.eventDate).toBe('2026-09-20');
    expect(request.request.body.termsAccepted).toBe(true);
    request.flush({ data: { id: 1 } });
    expect(router.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('blocks event creation when terms are not accepted', () => {
    component.event = {
      title: 'Community Gita Study',
      category: 'Educational',
      description: 'A welcoming study session for the Bhagavad Gita and its practical wisdom for daily community life.',
      imageUrl: '', status: 'Published', date: '2026-09-20', startTime: '10:00', endTime: '12:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeId: null, templeName: 'Sanatan Community Temple', hallName: 'Main Hall', address: 'Auckland', mapsLink: '', onlineLink: '',
    };
    component.termsAccepted = false;

    component.createEvent();

    http.expectNone(request => request.url.endsWith('/event'));
    expect(component.errorMessage).toContain('Terms and Conditions');
  });

  afterEach(() => http?.verify());
});
