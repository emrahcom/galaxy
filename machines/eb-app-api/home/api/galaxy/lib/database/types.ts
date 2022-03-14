export interface Id {
  id: string;
  at: string;
}

// -----------------------------------------------------------------------------
export interface Domain {
  id: string;
  name: string;
  auth_type: string;
  domain_attr: {
    [key: string]: string;
  };
  enabled: boolean;
  owner_enabled: boolean;
  chain_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface PubDomain {
  id: string;
  name: string;
}

// -----------------------------------------------------------------------------
export interface Meeting {
  id: string;
  profile_id: string;
  profile_name: string;
  domain_id: string;
  domain_name: string;
  domain_enabled: boolean;
  domain_owner_enabled: boolean;
  room_id: string;
  room_name: string;
  room_enabled: boolean;
  room_owner_enabled: boolean;
  host_key: string;
  guest_key: string;
  name: string;
  info: string;
  schedule_type: string;
  hidden: boolean;
  restricted: boolean;
  subscribable: boolean;
  enabled: boolean;
  chain_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface PubMeeting {
  id: string;
  name: string;
  info: string;
  schedule_type: string;
  restricted: boolean;
  subscribable: boolean;
}

// -----------------------------------------------------------------------------
export interface MeetingInvite {
  id: string;
  meeting_id: string;
  meeting_name: string;
  meeting_info: string;
  code: string;
  as_host: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface PubMeetingInvite {
  meeting_name: string;
  meeting_info: string;
  code: string;
  as_host: boolean;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingMember {
  id: string;
  profile_name: string;
  is_host: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingMembership {
  id: string;
  profile_id: string;
  meeting_id: string;
  meeting_name: string;
  meeting_info: string;
  is_host: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingRequest {
  id: string;
  profile_id: string;
  profile_name: string;
  meeting_id: string;
  meeting_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingLinkSet {
  name: string;
  room_name: string;
  has_suffix: boolean;
  suffix: string;
  auth_type: string;
  domain_attr: {
    url: string;
    app_id: string;
    app_secret: string;
  };
  profile_name: string;
  profile_email: string;
}

// -----------------------------------------------------------------------------
export interface Profile {
  id: string;
  name: string;
  email: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Room {
  id: string;
  name: string;
  domain_id: string;
  domain_name: string;
  domain_enabled: boolean;
  domain_owner_enabled: boolean;
  has_suffix: boolean;
  suffix: string;
  enabled: boolean;
  owner_enabled: boolean;
  chain_enabled: boolean;
  created_at: string;
  updated_at: string;
  accessed_at: string;
}

// -----------------------------------------------------------------------------
export interface RoomLinkSet {
  name: string;
  has_suffix: boolean;
  suffix: string;
  auth_type: string;
  domain_attr: {
    url: string;
    app_id: string;
    app_secret: string;
  };
}
