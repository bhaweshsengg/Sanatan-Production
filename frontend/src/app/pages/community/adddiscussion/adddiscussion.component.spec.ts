import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AdddiscussionComponent } from './adddiscussion.component';

describe('AdddiscussionComponent', () => {
  let component: AdddiscussionComponent;
  let fixture: ComponentFixture<AdddiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdddiscussionComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
