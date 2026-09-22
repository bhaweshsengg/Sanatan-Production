import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DirectoryComponent } from './directory.component';

describe('DirectoryComponent', () => {
  let component: DirectoryComponent;
  let fixture: ComponentFixture<DirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
