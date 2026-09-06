import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-deity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Manage Deities</h1>
      
      <!-- Add New Deity -->
      <div class="bg-white p-4 rounded-lg shadow mb-8">
        <h2 class="text-xl font-semibold mb-4">Add New Deity</h2>
        <div class="flex gap-4">
          <input [(ngModel)]="newDeityName" placeholder="Deity Name" class="flex-1 p-2 border rounded">
          <button (click)="addDeity()" class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Add Deity</button>
        </div>
      </div>

      <!-- Deity List -->
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
            <tr *ngFor="let deity of deities" class="border-b">
              <td class="p-4">{{ deity.id }}</td>
              <td class="p-4">
                <span *ngIf="editingId !== deity.id">{{ deity.name }}</span>
                <input *ngIf="editingId === deity.id" [(ngModel)]="editName" class="p-1 border rounded w-full">
              </td>
              <td class="p-4 space-x-2">
                <button *ngIf="editingId !== deity.id" (click)="startEdit(deity)" class="text-blue-600 hover:underline">Edit</button>
                <button *ngIf="editingId === deity.id" (click)="saveEdit(deity.id)" class="text-green-600 hover:underline">Save</button>
                <button *ngIf="editingId === deity.id" (click)="editingId = null" class="text-gray-600 hover:underline">Cancel</button>
                <button (click)="deleteDeity(deity.id)" class="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminDeityComponent implements OnInit {
  private http = inject(HttpClient);
  deities: any[] = [];
  newDeityName = '';
  
  editingId: number | null = null;
  editName = '';

  ngOnInit() {
    this.loadDeities();
  }

  loadDeities() {
    this.http.get<any>(`${environment.apiBaseUrl}/public/deity`).subscribe({
      next: (res) => this.deities = res.data || [],
      error: (err) => console.error(err)
    });
  }

  addDeity() {
    if (!this.newDeityName.trim()) return;
    this.http.post(`${environment.apiBaseUrl}/deity`, { name: this.newDeityName }).subscribe({
      next: () => {
        this.newDeityName = '';
        this.loadDeities();
      },
      error: (err) => alert('Failed to add deity')
    });
  }

  startEdit(deity: any) {
    this.editingId = deity.id;
    this.editName = deity.name;
  }

  saveEdit(id: number) {
    this.http.put(`${environment.apiBaseUrl}/deity/${id}`, { name: this.editName }).subscribe({
      next: () => {
        this.editingId = null;
        this.loadDeities();
      },
      error: (err) => alert('Failed to update deity')
    });
  }

  deleteDeity(id: number) {
    if (confirm('Are you sure you want to delete this deity?')) {
      this.http.delete(`${environment.apiBaseUrl}/deity/${id}`).subscribe({
        next: () => this.loadDeities(),
        error: (err) => alert('Failed to delete deity')
      });
    }
  }
}
