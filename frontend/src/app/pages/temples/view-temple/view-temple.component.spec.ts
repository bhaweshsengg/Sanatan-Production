import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CommonService } from 'src/app/shared/common.service';

import { ViewTempleComponent } from './view-temple.component';

describe('ViewTempleComponent', () => {
  let component: ViewTempleComponent;
  let fixture: ComponentFixture<ViewTempleComponent>;
  let mockTempleService: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    mockTempleService = jasmine.createSpyObj('CommonService', ['getTemplebyId', 'getEventsByTemple']);
    mockTempleService.getTemplebyId.and.returnValue(of({
      id: 99,
      mandir_name: 'Shri Radha Krishna Temple',
      publicId: 'cmuh-temple-99',
      message: 'success',
      full_address: '123 Temple Road, Auckland',
      city_id: 1,
      city: { id: 1, name: 'Auckland' },
      year_established: 2005,
      main_deity_id: 1,
      main_deity: { id: 1, name: 'Radha Krishna' },
      service_offered: [],
      facilities_offered: [],
      phone_no: '09-1234567',
      website: '',
      opening_hours: '06:00 - 20:00',
      your_name: 'Devotee',
      your_email: 'devotee@example.com',
      email: '',
      rating: 5,
      description: 'Divine temple',
      location: 'Auckland',
      review: '',
      contactRole: 'Admin'
    }));
    mockTempleService.getEventsByTemple.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ViewTempleComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CommonService, useValue: mockTempleService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? 'cmuh-temple-99' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the actual selected temple name in the header and breadcrumb', () => {
    expect(component).toBeTruthy();
    expect(component.temple?.mandir_name).toBe('Shri Radha Krishna Temple');

    const header = fixture.nativeElement.querySelector('header');
    expect(header).toBeTruthy();
    const h1 = header.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Shri Radha Krishna Temple');

    const breadcrumb = header.querySelector('p');
    expect(breadcrumb?.textContent).toContain('Shri Radha Krishna Temple');
    expect(breadcrumb?.textContent).toContain('Sanatan New Zealand');
  });
});
