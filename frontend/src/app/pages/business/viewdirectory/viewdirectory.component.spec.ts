import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ViewdirectoryComponent } from './viewdirectory.component';

describe('ViewdirectoryComponent', () => {
  let component: ViewdirectoryComponent;
  let fixture: ComponentFixture<ViewdirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewdirectoryComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewdirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
