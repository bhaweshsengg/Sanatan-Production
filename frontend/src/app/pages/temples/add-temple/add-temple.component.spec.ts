import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AddTempleComponent } from './add-temple.component';

describe('AddTempleComponent', () => {
  let component: AddTempleComponent;
  let fixture: ComponentFixture<AddTempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTempleComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
