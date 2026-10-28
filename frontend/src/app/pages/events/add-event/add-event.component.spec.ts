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
    templeReq.flush({ data: [{ id: 1, name: 'Sanatan Mandir' }] });
    const commReq = http.expectOne(req => req.url.includes('/community/groups') && req.method === 'GET');
    commReq.flush({ data: [{ id: 10, name: 'Auckland Sanatan Mandal' }] });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a valid regular event and navigates to the events page when terms accepted', () => {
    component.event = {
      title: 'Community Gita Study',
      category: 'Educational',
      description: 'A welcoming study session for the Bhagavad Gita and its practical wisdom for daily community life.',
      imageUrl: '', status: 'Published', date: '2026-09-20', startTime: '10:00', endTime: '12:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeId: null, templeName: 'Sanatan Community Temple', communityId: null, communityName: '', hallName: 'Main Hall', address: 'Auckland', mapsLink: '', onlineLink: '',
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

  it('creates a regular event with selected Host Community Group and passes communityId and communityName', () => {
    component.event = {
      title: 'Youth Vedic Discussion',
      category: 'Youth Event',
      description: 'Engaging discussion on Vedic heritage, values, and mindfulness for young devotees.',
      imageUrl: '', status: 'Published', date: '2026-10-15', startTime: '15:00', endTime: '17:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeId: 1, templeName: 'Sanatan Mandir', communityId: null, communityName: '', hallName: '', address: 'Auckland', mapsLink: '', onlineLink: '',
    };
    component.onCommunitySelected(10);
    component.termsAccepted = true;

    expect(component.selectedCommunityId).toBe(10);
    expect(component.event.communityName).toBe('Auckland Sanatan Mandal');

    component.createEvent();

    const req = http.expectOne(r => r.url.endsWith('/event') && r.method === 'POST');
    expect(req.request.body.communityId).toBe(10);
    expect(req.request.body.communityName).toBe('Auckland Sanatan Mandal');
    expect(req.request.body.templeName).toBe('Sanatan Mandir');
    req.flush({ data: { id: 3 } });
    expect(router.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('allows festival event creation with community without requiring a temple, navigating to /festival', () => {
    component.event = {
      title: 'Grand Diwali Celebration 2026',
      category: 'Festival',
      description: 'Annual Diwali Festival celebration organized by community members with cultural events and prasad.',
      imageUrl: '', status: 'Published', date: '2026-11-01', startTime: '18:00', endTime: '22:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeId: null, templeName: '', communityId: null, communityName: '', hallName: '', address: '123 Queen Street, Auckland', mapsLink: '', onlineLink: '',
    };
    component.onCommunitySelected(10);
    component.termsAccepted = true;

    expect(component.isFestivalCategory).toBeTrue();
    expect(component.isSubmitDisabled()).toBeFalse();

    component.createEvent();

    const request = http.expectOne(request => request.url.endsWith('/event') && request.method === 'POST');
    expect(request.request.body.title).toBe('Grand Diwali Celebration 2026');
    expect(request.request.body.category).toBe('Festival');
    expect(request.request.body.communityId).toBe(10);
    expect(request.request.body.communityName).toBe('Auckland Sanatan Mandal');
    expect(request.request.body.templeName).toBe('Auckland Sanatan Mandal');
    request.flush({ data: { id: 2, category: 'Festival' } });

    expect(router.navigate).toHaveBeenCalledWith(['/festival']);
  });

  it('disables submit for non-festival events if templeName is missing', () => {
    component.event = {
      title: 'Vedic Meditation Workshop',
      category: 'Workshop',
      description: 'Introductory meditation workshop open to all devotees.',
      imageUrl: '', status: 'Published', date: '2026-09-25', startTime: '09:00', endTime: '11:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeId: null, templeName: '', communityId: null, communityName: '', hallName: '', address: 'Auckland', mapsLink: '', onlineLink: '',
    };
    component.termsAccepted = true;

    expect(component.isFestivalCategory).toBeFalse();
    expect(component.isSubmitDisabled()).toBeTrue();

    // Adding templeName should enable submission
    component.event.templeName = 'Shiv Mandir Auckland';
    expect(component.isSubmitDisabled()).toBeFalse();
  });

  it('blocks event creation when terms are not accepted', () => {
    component.event = {
      title: 'Community Gita Study',
      category: 'Educational',
      description: 'A welcoming study session for the Bhagavad Gita and its practical wisdom for daily community life.',
      imageUrl: '', status: 'Published', date: '2026-09-20', startTime: '10:00', endTime: '12:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeId: null, templeName: 'Sanatan Community Temple', communityId: null, communityName: '', hallName: 'Main Hall', address: 'Auckland', mapsLink: '', onlineLink: '',
    };
    component.termsAccepted = false;

    component.createEvent();

    http.expectNone(request => request.url.endsWith('/event'));
    expect(component.errorMessage).toContain('Terms and Conditions');
  });

  afterEach(() => http?.verify());
});

