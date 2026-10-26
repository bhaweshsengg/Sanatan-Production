import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create and load stats, featured mandirs, and upcoming events', () => {
    fixture.detectChanges();

    const statsReq = httpTesting.expectOne(`${environment.apiBaseUrl}/stats`);
    expect(statsReq.request.method).toBe('GET');
    statsReq.flush({ data: { temples: 10, events: 5, users: 100, businesses: 20 } });

    const templesReq = httpTesting.expectOne(`${environment.apiBaseUrl}/temple`);
    expect(templesReq.request.method).toBe('GET');
    templesReq.flush({
      success: true,
      data: [
        { id: 1, mandir_name: 'Temple One', status: 'Approved', rating: 4.5 },
        { id: 2, mandir_name: 'Temple Two (Pending)', status: 'Pending', rating: 4.9 },
        { id: 3, mandir_name: 'Temple Three', status: 'Approved', rating: 4.9 }
      ]
    });

    const eventsReq = httpTesting.expectOne(`${environment.apiBaseUrl}/event`);
    expect(eventsReq.request.method).toBe('GET');
    eventsReq.flush({
      success: true,
      data: [
        { id: 1, title: 'Future Diwali', status: 'Approved', eventDate: '2099-10-20', startTime: '18:00' },
        { id: 2, title: 'Past Event', status: 'Approved', eventDate: '2020-01-01', startTime: '10:00' },
        { id: 3, title: 'Unapproved Event', status: 'Pending', eventDate: '2099-11-01', startTime: '12:00' }
      ]
    });

    expect(component).toBeTruthy();
    expect(component.stats.temples).toBe(10);
    // Only approved mandirs, sorted by rating descending
    expect(component.featuredMandirs.length).toBe(2);
    expect(component.featuredMandirs[0].mandir_name).toBe('Temple Three');
    expect(component.featuredMandirs[1].mandir_name).toBe('Temple One');

    // Only approved & future events
    expect(component.upcomingEventsList.length).toBe(1);
    expect(component.upcomingEventsList[0].title).toBe('Future Diwali');
  });

  it('should render the Sanatan Panchang section inside a single container div', () => {
    fixture.detectChanges();

    httpTesting.expectOne(`${environment.apiBaseUrl}/stats`).flush({ data: {} });
    httpTesting.expectOne(`${environment.apiBaseUrl}/temple`).flush({ data: [] });
    httpTesting.expectOne(`${environment.apiBaseUrl}/event`).flush({ data: [] });

    fixture.detectChanges();
    const panchangSection = fixture.nativeElement.querySelector('#sanatan-panchang-section');
    expect(panchangSection).toBeTruthy();
    expect(panchangSection.textContent).toContain('सनातन पंचांग');
  });
});

