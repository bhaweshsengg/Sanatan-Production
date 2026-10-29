import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TemplesComponent } from './temples.component';

describe('TemplesComponent', () => {
  let component: TemplesComponent;
  let fixture: ComponentFixture<TemplesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TemplesComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(TemplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Join and View buttons on temple cards', () => {
    component.isLoading = false;
    component.errorMessage = '';
    component.temples = [
      {
        id: 101,
        publicId: 'cuid-101',
        name: 'Auckland Sanatan Mandir',
        deity: 'Lord Shiva',
        location: 'Auckland',
        rating: 4.8,
        description: 'Test Mandir Description',
        established: '2000',
        image: 'assets/temple.jpg',
        category: 'Temple',
        reviews: 10,
        phone: '12345678',
        email: 'mandir@test.com',
        website: 'https://mandir.test',
        timings: '6:00 AM - 8:00 PM',
        status: 'Approved',
        contact: '12345678',
        address: '108 Temple Way',
        city: 'Auckland',
        mainDeity: 'Lord Shiva',
        services: [],
        facilities: [],
        contactPerson: 'Pandit Ji',
        contactRole: 'Head Priest',
        contactEmail: 'priest@mandir.test',
      },
    ];
    component.filteredTemples = [...component.temples];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('a'));
    const joinBtn = buttons.find((b) => b.textContent?.trim().includes('Join'));
    const viewBtn = buttons.find((b) => b.textContent?.trim().includes('View'));

    expect(joinBtn).toBeTruthy();
    expect(viewBtn).toBeTruthy();
    expect(joinBtn?.getAttribute('href')).toContain('/user-registration');
    expect(viewBtn?.getAttribute('href')).toContain('/temples/view-temple');
  });
});
