export type GroupPermission = 'CAN_CREATE' | 'CAN_EDIT' | 'CAN_DELETE';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface Group {
  id: number;
  name: string;
  description?: string;
  ownerName: string;
  memberCount: number;
  pendingTaskCount: number;
  myPermissions: GroupPermission[];
  createdAt: string;
  isOwner: boolean;
}

export interface GroupMember {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  permissions: GroupPermission[];
}

export interface GroupInvitationResponse {
  id: number;
  groupId: number;
  groupName: string;
  inviterName: string;
  createdAt: string;
  status: InvitationStatus;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface GroupInviteRequest {
  inviteeEmail: string;
  permissions: GroupPermission[];
}

export interface GroupUpdatePermissionsRequest {
  permissions: GroupPermission[];
}
