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
});
