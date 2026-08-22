import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSubmissionComponent } from './business-submission.component';

describe('BusinessSubmissionComponent', () => {
  let component: BusinessSubmissionComponent;
  let fixture: ComponentFixture<BusinessSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSubmissionComponent]
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
