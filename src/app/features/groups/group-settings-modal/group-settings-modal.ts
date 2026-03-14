import { Component, EventEmitter, inject, Input, OnChanges, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Group, GroupMember, GroupPermission } from '../../../core/models/group.models';
import { GroupService } from '../../../core/services/group.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-group-settings-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './group-settings-modal.html',
})
export class GroupSettingsModal implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly groupService = inject(GroupService);

  @Input() group: Group | null = null;
  @Output() membersChanged = new EventEmitter<void>();

  members = signal<GroupMember[]>([]);
  activeTab = signal<'members' | 'invite'>('members');
  isLoadingMembers = signal(false);
  isInviting = signal(false);

  inviteForm: FormGroup = this.fb.group({
    inviteeEmail: ['', [Validators.required, Validators.email]],
    canCreate: [false],
    canEdit: [false],
    canDelete: [false],
  });

  ngOnChanges(): void {
    if (this.group) {
      this.loadMembers();
    }
  }

  loadMembers(): void {
    if (!this.group) return;
    this.isLoadingMembers.set(true);
    this.groupService
      .getGroupMembers(this.group.id)
      .pipe(finalize(() => this.isLoadingMembers.set(false)))
      .subscribe({ next: (m) => this.members.set(m) });
  }

  onInvite(): void {
    if (this.inviteForm.invalid || !this.group) return;
    this.isInviting.set(true);

    const v = this.inviteForm.value;
    const permissions: GroupPermission[] = [];
    if (v.canCreate) permissions.push('CAN_CREATE');
    if (v.canEdit) permissions.push('CAN_EDIT');
    if (v.canDelete) permissions.push('CAN_DELETE');

    this.groupService
      .inviteMember(this.group.id, { inviteeEmail: v.inviteeEmail, permissions })
      .pipe(finalize(() => this.isInviting.set(false)))
      .subscribe({
        next: () => {
          this.inviteForm.reset();
          this.activeTab.set('members');
          alert('Invitation sent!');
        },
        error: (err) => alert(err?.error?.message || 'Failed to send invitation.'),
      });
  }

  onRemoveMember(userId: number): void {
    if (!this.group || !confirm('Remove this member?')) return;
    this.groupService.removeMember(this.group.id, userId).subscribe({
      next: () => {
        this.members.update((list) => list.filter((m) => m.userId !== userId));
        this.membersChanged.emit();
      },
      error: () => alert('Failed to remove member.'),
    });
  }

  hasPermission(member: GroupMember, perm: GroupPermission): boolean {
    return member.permissions.includes(perm);
  }

  togglePermission(member: GroupMember, perm: GroupPermission): void {
    if (!this.group) return;
    const perms = new Set(member.permissions);
    if (perms.has(perm)) {
      perms.delete(perm);
    } else {
      perms.add(perm);
      if (perm === 'CAN_MANAGE') {
        (['CAN_CREATE', 'CAN_EDIT', 'CAN_DELETE', 'CAN_INVITE'] as GroupPermission[]).forEach((p) =>
          perms.add(p)
        );
      }
    }
    const updated = Array.from(perms);
    this.groupService
      .updateMemberPermissions(this.group.id, member.userId, { permissions: updated })
      .subscribe({
        next: () => {
          this.members.update((list) =>
            list.map((m) => (m.userId === member.userId ? { ...m, permissions: updated } : m))
          );
        },
        error: () => alert('Failed to update permissions.'),
      });
  }
}
