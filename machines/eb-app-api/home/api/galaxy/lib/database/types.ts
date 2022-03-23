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
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainReduced {
  id: string;
  name: string;
  auth_type: string;
  url: string;
  enabled: boolean;
  updated_at: string;
  ownership: string;
}

// -----------------------------------------------------------------------------
export interface DomainInvite {
  id: string;
  name: string;
  domain_id: string;
  domain_name: string;
  domain_url: string;
  code: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainInviteReduced {
  domain_name: string;
  domain_url: string;
  code: string;
}

// -----------------------------------------------------------------------------
export interface DomainPartner {
  id: string;
  domain_id: string;
  profile_name: string;
  profile_email: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface DomainPartnership {
  id: string;
  domain_id: string;
  domain_name: string;
  domain_url: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface Meeting {
  id: string;
  name: string;
  info: string;
  profile_id: string;
  profile_name: string;
  profile_email: string;
  domain_id: string;
  domain_name: string;
  domain_url: string;
  domain_enabled: boolean;
  room_id: string;
  room_name: string;
  room_enabled: boolean;
  host_key: string;
  guest_key: string;
  schedule_type: string;
  hidden: boolean;
  restricted: boolean;
  subscribable: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingReduced {
  id: string;
  name: string;
  info: string;
  domain_name: string;
  domain_url: boolean;
  room_name: string;
  schedule_type: string;
  scheduled_at: string;
  hidden: boolean;
  restricted: boolean;
  subscribable: boolean;
  enabled: boolean;
  chain_enabled: boolean;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingPublic {
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
  name: string;
  meeting_id: string;
  meeting_name: string;
  meeting_info: string;
  code: string;
  as_host: boolean;
  disposable: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface MeetingInvitePublic {
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
  domain_url: string;
  domain_enabled: boolean;
  has_suffix: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  accessed_at: string;
}

// -----------------------------------------------------------------------------
export interface RoomReduced {
  id: string;
  name: string;
  domain_name: string;
  domain_url: string;
  enabled: boolean;
  chain_enabled: boolean;
  updated_at: string;
  ownership: string;
}

// -----------------------------------------------------------------------------
export interface RoomInvite {
  id: string;
  name: string;
  room_id: string;
  room_name: string;
  domain_id: string;
  domain_name: string;
  domain_url: string;
  code: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
}

// -----------------------------------------------------------------------------
export interface RoomInviteReduced {
  room_name: string;
  domain_name: string;
  domain_url: string;
  code: string;
}

// -----------------------------------------------------------------------------
export interface RoomPartner {
  id: string;
  room_id: string;
  profile_name: string;
  profile_email: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
export interface RoomPartnership {
  id: string;
  room_id: string;
  room_name: string;
  domain_name: string;
  domain_url: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
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
