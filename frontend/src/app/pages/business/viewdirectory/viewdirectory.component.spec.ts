import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdirectoryComponent } from './viewdirectory.component';

describe('ViewdirectoryComponent', () => {
  let component: ViewdirectoryComponent;
  let fixture: ComponentFixture<ViewdirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewdirectoryComponent]
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
