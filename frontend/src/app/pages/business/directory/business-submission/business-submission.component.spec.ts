import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BusinessSubmissionComponent } from './business-submission.component';

describe('BusinessSubmissionComponent', () => {
  let component: BusinessSubmissionComponent;
  let fixture: ComponentFixture<BusinessSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSubmissionComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
