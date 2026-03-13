import { Component, inject, OnInit, signal } from '@angular/core';
import { GroupInvitationResponse } from '../../../core/models/group.models';
import { InvitationService } from '../../../core/services/invitation.service';

@Component({
  selector: 'app-invitations-badge',
  templateUrl: './invitations-badge.html',
})
export class InvitationsBadge implements OnInit {
  private readonly invitationService = inject(InvitationService);

  invitations = signal<GroupInvitationResponse[]>([]);
  showList = signal(false);

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations(): void {
    this.invitationService.getMyPendingInvitations().subscribe({
      next: (list) => this.invitations.set(list),
    });
  }

  onAccept(invitationId: number): void {
    this.invitationService.acceptInvitation(invitationId).subscribe({
      next: () => {
        this.invitations.update((list) => list.filter((i) => i.id !== invitationId));
        window.location.reload();
      },
      error: () => alert('Failed to accept invitation.'),
    });
  }

  onDecline(invitationId: number): void {
    this.invitationService.declineInvitation(invitationId).subscribe({
      next: () => this.invitations.update((list) => list.filter((i) => i.id !== invitationId)),
      error: () => alert('Failed to decline invitation.'),
    });
  }

  toggleList(): void {
    this.showList.update((v) => !v);
  }
}
