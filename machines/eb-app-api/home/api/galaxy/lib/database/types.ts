export interface Id {
  id: string;
  at: string;
}

// -----------------------------------------------------------------------------
export interface Domain {
  id: string;
  name: string;
  auth_type: string;
  auth_attr: {
    [key: string]: string;
  };
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface PubDomain {
  id: string;
  name: string;
}

// -----------------------------------------------------------------------------
export interface Invite {
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
export interface PubInvite {
  meeting_name: string;
  meeting_info: string;
  code: string;
  as_host: boolean;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface Meeting {
  id: string;
  profile_id: string;
  room_id: string;
  host_key: string;
  guest_key: string;
  name: string;
  info: string;
  schedule_type: string;
  schedule_attr: unknown;
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
  schedule_attr: unknown;
  restricted: boolean;
  subscribable: boolean;
}

// -----------------------------------------------------------------------------
export interface Member {
  id: string;
  profile_name: string;
  is_host: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Membership {
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
export interface Profile {
  id: string;
  name: string;
  email: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Req {
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
export interface Room {
  id: string;
  name: string;
  domain_id: string;
  domain_name: string;
  has_suffix: boolean;
  suffix: string;
  enabled: boolean;
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
  auth_attr: {
    url: string;
    app_id: string;
    app_secret: string;
  };
}
