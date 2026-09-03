import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AddEventComponent } from './add-event.component';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [AddEventComponent],
      providers: [{ provide: Router, useValue: router }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a valid event and navigates back to the events page', () => {
    component.event = {
      title: 'Community Gita Study',
      category: 'Educational',
      description: 'A welcoming study session for the Bhagavad Gita and its practical wisdom for daily community life.',
      imageUrl: '', status: 'Published', date: '2026-09-20', startTime: '10:00', endTime: '12:00',
      multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
      templeName: 'Sanatan Community Temple', hallName: 'Main Hall', address: 'Auckland', mapsLink: '', onlineLink: '',
    };

    component.createEvent();

    const storedEvents = JSON.parse(localStorage.getItem('sanatan-created-events') ?? '[]');
    expect(storedEvents[0].title).toBe('Community Gita Study');
    expect(storedEvents[0].status).toBe('Published');
    expect(storedEvents[0].time).toBe('10:00 - 12:00');
    expect(router.navigate).toHaveBeenCalledWith(['/events']);
    localStorage.removeItem('sanatan-created-events');
  });
});
