import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { FestivalComponent } from './festival.component';

describe('FestivalComponent', () => {
  let component: FestivalComponent;
  let fixture: ComponentFixture<FestivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FestivalComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FestivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Create Festival button linking to /festival/create', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const createBtn = compiled.querySelector('a[routerlink="/festival/create"], a[href="/festival/create"]');
    expect(createBtn).toBeTruthy();
    expect(createBtn?.textContent).toContain('Create Festival');
  });

  it('should categorize festivals into upcoming and past based on NZ timezone date', () => {
    const nzToday = component.getNzTodayDateString();
    
    // Create dates: pastDate, todayDate, futureDate
    const today = new Date();
    const past = new Date(today);
    past.setDate(today.getDate() - 5);
    const pastDateStr = past.toISOString().slice(0, 10);

    const future = new Date(today);
    future.setDate(today.getDate() + 5);
    const futureDateStr = future.toISOString().slice(0, 10);

    component.festivals = [
      {
        id: 1,
        name: 'Past Festival',
        date: pastDateStr,
        rawDate: pastDateStr,
        significance: 'Past festival test',
        rituals: [],
        deities: [],
        category: 'Hindu',
      },
      {
        id: 2,
        name: 'Today Festival',
        date: nzToday,
        rawDate: nzToday,
        significance: 'Today festival test',
        rituals: [],
        deities: [],
        category: 'Hindu',
      },
      {
        id: 3,
        name: 'Future Festival',
        date: futureDateStr,
        rawDate: futureDateStr,
        significance: 'Future festival test',
        rituals: [],
        deities: [],
        category: 'Hindu',
      },
    ];
    component.filteredFestivals = [...component.festivals];

    expect(component.upcomingFestivals.some((f) => f.name === 'Today Festival')).toBeTrue();
    expect(component.upcomingFestivals.some((f) => f.name === 'Future Festival')).toBeTrue();
    expect(component.pastFestivals.some((f) => f.name === 'Past Festival')).toBeTrue();
    expect(component.pastFestivals.some((f) => f.name === 'Today Festival')).toBeFalse();
    expect(component.pastFestivals.some((f) => f.name === 'Future Festival')).toBeFalse();
  });
});
