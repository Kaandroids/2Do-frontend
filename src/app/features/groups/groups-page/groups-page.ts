import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Group, GroupInvitationResponse } from '../../../core/models/group.models';
import { GroupService } from '../../../core/services/group.service';
import { InvitationService } from '../../../core/services/invitation.service';
import { CreateGroupModal } from '../create-group-modal/create-group-modal';
import { GroupDetailModal } from '../group-detail-modal/group-detail-modal';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-groups-page',
  imports: [CreateGroupModal, GroupDetailModal, DatePipe],
  templateUrl: './groups-page.html',
  styleUrl: './groups-page.scss',
})
export class GroupsPage implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly invitationService = inject(InvitationService);

  @Input() groups: Group[] = [];
  @Output() groupsChanged = new EventEmitter<void>();

  selectedGroup = signal<Group | null>(null);
  invitations = signal<GroupInvitationResponse[]>([]);

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations(): void {
    this.invitationService.getMyPendingInvitations().subscribe({
      next: (list) => this.invitations.set(list),
    });
  }

  openDetail(group: Group): void {
    this.selectedGroup.set(group);
    const btn = document.getElementById('openGroupDetailBtn');
    if (btn) btn.click();
  }

  onGroupCreated(group: Group): void {
    this.groupsChanged.emit();
  }

  onGroupUpdated(): void {
    this.groupsChanged.emit();
  }

  onGroupDeleted(groupId: number): void {
    this.groupsChanged.emit();
  }

  onAccept(invitationId: number): void {
    this.invitationService.acceptInvitation(invitationId).subscribe({
      next: () => {
        this.invitations.update((list) => list.filter((i) => i.id !== invitationId));
        this.groupsChanged.emit();
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
}
