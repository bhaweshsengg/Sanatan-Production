import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DateandtimeComponent } from './dateandtime.component';

describe('DateandtimeComponent', () => {
  let component: DateandtimeComponent;
  let fixture: ComponentFixture<DateandtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateandtimeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateandtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
