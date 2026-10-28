import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Quick Action buttons in the Hero section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const addTempleBtn = compiled.querySelector('a[routerlink="/temples/add-temple"], a[href="/temples/add-temple"]');
    const addEventBtn = compiled.querySelector('a[routerlink="/events/add-event"], a[href="/events/add-event"]');
    const addServiceBtn = compiled.querySelector('a[routerlink="/services/add"], a[href="/services/add"]');

    expect(addTempleBtn).toBeTruthy();
    expect(addEventBtn).toBeTruthy();
    expect(addServiceBtn).toBeTruthy();

    expect(addTempleBtn?.textContent).toContain('Add New Temple');
    expect(addEventBtn?.textContent).toContain('Add Event');
    expect(addServiceBtn?.textContent).toContain('Add Service');
  });
});
