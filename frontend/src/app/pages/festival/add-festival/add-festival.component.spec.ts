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

    const templeReq = http.expectOne(req => req.url.includes('/temple') && req.method === 'GET');
    templeReq.flush({ data: [{ id: 1, name: 'Sanatan Mandir' }] });
    const commReq = http.expectOne(req => req.url.includes('/community/groups') && req.method === 'GET');
    commReq.flush({ data: [{ id: 5, name: 'NZ Hindu Community' }] });
  });

  it('should create AddFestivalComponent', () => {
    expect(component).toBeTruthy();
    expect(component.festival.category).toBe('Festival');
  });

  it('allows festival creation with community selection and without a temple', () => {
    component.festival.title = 'Maha Shivaratri 2026';
    component.festival.description = 'Grand Shivaratri celebrations with Maha Abhishek and all-night bhajan with community prasad and arati.';
    component.festival.eventDate = '2026-03-08';
    component.festival.address = 'Waitakere Indian Association Centre';
    component.onCommunitySelected(5);
    component.termsAccepted = true;

    expect(component.isSubmitDisabled()).toBeFalse();

    component.createFestival();

    const req = http.expectOne(r => r.url.endsWith('/event') && r.method === 'POST');
    expect(req.request.body.title).toBe('Maha Shivaratri 2026');
    expect(req.request.body.category).toBe('Festival');
    expect(req.request.body.communityId).toBe(5);
    expect(req.request.body.communityName).toBe('NZ Hindu Community');
    expect(req.request.body.templeName).toBe('NZ Hindu Community');

    req.flush({ data: { id: 101, title: 'Maha Shivaratri 2026' } });
    expect(router.navigate).toHaveBeenCalledWith(['/festival']);
  });

  it('allows festival creation with temple selection', () => {
    component.festival.title = 'Janmashtami Celebration';
    component.festival.description = 'Celebrate Krishna Janmashtami with midnight aarti and cultural plays.';
    component.festival.eventDate = '2026-09-04';
    component.onTempleSelected({ id: 1, mandir_name: 'Sanatan Mandir' });
    component.termsAccepted = true;

    expect(component.isSubmitDisabled()).toBeFalse();

    component.createFestival();

    const req = http.expectOne(r => r.url.endsWith('/event') && r.method === 'POST');
    expect(req.request.body.templeId).toBe(1);
    expect(req.request.body.templeName).toBe('Sanatan Mandir');
    req.flush({ data: { id: 102 } });
    expect(router.navigate).toHaveBeenCalledWith(['/festival']);
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

    // Fill valid description >= 50 chars and valid host
    component.festival.description = 'A joyful festival of colors celebrated with devotion, joy, sweets, and community bhajans across Auckland.';
    component.festival.address = 'Auckland';
    expect(component.isSubmitDisabled()).toBeFalse();
  });

  afterEach(() => http?.verify());
});
