import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-city',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Manage Cities</h1>
      
      <!-- Add New City -->
      <div class="bg-white p-4 rounded-lg shadow mb-8">
        <h2 class="text-xl font-semibold mb-4">Add New City</h2>
        <div class="flex gap-4">
          <input [(ngModel)]="newCityName" placeholder="City Name" class="flex-1 p-2 border rounded">
          <button (click)="addCity()" class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Add City</button>
        </div>
      </div>

      <!-- City List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="p-4 font-semibold text-gray-700">ID</th>
              <th class="p-4 font-semibold text-gray-700">Name</th>
              <th class="p-4 font-semibold text-gray-700 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let city of cities" class="border-b">
              <td class="p-4">{{ city.id }}</td>
              <td class="p-4">
                <span *ngIf="editingId !== city.id">{{ city.name }}</span>
                <input *ngIf="editingId === city.id" [(ngModel)]="editName" class="p-1 border rounded w-full">
              </td>
              <td class="p-4 space-x-2">
                <button *ngIf="editingId !== city.id" (click)="startEdit(city)" class="text-blue-600 hover:underline">Edit</button>
                <button *ngIf="editingId === city.id" (click)="saveEdit(city.id)" class="text-green-600 hover:underline">Save</button>
                <button *ngIf="editingId === city.id" (click)="editingId = null" class="text-gray-600 hover:underline">Cancel</button>
                <button (click)="deleteCity(city.id)" class="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminCityComponent implements OnInit {
  private http = inject(HttpClient);
  cities: any[] = [];
  newCityName = '';
  
  editingId: number | null = null;
  editName = '';

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.http.get<any>(`${environment.apiBaseUrl}/public/city`).subscribe({
      next: (res) => this.cities = res.data || [],
      error: (err) => console.error(err)
    });
  }

  addCity() {
    if (!this.newCityName.trim()) return;
    this.http.post(`${environment.apiBaseUrl}/city`, { name: this.newCityName }).subscribe({
      next: () => {
        this.newCityName = '';
        this.loadCities();
      },
      error: (err) => alert('Failed to add city')
    });
  }

  startEdit(city: any) {
    this.editingId = city.id;
    this.editName = city.name;
  }

  saveEdit(id: number) {
    this.http.put(`${environment.apiBaseUrl}/city/${id}`, { name: this.editName }).subscribe({
      next: () => {
        this.editingId = null;
        this.loadCities();
      },
      error: (err) => alert('Failed to update city')
    });
  }

  deleteCity(id: number) {
    if (confirm('Are you sure you want to delete this city?')) {
      this.http.delete(`${environment.apiBaseUrl}/city/${id}`).subscribe({
        next: () => this.loadCities(),
        error: (err) => alert('Failed to delete city')
      });
    }
  }
}
