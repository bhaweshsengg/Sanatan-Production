import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface TempleSelectItem {
  id: number;
  mandir_name: string;
  full_address?: string;
  city?: { id?: number; name?: string };
  main_deity?: { id?: number; name?: string };
  image?: string;
}

@Component({
  selector: 'app-temple-search-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TempleSearchSelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="temple-search-select-wrapper relative w-full font-sans text-left">
      <!-- Field Label -->
      <div *ngIf="label" class="mb-1.5 flex items-center justify-between">
        <label [for]="inputId" class="block text-sm font-semibold text-slate-700">
          {{ label }} <span *ngIf="required" class="text-red-500">*</span>
        </label>
        <span *ngIf="temples.length > 0 && !selectedTemple" class="text-xs text-slate-400">
          {{ temples.length }} available
        </span>
      </div>

      <!-- Optional Helper Text -->
      <p *ngIf="helperText" class="mb-2 text-xs text-slate-500">{{ helperText }}</p>

      <!-- Selected Temple Card Display -->
      <div
        *ngIf="selectedTemple; else searchInputBox"
        class="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/90 px-3.5 py-2.5 shadow-sm transition hover:bg-orange-50"
      >
        <div class="flex items-center gap-3 min-w-0 pr-2">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white text-base shadow-sm">
            🛕
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="truncate text-sm font-bold text-slate-900">
                {{ selectedTemple.mandir_name }}
              </span>
              <span
                *ngIf="selectedTemple.city?.name"
                class="shrink-0 rounded-md bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-800"
              >
                {{ selectedTemple.city?.name }}
              </span>
            </div>
            <p *ngIf="selectedTemple.full_address" class="truncate text-xs text-slate-500 mt-0.5">
              {{ selectedTemple.full_address }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="onChangeClick($event)"
            [disabled]="disabled"
            class="rounded-lg bg-white border border-orange-300 px-3 py-1.5 text-xs font-semibold text-orange-700 shadow-sm hover:bg-orange-100 hover:text-orange-900 transition-colors cursor-pointer disabled:opacity-50"
          >
            Change
          </button>
          <button
            *ngIf="allowNone"
            type="button"
            (click)="clearSelection($event)"
            [disabled]="disabled"
            class="rounded-lg p-1.5 text-slate-400 hover:bg-orange-100 hover:text-slate-600 transition cursor-pointer"
            title="Clear Selection"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Searchable Input Box -->
      <ng-template #searchInputBox>
        <div class="relative">
          <div
            class="flex items-center rounded-xl border bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-orange-200"
            [ngClass]="{
              'border-red-500 ring-1 ring-red-300': isInvalid,
              'border-orange-500 ring-2 ring-orange-200': isOpen && !isInvalid,
              'border-slate-300 hover:border-slate-400': !isOpen && !isInvalid
            }"
          >
            <!-- Search Icon -->
            <span class="pl-3.5 text-slate-400 text-sm select-none">🔍</span>

            <!-- Search Input -->
            <input
              [id]="inputId"
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              (focus)="openDropdown()"
              [placeholder]="placeholder"
              [disabled]="disabled"
              autocomplete="off"
              class="w-full rounded-xl bg-transparent py-2.5 pl-2.5 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
            />

            <!-- Clear Search Button / Caret -->
            <button
              *ngIf="searchQuery"
              type="button"
              (click)="clearSearch($event)"
              class="pr-3 text-slate-400 hover:text-slate-600 text-xs font-bold transition cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
            <span
              *ngIf="!searchQuery"
              (click)="toggleDropdown($event)"
              class="pr-3 text-slate-400 text-xs cursor-pointer select-none transition-transform duration-200"
              [ngClass]="{ 'rotate-180': isOpen }"
            >
              ▼
            </span>
          </div>

          <!-- Dropdown Options Overlay -->
          <div
            *ngIf="isOpen"
            class="absolute left-0 right-0 z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl text-sm ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
          >
            <!-- Optional "None" Option -->
            <div
              *ngIf="allowNone"
              (click)="selectTemple(null)"
              class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer border-b border-slate-100 transition"
            >
              <span>🚫</span>
              <span>{{ noneLabel }}</span>
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="p-4 text-center text-xs text-slate-500">
              <div class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mr-1.5"></div>
              Loading temples list...
            </div>

            <!-- Empty Search Results -->
            <div
              *ngIf="!isLoading && filteredTemples.length === 0"
              class="p-4 text-center text-xs text-slate-500"
            >
              <div class="text-xl mb-1">🔍</div>
              <p class="font-medium text-slate-700">No temples found</p>
              <p class="text-slate-400 text-[11px] mt-0.5">
                No mandir matched "{{ searchQuery }}". Try another name or city.
              </p>
            </div>

            <!-- Filtered Temples List -->
            <div
              *ngFor="let t of filteredTemples; trackBy: trackByTempleId"
              (click)="selectTemple(t)"
              class="flex items-center justify-between rounded-lg px-3 py-2 text-left cursor-pointer transition"
              [ngClass]="{
                'bg-orange-50 text-orange-950 font-medium': selectedId === t.id,
                'hover:bg-slate-50 text-slate-800': selectedId !== t.id
              }"
            >
              <div class="flex items-center gap-2.5 min-w-0 pr-2">
                <span class="text-base shrink-0">🛕</span>
                <div class="min-w-0">
                  <div class="truncate text-xs sm:text-sm font-semibold text-slate-900">
                    {{ t.mandir_name }}
                  </div>
                  <div class="flex items-center gap-1.5 text-[11px] text-slate-500 truncate mt-0.5">
                    <span *ngIf="t.city?.name" class="font-medium text-orange-700">
                      📍 {{ t.city?.name }}
                    </span>
                    <span *ngIf="t.city?.name && t.full_address">•</span>
                    <span *ngIf="t.full_address" class="truncate">{{ t.full_address }}</span>
                  </div>
                </div>
              </div>

              <span
                *ngIf="selectedId === t.id"
                class="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700"
              >
                ✓ Selected
              </span>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class TempleSearchSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  private http = inject(HttpClient);
  private elementRef = inject(ElementRef);
  private apiUrl = environment.apiBaseUrl;

  @Input() label = 'Select Temple';
  @Input() required = false;
  @Input() placeholder = 'Search temple by name, city, or address...';
  @Input() helperText = '';
  @Input() allowNone = false;
  @Input() noneLabel = '-- None / Custom Location --';
  @Input() isInvalid = false;
  @Input() inputId = 'temple-search-select-' + Math.random().toString(36).substring(2, 7);
  @Input() autoFetch = false;

  private _temples: TempleSelectItem[] = [];
  @Input()
  set temples(val: TempleSelectItem[]) {
    this._temples = Array.isArray(val) ? val : [];
    this.applyFilter();
    this.syncSelectedTemple();
  }
  get temples(): TempleSelectItem[] {
    return this._temples;
  }

  @Output() templeSelected = new EventEmitter<TempleSelectItem | null>();

  selectedId: number | null = null;
  selectedTemple: TempleSelectItem | null = null;
  searchQuery = '';
  isOpen = false;
  isLoading = false;
  disabled = false;

  filteredTemples: TempleSelectItem[] = [];

  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  ngOnInit(): void {
    if (this.autoFetch && (!this.temples || this.temples.length === 0)) {
      this.loadTemples();
    } else {
      this.filteredTemples = this.temples ? [...this.temples] : [];
      this.syncSelectedTemple();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['temples'] && this.temples) {
      this.applyFilter();
      this.syncSelectedTemple();
    }
  }

  loadTemples(): void {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/public/temple?status=Approved&limit=all`).subscribe({
      next: (res) => {
        const list = res?.data ?? (Array.isArray(res) ? res : []);
        this.temples = Array.isArray(list) ? list : [];
        this.temples.sort((a, b) => (a.mandir_name || '').localeCompare(b.mandir_name || ''));
        this.filteredTemples = [...this.temples];
        this.isLoading = false;
        this.syncSelectedTemple();
      },
      error: () => {
        // Fallback to /temple
        this.http.get<any>(`${this.apiUrl}/temple?status=Approved&limit=all`).subscribe({
          next: (res) => {
            const list = res?.data ?? (Array.isArray(res) ? res : []);
            this.temples = Array.isArray(list) ? list : [];
            this.temples.sort((a, b) => (a.mandir_name || '').localeCompare(b.mandir_name || ''));
            this.filteredTemples = [...this.temples];
            this.isLoading = false;
            this.syncSelectedTemple();
          },
          error: () => {
            this.isLoading = false;
          },
        });
      },
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.isOpen = true;
    this.applyFilter();
  }

  applyFilter(): void {
    const q = (this.searchQuery || '').trim().toLowerCase();
    if (!q) {
      this.filteredTemples = [...this.temples];
      return;
    }

    this.filteredTemples = this.temples.filter((t) => {
      const nameMatch = t.mandir_name && t.mandir_name.toLowerCase().includes(q);
      const cityMatch = t.city?.name && t.city.name.toLowerCase().includes(q);
      const addrMatch = t.full_address && t.full_address.toLowerCase().includes(q);
      const deityMatch = t.main_deity?.name && t.main_deity.name.toLowerCase().includes(q);
      return Boolean(nameMatch || cityMatch || addrMatch || deityMatch);
    });
  }

  selectTemple(temple: TempleSelectItem | null): void {
    if (this.disabled) return;
    this.selectedTemple = temple;
    this.selectedId = temple ? temple.id : null;
    this.searchQuery = '';
    this.isOpen = false;
    this.onChange(this.selectedId);
    this.onTouched();
    this.templeSelected.emit(temple);
  }

  onChangeClick(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedTemple = null;
    this.isOpen = true;
    this.searchQuery = '';
    this.applyFilter();
  }

  clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.selectTemple(null);
  }

  clearSearch(event: MouseEvent): void {
    event.stopPropagation();
    this.searchQuery = '';
    this.applyFilter();
  }

  openDropdown(): void {
    if (this.disabled) return;
    this.isOpen = true;
    this.applyFilter();
  }

  closeDropdown(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.onTouched();
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  syncSelectedTemple(): void {
    if (this.selectedId && this.temples && this.temples.length > 0) {
      const match = this.temples.find((t) => Number(t.id) === Number(this.selectedId));
      if (match) {
        this.selectedTemple = match;
        return;
      }
    }
    if (!this.selectedId) {
      this.selectedTemple = null;
    }
  }

  trackByTempleId(_index: number, temple: TempleSelectItem): number {
    return temple.id;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value !== undefined && value !== null && value !== '') {
      this.selectedId = Number(value);
    } else {
      this.selectedId = null;
    }
    this.syncSelectedTemple();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
