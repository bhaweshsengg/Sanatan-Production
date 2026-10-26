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
});
