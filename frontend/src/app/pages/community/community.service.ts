import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CommunityGroupMember {
  id: number;
  name: string;
  role: string;
  joinedAt: string;
}

export interface CommunityGroup {
  id: number;
  name: string;
  slug?: string;
  category: string;
  description: string;
  cityId?: number | null;
  cityName?: string;
  meetingInfo?: string;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl?: string;
  creatorId?: number | null;
  creatorName?: string;
  status: string;
  memberCount: number;
  isMember?: boolean;
  createdAt: string;
  updatedAt: string;
  members?: CommunityGroupMember[];
}

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  cityName: string;
  joinedAt: string;
  groupCount: number;
  groups: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/public/community`;
  private authUrl = `${environment.apiBaseUrl}/community`;

  getDiscussions(params?: { category?: string; cityId?: number; tag?: string; page?: number; limit?: number }): Observable<ApiResponse<any[]>> {
    let httpParams = new HttpParams();
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.cityId) httpParams = httpParams.set('cityId', params.cityId.toString());
    if (params?.tag) httpParams = httpParams.set('tag', params.tag);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/discussions`, { params: httpParams });
  }

  getGroups(params?: { search?: string; category?: string; cityId?: number; userEmail?: string; page?: number; limit?: number }): Observable<ApiResponse<CommunityGroup[]>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.cityId) httpParams = httpParams.set('cityId', params.cityId.toString());
    if (params?.userEmail) httpParams = httpParams.set('userEmail', params.userEmail);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<ApiResponse<CommunityGroup[]>>(`${this.baseUrl}/groups`, { params: httpParams });
  }

  getGroupById(id: number, userEmail?: string): Observable<ApiResponse<CommunityGroup>> {
    let httpParams = new HttpParams();
    if (userEmail) httpParams = httpParams.set('userEmail', userEmail);
    return this.http.get<ApiResponse<CommunityGroup>>(`${this.baseUrl}/groups/${id}`, { params: httpParams });
  }

  createGroup(groupData: Partial<CommunityGroup>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.authUrl}/groups`, groupData);
  }

  updateGroup(id: number, groupData: Partial<CommunityGroup>): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.authUrl}/groups/${id}`, groupData);
  }

  deleteGroup(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.authUrl}/groups/${id}`);
  }

  joinGroup(groupId: number, memberData: { name: string; email: string; phone?: string; role?: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/groups/${groupId}/join`, memberData);
  }

  leaveGroup(groupId: number, email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/groups/${groupId}/leave`, { email });
  }

  getMembers(params?: { search?: string; role?: string; city?: string; page?: number; limit?: number }): Observable<ApiResponse<CommunityMember[]>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.role) httpParams = httpParams.set('role', params.role);
    if (params?.city) httpParams = httpParams.set('city', params.city);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<ApiResponse<CommunityMember[]>>(`${this.baseUrl}/members`, { params: httpParams });
  }
}
