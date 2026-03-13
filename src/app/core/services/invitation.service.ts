import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupInvitationResponse } from '../models/group.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/invitations`;

  getMyPendingInvitations(): Observable<GroupInvitationResponse[]> {
    return this.http.get<GroupInvitationResponse[]>(this.API_URL);
  }

  acceptInvitation(invitationId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${invitationId}/accept`, {});
  }

  declineInvitation(invitationId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${invitationId}/decline`, {});
  }
}
