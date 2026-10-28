import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AddFestivalComponent } from './add-festival.component';

describe('AddFestivalComponent', () => {
  let component: AddFestivalComponent;
  let fixture: ComponentFixture<AddFestivalComponent>;
  let router: Router;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFestivalComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(AddFestivalComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create AddFestivalComponent and default category to Hindu', () => {
    expect(component).toBeTruthy();
    expect(component.festival.category).toBe('Hindu');
    expect(component.isLegacyCategory('Hindu')).toBeFalse();
    expect(component.isLegacyCategory('Jain')).toBeFalse();
    expect(component.isLegacyCategory('Sikh')).toBeFalse();
    expect(component.isLegacyCategory('Baudh')).toBeFalse();
    expect(component.isLegacyCategory('Festival')).toBeTrue();
  });

  it('allows festival creation with Sanatan Dharma tradition and navigates to /festival', () => {
    component.festival.title = 'Maha Shivaratri 2026';
    component.festival.category = 'Hindu';
    component.festival.description = 'Grand Shivaratri celebrations with Maha Abhishek and all-night bhajan with community prasad and arati.';
    component.festival.eventDate = '2026-03-08';
    component.festival.startTime = '18:00';
    component.festival.endTime = '06:00';
    component.termsAccepted = true;

    expect(component.isSubmitDisabled()).toBeFalse();

    component.createFestival();

    const req = http.expectOne(r => r.url.endsWith('/event') && r.method === 'POST');
    expect(req.request.body.title).toBe('Maha Shivaratri 2026');
    expect(req.request.body.category).toBe('Hindu');
    expect(req.request.body.eventDate).toBe('2026-03-08');
    expect(req.request.body.templeName).toBe('Sanatan Community');

    req.flush({ data: { id: 101, title: 'Maha Shivaratri 2026' } });
    expect(router.navigate).toHaveBeenCalledWith(['/festival']);
  });

  it('supports creating festivals with Jain, Sikh, or Baudh traditions', () => {
    for (const tradition of ['Jain', 'Sikh', 'Baudh']) {
      component.festival.title = `${tradition} Sacred Gathering`;
      component.festival.category = tradition;
      component.festival.description = 'Sacred spiritual assembly celebrating traditions, values, community prayers, and mahaprasad.';
      component.festival.eventDate = '2026-04-14';
      component.festival.startTime = '10:00';
      component.festival.endTime = '14:00';
      component.termsAccepted = true;

      expect(component.isSubmitDisabled()).toBeFalse();

      component.createFestival();

      const req = http.expectOne(r => r.url.endsWith('/event') && r.method === 'POST');
      expect(req.request.body.category).toBe(tradition);
      req.flush({ data: { id: 200, title: `${tradition} Sacred Gathering` } });
    }
  });

  it('disables submit when required basic fields are missing or terms are not accepted', () => {
    component.festival.title = '';
    component.termsAccepted = false;
    expect(component.isSubmitDisabled()).toBeTrue();

    component.festival.title = 'Holi 2026';
    component.festival.description = 'Festival of colors';
    component.festival.eventDate = '2026-03-25';
    component.termsAccepted = false;
    expect(component.isSubmitDisabled()).toBeTrue();

    // Still disabled because description < 50 characters
    component.termsAccepted = true;
    expect(component.isSubmitDisabled()).toBeTrue();

    // Fill valid description >= 50 chars
    component.festival.description = 'A joyful festival of colors celebrated with devotion, joy, sweets, and community bhajans across Auckland.';
    expect(component.isSubmitDisabled()).toBeFalse();
  });

  afterEach(() => http?.verify());
});
