import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanchangComponent } from './panchang.component';

describe('PanchangComponent', () => {
  let component: PanchangComponent;
  let fixture: ComponentFixture<PanchangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PanchangComponent]
    });
    fixture = TestBed.createComponent(PanchangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
