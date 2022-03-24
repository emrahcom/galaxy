export interface Domain {
  id: string;
  name: string;
  auth_type: string;
  domain_attr: {
    url: string;
    app_id: string;
    app_secret: string;
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
  domain_url: boolean;
  domain_enabled: boolean;
  room_id: string;
  room_name: string;
  room_enabled: boolean;
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
  ownership: string;
}

// -----------------------------------------------------------------------------
export interface MeetingInvite {
  id: string;
  name: string;
  meeting_id: string;
  meeting_name: string;
  meeting_info: string;
  code: string;
  invite_type: string;
  affiliation: string;
  disposable: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
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
