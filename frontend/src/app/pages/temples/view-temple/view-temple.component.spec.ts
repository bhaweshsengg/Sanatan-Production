import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ViewTempleComponent } from './view-temple.component';

describe('ViewTempleComponent', () => {
  let component: ViewTempleComponent;
  let fixture: ComponentFixture<ViewTempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTempleComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
