import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MandirUserRegistrationComponent } from './mandir-user-registration.component';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from '../../../environments/environment';

describe('MandirUserRegistrationComponent', () => {
  let component: MandirUserRegistrationComponent;
  let fixture: ComponentFixture<MandirUserRegistrationComponent>;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MandirUserRegistrationComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(MandirUserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Satisfy initial loadMandirs() call
    const req = httpMock.expectOne((r) => r.url.includes('/public/temple'));
    req.flush({
      data: [
        { id: 1, mandir_name: 'Shri Ram Mandir', status: 'Approved' },
        { id: 2, mandir_name: 'Shiva Vishnu Temple', status: 'Approved' },
      ],
    });
    fixture.detectChanges();
  }

  it('should create the component', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should require password when user is NOT logged in', () => {
    createComponent();
    expect(component.isLoggedIn).toBeFalse();

    const pwdControl = component.form.get('password');
    expect(pwdControl?.validator).toBeTruthy();

    component.form.patchValue({
      firstName: 'Ramesh',
      lastName: 'Sharma',
      email: 'ramesh@example.com',
      mobile: '+6421000000',
      mandirId: 1,
      subscription: 'Yes',
      termsAccepted: true,
      password: '', // Missing password
    });

    expect(component.form.invalid).toBeTrue();
    expect(pwdControl?.valid).toBeFalse();
  });

  it('should automatically populate form and omit password when user is logged in', () => {
    const mockUser = {
      id: 99,
      fullName: 'Aarav Patel',
      username: 'aarav.patel',
      email: 'aarav@example.com',
      role: 'User',
      mobile: '+64 21 987 6543',
    };
    authService.login('mock-jwt-token', mockUser);

    createComponent();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.loggedInFullName).toBe('Aarav Patel');
    expect(component.loggedInEmail).toBe('aarav@example.com');
    expect(component.form.get('firstName')?.value).toBe('Aarav');
    expect(component.form.get('lastName')?.value).toBe('Patel');
    expect(component.form.get('email')?.value).toBe('aarav@example.com');
    expect(component.form.get('mobile')?.value).toBe('+64 21 987 6543');

    // Password validation should be cleared
    const pwdControl = component.form.get('password');
    expect(pwdControl?.errors).toBeNull();

    // Fill in only remaining devotee fields
    component.form.patchValue({
      mandirId: 1,
      subscription: 'Yes',
      termsAccepted: true,
    });

    expect(component.form.valid).toBeTrue();
  });

  it('should detect existing approved devotee registration and display approved banner', () => {
    const mockUser = {
      id: 42,
      fullName: 'Pooja Sharma',
      email: 'pooja@example.com',
    };
    authService.login('mock-token', mockUser);

    createComponent();

    // Trigger check for mandir 1
    component.form.patchValue({ mandirId: 1 });

    const statusReq = httpMock.expectOne((r) => r.url.includes('/public/user-registration/status'));
    expect(statusReq.request.url).toContain('mandirId=1');
    expect(statusReq.request.url).toContain('email=pooja%40example.com');
    expect(statusReq.request.headers.get('Authorization')).toBe('Bearer mock-token');

    statusReq.flush({
      data: {
        isRegistered: true,
        isApproved: true,
        isPending: false,
        status: 'Approved',
        templeName: 'Shri Ram Mandir',
      },
    });
    fixture.detectChanges();

    expect(component.existingRegistration?.isApproved).toBeTrue();
    expect(component.existingRegistration?.templeName).toBe('Shri Ram Mandir');

    // Trying to submit should prevent duplicate
    component.submit();
    expect(component.message).toContain('already an approved devotee');
  });

  it('should detect existing pending devotee registration and prevent duplicate submission', () => {
    const mockUser = {
      id: 43,
      fullName: 'Vikram Singh',
      email: 'vikram@example.com',
    };
    authService.login('mock-token-2', mockUser);

    createComponent();

    component.form.patchValue({ mandirId: 2 });

    const statusReq = httpMock.expectOne((r) => r.url.includes('/public/user-registration/status'));
    statusReq.flush({
      data: {
        isRegistered: true,
        isApproved: false,
        isPending: true,
        status: 'Pending',
        templeName: 'Shiva Vishnu Temple',
      },
    });
    fixture.detectChanges();

    expect(component.existingRegistration?.isPending).toBeTrue();

    // Submit should be rejected
    component.submit();
    expect(component.message).toContain('already pending approval');
  });
});
