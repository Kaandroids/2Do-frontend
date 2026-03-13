import { Component, EventEmitter, inject, Input, OnChanges, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Group, GroupMember, GroupPermission } from '../../../core/models/group.models';
import { GroupService } from '../../../core/services/group.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-group-detail-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './group-detail-modal.html',
  styleUrl: './group-detail-modal.scss',
})
export class GroupDetailModal implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly groupService = inject(GroupService);

  @Input() group: Group | null = null;
  @Output() groupDeleted = new EventEmitter<number>();
  @Output() groupChanged = new EventEmitter<void>();

  activeTab = signal<'members' | 'invite' | 'edit'>('members');
  members = signal<GroupMember[]>([]);
  isLoadingMembers = signal(false);
  isInviting = signal(false);
  isDeleting = signal(false);
  isSavingEdit = signal(false);

  readonly allPerms: GroupPermission[] = ['CAN_CREATE', 'CAN_EDIT', 'CAN_DELETE', 'CAN_INVITE', 'CAN_MANAGE'];

  inviteForm: FormGroup = this.fb.group({
    inviteeEmail: ['', [Validators.required, Validators.email]],
    canCreate: [false],
    canEdit: [false],
    canDelete: [false],
    canInvite: [false],
    canManage: [false],
  });

  editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
  });

  ngOnChanges(): void {
    if (this.group) {
      this.activeTab.set('members');
      this.loadMembers();
      this.editForm.patchValue({
        name: this.group.name,
        description: this.group.description ?? '',
      });
    }
  }

  /** Current user can manage member permissions */
  canManageMembers(): boolean {
    if (!this.group) return false;
    return this.group.isOwner || this.group.myPermissions.includes('CAN_MANAGE');
  }

  /** Current user can invite new members */
  canInviteMembers(): boolean {
    if (!this.group) return false;
    return this.group.isOwner || this.group.myPermissions.includes('CAN_INVITE');
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
    if (v.canInvite) permissions.push('CAN_INVITE');
    if (v.canManage) permissions.push('CAN_MANAGE');

    this.groupService
      .inviteMember(this.group.id, { inviteeEmail: v.inviteeEmail, permissions })
      .pipe(finalize(() => this.isInviting.set(false)))
      .subscribe({
        next: () => {
          this.inviteForm.reset();
          this.activeTab.set('members');
          this.groupChanged.emit();
        },
        error: (err) => alert(err?.error?.message || 'Failed to send invitation.'),
      });
  }

  onRemoveMember(userId: number): void {
    if (!this.group || !confirm('Remove this member from the group?')) return;
    this.groupService.removeMember(this.group.id, userId).subscribe({
      next: () => {
        this.members.update((list) => list.filter((m) => m.userId !== userId));
        this.groupChanged.emit();
      },
      error: () => alert('Failed to remove member.'),
    });
  }

  togglePermission(member: GroupMember, perm: GroupPermission): void {
    if (!this.group) return;
    const perms = new Set(member.permissions);
    perms.has(perm) ? perms.delete(perm) : perms.add(perm);
    const updated = Array.from(perms);

    this.groupService
      .updateMemberPermissions(this.group.id, member.userId, { permissions: updated })
      .subscribe({
        next: () =>
          this.members.update((list) =>
            list.map((m) => (m.userId === member.userId ? { ...m, permissions: updated } : m))
          ),
        error: () => alert('Failed to update permissions.'),
      });
  }

  onSaveEdit(): void {
    if (this.editForm.invalid || !this.group) return;
    this.isSavingEdit.set(true);
    this.groupService
      .updateGroup(this.group.id, this.editForm.value)
      .pipe(finalize(() => this.isSavingEdit.set(false)))
      .subscribe({
        next: () => {
          this.groupChanged.emit();
          this.activeTab.set('members');
        },
        error: () => alert('Failed to update group.'),
      });
  }

  onDeleteGroup(): void {
    if (!this.group || !confirm(`Delete "${this.group.name}"? This cannot be undone.`)) return;
    this.isDeleting.set(true);
    this.groupService.deleteGroup(this.group.id).pipe(finalize(() => this.isDeleting.set(false))).subscribe({
      next: () => {
        const closeBtn = document.getElementById('closeGroupDetailModalBtn');
        if (closeBtn) closeBtn.click();
        this.groupDeleted.emit(this.group!.id);
      },
      error: () => alert('Failed to delete group.'),
    });
  }

  hasPermission(member: GroupMember, perm: GroupPermission): boolean {
    return member.permissions.includes(perm);
  }

  permLabel(perm: GroupPermission): string {
    const labels: Record<GroupPermission, string> = {
      CAN_CREATE: 'Create',
      CAN_EDIT: 'Edit',
      CAN_DELETE: 'Delete',
      CAN_INVITE: 'Invite',
      CAN_MANAGE: 'Master',
    };
    return labels[perm];
  }
}
