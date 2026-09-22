import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PanchangComponent } from './panchang.component';

describe('PanchangComponent', () => {
  let component: PanchangComponent;
  let fixture: ComponentFixture<PanchangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PanchangComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    fixture = TestBed.createComponent(PanchangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
