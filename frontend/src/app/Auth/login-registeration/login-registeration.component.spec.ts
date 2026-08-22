import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterationComponent } from './login-registeration.component';

describe('LoginRegisterationComponent', () => {
  let component: LoginRegisterationComponent;
  let fixture: ComponentFixture<LoginRegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRegisterationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
