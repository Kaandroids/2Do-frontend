import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Group } from '../../../core/models/group.models';
import { GroupService } from '../../../core/services/group.service';
import { CreateGroupModal } from '../create-group-modal/create-group-modal';
import { GroupDetailModal } from '../group-detail-modal/group-detail-modal';

@Component({
  selector: 'app-groups-page',
  imports: [CreateGroupModal, GroupDetailModal],
  templateUrl: './groups-page.html',
  styleUrl: './groups-page.scss',
})
export class GroupsPage {
  private readonly groupService = inject(GroupService);

  @Input() groups: Group[] = [];
  @Output() groupsChanged = new EventEmitter<void>();

  selectedGroup = signal<Group | null>(null);

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
}
