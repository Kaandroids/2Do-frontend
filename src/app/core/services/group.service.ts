import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Group,
  GroupMember,
  CreateGroupRequest,
  GroupInviteRequest,
  GroupUpdatePermissionsRequest,
} from '../models/group.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/groups`;

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.API_URL);
  }

  createGroup(request: CreateGroupRequest): Observable<Group> {
    return this.http.post<Group>(this.API_URL, request);
  }

  updateGroup(groupId: number, request: CreateGroupRequest): Observable<Group> {
    return this.http.put<Group>(`${this.API_URL}/${groupId}`, request);
  }

  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${groupId}`);
  }

  getGroupMembers(groupId: number): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.API_URL}/${groupId}/members`);
  }

  inviteMember(groupId: number, request: GroupInviteRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${groupId}/invitations`, request);
  }

  updateMemberPermissions(groupId: number, userId: number, request: GroupUpdatePermissionsRequest): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${groupId}/members/${userId}/permissions`, request);
  }

  removeMember(groupId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${groupId}/members/${userId}`);
  }
}
