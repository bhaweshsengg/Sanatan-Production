import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TempleSearchSelectComponent, TempleSelectItem } from './temple-search-select.component';

describe('TempleSearchSelectComponent', () => {
  let component: TempleSearchSelectComponent;
  let fixture: ComponentFixture<TempleSearchSelectComponent>;

  const mockTemples: TempleSelectItem[] = [
    {
      id: 1,
      mandir_name: 'Shri Ram Mandir',
      city: { id: 1, name: 'Auckland' },
      full_address: '11 Brick St, Henderson, Auckland',
    },
    {
      id: 2,
      mandir_name: 'Bharatiya Mandir',
      city: { id: 1, name: 'Auckland' },
      full_address: '252 Balmoral Rd, Mt Albert, Auckland',
    },
    {
      id: 3,
      mandir_name: 'Wellington Sanatan Mandir',
      city: { id: 2, name: 'Wellington' },
      full_address: 'Petone, Lower Hutt',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempleSearchSelectComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TempleSearchSelectComponent);
    component = fixture.componentInstance;
    component.temples = mockTemples;
    fixture.detectChanges();
  });

  it('should create successfully', () => {
    expect(component).toBeTruthy();
    expect(component.filteredTemples.length).toBe(3);
  });

  it('filters temples by mandir name', () => {
    component.onSearchChange('Ram');
    expect(component.filteredTemples.length).toBe(1);
    expect(component.filteredTemples[0].mandir_name).toBe('Shri Ram Mandir');
  });

  it('filters temples by city name', () => {
    component.onSearchChange('Wellington');
    expect(component.filteredTemples.length).toBe(1);
    expect(component.filteredTemples[0].mandir_name).toBe('Wellington Sanatan Mandir');
  });

  it('selects a temple and emits templeSelected event', () => {
    let emitted: any = null;
    component.templeSelected.subscribe((t) => (emitted = t));

    component.selectTemple(mockTemples[0]);
    expect(component.selectedId).toBe(1);
    expect(component.selectedTemple?.mandir_name).toBe('Shri Ram Mandir');
    expect(component.isOpen).toBeFalse();
    expect(emitted).toEqual(mockTemples[0]);
  });

  it('supports ControlValueAccessor writeValue', () => {
    component.writeValue(2);
    expect(component.selectedId).toBe(2);
    expect(component.selectedTemple?.mandir_name).toBe('Bharatiya Mandir');

    component.writeValue(null);
    expect(component.selectedId).toBeNull();
    expect(component.selectedTemple).toBeNull();
  });

  it('opens search view when onChangeClick is called', () => {
    component.writeValue(1);
    const mockEvent = new MouseEvent('click');
    component.onChangeClick(mockEvent);
    expect(component.selectedTemple).toBeNull();
    expect(component.isOpen).toBeTrue();
  });

  it('clears selection when allowNone is true', () => {
    component.allowNone = true;
    component.writeValue(1);
    const mockEvent = new MouseEvent('click');
    component.clearSelection(mockEvent);
    expect(component.selectedId).toBeNull();
    expect(component.selectedTemple).toBeNull();
  });
});
