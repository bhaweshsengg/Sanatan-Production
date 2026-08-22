import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css'],
})
export class DirectoryComponent implements OnInit {
  businesses: any[] = [];
  loading = true;
  toastMessage: any;
  toastType: any;
  showToast: any;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.getBusinesses().subscribe({
      next: (data) => {
        this.businesses = data.filter((business: any) => business.status === 'Approved');
        console.log(this.businesses, 'response');

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching businesses', err);
        this.loading = false;
      },
    });
  }
showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    
    setTimeout(() => {
      this.showToast.set(false);
      this.toastMessage.set('');
    }, 3000);
  }
}
